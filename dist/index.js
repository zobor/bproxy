const program = require('commander');

const packageJson = require('../package.json');

const _ = require('./common/util');

if (process.argv.length == 2) {
  process.argv.push('-h');
}

program.version(packageJson.version).option('-s ,--start', 'start bproxy').option('-c, --config [value]', 'specifies the profile path').option('-p, --port [value]', 'specify the app port').option('-i, --install', 'install bproxy certificate').option('-x, --proxy [value]', 'turn on/off system proxy').parse(process.argv);

if (program.install) {
  const spawn = require('child_process').spawn;

  const ca = require('./common/ca');

  const rs = ca.init();

  _.info(`${_.color.green('bproxy certificate')}: ${_.color.underline(rs.caCertPath)}`);

  if ('darwin' == process.platform) {
    const shellCode = `sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ${rs.caCertPath}`;
    let spawnParams = shellCode.split(' ');
    let param1 = spawnParams.shift();
    spawn(param1, spawnParams);
  } else if ('win32' == process.platform) {
    let certPath = rs.caCertPath.replace(/[\w\.]+$/, '');
    console.log('auto instal certificate only support macOS');
    console.log('double click bproxy.ca.crt to install');
    spawn('explorer', [certPath]);
  }
} else if (program.start || program.port || program.config) {
  const bproxy = require('./bproxy');

  if (typeof program.port === 'boolean' || !/^\d+$/.test(program.port)) {
    program.port = null;
  }

  new bproxy(program);
} else if (program.proxy) {
  const spawn = require('child_process').spawn;

  if (typeof program.proxy === Boolean) {
    console.log('Usage: bproxy --proxy on/off');
  } else if (program.proxy === 'on') {
    spawn(`networksetup`, ['-setautoproxystate', 'Wi-Fi', 'off']);
    spawn(`networksetup`, ['-setwebproxy', 'Wi-Fi', '127.0.0.1', '8888']);
    spawn(`networksetup`, ['-setsecurewebproxy', 'Wi-Fi', '127.0.0.1', '8888']);
  } else if (program.proxy === 'off') {
    spawn(`networksetup`, ['-setautoproxystate', 'Wi-Fi', 'off']);
    spawn(`networksetup`, ['-setwebproxystate', 'Wi-Fi', 'off']);
    spawn(`networksetup`, ['-setsecurewebproxystate', 'Wi-Fi', 'off']);
  }
}

module.exports = {};