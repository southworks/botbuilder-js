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

// // Copyright (c) Microsoft Corporation.
// // Licensed under the MIT License.

// import fs from 'fs';
// import readline from 'readline';
// import path from 'path';
// import globby from 'globby';
// import tar from 'tar-stream';
// import zlib from 'zlib';
// import url from 'url';
// import { EOL } from 'os';

// import { run, Result, success, failure } from './run';
// import { gitRoot } from './git';

// function readFile(file: string) {
//     const stream: any[] = [];
//     var rl = readline.createInterface({
//         input: fs.createReadStream(file),
//         output: process.stdout,
//         terminal: false,
//     });
//     return new Promise<any>((res) => {
//         rl.on('line', (line) => stream.push(line));
//         rl.on('close', () => {
//             const content = () => stream.join(EOL);
//             const name = path.posix.basename(file);
//             const dir = path.posix.dirname(file);
//             res({ name, dir, updated: false, stream, content, pkg: JSON.parse(content()) });
//         });
//     });
// }

// const main = () => async (): Promise<Result> => {
//     const pkgName = 'package.json';
//     try {
//         const rootDir = await gitRoot();
//         const librariesDir = path.posix.join(rootDir, 'libraries');
//         const vendorDir = path.posix.join(rootDir, 'vendor');
//         const vendorPackages = await globby(path.posix.join(vendorDir, `**/${pkgName}`), {
//             gitignore: true,
//             cwd: rootDir,
//         });
//         const vendors: Record<string, any> = {};
//         for (const pkgPath of vendorPackages) {
//             const dir = path.posix.dirname(pkgPath);
//             const file = await readFile(pkgPath);
//             vendors[file.pkg.name] = { dir, file, deps: [] };
//         }
//         // Load dependencies and update references
//         const vendorsList = Object.entries(vendors);
//         for (const [, data] of vendorsList) {
//             for (const [depName, depData] of vendorsList) {
//                 const line = data.file.stream.find((e: string) => e.includes(`"${depName}"`));
//                 if (line?.includes(depData.file.pkg.version)) {
//                     data.deps.push(depName);
//                     const lineNumber = data.file.stream.indexOf(line);
//                     const file = path.posix.relative(data.dir, depData.dir);
//                     data.file.updated = true;
//                     data.file.stream[lineNumber] = line.replace(`"${depData.file.pkg.version}"`, `"file:${file}"`);
//                 }
//             }
//         }

//         // BotBuilder libraries
//         const testingDir = path.posix.join(rootDir, 'testing');
//         const libFiles = await globby(
//             [path.posix.join(librariesDir, '**/package.json'), path.posix.join(testingDir, '**/package.json')],
//             {
//                 gitignore: true,
//                 cwd: rootDir,
//             }
//         );

//         function replaceAt(str: string, index: number, replacement: string) {
//             return str.substring(0, index) + replacement + str.substring(index + replacement.length);
//         }
//         for (const libfile of libFiles) {
//             const file = await readFile(libfile);
//             if (!libfile.includes('/adaptive-expressions/package.json')) {
//                 continue;
//             }

//             const libdir = path.posix.dirname(libfile);
//             const vendorDir = path.posix.join(libdir, 'vendor');
//             if (!fs.existsSync(vendorDir)) {
//                 fs.mkdirSync(vendorDir);
//             }

//             const memo = new Set<string>();

//             // Update package.json reference solo de la libreria,
//             // los vendors ya fueron actualizados antes ya que son las mismas referencias para todas las libs
//             for (const [depName, depData] of vendorsList) {
//                 const line = file.stream.find((e: string) => e.includes(`"${depName}"`));
//                 if (!line?.includes(depData.file.pkg.version)) {
//                     continue;
//                 }
//                 const lineNumber = file.stream.indexOf(line);
//                 const resolvedPath = path.posix.join(vendorDir, depName);
//                 const realDir = path.posix.join(libdir, depName); // TODO: probar sin carpeta en la dep si queda tiempo
//                 const newFile = path.posix.relative(realDir, resolvedPath);
//                 file.stream[lineNumber] = line.replace(`"${depData.file.pkg.version}"`, `"file:${newFile}"`);

//                 for (const name of [depName, ...depData.deps]) {
//                     const data = vendors[name];
//                     const resolvedPath = path.posix.join(vendorDir, name);
//                     copyDir(data.dir, resolvedPath);
//                     if (data.file.updated) {
//                         fs.writeFileSync(path.posix.join(resolvedPath, data.file.name), data.file.content(), {
//                             encoding: 'utf-8',
//                         });
//                     }
//                 }

//                 // copyDir(depData.dir, resolvedPath);
//                 // if (depData.file.updated) {
//                 //     fs.writeFileSync(path.posix.join(resolvedPath, depData.file.name), depData.file.content(), {
//                 //         encoding: 'utf-8',
//                 //     });
//                 // }

//                 // Update lib
//                 fs.writeFileSync(libfile, file.content(), { encoding: 'utf-8' });

//                 // const line = file.stream.find((e: string) => e.includes(`"${depName}"`));
//                 // if (line?.includes(depData.file.pkg.version)) {
//                 //     const resolvedPath = path.posix.join(vendorDir, depName);
//                 //     const lineNumber = file.stream.indexOf(line);
//                 //     const newFile = path.posix.relative(dir, resolvedPath);
//                 //     console.log(newFile);
//                 //     file.stream[lineNumber] = line.replace(`"${depData.file.pkg.version}"`, `"file:${newFile}"`);
//                 //     // fs.copyFileSync(data.dir, resolvedPath);
//                 //     console.log('copy:', depData.dir, resolvedPath, depData.deps);
//                 //     console.log('replace:', path.posix.join(resolvedPath, depData.file.name));
//                 //     // Copy dir
//                 //     // Replace package.json
//                 //     // Same for nested dependencies
//                 //     // copyNestedDependencies(vendors, depData.deps, vendorDir, memo);
//                 //     copy(vendorsList, depData.file, depData.file.dir);
//                 // }
//             }
//         }

//         return success();
//     } catch (err: any) {
//         return failure(err instanceof Error ? err.message : err, 22);
//     }
// };

// function copyNestedDependencies(index: Record<string, any>, dependencies: string[], dir: string, memo: Set<string>) {
//     const run = (index: Record<string, any>, dependencies: string[], dir: string, memo: Set<string>) => {
//         for (const id of dependencies) {
//             const tgz = index[id];
//             const to = path.posix.join(dir, id);
//             if (memo.has(to)) {
//                 continue;
//             }
//             // fs.copyFileSync(tgz.path, to);
//             console.log('copy dep:', tgz.dir, to, tgz.deps);
//             console.log('replace:', path.posix.join(to, tgz.file.name));
//             memo.add(to);
//             run(index, tgz.deps, dir, memo);
//         }
//     };

//     return run(index, dependencies, dir, memo);
// }

// if (require.main === module) {
//     run(main());
// }

// function copyDir(source: string, destination: string) {
//     const ignore = ['node_modules'];
//     const directoryEntries = fs.readdirSync(source, { withFileTypes: true });
//     fs.mkdirSync(destination, { recursive: true });

//     directoryEntries.map((entry) => {
//         if (ignore.includes(entry.name)) {
//             return;
//         }
//         const sourcePath = path.join(source, entry.name);
//         const destinationPath = path.join(destination, entry.name);

//         return entry.isDirectory()
//             ? copyDir(sourcePath, destinationPath)
//             : fs.copyFileSync(sourcePath, destinationPath);
//     });
// }
