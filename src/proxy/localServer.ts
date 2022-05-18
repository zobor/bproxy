import chalk from 'chalk';
import * as fs from 'fs';
import * as http from 'http';
import * as _ from 'lodash';
import * as path from 'path';
import request from 'request';
import * as url from 'url';
import * as pkg from '../../package.json';
import { ProxyConfig } from '../types/proxy';
import JSONFormat from '../web/libs/jsonFormat';
import settings from './config';
import { httpMiddleware } from './httpMiddleware';
import httpsMiddleware from './httpsMiddleware';
import preload from './preload';
import { isLocal, requestJac } from './routers';
import { ioInit, onConfigFileChange, wsApi, wss } from './socket/socket';
import { userConfirm } from './utils/confirm';
import dataset, { updateDataSet } from './utils/dataset';
import { compareVersion, log, runShellCode, utils } from './utils/utils';


export default class LocalServer {
  static async start(port: number, configPath: string): Promise<void>{
    const { config = {} as any, configPath: confPath = "" } =
      await this.loadUserConfig(configPath, settings);
    if (_.isEmpty(config) || _.isEmpty(confPath)) {
      return;
    }
    let appConfig = config;
    if (port) {
      appConfig.port = port;
    }
    // 监听配置文件
    fs.watchFile(confPath, { interval: 1500 }, async() => {
      log.info(`配置已更新: ${chalk.yellow(confPath)}`);
      try {
        appConfig = await this.loadUserConfig(configPath, settings);
        onConfigFileChange();
      } catch(err){}
    });
    const server = new http.Server();
    const certConfig = httpsMiddleware.beforeStart();
    // websocket server
    ioInit(server);

    server.listen(appConfig.port, () => {
      // http
      server.on('request', (req, res) => {
        if (isLocal(req.url || '')) {
          if (req.url?.includes('/socket.io/')) {
            return;
          }
          requestJac(req, res, certConfig);
          return;
        }
        const $req: any = req;
        if (!$req.$requestId) {
          $req.$requestId = utils.guid();
        }
        httpMiddleware.proxy($req, res, dataset.config);
      });
      // https
      server.on('connect', (req, socket, head) => {
        // 重置URL到本地服务
        if (req.url === 'bproxy.io:80') {
          req.url = `localhost:${dataset.config.port}`;
        }
        const $req: any = req;
        if (!$req.$requestId) {
          $req.$requestId = utils.guid();
        }
        httpsMiddleware.proxy($req, socket, head, dataset.config);
      });
      // ws
      server.on('upgrade', (req, socket, head) => {
        const urlObj: any = url.parse(req.url, true);
        const pathname = urlObj.pathname.split('/');

        const type = pathname[1];
        const id = pathname[2];

        if (type === 'target' || type === 'client') {
          wss.handleUpgrade(req, socket, head, ws => {
            ws.type = type;
            ws.id = id;
            const q: any = urlObj.query;
            if (type === 'target') {
              ws.pageURL = q.url;
              ws.title = q.title;
              ws.favicon = q.favicon;
            } else {
              ws.target = q.target;
            }
            wss.emit('connection', ws, req);
          });
        } else if (type === 'data') {
          wss.handleUpgrade(req, socket, head, ws => {
            wsApi(ws);
          });
        } else {
          socket.destroy();
        }
      });
    });
    log.info(`✔ ${chalk.cyan('HTTPS')} & ${chalk.cyan('WebSocket')} 服务启动成功`);
    log.info(`✔ bproxy[${chalk.green.bold(pkg.version)}] 启动成功✨`);
    log.info(`♨️  操作面板地址：${chalk.green.underline(`http://127.0.0.1:${appConfig.port}`)}`);

    const upgradeVersion = await this.checkUpdate();
    if (upgradeVersion) {
      const userInput = await userConfirm(`是否升级到 ${chalk.green(upgradeVersion)} (Y/N)`);

      if (userInput.toString().toLocaleUpperCase() === 'Y') {
        log.info('bproxy 自动升级中...')
        runShellCode('npm i bproxy@latest -g --registry=https://registry.npmmirror.com', (data) => {
          log.info(`${data}`);
        }, (err) => {
          log.warn(`${err}`);
        }, () => {
          log.info('✨ 升级完成，请重启bproxy!');
          runShellCode('bproxy -V', (data) => log.info(`当前 bproxy 版本: ${chalk.green(data)}`));
          setTimeout(() => {
            process.exit(0);
          }, 3000);
        });
      } else {
        log.warn('已取消自动升级');
      }
    }
  }

  static async loadUserConfig(configPath: string, defaultSettings: ProxyConfig): Promise<{
    configPath?: string;
    config?: ProxyConfig;
  }> {
    let mixConfig, userConfigPath;
    const res: {
      configPath?: string;
      config?: ProxyConfig;
    } = {};

    if (_.isBoolean(configPath) || _.isUndefined(configPath)) {
      userConfigPath = '.';
    }

    const requireUserConfig = (confPath: string) => {
      try {
        delete require.cache[require.resolve(confPath)];
        const userConfig = require(confPath);
        mixConfig = { ...defaultSettings, ...userConfig };
        res.configPath = confPath;
        res.config = mixConfig;
        updateDataSet('config', preload(res.config));
      } catch (err: any) {
        log.error(err.message);
      }
    };

    if (userConfigPath || _.isString(configPath)) {
      const confPath = path.resolve(userConfigPath || configPath, 'bproxy.config.js');
      updateDataSet('configPath', confPath);
      // 当前目录没有bproxy的配置文件
      if (!fs.existsSync(confPath)) {
        const userInput = await userConfirm(`当前目录(${confPath})没有找到bproxy.config.js, 是否自动创建？(Y/N)`);

        if (userInput.toString().toLocaleUpperCase() === 'Y') {
          const defaultConfig = _.omit({...settings}, ['configFile', 'certificate']);
          const template: string[] = [
            `const config = ${JSONFormat(defaultConfig)};`,
            'module.exports = config;',
          ];

          fs.writeFileSync(confPath, template.join('\n\n'));
          log.info(`✔ 配置文件已创建: ${confPath}`);
        } else {
          log.warn('请手动创建 bproxy.config.js 文件');
          process.exit();
        }
      }
      requireUserConfig(confPath);
    }

    return res;
  }

  static checkUpdate(): Promise<string> {
    return new Promise((resolve) => {
      // const url1 = 'https://raw.githubusercontent.com/zobor/bproxy/master/package.json';
      const url1 = 'https://www.npmjs.com/package/bproxy';
      const parse = (str) => {
        try {
          const json = JSON.parse(str);
          const latestVersion = json.packument.version;
          if (compareVersion(latestVersion, pkg.version) === 1) {
            log.warn(chalk.red(`bproxy有新版本(${chalk.bold.underline(latestVersion)})可以更新.当前版本(${chalk.bold.underline(pkg.version)})`));
            resolve(latestVersion);
          } else {
            resolve('');
          }
        } catch(err) {}
      };
      request(url1, {
        headers: {
          'x-requested-with': 'XMLHttpRequest',
          'x-spiferack': 1,
        }
      }, (err, response, body) => {
        if (!err && body) {
          parse(body);
        }
      });
    });
  }
}
