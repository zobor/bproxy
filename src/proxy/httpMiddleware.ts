import { ProxyRule } from './../types/proxy.d';
import request from 'request';
import * as fs from 'fs';
import { Readable } from 'stream';
import pako from 'pako';
import * as _ from 'lodash';
import * as path from 'path';
import * as url from 'url';
import { matcher } from './matcher';
import { ioRequest } from './socket';
import MatcherResult, { ProxyConfig, RequestOptions } from '../types/proxy';
import { hookConsoleLog, log, stringToBytes } from './utils/utils';
import { getFileTypeFromSuffix, getResponseContentType } from './utils/file';
import { isInspectContentType, isPromise } from './utils/is';

const getDalay = (rule: ProxyRule, config: ProxyConfig) => {
  return rule?.delay || config?.delay || 0;
}
const delay = (time: number) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(true);
  }, time);
});

const responseText = (text: any, res) => {
  const s = new Readable();
  s.push(text);
  s.push(null);
  s.pipe(res);
};

const getPostBody = (req: any): Promise<Buffer> => {
  return new Promise((resolve) => {
    const body: Array<Buffer> = [];
    req.on('data', (chunk: Buffer) => {
      body.push(chunk);
    });
    req.on('end', () => {
      resolve(Buffer.concat(body));
    });
  });
}

export const httpMiddleware = {
  async proxy(req: any, res: any, config: ProxyConfig): Promise<number> {
    const { rules } = config;
    const matcherResult = matcher(rules, req.httpsURL || req.url);
    const resOptions = {
      headers: {},
    };
    const delayTime = getDalay(matcherResult?.rule as ProxyRule, config);

    if (matcherResult.matched) {
      return new Promise(async () => {
        if (!matcherResult.rule) return;
        if (matcherResult?.responseHeaders) {
          resOptions.headers = { ...matcherResult.responseHeaders };
        }
        if (matcherResult?.rule?.responseHeaders) {
          resOptions.headers = { ...matcherResult.rule.responseHeaders };
        }
        // local file
        // 1. rule.file
        if (matcherResult.rule.file) {
          ioRequest({
            matched: true,
            requestId: req.$requestId,
            url: req.httpsURL || req.requestOriginUrl || req.url,
            method: req.method,
            requestHeaders: req.headers,
          });
          if (delayTime) {
            await delay(delayTime);
          }
          this.proxyLocalFile(
            path.resolve(matcherResult.rule.file),
            res,
            resOptions.headers,
            req
          );
        }
        // 2. rule.path
        else if (matcherResult.rule.path) {
          ioRequest({
            matched: true,
            requestId: req.$requestId,
            url: req.httpsURL || req.requestOriginUrl || req.url,
            method: req.method,
            statusCode: matcherResult.rule.statusCode,
            requestHeaders: req.headers,
          });
          if (delayTime) {
            await delay(delayTime);
          }
          this.proxyLocalFile(
            path.resolve(
              matcherResult.rule.path,
              matcherResult.rule.filepath || ""
            ),
            res,
            resOptions.headers,
            req
          );
        }
        // 3.1. rule.response.function
        else if (_.isFunction(matcherResult.rule.response)) {
          const body =
            req.method.toLowerCase() === "post"
              ? await (await getPostBody(req)).toString()
              : undefined;
          ioRequest({
            matched: true,
            requestId: req.$requestId,
            url: req.httpsURL || req.requestOriginUrl || req.url,
            method: req.method,
            requestHeaders: req.headers,
            requestBody: body,
          });
          if (delayTime) {
            await delay(delayTime);
          }
          const rs = matcherResult.rule.response({
            response: res,
            request,
            req,
            rules: matcherResult?.rule,
            body,
          });
          let resData;
          if (isPromise(rs)) {
            resData = await rs;
          } else {
            resData = rs;
          }
          const { data, headers, statusCode } = resData || {};
          ioRequest({
            requestId: req.$requestId,
            responseBody: data,
            statusCode: statusCode || 200,
            responseHeaders: headers || {
              "content-type": "bproxy/log",
            },
          });
        }
        // 3.2.  rule.response.string
        else if (_.isString(matcherResult.rule.response)) {
          ioRequest({
            matched: true,
            requestId: req.$requestId,
            url: req.httpsURL || req.requestOriginUrl || req.url,
            method: req.method,
            requestHeaders: req.headers,
          });
          if (delayTime) {
            await delay(delayTime);
          }
          const responseHeaders = {
            ...resOptions.headers,
          };
          ioRequest({
            matched: true,
            requestId: req.$requestId,
            statusCode: matcherResult.rule.statusCode,
            responseHeaders,
            responseBody: matcherResult.rule.response,
          });
          res.writeHead(200, responseHeaders || {});
          responseText(matcherResult.rule.response, res);
        }
        // rule.statusCode
        else if (matcherResult.rule.statusCode) {
          ioRequest({
            matched: true,
            requestId: req.$requestId,
            url: req.httpsURL || req.requestOriginUrl || req.url,
            method: req.method,
            requestHeaders: req.headers,
          });
          if (delayTime) {
            await delay(delayTime);
          }
          ioRequest({
            requestId: req.$requestId,
            statusCode: matcherResult.rule.statusCode,
            responseBody: matcherResult.rule.statusCode.toString(),
          });
          res.writeHead(matcherResult.rule.statusCode, {});
          res.end(matcherResult.rule.statusCode.toString());
        }
        // network response
        // 4. rule.redirect
        else if (_.isString(matcherResult.rule.redirect)) {
          req.requestOriginUrl = req.url;
          req.url =
            matcherResult.rule.redirectTarget || matcherResult.rule.redirect;
          req.httpsURL = req.url;
          const redirectUrlParam = url.parse(req.url);
          if (redirectUrlParam.host && req.headers) {
            req.headers.host = redirectUrlParam.host;
          }
          const requestOption = {
            headers: matcherResult.rule.requestHeaders || {},
          };
          if (delayTime) {
            await delay(delayTime);
          }
          return this.proxyByRequest(
            req,
            res,
            requestOption,
            resOptions,
            matcherResult,
            config
          );
        }
        // rule.proxy
        else if (_.isString(matcherResult.rule.proxy)) {
          if (delayTime) {
            await delay(delayTime);
          }
          return this.proxyByRequest(
            req,
            res,
            {
              proxy: matcherResult.rule.proxy,
            },
            resOptions,
            matcherResult,
            config
          );
        }
        // rule.host
        else if (_.isString(matcherResult.rule.host)) {
          if (delayTime) {
            await delay(delayTime);
          }
          return this.proxyByRequest(
            req,
            res,
            {
              hostname: matcherResult.rule.host,
            },
            resOptions,
            matcherResult,
            config
          );
        } else {
          return this.proxyByRequest(
            req,
            res,
            {},
            resOptions,
            matcherResult,
            config
          );
        }
      });
    } else {
      if (delayTime) {
        await delay(delayTime);
      }
      return this.proxyByRequest(req, res, {}, resOptions, {}, config);
    }
  },

  async proxyByRequest(
    req,
    res,
    requestOption,
    responseOptions,
    matcherResult?: MatcherResult,
    config?: ProxyConfig,
  ): Promise<number> {
    return new Promise(async () => {
      const requestHeaders = { ...req.headers, ...requestOption.headers };
      const syncLogs = matcherResult?.rule?.syncLogs;
      if (config?.disableCache || matcherResult?.rule?.disableCache) {
        ["cache-control", "if-none-match", "if-modified-since"].forEach(
          (key: string) => {
            requestHeaders[key] && delete requestHeaders[key];
            requestHeaders["pragma"] = "no-cache";
            requestHeaders["cache-control"] = "no-cache";
          }
        );
      }
      const options: RequestOptions = {
        url: req.httpsURL || req.url,
        method: req.method,
        headers: requestHeaders,
        body: null,
        encoding: null,
        strictSSL: false,
        rejectUnauthorized: false,
        followRedirect: false,
      };
      
      if (["post", "put"].includes(req.method.toLowerCase())) {
        options.body = await getPostBody(req);
      }
      if (req.httpVersion !== "2.0" && !req.headers?.connection) {
        options.headers.connection = "keep-alive";
      }
      // todo deep assign object
      requestOption.headers = { ...options.headers, ...requestOption.headers };
      const rOpts = {
        ...options,
        ...requestOption,
      };

      ioRequest({
        url: req.requestOriginUrl || options.url,
        method: rOpts.method,
        requestHeaders: rOpts.headers,
        requestId: req.$requestId,
        requestBody: rOpts.body ? rOpts.body.toString() : null,
        matched: matcherResult?.matched,
      });

      const rst = request(rOpts)
        .on("response", function (response) {
          const headers = { ...response.headers, ...responseOptions.headers };
          const encoding = _.get(headers, '["content-encoding"]');
          const isgzip = encoding === "gzip";
          const showContent = isInspectContentType(headers || {});
          const ip = response?.socket?.remoteAddress;
          const statusCode = response?.statusCode || 500;
          if (showContent) {
            const body: Buffer[] = [];
            response.on("data", (d: Buffer) => body.push(d));
            response.on("end", () => {
              const buf = Buffer.concat(body);
              let str: any = buf;
              if (isgzip) {
                str = pako.ungzip(new Uint8Array(buf), { to: "string" });
              } else if (!encoding) {
                str = buf.toString();
              }
              ioRequest({
                requestId: req.$requestId,
                responseBody: str,
              });
              if (syncLogs) {
                const txt = hookConsoleLog(str, syncLogs);
                let resData = txt;
                if (isgzip) {
                  resData = pako.gzip(txt);
                }
                responseText(resData, res);
              }
            });
          }

          ioRequest({
            requestId: req.$requestId,
            responseHeaders: headers,
            statusCode,
            ip,
          });
          res.writeHead(statusCode, headers);
        })
        .on("error", (err) => {
          // log.warn(
          //   `[http request error]: message-->${err.message} url--->${rOpts.url}`
          // );
          res.writeHead(500, {});
          res.end(err.message);
          ioRequest({
            requestId: req.$requestId,
            statusCode: 500,
          });
        });
      if (!syncLogs) {
        // put response to proxy response
        rst.pipe(res);
      }
    });
  },

  proxyLocalFile(
    filepath: string,
    res: any,
    resHeaders: any = {},
    req: any
  ): void {
    try {
      fs.accessSync(filepath, fs.constants.R_OK);
      const readStream = fs.createReadStream(filepath);
      const suffix = getFileTypeFromSuffix(filepath);
      const fileContentType = getResponseContentType(suffix);
      const headers = resHeaders;
      if (fileContentType && !headers["content-type"]) {
        headers["content-type"] = fileContentType;
      }
      res.writeHead(200, headers);
      readStream.pipe(res);

      let responseBody = "不支持预览";
      if (["json", "js", "css", "html"].includes(suffix)) {
        responseBody = fs.readFileSync(filepath, "utf-8");
      }

      ioRequest({
        requestId: req.$requestId,
        responseHeaders: headers,
        statusCode: 200,
        responseBody: stringToBytes(responseBody),
      });
    } catch (err) {
      const s = new Readable();
      res.writeHead(404, {});
      s.push(`404: Not Found or Not Access: (${filepath})`);
      s.push(null);
      s.pipe(res);
      ioRequest({
        requestId: req.$requestId,
        responseHeaders: {},
        statusCode: 404,
      });
    }
  },
};
