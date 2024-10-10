const { spawn } = require('child_process');
const { DEFAULT_BROWSER, getFlag, getBrowser, logs, isBrowserInstalled } = require('./utils');

async function validate() {
    const inputs = getFlag(['-e', '--env']).split(',');

    for (const input of inputs) {
        let /** @type {import('./types').IBrowser} */ browser, /** @type {Error} */ err;
        [browser, err] = getBrowser(input);
        if (err) {
            logs.browserNotFoundWarn(err);
            [browser] = getBrowser(DEFAULT_BROWSER);
        }

        err = await isBrowserInstalled(browser);
        if (err) {
            logs.browserNotFoundError(browser);
            process.exit(1);
        }

        logs.browserInstalledLog(browser);
    }
}

async function prepare() {
    // TODO: Start browser-echo-bot
    // check installed
    // check build
    // then start
    // spawn('yarn start', [script, 'detached'], {
    //     stdio: 'ignore',
    //     detached: true,
    //     cwd: `${process.cwd()}/browser-echo-bot`,
    //   }).unref();
    // const exe = cp.spawn(driver.path, [`--port=${driver.port}`], {
    //     encoding: 'utf-8',
    //     shell: false,
    //     detached: true,
    //     windowsHide: true,
    // });
    // const isDriverRunning = await new Promise((res) => exe.stdout.on('data', () => res(true)));
    // const browserExists = isDriverRunning && (await driver.browser.exists(driver));
    // process.kill(exe.pid, 'SIGKILL');
    // process.exit(1);
}

module.exports = { validate, prepare };
