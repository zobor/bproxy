/*
 * @Author: zobor
 * @Date: 2020-06-28 16:25:11
 * @LastEditTime: 2020-07-07 10:46:00
 * @LastEditors: zobor
 * @FilePath: \bproxy\src\command.ts
 */
import { CommanderStatic } from 'commander';
import * as request from 'request';
import settings from './settings';
import { spawn } from 'child_process';
import * as pkg from '../package.json';
import Certificate from './certifica';
import { cm } from './common';
import lang from './i18n';
import LocalServer from './localServer';

export default {
  async run(params: CommanderStatic): Promise<string> {
    this.report();
    let verLatest;
    if (params.install) {
      this.install();
    } else if (params.proxy) {
      this.proxy(params.proxy, params.port);
    } else if (params.start) {
      this.start(params);
    }
    return verLatest;
  },

  report() {
    request.get(`http://pingtcss.qq.com/pingd?dm=zobor.me&pvi=67181574951438293&si=s106251574951438294&url=/&arg=&ty=0&rdm=&rurl=&rarg=&adt=&r2=500704279&scr=1440x900&scl=24-bit&lg=zh-cn&tz=-8&ext=version=2.0.14&random=${+new Date}`);
  },

  // install and trust certificate
  install() {
    const ca = new Certificate();
    const installStatus = ca.install();
    if (installStatus && !installStatus.create) {
      cm.warn(lang.CERT_EXIST);
      return;
    }
    if (installStatus && installStatus.caCertPath) {
      cm.info(`${lang.CREATE_CERT_SUC}: ${installStatus.caCertPath}`);
    } else {
      cm.error(lang.CREATE_CERT_FAIL);
      return;
    }
    if (process.platform === 'darwin') {
      const sh = `sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ${installStatus.caCertPath}`;
      const param = sh.split(' ');
      const cmd = param.shift();
      cm.warn(lang.TRUST_CERT_PWD);
      spawn(cmd || 'sudo', param);
      cm.info(lang.CERT_INSTALL_FAIL);
    } else {
      cm.warn(lang.INSTALL_TIPS);
    }
  },

  // set system proxy
  proxy(proxy: string | boolean, port: number) {
    const sysProxyPort = port || settings.port;
    if (typeof proxy === 'boolean') {
      cm.warn(`Usage:\n${pkg.name} --proxy [off|on]`);
    } else if (proxy === 'on') {
      spawn('networksetup', ['-setautoproxystate', 'Wi-Fi', 'off']);
      spawn('networksetup', ['-setwebproxy', 'Wi-Fi', '127.0.0.1', `${sysProxyPort}`]);
      spawn('networksetup', ['-setsecurewebproxy', 'Wi-Fi', '127.0.0.1', `${sysProxyPort}`]);
    } else if (proxy === 'off') {
      spawn('networksetup', ['-setautoproxystate', 'Wi-Fi', 'off']);
      spawn('networksetup', ['-setwebproxystate', 'Wi-Fi', 'off']);
      spawn('networksetup', ['-setsecurewebproxystate', 'Wi-Fi', 'off']);
    }
  },

  // start local proxy server
  start(params: CommanderStatic): void {
    const port = params.port || 0;
    const configPath = params.config;
    LocalServer.start(port, configPath);
  },
}
