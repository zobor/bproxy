import request from 'request';
import * as fs from 'fs';
import { Readable } from 'stream';
import * as _ from 'lodash';
import * as path from 'path';
import * as url from 'url';
import { matcher } from './matcher';
import { ioRequest } from './socket';
import { isInspectContentType } from './utils/is';
import MatcherResult, { ProxyConfig, RequestOptions } from '../types/proxy';
import { log } from './utils/utils';
import { getFileTypeFromSuffix, getResponseContentType } from './utils/file';
import { stringToBytes } from '../web/modules/buffer';

export const httpMiddleware = {
  responseByText(text: string, res, responseHeaders): void {
    const s = new Readable();
    res.writeHead(200, responseHeaders || {});
    s.push(text);
    s.push(null);
    s.pipe(res);
  },

  async proxy(req: any, res: any, config: ProxyConfig): Promise<number> {
    const { rules } = config;
    const matcherResult = matcher(rules, req.httpsURL || req.url);
    const resOptions = {
      headers: {},
    };
    if (matcherResult.matched) {
      return new Promise(() => {
        if (!matcherResult.rule) return;
        if (matcherResult?.responseHeaders) {
          resOptions.headers = {...matcherResult.responseHeaders}
        }
        if (matcherResult?.rule?.responseHeaders) {
          resOptions.headers = {...matcherResult.rule.responseHeaders}
        }
        // localfile
        // 1. rule.file
        if (matcherResult.rule.file) {
          ioRequest({
            requestId: req.$requestId,
            url: req.requestOriginUrl || req.url,
            method: req.method,
            statusCode: matcherResult.rule.statusCode,
            requestHeaders: req.headers,
          });
          this.proxyLocalFile(
            matcherResult.rule.file,
            res,
            resOptions.headers,
            req,
          );
        }
        // 2. rule.path
        else if (matcherResult.rule.path) {
          ioRequest({
            requestId: req.$requestId,
            url: req.requestOriginUrl || req.url,
            method: req.method,
            statusCode: matcherResult.rule.statusCode,
            requestHeaders: req.headers,
          });
          this.proxyLocalFile(
            path.resolve(matcherResult.rule.path, matcherResult.rule.filepath || ''),
            res,
            resOptions.headers,
            req,
          );
        }
        // 3.1. rule.response.function
        else if (_.isFunction(matcherResult.rule.response)) {
          matcherResult.rule.response({
            response: res,
            request,
            req,
            rules: matcherResult?.rule,
          });
          ioRequest({
            requestId: req.$requestId,
            url: req.requestOriginUrl || req.url,
            method: req.method,
            statusCode: matcherResult.rule.statusCode,
            requestHeaders: req.headers,
          });
        }
        // 3.2.  rule.response.string
        else if (_.isString(matcherResult.rule.response)) {
          this.responseByText(matcherResult.rule.response, res, resOptions.headers);
          ioRequest({
            requestId: req.$requestId,
            url: req.requestOriginUrl || req.url,
            method: req.method,
            statusCode: matcherResult.rule.statusCode,
            requestHeaders: req.headers,
          });
        }
        // rule.statusCode
        else if (matcherResult.rule.statusCode) {
          res.writeHead(matcherResult.rule.statusCode, {});
          res.end(matcherResult.rule.statusCode.toString());
          ioRequest({
            requestId: req.$requestId,
            url: req.requestOriginUrl || req.url,
            method: req.method,
            statusCode: matcherResult.rule.statusCode,
            requestHeaders: req.headers,
          });
        }
        // network response
        // 4. rule.redirect
        else if (_.isString(matcherResult.rule.redirect)) {
          req.requestOriginUrl = req.url;
          req.url = matcherResult.rule.redirectTarget || matcherResult.rule.redirect;
          req.httpsURL = req.url;
          const redirectUrlParam = url.parse(req.url);
          if (redirectUrlParam.host && req.headers) {
            req.headers.host = redirectUrlParam.host;
          }
          const requestOption = {
            headers: matcherResult.rule.requestHeaders || {}
          };
          return this.proxyByRequest(req, res, requestOption, resOptions, matcherResult);
        }
        // rule.proxy
        else if (_.isString(matcherResult.rule.proxy)) {
          return this.proxyByRequest(req, res, {
            proxy: matcherResult.rule.proxy,
          }, resOptions, matcherResult);
        }
        // rule.host
        else if (_.isString(matcherResult.rule.host)) {
          return this.proxyByRequest(req, res, {
            hostname: matcherResult.rule.host,
          }, resOptions, matcherResult);
        }
        else {
          // todo
        }
      });
    } else {
      return this.proxyByRequest(req, res, {}, resOptions);
    }
  },

  async proxyByRequest(req, res, requestOption, responseOptions, matcherResult?: MatcherResult): Promise<number> {
    return new Promise(async () => {
      const rHeaders = { ...req.headers, ...requestOption.headers };
      if (!_.isEmpty(requestOption)) {
        ['cache-control', 'if-none-match', 'if-modified-since'].forEach((key: string) => {
          rHeaders[key] && delete rHeaders[key];
          rHeaders['pragma'] = 'no-cache';
          rHeaders['cache-control'] = 'no-cache';
        });
      }
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
      if (req.httpVersion !== '2.0' && !req.headers?.connection) {
        options.headers.connection = 'keep-alive';
      }
      if (req.httpVersion === '1.0' && options.headers['transfer-encoding']) {
        delete options.headers['transfer-encoding'];
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
        matched: matcherResult?.matched,
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
          log.warn(`[http request error]: ${err.message}\n  url--->${rOpts.url}`);
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

  proxyLocalFile(filepath: string, res: any, resHeaders: any = {}, req: any): void {
    try {
      fs.accessSync(filepath, fs.constants.R_OK);
      const readStream = fs.createReadStream(filepath);
      const suffix = getFileTypeFromSuffix(filepath);
      const fileContentType = getResponseContentType(suffix);
      const headers = resHeaders;
      if (fileContentType && !headers['content-type']) {
        headers['content-type'] = fileContentType;
      }
      res.writeHead(200, headers);
      readStream.pipe(res);

      let responseBody = '不支持预览';
      if (['json', 'js', 'css', 'html'].includes(suffix)) {
        responseBody  =fs.readFileSync(filepath, 'utf-8');
      }

      ioRequest({
        requestId: req.$requestId,
        url: req.url,
        method: req.method,
        responseHeaders: headers,
        statusCode: 200,
        responseBody: stringToBytes(responseBody),
      });
    } catch (err) {
      const s = new Readable();
      res.writeHead(404, {});
      s.push('404: Not Found or Not Access');
      s.push(null);
      s.pipe(res);
      ioRequest({
        requestId: req.$requestId,
        url: req.url,
        method: req.method,
        responseHeaders: {},
        statusCode: 404,
      });
    }
  },
}
