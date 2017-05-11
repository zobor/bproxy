let baseConfig = require('./config');
let fs = require('fs-extra');
let proxyConfigTemplate = require('./config-template');
let http = require('http');
let server = new http.Server();
let colors = require('colors');
let httpMiddleware = require('./http-middleware');
console.log(httpMiddleware);
class bproxy {
  constructor(config) {
    this.configFile = config.configFile || baseConfig.CONFIG_PATH;
    this.port = config.port || baseConfig.PORT;

    if (!fs.existsSync(this.configFile)) {
      fs.writeFileSync(this.configFile, proxyConfigTemplate);
    }
    this.init();
  }

  init() {
    this.startServer();
  }

  startServer() {
    terminalLog([`[app start up]`.magenta, 'http://127.0.0.1'.blue.underline + `:${this.port}`.blue.underline]);
    server.listen(this.port, () => {
      server.on('error', e => {
        console.error(colors.red(e));
      });

      server.on('request', (req, res) => {
        // if (!req.__sid__) req.__sid__ = util.GUID()
        httpMiddleware.proxy(req).then(() => {
          res.end(+new Date());
        }).catch(error => {
          res.end(error);
        });
        // requestHandler(req, res)
      });

      // tunneling for https
      server.on('connect', (req, socket, head) => {
        // if (!req.__sid__) req.__sid__ = util.GUID()
        // connectHandler(req, socket, head)
      });

      server.on('upgrade', (req, socket, head) => {
        console.log(res.url);
        // upgradeHandler(req, socket, head, ssl);
      });
    });
  }
}

function terminalLog(arr) {
  console.log(arr.join(''));
}

module.exports = bproxy;