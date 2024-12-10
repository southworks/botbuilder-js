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
        // Parse process.argv for all configuration options
        const flags = minimist(argv, { boolean: ['install', 'build'], default: { install: true } });

        const repoRoot = await gitRoot();
        const packageFile = await readJsonFile<Package>(path.join(repoRoot, 'package.json'));
        if (!packageFile) {
            return failure('package.json not found', 20);
        }

        const workspaces = await collectWorkspacePackages(repoRoot, packageFile.workspaces?.packages, {
            hasLocalDependencies: true,
            ignorePath: ['/libraries/botbuilder-vendors/**/*'],
        });

        const globalVendors = await collectVendors(repoRoot);

        if (globalVendors.length === 0) {
            return;
        }

        for (const { pkg, absPath } of workspaces) {
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

            if (flags.build) {
                const tsconfig = await readJsonFile<any>(path.join(dir, 'tsconfig.json'));
                const outDir = path.resolve(dir, tsconfig.compilerOptions.outDir);
                const files = await glob(`**/*.js`, { cwd: outDir });
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
                        const newContent = content.replace(definition, `require("${relative}")`);
                        await fs.writeFile(filePath, newContent, 'utf8');
                    }
                }
            }

            if (flags.install) {
                console.log(`Adding packages to ${pkg.name}...`);
                for (const vendor of vendors) {
                    const source = path.join(vendor.dir, vendor.main);
                    const vendorDir = path.join(dir, location, path.basename(vendor.dir));
                    const destination = path.join(vendorDir, vendor.main);

                    if (!existsSync(vendorDir)) {
                        await fs.mkdir(vendorDir, { recursive: true });
                    }

                    console.log(`  - ${vendor.name}@${vendor.version} (VENDOR)`);
                    await fs.copyFile(source, destination);
                }

                for (const { name, version } of dependencies) {
                    console.log(`  - [added in package.json] ${name}@${version} (VENDOR DEPENDENCY)`);
                    execSync(`npm pkg set dependencies["${name}"]="${version}"`, { cwd: dir });
                }
            }
        }

        return success();
    } catch (err: any) {
        return failure(err instanceof Error ? err.message : err, 22);
    }
};

if (require.main === module) {
    run(command(process.argv.slice(2)) as any);
}
