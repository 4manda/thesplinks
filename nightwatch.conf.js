require('babel-core/register');

module.exports = {
  src_folders: ['test/e2e/tests'],
  output_folder: './test/e2e/output',
  page_objects_path: ['test/e2e/pages'],
  globals_path: 'test/e2e/globals',
  selenium: {
    start_process: true,
    server_path: './test/e2e/drivers/selenium-server-standalone-3.4.0.jar',
    log_path: './test/e2e/selenium-logs',
    host: '127.0.0.1',
    port: 4444,
    cli_args: {
      'webdriver.chrome.driver': './test/e2e/drivers/chromedriver',
      'webdriver.gecko.driver': './test/e2e/drivers/geckodriver',
    },
  },

  test_settings: {
    default: {
      launch_url: 'http://localhost:8090',
      selenium_port: 4444,
      selenium_host: 'localhost',
      silent: true,
      persist_globals: true,
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true,
      },
    },
    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        firefoxOptions: {
          log: { level: 'trace' },
        },
        marionette: true,
      },
    },
  },
};
