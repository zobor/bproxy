const program = require('commander')
const packageJson = require('../package.json')
const util = require('./common/util')

if (process.argv.length==2) {
  process.argv.push('-h')
}
program
  .version(packageJson.version)
  .option('-s ,--start', 'start bproxy')
  .option('-c, --config [value]', 'specifies the profile path')
  .option('-p, --port [value]', 'specify the app port')
  .option('-i, --install', 'install bproxy certificate')
  .parse(process.argv)

if (program.install) {
  const spawn = require('child_process').spawn
  const ca = require('./common/ca')
  const rs = ca.init()
  util.terminalLog([
    '[bproxy certificate] '.magenta,
    `${rs.caCertPath}`.underline
  ])
  if ('darwin'==process.platform) {
    const shellCode = `sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ${rs.caCertPath}`
    let spawnParams = shellCode.split(' ')
    let param1 = spawnParams.shift()
    spawn(param1, spawnParams)
  }else if('win32'==process.platform){
    let certPath = rs.caCertPath.replace(/[\w\.]+$/,'')
    console.log('auto instal certificate only support macOS')
    console.log('double click bproxy.ca.crt to install')
    spawn('explorer', [certPath])
  }
}

else if(program.start || program.port || program.config){
  const bproxy = require('./bproxy')
  if(typeof program.port==='boolean' || !/^\d+$/.test(program.port)){
    program.port = null
  }
  new bproxy(program)
}


module.exports = {}