// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import glob from 'fast-glob';
import path from 'path';
import { existsSync } from 'fs';
import fs from 'fs/promises';
import { Package } from 'botbuilder-repo-utils/src/package';
import { collectWorkspacePackages } from 'botbuilder-repo-utils/src/workspace';
import { failure, run, success } from 'botbuilder-repo-utils/src/run';
import { gitRoot } from 'botbuilder-repo-utils/src/git';
import { readJsonFile } from 'botbuilder-repo-utils/src/file';
import { execSync } from 'child_process';
import minimist from 'minimist';

interface Vendor extends Package {
    dir: string;
}

interface Dependency {
    name: string;
    version: string;
}

const colors = {
    reset: '\x1b[0m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
};

const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';

async function collectVendors(gitRoot: string) {
    const dir = path.resolve(gitRoot, 'libraries/botbuilder-vendors/vendors');
    const packages = await glob('**/package.json', { cwd: dir });

    if (packages.length === 0) {
        throw new Error(`No vendors found in '${dir}'`);
    }

    const p = packages.map(async (file) => {
        const pkg = (await readJsonFile(path.join(dir, file))) as Package;
        return {
            ...pkg,
            dir: path.join(dir, path.dirname(file)),
        } as Vendor;
    });
    return Promise.all(p);
}

async function getConnectedPackages(pkg: Vendor, vendors: Vendor[]) {
    const result: { vendors: Vendor[]; dependencies: Dependency[] } = { vendors: [], dependencies: [] };

    async function inner(pkg: Vendor, memo: Set<string> = new Set()) {
        const localDependencies = Object.keys(pkg.localDependencies || {});
        for (const name of localDependencies) {
            if (memo.has(name)) {
                continue;
            }
            const vendor = vendors.find((vendor) => vendor.name === name);
            if (!vendor) {
                continue;
            }
            memo.add(vendor.name);
            result.vendors.push(vendor);

            if (vendor.localDependencies) {
                await inner(vendor, memo);
            }

            if (vendor.dependencies) {
                for (const [name, version] of Object.entries(vendor.dependencies)) {
                    if (memo.has(name)) {
                        continue;
                    }
                    memo.add(name);
                    result.dependencies.push({ name, version });
                }
            }
        }
    }

    await inner(pkg);

    return result;
}

export const command = (argv: string[]) => async () => {
    try {
        const flags = minimist(argv);
        const action = flags._[0];
        const isEmpty = action === undefined;
        const isInstall = action === 'install';
        const isBuild = action === 'build';

        if (isEmpty) {
            return failure('Please provide a command (install or build)', 21);
        }

        const repoRoot = await gitRoot();
        const packageFile = await readJsonFile<Package>(path.join(repoRoot, 'package.json'));
        if (!packageFile) {
            return failure('package.json not found', 20);
        }

        // TODO: get folder where the script is running and execute the stuff there.
        const workspaces = await collectWorkspacePackages(repoRoot, packageFile.workspaces?.packages, {
            hasLocalDependencies: true,
            ignorePath: ['**/libraries/botbuilder-vendors/**/*'],
        });

        const globalVendors = await collectVendors(repoRoot);

        if (globalVendors.length === 0) {
            return;
        }

        console.log(`
Connecting vendors to workspaces...

${colors.blue}summary${colors.reset}
----------------------
action    : ${colors.magenta}${action}${colors.reset}
vendors   : ${colors.magenta}${globalVendors.length} packages${colors.reset}
workspaces: ${colors.magenta}${workspaces.length} packages${colors.reset}
`);
        for (const { pkg, absPath } of workspaces) {
            console.log(`${colors.blue}${pkg.name} ${colors.green}[workspace]${colors.reset}`);
            const location = pkg.localDependencies!.__location;
            if (!location) {
                throw new Error(
                    `localDependencies.__location property not found in ${pkg.name} library. Please provide a directory to copy the files to.`,
                );
            }

            const dir = path.dirname(absPath);

            const { vendors, dependencies } = await getConnectedPackages(pkg as any, globalVendors);

            if (vendors.length == 0) {
                continue;
            }

            if (isBuild) {
                const tsconfig = await readJsonFile<any>(path.join(dir, 'tsconfig.json'));
                const configDir = tsconfig.compilerOptions.outDir;
                const outDir = path.resolve(dir, configDir);
                const files = await glob(`**/*.js`, { cwd: outDir });

                const references: Record<string, any> = {};
                for (const file of files) {
                    const filePath = path.join(outDir, file);
                    const content = await fs.readFile(filePath, 'utf8');
                    for (const vendor of vendors) {
                        const vendorDir = path.join(dir, location, path.basename(vendor.dir));
                        const relative = path.relative(path.dirname(filePath), vendorDir).split(path.sep).join('/');
                        const from = `require("${vendor.name}")`;
                        const to = `require("${relative}")`;
                        if (!content.includes(from)) {
                            continue;
                        }
                        const line = content.split('\n').findIndex((line) => line.includes(from)) + 1;
                        references[file] ??= [];
                        references[file].push({ from, to, line });
                        const newContent = content.replace(from, to);
                        // await fs.writeFile(filePath, newContent, 'utf8');
                    }
                }

                if (files.length > 0) {
                    const entries = Object.entries(references);
                    console.log(`└─ require statements: ${colors.magenta}${entries.length} files${colors.reset}`);
                    for (let i = 0; i < entries.length; i++) {
                        const [file, refs] = entries[i];
                        const prefix = i === entries.length - 1 ? '└─' : '├─';
                        console.log(
                            `   ${prefix} ${colors.cyan}${configDir}/${file}: ${colors.magenta}${refs.length} reference${refs.length === 1 ? '' : 's'}${colors.reset}`,
                        );
                        for (let j = 0; j < refs.length; j++) {
                            const ref = refs[j];
                            const prefix = j === refs.length - 1 ? '└─' : '├─';
                            const prefix2 = i === entries.length - 1 ? ' ' : '│';
                            console.log(
                                `   ${prefix2}  ${prefix} ${colors.dim}line:${ref.line} | ${colors.red}${ref.from}${colors.reset} ${colors.dim}-> ${colors.green}${ref.to}${colors.reset}`,
                            );
                        }
                    }
                }
            }

            if (isInstall) {
                console.log(
                    `├─ vendors: ${colors.magenta}${vendors.length} packages ${colors.green}[linked]${colors.reset}`,
                );
                for (let i = 0; i < vendors.length; i++) {
                    const vendor = vendors[i];
                    const source = path.join(vendor.dir, vendor.main);
                    const vendorDir = path.join(dir, location, path.basename(vendor.dir));
                    const destination = path.join(vendorDir, vendor.main);

                    if (!existsSync(vendorDir)) {
                        await fs.mkdir(vendorDir, { recursive: true });
                    }

                    const prefix = i === vendors.length - 1 ? '└─' : '├─';
                    console.log(
                        `│  ${prefix} ${colors.dim}${vendor.name}@${colors.cyan}${vendor.version}${colors.reset}`,
                    );
                    await fs.copyFile(source, destination);
                }

                if (isGitHubActions) {
                    console.log(
                        `└─ dependencies: ${colors.magenta}${dependencies.length} packages ${colors.green}[added]${colors.reset}`,
                    );
                    for (let i = 0; i < dependencies.length; i++) {
                        const { name, version } = dependencies[i];
                        const prefix = i === dependencies.length - 1 ? '└─' : '├─';
                        console.log(`   ${prefix} ${colors.dim}${name}@${colors.cyan}${version}${colors.reset}`);
                        execSync(`npm pkg set dependencies["${name}"]="${version}"`, { cwd: dir });
                    }
                }
            }
            console.log('');
        }

        return success();
    } catch (err: any) {
        return failure(err instanceof Error ? err.message : err, 22);
    }
};

if (require.main === module) {
    run(command(process.argv.slice(2)) as any);
}
