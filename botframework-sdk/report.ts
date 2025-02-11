import { exec, execSync, spawnSync, fork, spawn } from 'child_process';
import * as path from 'path';
import { promisify } from 'util';

const execp = promisify(exec);
const spawnp = promisify(spawn);

interface YarnReport {
    Package: string;
    Current: string;
    Wanted: string;
    Latest: string;
    Workspace: string;
    PackageType: string;
    URL: string;
}

interface OutdatedPackage {
    url: string;
    detectedVersions: {
        [version: string]: {
            projects: string[];
        };
    };
    availableUpdates: any;
}

interface OutdatedPackages {
    [version: string]: OutdatedPackage;
}

function mapToObject(head: string[], body: string[][]): YarnReport[] {
    return body.map((row) => {
        return row.reduce((acc, cell, index) => {
            acc[head[index]] = cell;
            return acc;
        }, {} as YarnReport);
    });
}

function mapToPackage(yarnReport: YarnReport[]): OutdatedPackages {
    return yarnReport.reduce((acc, e) => {
        const prevPkg = acc[e.Package];
        const pkg: OutdatedPackage = {
            url: `https://www.npmjs.com/package/${e.Package}`,
            detectedVersions: {
                [e.Current]: {
                    // projects: [e.Workspace, ...(prevPkg?.detectedVersions?.[e.Current]?.projects || [])].filter(
                    //     Boolean,
                    // ),
                    projects: [
                        ...(prevPkg?.detectedVersions?.[e.Current]?.projects || []),
                        { name: e.Workspace, path: `//.../${e.Workspace}/package.json` },
                    ],
                },
            },
            availableUpdates: {
                // TODO: search from npm feed to gather more versions based on certain criteria, greatest than supported node versions + ts version, for greatest node + ts versions that arent suported in the sdk show a flag.
                // [e.Wanted]: {
                // },
                [e.Latest]: { type: 'CJS', node: '>=18' },
            },
        };

        acc[e.Package] = pkg;
        return acc;
    }, {});
}

/**
 * Pluralize a word based on a count.
 *
 * @param n Count.
 * @param text Word to pluralize.
 * @param plural Plural suffix.
 * @returns Pluralized word.
 */
function plural(n: number, text: string, plural: string = 's') {
    return `${text}${n === 1 ? '' : plural}`;
}

function createDetectedVersionsMarkdown(pkg: OutdatedPackage): string[] {
    const detectedVersions = Object.entries(pkg.detectedVersions);
    if (detectedVersions.length === 0) {
        throw new Error('No detected versions');
    }

    let title = `- **detected ${plural(detectedVersions.length, 'version')}:**`;

    const isMultiVersion = detectedVersions.length > 1;
    const isSingleVersion = !isMultiVersion;
    const isSingleProject = detectedVersions[0][1].projects.length === 1;

    if (isSingleVersion && isSingleProject) {
        title += ` _only one project contains the package._`;
    } else if (isSingleVersion) {
        title += ` _multiple projects contain the same version of the package_.`;
    } else if (isMultiVersion) {
        title += ` _multiple projects contain different versions of the package, please consolidate._`;
    }

    const lines = [];
    lines.push(title);
    for (let i = 0; i < detectedVersions.length; i++) {
        const [version, info] = detectedVersions[i];
        const projects = info.projects.map((e) => `[\`${e.name}\`](${e.path})`);
        const line = ` ├─ [\`${version}\`](${pkg.url}/v/${version}) ─ **${plural(projects.length, 'project')}:** ${projects.join('')}`;
        lines.push(line);
    }
    return lines;
}

function createAvailableUpdatesMarkdown(pkg: OutdatedPackage): string[] {
    const availableUpdates = Object.entries(pkg.availableUpdates);

    let title = `- **available ${plural(availableUpdates.length, 'update')}:**`;

    const isMultiVersion = availableUpdates.length > 1;
    const isSingleVersion = !isMultiVersion;
    const isSingleProject = availableUpdates[0][1].projects.length === 1;

    if (isSingleVersion && isSingleProject) {
        title += ` _only one project contains the package._`;
    } else if (isSingleVersion) {
        title += ` _multiple projects contain the same version of the package_.`;
    } else if (isMultiVersion) {
        title += ` _multiple projects contain different versions of the package, please consolidate._`;
    }

    const lines = [];
    lines.push(title);
    for (let i = 0; i < availableUpdates.length; i++) {
        const [version, info] = availableUpdates[i];
        const projects = info.projects.map((e) => `[\`${e.name}\`](${e.path})`);
        const line = ` ├─ [\`${version}\`](${pkg.url}/v/${version}) ─ **${plural(projects.length, 'project')}:** ${projects.join('')}`;
        lines.push(line);
    }
    return lines;
}

function createMarkdown(packages: OutdatedPackages) {
    const lines = [];
    for (const [name, pkg] of Object.entries(packages)) {
        lines.push(`## [${name}](${pkg.url})`);

        lines.concat(createDetectedVersionsMarkdown(pkg));
        lines.concat(createAvailableUpdatesMarkdown(pkg));

        const availableUpdates = Object.entries(pkg.availableUpdates);
        title = `- **available ${plural(availableUpdates.length, 'updates')}:**`;
        if (detectedVersions.length > 1) {
            title += ' _newer version/s detected, please update to one of the following._';
        }
    }
}

function main() {
    const { stderr, stdout } = spawnSync('yarn', ['outdated', '--json'], { encoding: 'utf-8', shell: true });

    if (stderr.length > 0 && !stderr.startsWith('Debugger attached')) {
        console.error(stderr);
    }

    const info = stdout.split('\n')[1];
    const { head, body } = JSON.parse(info).data;
    const yarnReport = mapToObject(head, body);
    const outdatedPackages = mapToPackage(yarnReport);
    var markdown = createMarkdown(outdatedPackages);
    return {
        integrity: '1234567890',
        markdown,
    };
}

// const result = {
//     integrity: '1234567890',
//     markdown: 'Hello from report.ts',
// };

// console.log(JSON.stringify(result));

// main();

// TODO: try top level await.

// try {

// const stdout = execSync('yarn outdated --json', { encoding: 'utf-8', stdio: ['inherit', 'inherit', 'ignore'] });
// console.log(stdout);
// } catch (error) {
// console.log(error);
// }

// var s = spawnSync('yarn', ['outdated', '--json'], {
//     encoding: 'utf-8',
//     shell: true,
// });

// console.log(s);

const report = main();
console.log(JSON.stringify(report));
