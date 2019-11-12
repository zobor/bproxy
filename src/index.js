const program = require('commander');
const packageJson = require('../package.json');
const _ = require('./common/util');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
if (process.argv.length === 2) {
  process.argv.push('-h');
}
program
  .version(packageJson.version)
  .option('-s ,--start', 'start bproxy')
  .option('-c, --config [value]', 'specifies the profile path')
  .option('-p, --port [value]', 'specify the app port')
  .option('-i, --install', 'install bproxy certificate')
  .option('-x, --proxy [value]', 'turn on/off system proxy')
  .parse(process.argv);

if (program.install) {
  const { spawn } = require('child_process');
  const ca = require('./common/ca');
  const rs = ca.init();
  _.info(`${_.color.green('bproxy certificate')}: ${_.color.underline(rs.caCertPath)}`);
  if (process.platform === 'darwin') {
    const shellCode = `sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ${rs.caCertPath}`;
    const spawnParams = shellCode.split(' ');
    const param1 = spawnParams.shift();
    spawn(param1, spawnParams);
  } else if (process.platform === 'win32') {
    const certPath = rs.caCertPath.replace(/[\w.]+$/, '');
    console.log('auto instal certificate only support macOS');
    console.log('double click bproxy.ca.crt to install');
    spawn('explorer', [certPath]);
  }
} else if (program.start || program.port || program.config) {
  const Bproxy = require('./bproxy');
  if (typeof program.port === 'boolean' || !/^\d+$/.test(program.port)) {
    program.port = null;
  }
  const bp = new Bproxy(program);
  if (!bp) {
    console.error('bproxy init error');
  }
} else if (program.proxy) {
  const { spawn } = require('child_process');
  if (typeof program.proxy === 'boolean') {
    console.log('Usage: bproxy --proxy on/off');
  } else if (program.proxy === 'on') {
    spawn('networksetup', ['-setautoproxystate', 'Wi-Fi', 'off']);
    spawn('networksetup', ['-setwebproxy', 'Wi-Fi', '127.0.0.1', '8888']);
    spawn('networksetup', ['-setsecurewebproxy', 'Wi-Fi', '127.0.0.1', '8888']);
  } else if (program.proxy === 'off') {
    spawn('networksetup', ['-setautoproxystate', 'Wi-Fi', 'off']);
    spawn('networksetup', ['-setwebproxystate', 'Wi-Fi', 'off']);
    spawn('networksetup', ['-setsecurewebproxystate', 'Wi-Fi', 'off']);
  }
}


module.exports = {};
