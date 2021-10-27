import request from 'request';
import * as fs from 'fs';
import { Readable } from 'stream';
import * as _ from 'lodash';
import * as path from 'path';
import * as url from 'url';
import { rulesPattern } from './rule';
import { RequestOptions } from '../types/request';
import { ioRequest } from './socket';
import { isInspectContentType } from './utils/is';
import { ProxyConfig } from '../types/proxy';

export const httpMiddleware = {
  responseByText(text: string, res): void {
    const s = new Readable();
    s.push(text);
    s.push(null);
    s.pipe(res);
  },

  async proxy(req: any, res: any, config: ProxyConfig): Promise<number> {
    const { rules } = config;
    const pattern = rulesPattern(rules, req.httpsURL || req.url);
    const resOptions = {
      headers: {},
    };
    if (pattern.matched) {
      return new Promise(() => {
        if (!pattern.matchedRule) return;
        if (pattern?.responseHeaders) {
          resOptions.headers = {...pattern.responseHeaders}
        }
        if (pattern?.matchedRule?.responseHeaders) {
          resOptions.headers = {...pattern.matchedRule.responseHeaders}
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
            path.resolve(pattern.matchedRule.path, pattern.matchedRule.filepath || ''),
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
            rules: pattern?.matchedRule,
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
          req.url = pattern.matchedRule.redirectTarget || pattern.matchedRule.redirect;
          req.httpsURL = req.url;
          const redirectUrlParam = url.parse(req.url);
          if (redirectUrlParam.host && req.headers) {
            req.headers.host = redirectUrlParam.host;
          }
          const requestOption = {
            headers: pattern.matchedRule.requestHeaders || {}
          };
          resOptions.headers['X-BPROXY-REDIRECT'] = req.url;
          return this.proxyByRequest(req, res, requestOption, resOptions);
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
        else {
          // todo
        }
      });
    } else {
      return this.proxyByRequest(req, res, {}, resOptions);
    }
  },

  async proxyByRequest(req, res, requestOption, responseOptions): Promise<number> {
    return new Promise(async () => {
      const rHeaders = { ...req.headers, ...requestOption.headers };
      const options: RequestOptions = {
        url: req.httpsURL || req.url,
        method: req.method,
        headers: rHeaders,
        body: null,
        encoding: null,
        strictSSL: false,
        rejectUnauthorized: false,
        followRedirect: false,
      };
      if (['post', 'put'].includes(req.method.toLowerCase())) {
        options.body = await this.getPostBody(req);
      }
      // TODO
      // plugin to install here
      // download file by request.pipe
      // if (
      //     responseOptions?.config?.downloadPath &&
      // ) {
      //     const downloadFileName = utils.uuid(12);
      //     const parseUrl = url.parse(options.url);
      //     const fileName = (parseUrl.pathname || '').split('/').pop();
      //     if (fileName) {
      //         const filetype = fileName.split('.').pop();
      //         if (filetype) {
      //             request({
      //                 ...options,
      //                 ...requestOption,
      //             }).pipe(
      //                 fs.createWriteStream(
      //                     `${responseOptions.config.downloadPath}/${downloadFileName}.${filetype}`
      //                 )
      //             );
      //             return;
      //         }
      //     }
      // }
      // todo deep assign object
      requestOption.headers = {...options.headers, ...requestOption.headers};
      const rOpts = {
        ...options,
        ...requestOption,
      };

      ioRequest({
        url: rOpts.url,
        method: rOpts.method,
        requestHeader: rOpts.headers,
        requestId: req.$requestId,
        requestBody: rOpts.body,
      });
      request(rOpts)
        .on("response", function (response) {
          const responseHeader = {...response.headers, ...responseOptions.headers};
          if (
            (isInspectContentType(rOpts.headers) ||
            isInspectContentType(responseHeader))
          ) {
            const body: Buffer[] = [];
            response
              .on("data", (data: Buffer) => {
                body.push(data);
              })
              .on("end", () => {
                const buf = Buffer.concat(body);
                ioRequest({
                  requestId: req.$requestId,
                  responseBody: buf,
                });
              });
          }
          ioRequest({
            requestId: req.$requestId,
            url: rOpts.url,
            method: rOpts.method,
            responseHeader,
            statusCode: response.statusCode,
          });
          res.writeHead(response.statusCode, responseHeader);
        })
        // put response to proxy response
        .pipe(res);
    });
  },

  getPostBody(req: any): Promise<Buffer> {
    return new Promise((resolve) => {
      const body: Array<Buffer> = [];
      req.on('data', (chunk: Buffer) => {
        body.push(chunk);
      });
      req.on('end', () => {
        resolve(Buffer.concat(body));
      });
    });
  },

  proxyLocalFile(filepath: string, res: any, resHeaders: any = {}): void {
    try {
      fs.accessSync(filepath, fs.constants.R_OK);
      const readStream = fs.createReadStream(filepath);
      res.writeHead(200, resHeaders);
      readStream.pipe(res);
    } catch (err) {
      const s = new Readable();
      res.writeHead(404, {});
      s.push('404: Not Found or Not Access');
      s.push(null);
      s.pipe(res);
    }
  },
}
