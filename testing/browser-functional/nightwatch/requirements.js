const { Builder, Browser } = require('selenium-webdriver');

/**
 * @param {Browser} browser
 */
async function browserExists(browser) {
    if (!browser) {
        return false;
    }

    let ok = true;
    try {
        const driver = await new Builder().forBrowser(browser).build();
        await driver.quit();
    } catch (e) {
        // console.log(e);
        // Browser not installed message error. and tinclude the actual error just in case.
        ok = false;
    }

    return ok;
}

module.exports = { browserExists };
