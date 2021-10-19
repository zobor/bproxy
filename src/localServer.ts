import { utils } from './common';
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as http from 'http';
import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs';
import settings from './settings';
import { httpMiddleware } from './httpMiddleware';
import httpsMiddleware from './httpsMiddleware';
import { cm, getLocalIpAddress } from './common';
import lang from './i18n';
import { IConfig } from '../types/config';
import { isEmpty } from 'lodash';
import { isLocal, requestJac } from './pageRouter';
import { io } from './io';
export default class LocalServer {
  static start(port: number, configPath: string): void{
    const { config = {} as any, configPath: confPath = '' } = this.loadUserConfig(configPath, settings);
    settings.configPath = configPath;
    if (isEmpty(config) || isEmpty(confPath)) {
      return;
    }
    let appConfig = config;
    // watch config file change
    // update config without restart app
    fs.watchFile(confPath, { interval: 1000 }, () => {
      cm.info(`${lang.CONFIG_FILE_UPDATE}: ${confPath}`);
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
          requestJac(req, res, certConfig);
          return;
        }
        if (req.url?.includes('/socket.io/')) {
          return;
        }
        if (!req.$requestId) {
          req.$requestId = utils.guid();
        }
        httpMiddleware.proxy(req, res, appConfig);
      });
      // https
      server.on('connect', (req, socket, head) => {
        if (!req.$requestId) {
          req.$requestId = utils.guid();
        }
        httpsMiddleware.proxy(req, socket, head, appConfig);
      });
    });
    const ips = getLocalIpAddress();
    ips.forEach((ip: string) => {
      cm.info(`${lang.START_LOCAL_SVR_SUC}: http://${ip}:${appConfig.port}`);
    });
  }

  static loadUserConfig(configPath: string, defaultSettings: IConfig): {
    configPath?: string;
    config?: IConfig;
  } {
    let mixConfig, userConfigPath;
    const res: {
      configPath?: string;
      config?: IConfig;
    } = {};
    if (_.isBoolean(configPath) || _.isUndefined(configPath)) {
      userConfigPath = '.';
    }
    if (userConfigPath || _.isString(configPath)) {
      const confPath = path.resolve(userConfigPath || configPath, 'bproxy.conf.js');
      if (!fs.existsSync(confPath)) {
        console.log('当前目录下没有找到bproxy.conf.js, 是否立即自动创建？');
        return res;
      } else {
        try {
          /* eslint @typescript-eslint/no-var-requires: 0 */
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
