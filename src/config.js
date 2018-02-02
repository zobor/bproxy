let path = require('path')
let config = {
  PORT: 8888,
  CONFIG_PATH: path.resolve(process.cwd(), 'bproxy.conf.js')
}

module.exports = config