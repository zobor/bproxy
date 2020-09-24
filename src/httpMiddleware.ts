import * as request from 'request';
import * as fs from 'fs';
import { Readable } from 'stream';
import * as _ from 'lodash';
import * as path from 'path';
import * as url from 'url';
import { rulesPattern } from './rule';
import { IRequestOptions } from '../types/request';
import { IConfig } from '../types/config';
import { utils } from './common';

const dataset = {
  cache: {},
};

export const httpMiddleware = {
  responseByText(text: string, res): void {
    const s = new Readable();
    s.push(text);
    s.push(null);
    s.pipe(res);
  },
  
  async proxy(req: any, res: any, config: IConfig): Promise<number> {
    const { rules } = config;
    const pattern = rulesPattern(rules, req.httpsURL || req.url);
    const resOptions = {
      headers: {
        'X-BPROXY-MATCH': 1,
      },
    };
    if (pattern.matched) {
      return new Promise(() => {
        if (!pattern.matchedRule) return;
        if (pattern.matchedRule && pattern.matchedRule.headers) {
          resOptions.headers = {...pattern.matchedRule.headers,}
        }
        // localfile
        // 1. rule.file
        if (pattern.matchedRule.file) {
          this.proxyLocalFile(
            pattern.matchedRule.file,
            res,
            resOptions.headers,
          );
        }
        // 2. rule.path
        else if (pattern.matchedRule.path) {
          this.proxyLocalFile(
            path.resolve(pattern.matchedRule.path, pattern.filepath || ''),
            res,
            resOptions.headers,
          );
        }
        // 3.1. rule.response.function
        else if (_.isFunction(pattern.matchedRule.response)) {
          pattern.matchedRule.response({
            response: res,
            request,
            req,
          });
        }
        // 3.2.  rule.response.string
        else if (_.isString(pattern.matchedRule.response)) {
          this.responseByText(pattern.matchedRule.response, res);
        }
        // rule.statusCode
        else if (pattern.matchedRule.statusCode) {
          res.end();
        }

        // network response
        // 4. rule.redirect
        else if (_.isString(pattern.matchedRule.redirect)) {
          req.url = pattern.matchedRule.redirect;
          req.httpsURL = req.url;
          const redirectUrlParam = url.parse(req.url);
          if (redirectUrlParam.host && req.headers) {
            req.headers.host = redirectUrlParam.host;
          }
          return this.proxyByRequest(req, res, {}, resOptions);
        }
        // rule.proxy
        else if (_.isString(pattern.matchedRule.proxy)) {
          return this.proxyByRequest(req, res, {
            proxy: pattern.matchedRule.proxy,
          }, resOptions);
        }
        // rule.host
        else if (_.isString(pattern.matchedRule.host)) {
          return this.proxyByRequest(req, res, {
            hostname: pattern.matchedRule.host,
          }, resOptions);
        }
        // rule.showLog
        else if (pattern.matchedRule.showLog === true) {
          return this.proxyByRequest(req, res, {}, {
            ...resOptions, ... {
              showLog: true,
              download: pattern.matchedRule.download,
              config,
            }
          });
        }
        // rule.down
        else {
          console.log('// todo');
          console.log(pattern);
        }
      });
    } else {
      return this.proxyByRequest(req, res, {}, resOptions);
    }
  },

  async proxyByRequest(req, res, requestOption, responseOptions): Promise<number> {
    return new Promise(async () => {
      const rHeaders = { ...req.headers };
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
      // download file by request.pipe
      if (responseOptions.download &&
        responseOptions.config &&
        responseOptions.config.downloadPath &&
        !dataset.cache[options.url]
      ) {
        const downloadFileName = utils.uuid(12);
        const parseUrl = url.parse(options.url);
        const fileName = (parseUrl.pathname || '').split('/').pop();
        if (fileName) {
          const filetype = fileName.split('.').pop();
          if (filetype) {
            request({
              ...options,
              ...requestOption,
            }).pipe(fs.createWriteStream(`${responseOptions.config.downloadPath}/${downloadFileName}.${filetype}`));
            return;
          }
        }
      }
      const rOpts = {
        ...options,
        ...requestOption,
      };
      // request(rOpts, (err, resp, body) => {
      //   if (err) {
      //     this.responseByText(JSON.stringify(err), res);
      //     return;
      //   }
      //   this.responseByText(body, res);
      // });
      request(rOpts).pipe(res);
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

  proxyLocalFile(filepath: string, res: any, resHeaders: any = {}): void {
    try {
      fs.accessSync(filepath, fs.constants.R_OK);
      const readStream = fs.createReadStream(filepath);
      readStream.pipe(res);
    } catch (err) {
      const s = new Readable();
      s.push('Not Found or Not Acces');
      s.push(null);
      s.pipe(res);
    }
  },
}
