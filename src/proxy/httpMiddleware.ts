import request from 'request';
import * as fs from 'fs';
import { Readable } from 'stream';
import * as _ from 'lodash';
import * as path from 'path';
import * as url from 'url';
import { matcher } from './matcher';
import { ioRequest } from './socket';
import { isInspectContentType } from './utils/is';
import { ProxyConfig, RequestOptions } from '../types/proxy';
import { log } from './utils/utils';

export const httpMiddleware = {
  responseByText(text: string, res): void {
    const s = new Readable();
    s.push(text);
    s.push(null);
    s.pipe(res);
  },

  async proxy(req: any, res: any, config: ProxyConfig): Promise<number> {
    const { rules } = config;
    const pattern = matcher(rules, req.httpsURL || req.url);
    const resOptions = {
      headers: {},
    };
    if (pattern.matched) {
      return new Promise(() => {
        if (!pattern.rule) return;
        if (pattern?.responseHeaders) {
          resOptions.headers = {...pattern.responseHeaders}
        }
        if (pattern?.rule?.responseHeaders) {
          resOptions.headers = {...pattern.rule.responseHeaders}
        }
        // localfile
        // 1. rule.file
        if (pattern.rule.file) {
          this.proxyLocalFile(
            pattern.rule.file,
            res,
            resOptions.headers,
          );
        }
        // 2. rule.path
        else if (pattern.rule.path) {
          this.proxyLocalFile(
            path.resolve(pattern.rule.path, pattern.rule.filepath || ''),
            res,
            resOptions.headers,
          );
        }
        // 3.1. rule.response.function
        else if (_.isFunction(pattern.rule.response)) {
          pattern.rule.response({
            response: res,
            request,
            req,
            rules: pattern?.rule,
          });
        }
        // 3.2.  rule.response.string
        else if (_.isString(pattern.rule.response)) {
          this.responseByText(pattern.rule.response, res);
        }
        // rule.statusCode
        else if (pattern.rule.statusCode) {
          res.writeHead(pattern.rule.statusCode, {});
          res.end(pattern.rule.statusCode.toString());
        }
        // network response
        // 4. rule.redirect
        else if (_.isString(pattern.rule.redirect)) {
          req.requestOriginUrl = req.url;
          req.url = pattern.rule.redirectTarget || pattern.rule.redirect;
          req.httpsURL = req.url;
          const redirectUrlParam = url.parse(req.url);
          if (redirectUrlParam.host && req.headers) {
            req.headers.host = redirectUrlParam.host;
          }
          const requestOption = {
            headers: pattern.rule.requestHeaders || {}
          };
          // resOptions.headers['X-BPROXY-REDIRECT'] = req.url;
          return this.proxyByRequest(req, res, requestOption, resOptions);
        }
        // rule.proxy
        else if (_.isString(pattern.rule.proxy)) {
          return this.proxyByRequest(req, res, {
            proxy: pattern.rule.proxy,
          }, resOptions);
        }
        // rule.host
        else if (_.isString(pattern.rule.host)) {
          return this.proxyByRequest(req, res, {
            hostname: pattern.rule.host,
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
      // todo deep assign object
      requestOption.headers = {...options.headers, ...requestOption.headers};
      const rOpts = {
        ...options,
        ...requestOption,
      };

      ioRequest({
        url: req.requestOriginUrl || options.url,
        method: rOpts.method,
        requestHeaders: rOpts.headers,
        requestId: req.$requestId,
        requestBody: rOpts.body,
      });
      request(rOpts)
        .on("response", function (response) {
          const responseHeaders = {...response.headers, ...responseOptions.headers};
          if (
            isInspectContentType({
              ...rOpts.headers,
              ...responseHeaders,
            })
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
            url: req.requestOriginUrl || options.url,
            method: rOpts.method,
            responseHeaders,
            statusCode: response.statusCode,
          });
          res.writeHead(response.statusCode, responseHeaders);
        })
        .on("error", (err) => {
          log.warn(`[http request error]: ${err.message}\n${rOpts.url}`);
          res.writeHead(500, {});
          res.end(err.message);
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
