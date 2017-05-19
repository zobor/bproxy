let baseConfig = require('./config');
const fs = require('fs-extra');
const proxyConfigTemplate = require('./config-template');
const http = require('http');
const server = new http.Server();
const colors = require('colors');
const httpMiddleware = require('./http-middleware');
const httpsMiddleware = require('./https-middleware');
const util = require('./common/util');

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
        if (!req.__sid__) req.__sid__ = util.newGuid();
        httpMiddleware.proxy(req).catch(error => {
          res.end(error);
        }).then(httpRequest => {
          httpRequest.pipe(res);
        });
      });

      // tunneling for https
      server.on('connect', (req, socket, head) => {
        if (!req.__sid__) req.__sid__ = util.newGuid();
        httpsMiddleware.proxy(req, socket, head);
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

// process.on('uncaughtException', (err)=>{
//   console.log(err.stack)
// })

module.exports = bproxy;