import * as http from 'http';
import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs';
import settings from './settings';
import httpMiddleware from './httpMiddleware';
import httpsMiddleware from './httpsMiddleware';
import cm from './common';
import lang from './i18n';

export default class LocalServer {
  static start(port: number, configPath: string): void{
    if (!this.before(configPath)) return;
    const server = new http.Server();
    server.listen(settings.port, () => {
      // http
      server.on('request', (req, res) => {
        httpMiddleware.proxy(req, res, settings.rules);
      });
      // https
      server.on('connect', (req, socket, head) => {
        httpsMiddleware.proxy(req, socket, head);
      });
    });
    cm.info(`${lang.START_LOCAL_SVR_SUC}: http://127.0.0.1:${settings.port}`)
  }

  static before(configPath: string): boolean {
    if (_.isString(configPath)) {
      const confPath = path.resolve(configPath, 'bproxy.conf.js');
      if (!fs.existsSync(confPath)) {
        console.log('当前目录下没有找到bproxy.conf.js, 是否立即自动创建？');
        return false;
      } else {
        const userConfig = require(confPath);
        console.log(userConfig);
        const mixConfig = {...settings, ...userConfig};
        console.log(mixConfig);
      }
    } else {
      cm.error(`${lang.ERROR_CONFIG_PATH}`);
      return false;
    }
    return true;
  }
}