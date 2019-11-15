const chromedriver = require('chromedriver');
const seleniumServer = require('selenium-server');

module.exports = {
    src_folders: ['tests'],
    page_objects_path: 'tests/tests_pages',
    test_settings: {
        chrome: {
            webdriver: {
                start_process: true,
                server_path: chromedriver.path,
                port: 9515,
                cli_args: ['--port=9515', '--verbose']
            },
            desiredCapabilities: {
                browserName: 'chrome',
                javascriptEnabled: true,
                acceptSslCerts: true,
                loggingPrefs: {
                    'driver': 'INFO',
                    'server': 'INFO',
                    'browser': 'INFO'
                }
            }
        },
        edge: {
            selenium: {
                start_process: true,
                server_path: seleniumServer.path,
                host: '127.0.0.1',
                port: 4444,
                cli_args: {
                    'webdriver.edge.driver': 'tests/bin/MicrosoftWebDriver-EdgeHTML.exe'
                }
            },
            desiredCapabilities: {
                browserName: "MicrosoftEdge",
                acceptSslCerts: true
            }
        }
    }
};
