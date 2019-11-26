import * as request from 'request';
import * as fs from 'fs';
import { Readable } from 'stream';
import * as _ from 'lodash';
import * as path from 'path';
import * as url from 'url';
import { IHttpMiddleWare } from '../types/httpMiddleWare';
import { IRule } from '../types/rule';
import { rulesPattern } from './rule';
import { IRequestOptions } from '../types/request';

export const httpMiddleware: IHttpMiddleWare = {
  async proxy(req: any, res: any, rules: Array<IRule>): Promise<number>{
    const pattern = rulesPattern(rules, req.httpsURL || req.url);
    if (pattern.matched) {
      return new Promise(() => {
        if (!pattern.matchedRule) return;
        if (pattern.matchedRule.file) {
          this.proxyLocalFile(pattern.matchedRule.file, res);
        }
        else if (pattern.matchedRule.path) {
          this.proxyLocalFile(path.resolve(pattern.matchedRule.path, pattern.filepath || ''), res);
        } else if (_.isFunction(pattern.matchedRule.response)) {
          pattern.matchedRule.response({
            response: res,
          });
        } else if (_.isString(pattern.matchedRule.response)) {
          res.end(pattern.matchedRule.response);
        } else if (_.isString(pattern.matchedRule.redirect)) {
          req.url = pattern.matchedRule.redirect;
          const redirectUrlParam = url.parse(req.url);
          if (redirectUrlParam.host && req.headers) {
            req.headers.host = redirectUrlParam.host;
          }
          return this.proxyByRequest(req, res, {}, {});
        } else if (_.isString(pattern.matchedRule.proxy)) {
          return this.proxyByRequest(req, res, {
            proxy: pattern.matchedRule.proxy,
          }, {});
        } else if (_.isString(pattern.matchedRule.host)) {
          return this.proxyByRequest(req, res, {
            hostname: pattern.matchedRule.host,
          }, {});
        } else {
          console.log('// todo');
          console.log(pattern);
        }
      });
    } else {
      return this.proxyByRequest(req, res, {}, {});
    }
  },

  async proxyByRequest(req, res, requestOption, responseOptions): Promise<number> {
    return new Promise(async(resolve) => {
      const rHeaders = {...req.headers};
      const options: IRequestOptions = {
        url: req.httpsURL || req.url,
        method: req.method,
        headers: rHeaders,
        body: null,
        encoding: null,
        strictSSL: false,
        rejectUnauthorized: false,
      };
      if (req.method.toLowerCase() === 'post') {
        options.body = await this.getPOSTBody(req);
      }
      // todo
      if (/mp3|mp4|m4a/i.test(options.url)) {
        console.log('URL: ', options.url);
      }
      request({
        ...options,
        ...requestOption,
      }, (err, resp, body) => {
        if (err) {
          console.error('node http request error:', err);
          res.end(err);
          return;
        }
        res.writeHead(resp.statusCode, {...resp.headers, ...responseOptions.headers});
        res.write(body);
        res.end();
      });
    });
  },

  getPOSTBody(req: any): Promise<Buffer> {
    return new Promise((resolve) => {
      const body: Array<Buffer> = [];
      req.on('data', (chunk: Buffer) => {
        body.push(chunk);
      });
      req.on('end', () => {
        resolve(Buffer.concat(body));
      });
      req.on('error', (err) => {
        // todo
        console.error(err);
      });
    });
  },

  proxyLocalFile(filepath: string, res: any): void {
    try {
      fs.accessSync(filepath, fs.constants.R_OK);
      const readStream = fs.createReadStream(filepath);
      readStream.pipe(res);
    } catch(err) {
      const s = new Readable();
      s.push('Not Found or Not Acces');
      s.push(null);
      s.pipe(res);
      res.writeHead(404, {});
    }
  },
}
