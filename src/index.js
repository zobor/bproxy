const program = require('commander')
const packageJson = require('../package.json')
const bproxy = require('./bproxy')
const util = require('./common/util')


program.version(packageJson.version)
  .option('-c, --configFile [value]', 'specifies the profile path')
  .option('-p, --port [value]', 'specify the app port')
  .option('-v, --version [value]', packageJson.version)
  .option('-i, --install', 'install bproxy certificate')
  .parse(process.argv)

if (program.install) {
  const spawn = require('child_process').spawn
  const ca = require('./common/ca')
  const rs = ca.init()
  util.terminalLog([
    `[bproxy certificate]`.magenta,
    `${rs.caCertPath}`.blue.underline
  ])
  if ('darwin'==process.platform) {
    const shellCode = `sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ${rs.caCertPath}`
    let spawnParams = shellCode.split(' ')
    let param1 = spawnParams.shift()
    spawn(param1, spawnParams)
  }else if('win32'==process.platform){
    let certPath = rs.caCertPath.replace(/[\w\.]+$/,'')
    console.log('auto instal certificate only support macOS')
    console.log('dblclick bproxy.ca.crt to install')
    spawn('explorer', [certPath])
  }
}else{
  new bproxy(program)
}


module.exports = {}