let baseConfig = require('./config')
let fs = require('fs-extra')
class bproxy {
  constructor(config){
    this.configFile = config.configFile || baseConfig.CONFIG_PATH
    this.port = config.port || baseConfig.PORT

    console.log(fs.existsSync('/etc/file'))

  }
}
module.exports = bproxy