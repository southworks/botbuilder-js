// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import path from 'path';
import { glob } from 'fast-glob';
import { readJsonFile } from 'botbuilder-repo-utils/src/file';
import { Dependency, Package } from 'botbuilder-repo-utils/src/package';
import { failures } from './utils';

export interface Vendor extends Package {
    dir: string;
}

export async function findAll(dir: string): Promise<Vendor[]> {
    const packages = await glob('**/package.json', { cwd: dir });

    if (packages.length === 0) {
        throw failures.vendorPackagesNotFound(dir);
    }

    const promises = packages.map(async (file) => {
        const pkgPath = path.join(dir, file);
        const pkg = await readJsonFile<Package>(pkgPath);
        if (!pkg) {
            throw failures.packageJsonNotFound(pkgPath);
        }

        return {
            ...pkg,
            dir: path.dirname(pkgPath),
        };
    });
    return Promise.all(promises);
}

export async function findByPackage(pkg: Package, vendors: Vendor[]) {
    const result: { vendors: Vendor[]; dependencies: Dependency[]; unknown: Dependency[] } = {
        vendors: [],
        dependencies: [],
        unknown: [],
    };

    async function inner(pkg: Package, memo: Set<string> = new Set()) {
        const localDependencies = Object.entries(pkg.localDependencies || {});
        for (const [name, version] of localDependencies) {
            if (memo.has(name)) {
                continue;
            }
            const vendor = vendors.find((vendor) => vendor.name === name);
            if (!vendor) {
                result.unknown.push({ name, version });
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
