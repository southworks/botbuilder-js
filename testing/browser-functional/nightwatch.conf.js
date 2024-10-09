// Refer to the online docs for more details:
// https://nightwatchjs.org/gettingstarted/configuration/
//

//  _   _  _         _      _                     _          _
// | \ | |(_)       | |    | |                   | |        | |
// |  \| | _   __ _ | |__  | |_ __      __  __ _ | |_   ___ | |__
// | . ` || | / _` || '_ \ | __|\ \ /\ / / / _` || __| / __|| '_ \
// | |\  || || (_| || | | || |_  \ V  V / | (_| || |_ | (__ | | | |
// \_| \_/|_| \__, ||_| |_| \__|  \_/\_/   \__,_| \__| \___||_| |_|
//             __/ |
//            |___/

const { Browser } = require('selenium-webdriver');
const dotenv = require('dotenv');
dotenv.config();

const { browserExists } = require('./nightwatch/requirements');

const config = {
    // An array of folders (excluding subfolders) where your tests are located;
    // if this is not specified, the test source must be passed as the second argument to the test runner.
    src_folders: ['nightwatch/tests'],

    // See https://nightwatchjs.org/guide/concepts/page-object-model.html
    page_objects_path: ['nightwatch/pages'],

    // See https://nightwatchjs.org/guide/extending-nightwatch/adding-custom-commands.html
    custom_commands_path: [],

    // See https://nightwatchjs.org/guide/extending-nightwatch/adding-custom-assertions.html
    custom_assertions_path: [],

    // See https://nightwatchjs.org/guide/extending-nightwatch/adding-plugins.html
    plugins: [],

    // See https://nightwatchjs.org/guide/concepts/test-globals.html
    // globals_path: './globals.js',
    globals: {
        async before() {
            // Start browser-echo-bot
            console.log('before');

            const eFlag = process.argv.indexOf('-e', 2);
            let browser = eFlag >= 0 ? process.argv[eFlag + 1] : undefined;
            browser ??= config.test_settings.default.desiredCapabilities.browserName;
            const exists = await browserExists(browser);
            if (!exists) {
                process.exit(1);
            }
            process.exit(1);
        },
    },

    webdriver: {},

    test_workers: {
        enabled: true,
    },

    test_settings: {
        default: {
            disable_error_log: false,
            launch_url: process.env.TestURI,

            screenshots: {
                enabled: false,
                path: 'screens',
                on_failure: true,
            },

            desiredCapabilities: {
                browserName: 'chrome',
            },

            webdriver: {
                start_process: true,
                server_path: '',
            },
        },

        firefox: {
            desiredCapabilities: {
                browserName: 'firefox',
                alwaysMatch: {
                    acceptInsecureCerts: true,
                    'moz:firefoxOptions': {
                        args: [
                            // '-headless',
                            // '-verbose'
                        ],
                    },
                },
            },
            webdriver: {
                start_process: true,
                server_path: '',
                cli_args: [
                    // very verbose geckodriver logs
                    // '-vv'
                ],
            },
        },

        chrome: {
            desiredCapabilities: {
                browserName: 'chrome',
                'goog:chromeOptions': {
                    // More info on Chromedriver: https://sites.google.com/a/chromium.org/chromedriver/
                    args: [
                        //'--no-sandbox',
                        //'--ignore-certificate-errors',
                        //'--allow-insecure-localhost',
                        //'--headless=new'
                    ],
                },
            },

            webdriver: {
                start_process: true,
                server_path: '',
                cli_args: [
                    // --verbose
                ],
            },
        },

        edge: {
            desiredCapabilities: {
                browserName: 'MicrosoftEdge',
                'ms:edgeOptions': {
                    // More info on EdgeDriver: https://docs.microsoft.com/en-us/microsoft-edge/webdriver-chromium/capabilities-edge-options
                    args: [
                        //'--headless=new'
                    ],
                },
            },

            webdriver: {
                start_process: true,
                server_path: '',
                cli_args: [
                    // --verbose
                ],
            },
        },
    },
};

module.exports = config;
