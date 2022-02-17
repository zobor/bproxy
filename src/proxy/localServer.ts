import * as http from 'http';
import * as _ from 'lodash';
import chalk from 'chalk';
import * as path from 'path';
import * as fs from 'fs';
import * as net from "net";
import * as url from 'url';
import request from 'request';
import settings from './config';
import * as pkg from '../../package.json';
import { httpMiddleware } from './httpMiddleware';
import httpsMiddleware from './httpsMiddleware';
import { isLocal, requestJac } from './routers';
import { ioInit, onConfigFileChange, wsApi, wss } from './socket/socket';
import { getLocalIpAddress } from './utils/ip';
import { compareVersion, log, utils } from './utils/utils';
import { ProxyConfig } from '../types/proxy';
import dataset, { updateDataSet } from './utils/dataset';
import { userConfirm } from './utils/confirm';
import JSONFormat from '../web/libs/jsonFormat';


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
      log.info(`配置文件已更新: ${confPath}`);
      try {
        appConfig = await this.loadUserConfig(configPath, settings);
        onConfigFileChange();
      } catch(err){}
    });
    const server = new http.Server();
    const certConfig = httpsMiddleware.beforeStart();
    // websocket server
    ioInit(server);
    log.info('✔ WebSocket 服务启动成功');

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
        // let hostname = req.headers.host;
        // console.log(req.headers);
        // console.log(req.url);
        // let port = 80;
        // if (hostname.includes('bproxy.io')) {
        //   hostname = '127.0.0.1';
        //   port = 8888;
        // } else if (hostname.includes(':')) {
        //   const hostPort = hostname.split(':');
        //   hostname = hostPort[0];
        //   port = hostPort[1]
        // }
        // console.log(hostname, port);
        // const socketAgent = net.connect(port, hostname, () => {
        //   try {
        //     socketAgent.write(head);
        //     socketAgent.pipe(socket)
        //   } catch(err) {}
        // });
      });
    });
    const ips = getLocalIpAddress();
    log.info('✔ HTTPS 服务启动成功');
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
        delete require.cache[require.resolve(confPath)];
        const userConfig = require(confPath);
        mixConfig = { ...defaultSettings, ...userConfig };
        res.configPath = confPath;
        res.config = mixConfig;
        updateDataSet('config', res.config);
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
          const defaultConfig = _.omit({...settings}, ['configFile', 'certificate']);
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
      const url1 = 'https://raw.githubusercontent.com/zobor/bproxy/master/package.json';
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
        if (!err && body) {
          parse(body);
        }
      });
    });
  }
}
