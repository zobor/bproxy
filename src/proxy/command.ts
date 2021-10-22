import { CommanderStatic } from 'commander';
import * as request from 'request';
import settings from './settings';
import { spawn } from 'child_process';
import * as pkg from '../../package.json';
import Certificate from './certifica';
import { cm } from './common';
import lang from './i18n';
import LocalServer from './localServer';
import { rulesPattern } from './rule';

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
    } else if (params.test) {
      this.test(params);
    }
    return verLatest;
  },

  report(): void {
    request.get(`https://z3.cnzz.com/stat.htm?id=1278865075&r=http%3A%2F%2F192.168.80.17%3A8080%2F&lg=zh-cn&ntime=none&cnzz_eid=117682865-1634900721-null&showp=1920x1080&p=http%3A%2F%2Flocalhost%3A8080%2Ffed.html&t=Bproxy&umuuid=17ca7ad415558d-06ccc278d12621-5a402f16-1fa400-17ca7ad415644b&h=1&rnd=2074161089random=${+new Date}`);
  },

  // install and trust certificate
  install(): void{
    const ca = new Certificate();
    const installStatus = ca.install();
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
  proxy(proxy: string | boolean, port: number): void {
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

  test(params: CommanderStatic): boolean {
    const [, , , url] = params.rawArgs;
    const configPath = params.config;
    const { config = {} as any } = LocalServer.loadUserConfig(configPath, settings);
    const matchResult = rulesPattern(config.rules, url);
    console.log('匹配结果：', matchResult.matched);
    return false;
  }
}
