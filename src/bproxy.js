const fs = require('fs-extra')
const proxyConfigTemplate = require('./config-template')
const http = require('http')
const server = new http.Server()
const httpProxy = require('./http-proxy')
const httpsMiddleware = require('./https-middleware')
const _ = require('./common/util')
const message = require('./msg')
const configSet = require('./config-parse')
const baseConfig = require('./config')

class bproxy {
  constructor(userConfig) {
    this.userConfig = userConfig
    this.isProxyServerStart = false
    this.init()
  }

  init(){
    this.onConfigReady()
  }

  onConfigReady(){
    this.userConfig.configFile = this.userConfig.config || baseConfig.CONFIG_PATH
    const logConfigPath = _.color.green.bold.underline(this.userConfig.configFile)
    _.info(`bproxy ${_.color.magentaBright.bold.underline('Config filepath')}: ${logConfigPath}`)
    if (!fs.existsSync(this.userConfig.configFile)) {
      fs.writeFileSync(this.userConfig.configFile, proxyConfigTemplate)
    }
    message.emit('config-file-found', this.userConfig.configFile)
    if (!configSet.setting) {
      message.on('config:ready',cf=>{
        this.config = Object.assign({},cf,this.userConfig)
        this.configFile = this.userConfig.configFile || this.config.CONFIG_PATH
        this.port = this.userConfig.port || this.config.PORT
        this.startServer()
      })
      return ;
    }
    this.startServer()
  }

  startServer() {
    if (this.isProxyServerStart) return;
    this.isProxyServerStart = true;
    const serverURL = _.color.green.bold.underline(`http://127.0.0.1:${this.port}/`);
    const sName = _.color.bold.magentaBright.underline('Proxy Service');
    _.info(`bproxy ${sName} is running at ${serverURL}. Press Ctrl+C to stop.`);

    server.listen(this.port, () => {
      server.on('request', (req, res) => {
        httpProxy(req, res, this.config)
      })

      // tunneling for https
      server.on('connect', (req, socket, head) => {
        if (!req.__sid__) req.__sid__ = _.newGuid()
        httpsMiddleware.proxy(req, socket, head, this.config)
      })

      server.on('upgrade', (req, socket, head) => {
        console.log(`[server upgrade]: `, req);
          // upgradeHandler(req, socket, head, ssl);
      });

      server.on('error', (err) => {
        console.log('[server error]', err);
      })
    })
    server.on('error', (err) => {
      console.log('[server error2]', err);
    })
  }
}

process.on('uncaughtException', (err)=>{
  _.error(`uncaughtException: ${JSON.stringify(err.stack)}`);
  console.log(err);
})

module.exports = bproxy