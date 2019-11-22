import * as http from 'http';
import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs';
import settings from './settings';
import { httpMiddleware } from './httpMiddleware';
import httpsMiddleware from './httpsMiddleware';
import { cm } from './common';
import lang from './i18n';
import { IConfig } from '../types/config';

export default class LocalServer {
  static start(port: number, configPath: string): void{
    const mixConfig = this.loadUserConfig(configPath, settings);
    if (typeof mixConfig === 'boolean') {
      return;
    }
    const server = new http.Server();
    server.listen(mixConfig.port, () => {
      // http
      server.on('request', (req, res) => {
        httpMiddleware.proxy(req, res, mixConfig.rules);
      });
      // https
      server.on('connect', (req, socket, head) => {
        httpsMiddleware.proxy(req, socket, head, mixConfig.rules, mixConfig.ssl);
      });
    });
    cm.info(`${lang.START_LOCAL_SVR_SUC}: http://127.0.0.1:${mixConfig.port}`)
  }

  static loadUserConfig(configPath: string, defaultSettings: IConfig): IConfig | boolean {
    let mixConfig, userConfigPath;
    if (_.isBoolean(configPath) || _.isUndefined(configPath)) {
      userConfigPath = '.';
    }
    if (userConfigPath || _.isString(configPath)) {
      const confPath = path.resolve(userConfigPath || configPath, 'bproxy.conf.js');
      if (!fs.existsSync(confPath)) {
        console.log('当前目录下没有找到bproxy.conf.js, 是否立即自动创建？');
        return false;
      } else {
        /* eslint @typescript-eslint/no-var-requires: 0 */
        const userConfig = require(confPath);
        mixConfig = {...settings, ...userConfig};
      }
    }
    return mixConfig;
  }
}