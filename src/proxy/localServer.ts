import * as http from 'http';
import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs';
import settings from './config';
import { httpMiddleware } from './httpMiddleware';
import httpsMiddleware from './httpsMiddleware';
import { isLocal, requestJac } from './routers';
import { io } from './socket';
import { getLocalIpAddress } from './utils/ip';
import { log, utils } from './utils/utils';
import { ProxyConfig } from '../types/proxy';
import dataset from './utils/dataset';

export default class LocalServer {
  static start(port: number, configPath: string): void{
    const { config = {} as any, configPath: confPath = '' } = this.loadUserConfig(configPath, settings);
    dataset.configPath = configPath;
    if (_.isEmpty(config) || _.isEmpty(confPath)) {
      return;
    }
    let appConfig = config;
    // watch config file change
    // update config without restart app
    fs.watchFile(confPath, { interval: 1000 }, () => {
      log.info(`配置文件已更新: ${confPath}`);
      try {
        delete require.cache[require.resolve(confPath)];
        appConfig = require(confPath);
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
        httpMiddleware.proxy($req, res, appConfig);
      });
      // https
      server.on('connect', (req, socket, head) => {
        const $req: any = req;
        if (!$req.$requestId) {
          $req.$requestId = utils.guid();
        }
        httpsMiddleware.proxy($req, socket, head, appConfig);
      });
    });
    const ips = getLocalIpAddress();
    ips.forEach((ip: string) => {
      log.info(`本地代理服务器启动成功: http://${ip}:${appConfig.port}`);
    });
  }

  static loadUserConfig(configPath: string, defaultSettings: ProxyConfig): {
    configPath?: string;
    config?: ProxyConfig;
  } {
    let mixConfig, userConfigPath;
    const res: {
      configPath?: string;
      config?: ProxyConfig;
    } = {};
    if (_.isBoolean(configPath) || _.isUndefined(configPath)) {
      userConfigPath = '.';
    }
    if (userConfigPath || _.isString(configPath)) {
      const confPath = path.resolve(userConfigPath || configPath, 'bproxy.conf.js');
      if (!fs.existsSync(confPath)) {
        console.error('当前目录下没有找到bproxy.conf.js, 请先创建');
        return res;
      } else {
        try {
          const userConfig = require(confPath);
          mixConfig = {...defaultSettings, ...userConfig};
          res.configPath = confPath;
          res.config = mixConfig;
        } catch(err){}
      }
    }
    return res;
  }
}
