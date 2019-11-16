import * as http from 'http';
import settings from './settings';
import httpMiddleware from './httpMiddleware';
import httpsMiddleware from './httpsMiddleware';
import cm from './common';
import lang from './i18n';

export default class LocalServer {
  static start() {
    const server = new http.Server();
    server.listen(settings.port, () => {
      // http
      server.on('request', (req, res) => {
        httpMiddleware.proxy(req, res);
      });
      // https
      server.on('connect', (req, socket, head) => {
        // if (!req.__sid__) {
        //   req.__sid__ = _.newGuid();
        // }
        httpsMiddleware.proxy(req, socket, head);
      });
    });
    cm.info(`${lang.START_LOCAL_SVR_SUC}: http://127.0.0.1:${settings.port}`)
  }
}