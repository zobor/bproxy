let program = require('commander')
let packageJson = require('../package.json')
let bproxy = require('./bproxy')


program.version(packageJson.version)
  .option('-c, --configFile [value]', 'specifies the profile path')
  .option('-p, --port [value]', 'specify the app port')
  .option('-v, --version [value]', packageJson.version)
  .parse(process.argv)

new bproxy(program)
module.exports = {}