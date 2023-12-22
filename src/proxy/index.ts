import chalk from 'chalk';
import * as dns from 'dns';
import * as fs from 'fs';
import { isEmpty } from 'lodash';
import { delay } from '../utils/utils';
import { showError, showUpgrade } from './api';
import { appConfigFilePath, appDataPath, configModuleTemplate } from './config';
import dataset, { isApp, updateDataSet } from './dataset';
import { updateConfigPathAndWatch } from './getUserConfig';
import httpsMiddleware from './httpsMiddleware';
import logger from './logger';
import { afterLocalServerStartSuccess, startLocalServer } from './proxyServer';
import { ioInit } from './socket/socket';
import { configSystemProxy, getNetWorkProxyStatus, getNetworkProxyInfo, setSystemProxyOff } from './system/configProxy';
import { checkUpgrade } from './utils/request';
import storage, { STORAGE_KEYS, storageReady } from './storage';

(dns as any).setDefaultResultOrder && (dns as any).setDefaultResultOrder('ipv4first');

export default class LocalServer {
  static closeSystemProxyAfterShutdown = false;
  static proxySettingsBeforeStart = {
    deviceName: '',
    proxyStatus: 'off',
    http: {
      status: 'off',
      server: '127.0.0.1',
      port: 0,
    },
    https: {
      status: 'off',
      server: '127.0.0.1',
      port: 0,
    },
  };
  // 启动前的检查
  static async beforeStart() {
    logger.info('当前运行环境', dataset.platform);
    // 检查bproxy app默认的配置，不存在就创建一个
    await this.checkDefaultConfigAndCreateOne();

    // 检查bash环境的配置
    this.checkPWDConfig();

    // 检查 app 环境的配置
    this.checkAppLastTimeConfig();

    // 检查是否最新版本
    this.checkUpgrade();

    // 检查启动前的系统代理配置
    await this.checkProxyStatus();

    // storage ready
    // await storageReady();
  }

  // 启动前先检查一遍系统代理情况，以便关闭bpoxy之后恢复系统代理的配置
  static async checkProxyStatus() {
    const currentNetworkProxyStatus = await getNetWorkProxyStatus();
    if (isEmpty(currentNetworkProxyStatus)) {
      return;
    }
    this.proxySettingsBeforeStart.deviceName = Object.keys(currentNetworkProxyStatus)[0];
    this.proxySettingsBeforeStart.proxyStatus = currentNetworkProxyStatus[this.proxySettingsBeforeStart.deviceName]
      ? 'on'
      : 'off';

    if (this.proxySettingsBeforeStart.proxyStatus === 'off') {
      return;
    }

    const proxyDetail = await getNetworkProxyInfo();
    const currentDetail = proxyDetail[this.proxySettingsBeforeStart.deviceName];
    if (isEmpty(currentDetail) || isEmpty(currentDetail.http) || isEmpty(currentDetail.https)) {
      this.proxySettingsBeforeStart.proxyStatus = 'off';
      return;
    }

    if (+currentDetail.http.Port === 8888 || +currentDetail.https.Port === 8888) {
      this.proxySettingsBeforeStart.proxyStatus = 'off';
      return;
    }

    this.proxySettingsBeforeStart.http.status = currentDetail.http.Enabled === 'Yes' ? 'on' : 'off';
    this.proxySettingsBeforeStart.http.server = currentDetail.http.Server;
    this.proxySettingsBeforeStart.http.port = currentDetail.http.Port;

    this.proxySettingsBeforeStart.https.status = currentDetail.https.Enabled === 'Yes' ? 'on' : 'off';
    this.proxySettingsBeforeStart.https.server = currentDetail.https.Server;
    this.proxySettingsBeforeStart.https.port = currentDetail.https.Port;
  }

  // 检查版本更新
  static async checkUpgrade() {
    checkUpgrade().then((data: any) => {
      showUpgrade(data);
    });
  }

  // 检查配置默认配置文件
  static async checkDefaultConfigAndCreateOne() {
    if (!fs.existsSync(appConfigFilePath)) {
      fs.writeFileSync(appConfigFilePath, configModuleTemplate);
    }
    return true;
  }

  // 检查当面目录下的bproxy配置
  static async checkPWDConfig() {
    if (isApp()) {
      return;
    }
    // bash 环境使用当面目录承载配置
    updateConfigPathAndWatch({
      configPath: process.env.BP_CONFIG || process.cwd(),
    });
  }

  // 检查app上一次使用的配置文件目录
  static async checkAppLastTimeConfig() {
    if (dataset.platform !== 'app') {
      return;
    }
    const { prevConfigPath } = dataset;

    updateConfigPathAndWatch({
      configPath: prevConfigPath || appDataPath,
    });
  }

  // 开启系统代理
  static async enableBproxySystemProxy(port: number) {
    return configSystemProxy({ host: '127.0.0.1' });
  }

  // 关闭系统代理
  static async disableBproxySystemProxy() {
    if (this.proxySettingsBeforeStart.proxyStatus === 'off') {
      return setSystemProxyOff();
    } else {
      const server = this.proxySettingsBeforeStart.http.server || this.proxySettingsBeforeStart.https.server;
      const port = this.proxySettingsBeforeStart.http.port || this.proxySettingsBeforeStart.https.port;
      console.log(`系统代理已恢复至：Server: ${chalk.magenta(server)},Port: ${chalk.magenta(port)}`);
      if (server && port) {
        return configSystemProxy({ host: server, port: `${port}` });
      }
      return setSystemProxyOff();
    }
  }

  // 捕获全局错误
  static async errorCatch() {
    process.on('uncaughtException', async (err) => {
      // 端口被占用，停止启动
      if (err?.message?.includes('address already in use')) {
        logger.error(`ERROR: 端口被占用，请检查bproxy是否已启动。`);
        if (dataset.platform === 'app') {
          await showError('端口被占用，请检查bproxy是否已启动');
        }
        process.exit();
      } else {
        logger.error(`uncaughtException: ${JSON.stringify(err.stack)}`);
      }
    });

    // process.stdin.resume();
    process.on('exit', this.afterCloseNodeJsProcess);
    process.on('SIGINT', this.afterCloseNodeJsProcess);
  }

  // 监控关闭node进程
  static async afterCloseNodeJsProcess() {
    logger.info('close bproxy');
    if (this.closeSystemProxyAfterShutdown) {
      await LocalServer.disableBproxySystemProxy();
    }
    await delay(100);
    process.exit(0);
  }

  // 当bproxy启动完成
  static afterStart() {
    updateDataSet('ready', true);
  }

  // 启动bproxy
  static async start(): Promise<void> {
    await this.beforeStart();

    const { config } = dataset;
    if (isEmpty(config)) {
      logger.error('启动失败，找不到配置');
      await delay(1000);
      process.exit(0);
    }

    if (storage?.getItem && (await storage.getItem(STORAGE_KEYS.SYSTEM_PROXY)) === '1') {
      // 启动立即开启系统代理
      logger.info(`${chalk.gray('✔ 检查系统代理：已开启')}`);
      this.enableBproxySystemProxy(config.port || 8888);
      this.closeSystemProxyAfterShutdown = true;
    } else {
      logger.info(`${chalk.gray('✔ 检查系统代理：未开启')}`);
      this.closeSystemProxyAfterShutdown = false;
    }

    const certConfig = httpsMiddleware.beforeStart();
    const server = startLocalServer(certConfig, config);
    // websocket server
    ioInit(server);
    afterLocalServerStartSuccess();

    this.errorCatch();
    this.afterStart();
  }
}
