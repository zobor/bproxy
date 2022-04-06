import * as request from 'request';
import * as pkg from '../../package.json';
import Certificate from './certifica';
import settings from './config';
import LocalServer from './localServer';
import { setActiveNetworkProxyStatus } from './macos/proxy';
import { matcher } from './matcher';
import { log, runShellCode } from './utils/utils';

export default {
  async run(params: any): Promise<string> {
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
    const url = `https://z3.cnzz.com/stat.htm?id=1278865075&r=http%3A%2F%2Fregx.vip%2F&lg=zh-cn&ntime=none&cnzz_eid=117682865-1634900721-null&showp=1920x1080&p=http%3A%2F%2Fregx.vip%2Fbproxy%2F${pkg.version}&t=Bproxy&umuuid=17ca7ad415558d-06ccc278d12621-5a402f16-1fa400-17ca7ad415644b&h=1&rnd=${parseInt((+new Date / 1000).toString(), 10)}`;
    request.get(url);
  },

  // install and trust certificate
  install(): void{
    const ca = new Certificate();
    const installStatus = ca.install();
    if (installStatus && installStatus.caCertPath) {
      log.info(`证书创建成功: ${installStatus.caCertPath}`);
    } else {
      log.error('证书创建失败～');
      return;
    }
    if (process.platform === 'darwin') {
      const sh = `sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ${installStatus.caCertPath}`;
      log.warn('信任证书，你需要可能需要输入计算机密码授权');
      runShellCode(sh);
    } else {
      log.warn('自动安装证书目前只支持MacOS系统，其他系统请双击证书安装！');
      log.info('安装证书指引: https://github.com/zobor/bproxy/wiki/windows%E7%B3%BB%E7%BB%9F%E4%B8%8B%E5%AE%89%E8%A3%85%E8%AF%81%E4%B9%A6');
    }
  },

  // set system proxy
  proxy(proxy: string | boolean, port: number): void {
    // const sysProxyPort = port || settings.port;
    if (process.platform !== 'darwin') {
      log.warn('设置系统代理指令，不支持当前系统');
      return;
    }
    if (typeof proxy === 'boolean') {
      log.warn(`Usage:\n${pkg.name} --proxy [off|on]`);
    } else if (proxy === 'on') {
      setActiveNetworkProxyStatus('on');
    } else if (proxy === 'off') {
      setActiveNetworkProxyStatus('off');
    }
  },

  // start local proxy server
  start(params: any): void {
    const port = params.port || 0;
    LocalServer.start(port, params.config);
  },

  async test(params: any): Promise<boolean> {
    const [, , , url] = params.rawArgs;
    const configPath = params.config;
    const { config = {} as any } = await LocalServer.loadUserConfig(configPath, settings);
    const matchResult = matcher(config.rules, url);
    log.info(`匹配结果：${matchResult.matched}`);
    return false;
  }
}
