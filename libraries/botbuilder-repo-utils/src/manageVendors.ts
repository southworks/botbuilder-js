// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import fs from 'fs';
import readline from 'readline';
import path from 'path';
import globby from 'globby';
import { EOL } from 'os';
import { execSync } from 'child_process';

import { run, Result, success, failure } from './run';
import { gitRoot } from './git';
import { Package } from './package';

const cwd = process.env['INIT_CWD']!;
const original = 'package.json';
const backup = 'package.backup.json';

interface PackageData {
    path: string;
    stream: string[];
    isUpdated: () => boolean;
    content: () => string;
    json: () => Package;
}

interface PackageConfig {
    repository: string;
    branch: string;
    directory: string;
}

const repoPath = (config: PackageConfig) =>
    `https://raw.githubusercontent.com/${config.repository}/${config.branch}/${config.directory}`;

function readPackage(file: string) {
    const stream: any[] = [];
    var rl = readline.createInterface({
        input: fs.createReadStream(file),
        output: process.stdout,
        terminal: false,
    });
    return new Promise<PackageData>((resolve, reject) => {
        try {
            rl.on('line', (line) => stream.push(line));
            rl.on('close', () => {
                const base = {
                    stream: [...stream],
                    content: '',
                    json: {},
                };
                const result = {
                    path: file,
                    stream: base.stream,
                    isUpdated: () => base.stream !== stream,
                    content: () => (base.content = result.isUpdated() ? base.stream.join(EOL) : base.content),
                    json: () => (base.json = result.isUpdated() ? JSON.parse(result.content()) : base.json),
                };
                resolve(result);
            });
        } catch (error) {
            reject(error);
        }
    });
}

async function getConfig(rootDir: string) {
    const rootPackage = await readPackage(path.posix.join(rootDir, original));
    if (!rootPackage) {
        throw new Error(`Couldn't load "${path.posix.join(rootDir, original)}".`);
    }

    const config = rootPackage.json().config?.vendors as PackageConfig | undefined;
    if (!config) {
        throw new Error(`config.vendors property is required in "${rootPackage.path}".`);
    }

    if (!config.repository) {
        throw new Error(`config.vendors.repository property is required in "${rootPackage.path}".`);
    }

    if (!config.branch) {
        throw new Error(`config.vendors.branch property is required in "${rootPackage.path}".`);
    }

    if (!config.directory) {
        throw new Error(`config.vendors.directory property is required in "${rootPackage.path}".`);
    }

    return config;
}

async function getVendors() {
    const rootDir = await gitRoot();
    const config = await getConfig(rootDir);
    const vendorPackages = await globby(path.posix.join(rootDir, config.directory, `**/${original}`), {
        gitignore: true,
        cwd: rootDir,
    });
    return {
        config,
        data: await Promise.all(vendorPackages.map(readPackage)),
    };
}

function updateDependency(config: PackageConfig, root: PackageData, child: PackageData) {
    const line = root.stream.find(
        (e: string) => child.json().name !== root.json().name && e.includes(`"${child.json().name}"`)
    );
    if (!line?.includes(child.json().version)) {
        return false;
    }
    const lineNumber = root.stream.indexOf(line);
    root.stream[lineNumber] = line.replace(
        `"${child.json().version}"`,
        `"${repoPath(config)}/${child.json().name}/${child.json().version}.tgz"`
    );

    return true;
}

const command = (argv: string[]) => async (): Promise<Result> => {
    try {
        const [command] = argv;

        if (command === 'pack') {
            const vendors = await getVendors();
            const result = vendors.data.map(async (root) => {
                const dirname = path.posix.dirname(root.path);
                const originalContent = root.content();

                for (const child of vendors.data) {
                    updateDependency(vendors.config, root, child);
                }

                try {
                    // Update package.json.
                    if (root.isUpdated()) {
                        await fs.promises.writeFile(root.path, root.content(), { encoding: 'utf-8' });
                    }

                    // Remove existing .tgz.
                    const removeTgzs = await globby('*.tgz', { cwd: dirname, deep: 0 });
                    for (const tgz of removeTgzs) {
                        await fs.promises.rm(path.join(dirname, tgz), { force: true });
                    }

                    // Create new .tgz.
                    execSync('npm pack', { cwd: dirname });

                    // Rename .tgz.
                    const [tgz] = await globby('*.tgz', { cwd: dirname, deep: 0 });
                    await fs.promises.rename(path.join(dirname, tgz), path.join(dirname, `${root.json().version}.tgz`));
                } finally {
                    // Update package.json to original content.
                    if (root.isUpdated()) {
                        await fs.promises.writeFile(root.path, originalContent, { encoding: 'utf-8' });
                    }
                }
            });

            await Promise.all(result);
        } else if (command === 'postpublish') {
            // Update package.json to original content.
            const libfile = path.posix.join(cwd, backup);
            if (fs.existsSync(libfile)) {
                await fs.promises.rename(libfile, path.posix.join(cwd, original));
            }
        } else if (command === 'prepublish') {
            const libfile = path.posix.join(cwd, original);
            const root = await readPackage(libfile);
            const vendors = await getVendors();

            for (const child of vendors.data) {
                updateDependency(vendors.config, root, child);
            }

            // Update package.json.
            if (root.isUpdated()) {
                await fs.promises.rename(libfile, path.posix.join(cwd, backup));
                await fs.promises.writeFile(libfile, root.content(), { encoding: 'utf-8' });
            }
        } else {
            return failure(`Command "${command}" not supported.`);
        }

        return success();
    } catch (err: any) {
        return failure(err instanceof Error ? err.message : err);
    }
};

if (require.main === module) {
    run(command(process.argv.slice(2)));
}
