const baseConfig = require('./config')
const fs = require('fs-extra')
const proxyConfigTemplate = require('./config-template')
const http = require('http')
const server = new http.Server()
const colors = require('colors')
const httpProxy = require('./http-proxy')
const httpsMiddleware = require('./https-middleware')
const util = require('./common/util')
const msg = require('./msg')

class bproxy {
  constructor(config) {
    this.configFile = config.configFile || baseConfig.CONFIG_PATH
    this.port = config.port || baseConfig.PORT

    if (!fs.existsSync(this.configFile)) {
      fs.writeFileSync(this.configFile, proxyConfigTemplate)
    }
    this.init()
    msg.emit('config-file-found', this.configFile)
  }

  init(){
    this.startServer()
  }

  startServer() {
    util.terminalLog([
      `[app start up]`.magenta,
      'http://127.0.0.1'.blue.underline + `:${this.port}`.blue.underline
    ])
    server.listen(this.port, () => {
      server.on('error', (e) => {
        console.error(colors.red(e))
      })

      server.on('request', (req, res) => {
        httpProxy(req,res)
      })

      // tunneling for https
      server.on('connect', (req, socket, head) => {
        if (!req.__sid__) req.__sid__ = util.newGuid()
        httpsMiddleware.proxy(req, socket, head)
      })

      server.on('upgrade', (req, socket, head) => {
          // upgradeHandler(req, socket, head, ssl);
      });
    })
  }
}

process.on('uncaughtException', (err)=>{
  console.log(err.stack)
})

module.exports = bproxy