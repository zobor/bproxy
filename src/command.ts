import settings from './settings';
import { spawn } from 'child_process';
import * as pkg from '../package.json';
import Certificate from './certifica';

export default {
  // command entry
  run(params: any) {
    if (params.install) {
      this.install();
    } else if (params.proxy) {
      this.proxy(params.proxy, params.port);
    }
  },

  // install and trust certificate
  install() {
    const ca = new Certificate();
    const installStatus = ca.install();
    if (installStatus && !installStatus.create) {
      console.log('证书已存在，不需要再创建了!');
      return;
    }
    if (installStatus && installStatus.caCertPath) {
      console.log(`证书创建成功: ${installStatus.caCertPath}`);
    } else {
      console.log('证书创建失败～');
      return;
    }
    if (process.platform === 'darwin') {
      const sh = `sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ${installStatus.caCertPath}`;
      const param = sh.split(' ');
      const cmd = param.shift();
      spawn(cmd || 'sudo', param);
    } else {
      console.log('auto instal certificate only support macOS');
      console.log('double click bproxy.ca.crt to install');
    }
  },
  
  // set system proxy
  proxy(proxy: string | boolean, port: number) {
    const sysProxyPort = port || settings.port;
    if (typeof proxy === 'boolean') {
      console.log(`Usage:\n${pkg.name} --proxy [off|on]`);
    } else if (proxy === 'on') {
      spawn('networksetup', ['-setautoproxystate', 'Wi-Fi', 'off']);
      spawn('networksetup', ['-setwebproxy', 'Wi-Fi', '127.0.0.1', `${sysProxyPort}`]);
      spawn('networksetup', ['-setsecurewebproxy', 'Wi-Fi', '127.0.0.1', `${sysProxyPort}`]);
    } else if (proxy === 'off') {
      spawn('networksetup', ['-setautoproxystate', 'Wi-Fi', 'off']);
      spawn('networksetup', ['-setwebproxystate', 'Wi-Fi', 'off']);
      spawn('networksetup', ['-setsecurewebproxystate', 'Wi-Fi', 'off']);
    }
  }
}