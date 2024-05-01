// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import fs from 'fs';
import path from 'path';
import globby from 'globby';

import { failure, Result, run, success } from './run';
import { gitRoot } from './git';

const command = (argv: string[]) => async (): Promise<Result> => {
    try {
        const [from, to] = argv;
        const root = await gitRoot();
        const files = await globby(from, { cwd: root, gitignore: true });
        for (const file of files) {
            const filename = path.basename(file);
            const origin = path.join(root, file);
            const dest = path.join(root, path.extname(to) ? to : `${to}/${filename}`);
            await fs.promises.rename(origin, dest);
        }
        return success();
    } catch (err: any) {
        return failure(err instanceof Error ? err.message : err);
    }
};

if (require.main === module) {
    run(command(process.argv.slice(2)));
}
