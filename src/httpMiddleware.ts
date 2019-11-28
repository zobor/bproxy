import * as request from 'request';
import * as fs from 'fs';
import { Readable } from 'stream';
import * as _ from 'lodash';
import * as path from 'path';
import * as url from 'url';
import * as fileType from 'file-type';
import { IHttpMiddleWare } from '../types/httpMiddleWare';
import { rulesPattern } from './rule';
import { IRequestOptions } from '../types/request';
import { IConfig } from '../types/config';
import { utils } from './common';

const dataset = {
  cache: {},
};

export const httpMiddleware: IHttpMiddleWare = {
  async proxy(req: any, res: any, config: IConfig): Promise<number>{
    const { rules } = config;
    const pattern = rulesPattern(rules, req.httpsURL || req.url);
    if (pattern.matched) {
      return new Promise(() => {
        if (!pattern.matchedRule) return;
        // 1. rule.file
        if (pattern.matchedRule.file) {
          this.proxyLocalFile(pattern.matchedRule.file, res);
        }
        // 2. rule.path
        else if (pattern.matchedRule.path) {
          this.proxyLocalFile(path.resolve(pattern.matchedRule.path, pattern.filepath || ''), res);
        }
        // 3.1. rule.response.function
        else if (_.isFunction(pattern.matchedRule.response)) {
          pattern.matchedRule.response({
            response: res,
          });
        }
        // 3.2.  rule.response.string
        else if (_.isString(pattern.matchedRule.response)) {
          res.end(pattern.matchedRule.response);
        }
        // 4. rule.redirect
        else if (_.isString(pattern.matchedRule.redirect)) {
          req.url = pattern.matchedRule.redirect;
          const redirectUrlParam = url.parse(req.url);
          if (redirectUrlParam.host && req.headers) {
            req.headers.host = redirectUrlParam.host;
          }
          return this.proxyByRequest(req, res, {}, {});
        }
        // rule.proxy
        else if (_.isString(pattern.matchedRule.proxy)) {
          return this.proxyByRequest(req, res, {
            proxy: pattern.matchedRule.proxy,
          }, {});
        }
        // rule.host
        else if (_.isString(pattern.matchedRule.host)) {
          return this.proxyByRequest(req, res, {
            hostname: pattern.matchedRule.host,
          }, {});
        }
        // rule.showLog
        else if (pattern.matchedRule.showLog === true) {
          return this.proxyByRequest(req, res, {}, {
            showLog: true,
            download: pattern.matchedRule.download,
            config,
          });
        }
        // rule.down
        else {
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
      if (responseOptions.showLog) {
        console.info('URL: ', options.url);
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
        if (responseOptions.download &&
            responseOptions.config &&
            responseOptions.config.downloadPath &&
            !dataset.cache[options.url]
        ) {
          console.log('download: URL: ', options.url);
          dataset.cache[options.url] = true;
          const filetype = fileType(body);
          if (filetype && filetype.ext) {
            const downloadFileName = utils.guid();
            const downloadFilePath = `${responseOptions.config.downloadPath}/${downloadFileName}.${filetype.ext}`;
            fs.writeFile(downloadFilePath, body, () =>{
              console.log('download suc: ', downloadFilePath);
            });
          }
        }
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
