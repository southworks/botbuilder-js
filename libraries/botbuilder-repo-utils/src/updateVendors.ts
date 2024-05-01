// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import fs from 'fs';
import path from 'path';
import globby from 'globby';

import { failure, Result, run, success } from './run';
import { gitRoot } from './git';

const command = (argv: string[]) => async (): Promise<Result> => {
    const pkgName = 'package.json';
    const repoPath = 'https://raw.githubusercontent.com/southworks/botbuilder-js/joelmut/test/recognizers-text/vendor';
    try {
        const [folder] = argv;
        const rootDir = await gitRoot();
        const librariesDir = path.posix.join(rootDir, 'libraries');
        const vendorDir = path.posix.join(rootDir, 'vendor');
        const vendorPackages = await globby(path.posix.join(vendorDir, `**/${pkgName}`), {
            gitignore: true,
            cwd: rootDir,
        });
        const vendors: Record<string, any> = {};
        for (const pkgPath of vendorPackages) {
            const dir = path.posix.dirname(pkgPath);
            const file = await readFile(pkgPath);
            vendors[file.pkg.name] = { dir, file, deps: [] };
        }
        // Load dependencies and update references
        const vendorsList = Object.entries(vendors);
        for (const [, data] of vendorsList) {
            for (const [depName, depData] of vendorsList) {
                const line = data.file.stream.find((e: string) => e.includes(`"${depName}"`));
                if (line?.includes(depData.file.pkg.version)) {
                    data.deps.push(depName);
                    const lineNumber = data.file.stream.indexOf(line);
                    const file = path.posix.relative(data.dir, depData.dir);
                    data.file.updated = true;
                    data.file.stream[lineNumber] = line.replace(
                        `"${depData.file.pkg.version}"`,
                        `"${repoPath}/${depName}/"`
                    );
                    console.log(data.file.stream);
                }
            }
        }
        return success();
    } catch (err: any) {
        return failure(err instanceof Error ? err.message : err);
    }
};

if (require.main === module) {
    run(command(process.argv.slice(2)));
}
