import * as http from 'http';
import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs';
import * as net from "net";
import request from 'request';
import settings from './config';
import * as pkg from '../../package.json';
import { httpMiddleware } from './httpMiddleware';
import httpsMiddleware from './httpsMiddleware';
import { isLocal, requestJac } from './routers';
import { io, onConfigFileChange } from './socket';
import { getLocalIpAddress } from './utils/ip';
import { compareVersion, log, utils } from './utils/utils';
import { ProxyConfig } from '../types/proxy';
import dataset, { updateDataSet } from './utils/dataset';
import { userConfirm } from './utils/confirm';
import bproxyConfig from './config';
import JSONFormat from '../web/libs/jsonFormat';
import chalk from 'chalk';

export default class LocalServer {
  static async start(port: number, configPath: string): Promise<void>{
    const { config = {} as any, configPath: confPath = "" } =
      await this.loadUserConfig(configPath, settings);
    if (_.isEmpty(config) || _.isEmpty(confPath)) {
      return;
    }
    let appConfig = config;
    port && (appConfig.port = port);
    updateDataSet('config', appConfig);
    // 监听配置文件
    fs.watchFile(confPath, { interval: 1000 }, () => {
      log.info(`配置文件已更新: ${confPath}`);
      try {
        delete require.cache[require.resolve(confPath)];
        appConfig = require(confPath);
        updateDataSet('config', appConfig);
        onConfigFileChange();
      } catch(err){}
    });
    const server = new http.Server();
    const certConfig = httpsMiddleware.beforeStart();
    io(server);
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
        let hostname = req.headers.host;
        let port = 80;
        if (hostname === 'bproxy.io') {
          hostname = '127.0.0.1';
          port = 8888;
        } else if (hostname.indexOf(':') > -1) {
          const hostPort = hostname.split(':');
          hostname = hostPort[0];
          port = hostPort[1]
        }
        const socketAgent = net.connect(port, hostname, () => {
          try {
            socketAgent.write(head);
            socketAgent.pipe(socket)
          } catch(err) {}
        });
      });
    });
    const ips = getLocalIpAddress();
    log.info(`代理启动成功: ${ips.map((ip: string) => `${chalk.green(`http://${ip}:${appConfig.port}`)}\t`)}`);
    log.info(`请求日志查看: ${chalk.green(`http://127.0.0.1:${appConfig.port}`)}`);
    log.info(`更多配置用法: ${chalk.green('https://t.hk.uy/aAMp')}`);

    await this.checkUpdate();
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
        const userConfig = require(confPath);
        mixConfig = { ...defaultSettings, ...userConfig };
        res.configPath = confPath;
        res.config = mixConfig;
      } catch (err: any) {
        log.error(err.message);
      }
    };

    if (userConfigPath || _.isString(configPath)) {
      const confPath = path.resolve(userConfigPath || configPath, 'bproxy.config.js');
      updateDataSet('configPath', confPath);
      // 当前目录没有bproxy的配置文件
      if (!fs.existsSync(confPath)) {
        const userInput = await userConfirm(`当前目录(${confPath})没有找到bproxy.config.js, 是否自动创建？(y/n)`);

        if (userInput.toString().toLocaleUpperCase() === 'Y') {
          const defaultConfig = _.omit({...bproxyConfig}, ['configFile', 'certificate']);
          const template: string[] = [
            `const config = ${JSONFormat(defaultConfig)};`,
            'module.exports = config;',
          ];

          fs.writeFileSync(confPath, template.join('\n\n'));
          log.info(`配置文件已创建: ${confPath}`);
        } else {
          log.info('请手动创建 bproxy.config.js 文件');
          process.exit();
        }
      }
      requireUserConfig(confPath);
    }
    return res;
  }

  static checkUpdate(): Promise<string> {
    return new Promise((resolve) => {
      const url1 = 'https://external.githubfast.com/https/raw.githubusercontent.com/zobor/bproxy/master/package.json';
      const url2 = 'https://raw.githubusercontent.com/zobor/bproxy/master/package.json';
      const parse = (str) => {
        try {
          const json = JSON.parse(str);
          if (compareVersion(json.version, pkg.version) === 1) {
            log.info(`bproxy有新版本(${json.version})可以更新.当前版本(${pkg.version})`);
            log.info(`全局更新： ${chalk.green('npm i bproxy@latest -g')}`);
            log.info(`或者项目内更新: ${chalk.green('npm i bproxy -D')}`);
            resolve(json.version);
          } else {
            resolve('');
          }
        } catch(err) {}
      };
      request(url1, (err, response, body) => {
        if (err) {
          request(url2, (e, r, b) => {
            if (!e && b) {
              parse(b);
            }
          });
        }
        if (!err && body) {
          parse(body);
        }
      });
    });
  }
}
