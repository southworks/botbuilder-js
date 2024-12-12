// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { execSync } from 'child_process';
import path from 'path';
import { existsSync } from 'fs';
import { mkdir, readFile, writeFile, copyFile } from 'fs/promises';
import glob from 'fast-glob';
import minimist from 'minimist';
import { Package } from 'botbuilder-repo-utils/src/package';
import { collectWorkspacePackages } from 'botbuilder-repo-utils/src/workspace';
import { failure, run, success } from 'botbuilder-repo-utils/src/run';
import { gitRoot } from 'botbuilder-repo-utils/src/git';
import { readJsonFile } from 'botbuilder-repo-utils/src/file';

const VENDORS_DIR = 'libraries/botbuilder-vendors/vendors';
const IS_GITHUB_ACTIONS = process.env.GITHUB_ACTIONS === 'true';

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
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
};

const actions = {
    install: 'install',
    build: 'build',
};

function plural(n: number, text: string, plural: string = 's') {
    return `${text}${n === 1 ? '' : plural}`;
}

function padLeft(text: string) {
    return text
        .split('\n')
        .map((line) => line.trim())
        .join('\n');
}

const logs = {
    summary({ action, vendors, workspaces }: any) {
        console.log(
            padLeft(`
                Connecting vendors to workspaces...
                
                ${colors.blue}summary${colors.reset}
                ----------------------
                action    : ${colors.magenta}${action}${colors.reset}
                vendors   : ${colors.magenta}${vendors} ${plural(vendors, 'package')}${colors.reset}
                workspaces: ${colors.magenta}${workspaces} ${plural(workspaces, 'package')}${colors.reset}
            `),
        );
    },
    package: {
        header({ name }: any) {
            console.log(`${colors.blue}${name} ${colors.cyan}[workspace]${colors.reset}`);
        },
        footer() {
            console.log(`└─ ${colors.dim}done${colors.reset}\r\n`);
        },
        require: {
            header({ files }: any) {
                const tags = files > 0 ? [`${colors.green}[replaced]`] : [`${colors.red}[not found]`];
                console.log(
                    `├─ require statements: ${colors.magenta}${files} ${plural(files, 'file')} ${tags.join('')}${colors.reset}`,
                );
            },
            file: {
                header({ isLast, dir, file, references }: any) {
                    const prefix = isLast ? '└─' : '├─';
                    console.log(
                        `│   ${prefix} ${colors.cyan}${dir}/${file}: ${colors.magenta}${references} ${plural(references, 'reference')}${colors.reset}`,
                    );
                },
                reference({ isLast, line, from, to }: any) {
                    const prefix = isLast ? '└─' : '├─';
                    console.log(
                        `│  │  ${prefix} ${colors.dim}line:${line} | ${colors.red}${from}${colors.reset} ${colors.dim}-> ${colors.green}${to}${colors.reset}`,
                    );
                },
            },
        },
        vendors: {
            header({ vendors }: any) {
                const tags = vendors > 0 ? [`${colors.green}[linked]`] : [];
                console.log(
                    `├─ vendors: ${colors.magenta}${vendors} ${plural(vendors, 'package')} ${tags.join('')}${colors.reset}`,
                );
            },
            vendor({ isLast, name, version }: any) {
                const prefix = isLast ? '└─' : '├─';
                console.log(`│  ${prefix} ${colors.dim}${name}@${colors.cyan}${version}${colors.reset}`);
            },
        },
        dependencies: {
            header({ dependencies }: any) {
                console.log(
                    `├─ dependencies: ${colors.magenta}${dependencies} ${plural(dependencies, 'package')} ${colors.green}[added]${colors.reset}`,
                );
            },
            dependency({ isLast, name, version }: any) {
                const prefix = isLast ? '└─' : '├─';
                console.log(`│  ${prefix} ${colors.dim}${name}@${colors.cyan}${version}${colors.reset}`);
            },
        },
        unknown: {
            vendors: {
                header({ vendors }: any) {
                    console.log(
                        `├─ unknown vendors: ${colors.magenta}${vendors.length} ${plural(vendors.length, 'package')} ${colors.red}[not found]${colors.reset}`,
                    );
                    for (let i = 0; i < vendors.length; i++) {
                        const { name, version } = vendors[i];
                        logs.package.unknown.vendors.vendor({ isLast: i === vendors.length - 1, name, version });
                    }
                },
                vendor({ isLast, name, version }: any) {
                    const prefix = isLast ? '└─' : '├─';
                    console.log(`│  ${prefix} ${colors.dim}${name}@${colors.cyan}${version}${colors.reset}`);
                },
            },
        },
    },
};

const failures = {
    validAction() {
        return new Error(`Please provide a valid action: ${Object.values(actions).join(' or ')}`);
    },
    packageJsonNotFound(pkgPath: string) {
        return new Error(`Unable to find package.json file at ${pkgPath}`);
    },
    packageJsonNotFoundWithWorkspaces(pkgPath: string) {
        return new Error(`Unable to find package.json file with workspaces at ${pkgPath}`);
    },
};

async function collectVendors(gitRoot: string): Promise<Vendor[]> {
    const dir = path.resolve(gitRoot, VENDORS_DIR);
    const packages = await glob('**/package.json', { cwd: dir });

    if (packages.length === 0) {
        throw new Error(`Unable to find vendor packages under '${dir}' folder`);
    }

    const promises = packages.map(async (file) => {
        const pkgPath = path.join(dir, file);
        const pkg = await readJsonFile<Package>(pkgPath);
        if (!pkg) {
            throw new Error(`Unable to load ${pkgPath}. Please provide a valid package.json.`);
        }

        return {
            ...pkg,
            dir: path.dirname(pkgPath),
        };
    });
    return Promise.all(promises);
}

async function getConnectedVendors(pkg: Package, vendors: Vendor[]) {
    const result: { vendors: Vendor[]; dependencies: Dependency[]; unknown: Dependency[] } = {
        vendors: [],
        dependencies: [],
        unknown: [],
    };

    async function inner(pkg: Package, memo: Set<string> = new Set()) {
        const localDependencies = Object.keys(pkg.localDependencies || {});
        for (const name of localDependencies) {
            if (memo.has(name)) {
                continue;
            }
            const vendor = vendors.find((vendor) => vendor.name === name);
            if (!vendor) {
                result.unknown.push({ name, version: pkg.localDependencies![name] });
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

async function build({ dir, vendors, location }: any) {
    logs.package.vendors.header({ vendors: vendors.length });

    if (vendors.length === 0) {
        return;
    }

    const tsconfig = await readJsonFile<any>(path.join(dir, 'tsconfig.json'));
    const configDir = tsconfig.compilerOptions.outDir;
    const outDir = path.resolve(dir, configDir);
    const files = await glob(`**/*.js`, { cwd: outDir });

    const references: Record<string, any> = {};
    for (const file of files) {
        const filePath = path.join(outDir, file);
        const content = await readFile(filePath, 'utf8');
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
            await writeFile(filePath, newContent, 'utf8');
        }
    }

    const entries = Object.entries(references);
    logs.package.require.header({ files: entries.length });
    for (let i = 0; i < entries.length; i++) {
        const [file, refs] = entries[i];
        logs.package.require.file.header({
            isLast: i === entries.length - 1,
            dir: outDir,
            file,
            references: refs.length,
        });
        for (let j = 0; j < refs.length; j++) {
            const ref = refs[j];
            logs.package.require.file.reference({
                isLast: i === entries.length - 1,
                line: ref.line,
                from: ref.from,
                to: ref.to,
            });
        }
    }
}

async function install({ vendors, dependencies, dir, location }: any) {
    logs.package.vendors.header({ vendors: vendors.length });
    for (let i = 0; i < vendors.length; i++) {
        const vendor = vendors[i];
        const source = path.join(vendor.dir, vendor.main);
        const vendorDir = path.join(dir, location, path.basename(vendor.dir));
        const destination = path.join(vendorDir, vendor.main);

        if (!existsSync(vendorDir)) {
            await mkdir(vendorDir, { recursive: true });
        }

        logs.package.vendors.vendor({ isLast: i === vendors.length - 1, name: vendor.name, version: vendor.version });
        await copyFile(source, destination);
    }

    logs.package.dependencies.header({ dependencies: dependencies.length });
    for (let i = 0; i < dependencies.length; i++) {
        const { name, version } = dependencies[i];
        logs.package.dependencies.dependency({ isLast: i === dependencies.length - 1, name, version });
        if (IS_GITHUB_ACTIONS) {
            // Only modify package.json if running in GitHub Actions.
            execSync(`npm pkg set dependencies["${name}"]="${version}"`, { cwd: dir });
        }
    }
}

export const command = (argv: string[]) => async () => {
    try {
        const flags = minimist(argv);
        const action = flags._[0];
        if (!action) {
            throw failures.validAction();
        }

        const rootDir = await gitRoot();
        const globalVendors = await collectVendors(rootDir);

        const pkgPath = path.join(rootDir, 'package.json');
        if (!existsSync(pkgPath)) {
            throw failures.packageJsonNotFound(pkgPath);
        }

        const pkg = await readJsonFile<Package>(pkgPath);
        if (!pkg?.workspaces?.packages) {
            throw failures.packageJsonNotFoundWithWorkspaces(pkgPath);
        }

        const workspaces = await collectWorkspacePackages(rootDir, pkg.workspaces.packages, {
            hasLocalDependencies: true,
            ignorePath: [`**/${VENDORS_DIR}/**/*`],
        });

        logs.summary({ action, vendors: globalVendors.length, workspaces: workspaces.length });

        for (const { pkg, absPath } of workspaces) {
            logs.package.header({ name: pkg.name });

            const dir = path.dirname(absPath);
            const location = pkg.localDependencies!.__directory ?? 'vendors';
            delete pkg.localDependencies!.__directory;

            const { vendors, dependencies, unknown } = await getConnectedVendors(pkg, globalVendors);

            if (unknown.length > 0) {
                logs.package.unknown.vendors.header({ vendors: unknown });
            }

            if (action === actions.build) {
                await build({ dir, vendors, location });
            }

            if (action === actions.install) {
                await install({ vendors, dependencies, dir, location });
            }

            logs.package.footer();
        }

        return success();
    } catch (err: any) {
        return failure(err instanceof Error ? err.message : err);
    }
};

if (require.main === module) {
    run(command(process.argv.slice(2)));
}
