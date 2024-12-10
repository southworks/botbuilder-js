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

async function collectVendors(gitRoot: string) {
    const dir = path.resolve(gitRoot, 'libraries/botbuilder-vendors/src');
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
            ignorePath: ['/libraries/botbuilder-vendors/**/*'],
        });

        const globalVendors = await collectVendors(repoRoot);

        if (globalVendors.length === 0) {
            return;
        }

        console.log(`
summary
-------
action    : ${action}
vendors   : ${globalVendors.length} packages
workspaces: ${workspaces.length} packages
-------
        `);
        for (const { pkg, absPath } of workspaces) {
            console.log(`
${pkg.name}           
-------`);
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
                const outDir = path.resolve(dir, tsconfig.compilerOptions.outDir);
                const files = await glob(`**/*.js`, { cwd: outDir });
                if (files.length > 0) {
                    console.log(
                        // `[build] Updating import/require statements under the '${tsconfig.compilerOptions.outDir}' folder in '${pkg.name}'...`,
                        `[build] ${pkg.name}`,
                    );
                }

                let count = 0;
                for (const file of files) {
                    const filePath = path.join(outDir, file);
                    const content = await fs.readFile(filePath, 'utf8');
                    for (const vendor of vendors) {
                        const vendorDir = path.join(dir, location, path.basename(vendor.dir));
                        const relative = path.relative(path.dirname(filePath), vendorDir).split(path.sep).join('/');
                        const definition = `require("${vendor.name}")`;
                        if (!content.includes(definition)) {
                            continue;
                        }
                        count++;
                        const newContent = content.replace(definition, `require("${relative}")`);
                        await fs.writeFile(filePath, newContent, 'utf8');
                    }
                }

                if (files.length > 0) {
                    // console.log(`  - Found ${count} references.`);
                    // TODO: add a list of vendors updated in each file.
                    console.log(
                        `  - found ${count} import/require statements under the '${tsconfig.compilerOptions.outDir}' folder.`,
                    );
                }
            }

            if (isInstall) {
                // console.log(`Adding packages to ${pkg.name}...`);
                console.log(`vendors     : ${vendors.length} packages`);
                for (let i = 0; i < vendors.length; i++) {
                    const vendor = vendors[i];
                    const source = path.join(vendor.dir, vendor.main);
                    const vendorDir = path.join(dir, location, path.basename(vendor.dir));
                    const destination = path.join(vendorDir, vendor.main);

                    if (!existsSync(vendorDir)) {
                        await fs.mkdir(vendorDir, { recursive: true });
                    }

                    const prefix = i === vendors.length - 1 ? '└' : '├';
                    console.log(`  ${prefix} ${vendor.name}@${vendor.version}`);
                    await fs.copyFile(source, destination);
                }

                console.log(`dependencies: ${dependencies.length} packages`);
                for (let i = 0; i < dependencies.length; i++) {
                    const { name, version } = dependencies[i];
                    const prefix = i === dependencies.length - 1 ? '└' : '├';
                    console.log(`  ${prefix} ${name}@${version}`);
                    execSync(`npm pkg set dependencies["${name}"]="${version}"`, { cwd: dir });
                }
            }
            console.log('\n');
        }

        return success();
    } catch (err: any) {
        return failure(err instanceof Error ? err.message : err, 22);
    }
};

if (require.main === module) {
    run(command(process.argv.slice(2)) as any);
}
