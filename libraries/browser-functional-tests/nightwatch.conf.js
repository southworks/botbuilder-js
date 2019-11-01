const chromedriver = require('chromedriver');
const geckodriver = require('geckodriver');

module.exports = {
    src_folders: ['tests'],
    page_objects_path: 'tests/tests_pages',
    webdriver: {
        start_process: true,
        server_path: 'node_modules/.bin/chromedriver',
        port: 9515
    },

    test_workers: {
        enabled: false,
        workers: 'auto'
    },
    test_settings: {
        default: {
            webdriver: {
                start_process: true,
                server_path: chromedriver.path,
                port: 9515,
                cli_args: ['--port=9515']
            },
            desiredCapabilities: {
                browserName: 'chrome',
                javascriptEnabled: true,
                acceptSslCerts: true,
                chromeOptions: {
                    args: ['headless', 'disable-gpu']
                }
            }
        },
        chrome: {
            webdriver: {
                start_process: true,
                server_path: chromedriver.path,
                port: 9515,
                cli_args: ['--port=9515']
            },
            desiredCapabilities: {
                browserName: 'chrome',
                javascriptEnabled: true,
                acceptSslCerts: true,
                chromeOptions: {
                    args: ['headless', 'disable-gpu']
                }
            }
        },
        firefox: {
            webdriver: {
                start_process: true,
                server_path: geckodriver.path,
                cli_args: [
                    '--log', 'debug'
                ],
                port: 4444
            },
            desiredCapabilities: {
                browserName: 'firefox',
                acceptInsecureCerts: true
            }
        }
    }
};
