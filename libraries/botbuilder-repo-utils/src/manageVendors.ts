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
    isUpdated(): boolean;
    content(): string;
    json(): Package;
    updateDependency(dependency: Package, version: string): boolean;
}

interface PackageConfig {
    repository: string;
    branch: string;
    directory: string;
}

/**
 * Creates the GitHub URL to where the vendors' packages are located.
 * @param config package.json config property.
 */
const repoPath = (config: PackageConfig) =>
    `https://raw.githubusercontent.com/${config.repository}/${config.branch}/${config.directory}`;

/**
 * Creates the GitHub URL to where the vendors' packages are located.
 * @param config package.json config property.
 * @param dependency
 */
const tgzPath = (config: PackageConfig, dependency: Package) =>
    `"${repoPath(config)}/${dependency.name}/${dependency.version}.tgz"`;

/**
 * Reads a package.json file as a stream.
 * @param file Path to a package.json file.
 * @returns
 */
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
                    updateDependency(dependency: Package, version: string) {
                        if (dependency.name === result.json().name) {
                            return false;
                        }

                        const line = result.stream.find((e: string) => e.includes(`"${dependency.name}"`));
                        if (!line?.includes(dependency.version)) {
                            return false;
                        }

                        const lineNumber = result.stream.indexOf(line);
                        result.stream[lineNumber] = line.replace(`"${dependency.version}"`, version);

                        return true;
                    },
                };
                resolve(result);
            });
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Gets the config.vendors property from the root package.json file.
 * @param rootDir Directory where the root package.json file is located.
 */
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

/**
 * Gets all vendors' package.json files.
 * @param config package.json config property.
 * @param rootDir Path to the root directory.
 */
async function getVendors(config: PackageConfig, rootDir: string) {
    const vendorPackages = await globby(path.posix.join(rootDir, config.directory, `**/${original}`), {
        gitignore: true,
        cwd: rootDir,
    });
    console.log(vendorPackages);
    return Promise.all(vendorPackages.map(readPackage));
}

/**
 * List of supported commands.
 */
const commands = {
    async pack() {
        const rootDir = await gitRoot();
        const config = await getConfig(rootDir);
        const vendors = await getVendors(config, rootDir);
        const result = vendors.map(async (root) => {
            const dirname = path.posix.dirname(root.path);
            const originalContent = root.content();

            for (const child of vendors) {
                root.updateDependency(child.json(), tgzPath(config, child.json()));
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
    },

    async prepublish() {
        const libfile = path.posix.join(cwd, original);
        const rootDir = await gitRoot();
        const config = await getConfig(rootDir);
        const root = await readPackage(libfile);
        const vendors = await getVendors(config, rootDir);

        for (const child of vendors) {
            root.updateDependency(child.json(), tgzPath(config, child.json()));
        }

        // Update package.json.
        if (root.isUpdated()) {
            await fs.promises.rename(libfile, path.posix.join(cwd, backup));
            await fs.promises.writeFile(libfile, root.content(), { encoding: 'utf-8' });
        }
    },

    async postpublish() {
        // Update package.json to original content.
        const libfile = path.posix.join(cwd, backup);
        if (fs.existsSync(libfile)) {
            await fs.promises.rename(libfile, path.posix.join(cwd, original));
        }
    },
};

const command = (argv: string[]) => async (): Promise<Result> => {
    try {
        const [command] = argv;
        const supported = Object.keys(commands);
        if (!supported.includes(command)) {
            return failure(
                `Unrecognized "${command}" command. These are the supported commands => "${supported.join(', ')}"`
            );
        }

        await (commands as any)[command]();

        return success();
    } catch (err: any) {
        return failure(err instanceof Error ? err.message : err);
    }
};

if (require.main === module) {
    run(command(process.argv.slice(2)));
}
