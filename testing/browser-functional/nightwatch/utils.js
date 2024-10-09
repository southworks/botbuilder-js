const { Capabilities } = require('nightwatch');
const { Builder, Browser } = require('selenium-webdriver');

const DEFAULT_BROWSER = Browser.CHROME;

/**
 * @param {string} browser
 * @returns {Promise<Error>}
 */
async function browserExists(browser) {
    if (!browser) {
        return false;
    }

    try {
        // const caps = Capabilities.chrome();
        // caps.set('goog:chromeOptions', {
        //     args: ['--headless'],
        // });
        const driver = await new Builder()
            .forBrowser(browser)
            // .withCapabilities(caps)
            .build();
        await driver.quit();
    } catch (e) {
        return e;
    }
}

/**
 * @param {string} id
 * @returns {[{name: string, url: string}, Error]}
 */
function getBrowser(id) {
    const browser = id ?? '';
    const browsers = {
        chrome: {
            id: browser,
            name: 'Chrome',
            url: 'https://www.google.com/chrome',
        },
        firefox: {
            id: browser,
            name: 'Firefox',
            url: 'https://www.mozilla.org/firefox/new',
        },
        edge: {
            id: browser,
            name: 'Edge',
            url: 'https://www.microsoft.com/edge',
        },
    };

    const result = browsers[browser.trim().toLowerCase()];
    if (!result) {
        return ['', new Error(`Browser '${browser}' not found`)];
    }

    return [result, null];
}

/**
 * @param {string[]} flags
 * @returns {string}
 */
function getFlag(flags) {
    return process.argv.find((_, i, arr) => flags.includes(arr[i - 1]?.trim()));
}

const logs = {
    browserInstalledLog(browser) {
        console.log(`  ✅ Browser '${browser.name}' detected`);
    },
    browserNotFoundWarn(err) {
        console.warn(`  ⚠️  ${err.message} - Using default browser: ${DEFAULT_BROWSER}`);
    },
    browserNotFoundError(browser) {
        console.error(
            `  ❌ Browser '${browser.name}' binary not found - Please visit the following URL to download and install the required browser: ${browser.url}`
        );
    },
};

module.exports = { DEFAULT_BROWSER, browserExists, getBrowser, getFlag, logs };
