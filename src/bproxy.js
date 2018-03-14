const fs = require('fs-extra')
const proxyConfigTemplate = require('./config-template')
const http = require('http')
const server = new http.Server()
const colors = require('colors')
const httpProxy = require('./http-proxy')
const httpsMiddleware = require('./https-middleware')
const util = require('./common/util')
const message = require('./msg')
const configSet = require('./config-parse')

class bproxy {
  constructor(userConfig) {
    // this.configFile = userConfig.configFile || configSet.CONFIG_PATH
    // this.port = userConfig.port || configSet.PORT

    // if (!fs.existsSync(this.configFile)) {
    //   fs.writeFileSync(this.configFile, proxyConfigTemplate)
    // }
    this.userConfig = userConfig
    this.init()
    // msg.emit('config-file-found', this.configFile)
  }

  init(){
    // this.startServer()
    this.onConfigReady()
  }

  onConfigReady(){
    if (!this.userConfig.configFile) {
      message.emit('config-file-found', null)
    }else{
      if (!fs.existsSync(this.userConfig.configFile)) {
        fs.writeFileSync(this.userConfig.configFile, proxyConfigTemplate)
      }
      message.emit('config-file-found', this.userConfig.configFile)
    }
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
    util.terminalLog([
      '[Info] '.green,
      'bproxy Service is running at ',
      `http://0.0.0.0:${this.port}/`.underline,
      '. Press Ctrl+C to stop.'
    ])
    server.listen(this.port, () => {
      server.on('error', (e) => {
        console.log(colors.red(e))
      })

      server.on('request', (req, res) => {
        httpProxy(req, res, this.config)
      })

      // tunneling for https
      server.on('connect', (req, socket, head) => {
        if (!req.__sid__) req.__sid__ = util.newGuid()
        httpsMiddleware.proxy(req, socket, head, this.config)
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