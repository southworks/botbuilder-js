// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import fs from 'fs';
import readline from 'readline';
import path from 'path';
import globby from 'globby';
import tar from 'tar-stream';
import zlib from 'zlib';
import url from 'url';
import { EOL } from 'os';
import { execSync } from 'child_process';

import { run, Result, success, failure } from './run';
import { gitRoot } from './git';
import { collectWorkspacePackages } from './workspace';
import { readJsonFile } from './file';
import { Package } from './package';

function readFile(file: string) {
    const stream: any[] = [];
    var rl = readline.createInterface({
        input: fs.createReadStream(file),
        output: process.stdout,
        terminal: false,
    });
    return new Promise<any>((res) => {
        rl.on('line', (line) => stream.push(line));
        rl.on('close', () => {
            const content = () => stream.join(EOL);
            const name = path.posix.basename(file);
            const dir = path.posix.dirname(file);
            res({ name, dir, updated: false, stream, content, pkg: JSON.parse(content()) });
        });
    });
}

const pkgName = 'package.json';
const repoPath = 'https://raw.githubusercontent.com/southworks/botbuilder-js/joelmut/test/recognizers-text/vendor';

async function getVendors() {
    const rootDir = await gitRoot();
    const vendorDir = path.posix.join(rootDir, 'vendor');
    const vendorPackages = await globby(path.posix.join(vendorDir, `**/${pkgName}`), {
        gitignore: true,
        cwd: rootDir,
    });
    const vendors: Record<string, any> = {};
    for (const pkgPath of vendorPackages) {
        const dir = path.posix.dirname(pkgPath);
        const file = await readFile(pkgPath);
        const tgz = { path: `${repoPath}/${file.pkg.name}/${file.pkg.version}.tgz` };
        vendors[file.pkg.name] = { dir, file, tgz, deps: [] };
    }

    return vendors;
}

const command = (argv: string[]) => async (): Promise<Result> => {
    try {
        const [command] = argv;
        const cwd = process.env['INIT_CWD']!;

        // const packageFile = await readJsonFile<Package>(path.join(rootDir, 'package.json'));
        // const workspaces = await collectWorkspacePackages(rootDir, packageFile?.workspaces);
        // console.log(workspaces)

        // Load dependencies and update references

        if (command === 'pack') {
            const vendors = await getVendors();
            const vendorsList = Object.entries(vendors);
            for (const [name, data] of vendorsList) {
                const original = data.file.content();
                for (const [depName, depData] of vendorsList) {
                    const line = data.file.stream.find((e: string) => depName !== name && e.includes(`"${depName}"`));
                    if (line?.includes(depData.file.pkg.version)) {
                        data.deps.push(depName);
                        const lineNumber = data.file.stream.indexOf(line);
                        const file = path.posix.relative(data.dir, depData.dir);
                        data.file.updated = true;
                        data.file.stream[lineNumber] = line.replace(
                            `"${depData.file.pkg.version}"`,
                            `"${depData.tgz.path}"`
                        );
                    }
                }

                if (data.file.updated) {
                    await fs.promises.writeFile(path.posix.join(data.file.dir, data.file.name), data.file.content(), {
                        encoding: 'utf-8',
                    });
                }
                const removeTgzs = await globby('*.tgz', { cwd: data.file.dir });
                for (const tgz of removeTgzs) {
                    await fs.promises.rm(path.join(data.file.dir, tgz), { force: true });
                }
                execSync('npm pack', { cwd: data.file.dir });
                if (data.file.updated) {
                    await fs.promises.writeFile(path.posix.join(data.file.dir, data.file.name), original, {
                        encoding: 'utf-8',
                    });
                }
                const [tgz] = await globby('*.tgz', { cwd: data.file.dir });
                await fs.promises.rename(
                    path.join(data.file.dir, tgz),
                    path.join(data.file.dir, `${data.file.pkg.version}.tgz`)
                );
            }
        } else if (command === 'postpublish') {
            const libfile = path.posix.join(cwd, 'package.original.json');
            if (fs.existsSync(libfile)) {
                await fs.promises.rename(libfile, path.posix.join(cwd, 'package.json'));
            }
        } else if (command === 'prepublish') {
            const vendors = await getVendors();
            const vendorsList = Object.entries(vendors);
            const libfile = path.join(cwd, 'package.json');

            const file = await readFile(libfile);
            for (const [depName, depData] of vendorsList) {
                const line = file.stream.find((e: string) => e.includes(`"${depName}"`));
                if (!line?.includes(depData.file.pkg.version)) {
                    continue;
                }
                const lineNumber = file.stream.indexOf(line);
                file.stream[lineNumber] = line.replace(`"${depData.file.pkg.version}"`, `"${depData.tgz.path}"`);
                file.updated = true;
            }

            if (file.updated) {
                const parsed = path.posix.parse(file.name);
                await fs.promises.rename(libfile, path.posix.join(file.dir, `${parsed.name}.original${parsed.ext}`));
                await fs.promises.writeFile(libfile, file.content(), {
                    encoding: 'utf-8',
                });
            }
        }

        return success();
    } catch (err: any) {
        return failure(err instanceof Error ? err.message : err, 22);
    }
};

if (require.main === module) {
    run(command(process.argv.slice(2)));
}
