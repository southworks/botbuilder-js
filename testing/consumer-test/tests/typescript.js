const { exec } = require('child_process');
const { promisify } = require('util');
const execp = promisify(exec);

module.exports = function testVersion(version, targets) {
    describe(`typescript:${version}`, function () {
        this.timeout(60000); // 60 seconds
        this.retries(1);
        for (const target of targets) {
            it(`target:${target}`, async function () {
                await execp(`npx -p typescript@${version} tsc -p tsconfig-test.json --target ${target}`);
            });
        }
    });
};
