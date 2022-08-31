import { bproxyPrefixHeader } from './../config';
import { ioRequest } from '../socket/socket';
import pako from 'pako';
import request from 'request';
import { fromPairs, get, isArray, omit, toPairs } from 'lodash';
import { isInspectContentType } from '../utils/is';
import { hookConsoleLog } from '../utils/utils';
import { responseText } from './text';
import dataset from '../utils/dataset';

export async function responseByRequest(
  req,
  res,
  requestOption,
  responseHeaders = {},
  matcherResult: BproxyConfig.MatcherResult,
  config: BproxyConfig.Config,
  postBodyData,
): Promise<number> {
  return new Promise(async () => {
      const requestHeaders = { ...req.headers, ...requestOption.headers };
      const highPerformanceMode = dataset?.config?.highPerformanceMode;
      const debug = matcherResult?.rule?.debug;
      if (config?.disableCache || matcherResult?.rule?.disableCache) {
        ['cache-control', 'if-none-match', 'if-modified-since'].forEach(
          (key: string) => {
            requestHeaders[key] && delete requestHeaders[key];
            requestHeaders['pragma'] = 'no-cache';
            requestHeaders['cache-control'] = 'no-cache';
          }
        );
      }
      const url = matcherResult?.matched && (matcherResult?.filepath || matcherResult?.rule?.redirect) ? req.url : req.httpsURL;
      const options: BproxyConfig.RequestOptions = {
        url: url || req.url,
        method: req.method,
        headers: requestHeaders,
        body: postBodyData || null,
        encoding: null,
        strictSSL: false,
        rejectUnauthorized: false,
        followRedirect: false,
      };
      if (req.httpVersion !== '2.0' && !req.headers?.connection) {
        options.headers.connection = 'keep-alive';
      }
      // todo deep assign object
      requestOption.headers = { ...options.headers, ...requestOption.headers };
      const rOpts = {
        ...options,
        ...requestOption,
      };

      const ioRequestParams = {
        url: req.httpsURL || req.requestOriginUrl || options.url,
        method: rOpts.method,
        requestHeaders: rOpts.headers,
        requestId: req.$requestId,
        requestBody: rOpts.body && !highPerformanceMode ? rOpts.body.toString() : null,
        matched: matcherResult?.matched,
      };
      ioRequest(ioRequestParams);

      const fetch = request(rOpts)
        .on('response', function (response) {
          let headers: any = omit(
            { ...response.headers, ...responseHeaders },
            isArray(matcherResult?.rule?.excludeResponseHeaders)
              ? matcherResult?.rule?.excludeResponseHeaders || []
              : []
          );
          headers = fromPairs(
            toPairs(headers).map((arr) => [arr[0].trim(), arr[1]])
          );
          const encoding = get(headers, '["content-encoding"]');
          const isGzip = encoding === 'gzip';
          const showContent = isInspectContentType(headers || {});
          const ip = response?.socket?.remoteAddress;
          const statusCode = response?.statusCode || 500;

          !debug && res.writeHead(statusCode, headers);

          if (showContent && !highPerformanceMode) {
            const body: Buffer[] = [];
            response.on('data', (d: Buffer) => body.push(d));
            response.on('end', () => {
              const buf = Buffer.concat(body);
              let str: any = buf;
              if (isGzip) {
                str = pako.ungzip(new Uint8Array(buf), { to: 'string' });
              } else if (!encoding) {
                str = buf.toString();
              }

              if (debug) {
                const txt = hookConsoleLog(str, debug);
                let resData = txt;
                if (isGzip) {
                  resData = pako.gzip(txt);
                }
                headers = {
                  ...headers,
                  [`${bproxyPrefixHeader}-debug`]: true,
                };
                res.writeHead(statusCode, {
                  ...headers,
                  'content-length': resData.length,
                });
                responseText(resData, res);
                ioRequest({
                  ...ioRequestParams,
                  requestId: req.$requestId,
                  responseHeaders: headers,
                  responseBody: txt,
                  statusCode,
                });
              } else {
                ioRequest({
                  ...ioRequestParams,
                  requestId: req.$requestId,
                  responseHeaders: headers,
                  responseBody: str,
                  statusCode,
                  ip,
                });
              }
            });
          } else {
            ioRequest({
              ...ioRequestParams,
              requestId: req.$requestId,
              responseHeaders: headers,
              statusCode,
              ip,
            });
          }
        })
        .on('error', (err) => {
          res.writeHead(500, {});
          res.end(err.message);
          ioRequest({
            requestId: req.$requestId,
            statusCode: 500,
          });
        });
      if (!debug) {
        // put response to proxy response
        fetch.pipe(res);
      }
    });
}
