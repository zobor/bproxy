import { fromPairs, get, isArray, omit, toPairs } from 'lodash';
import pako from 'pako';
import request from 'request';
import { isInspectContentType } from '../../utils/is';
import logger from '../logger';
import { ioRequest } from '../socket/socket';
import { checkIsStaticFile } from '../utils/request';
import { insertScriptsToHTML } from '../utils/utils';
import { bproxyPrefixHeader } from './../config';
import { responseText } from './text';
import { parseJSON } from '../../utils/utils';

export async function responseByRequest(
  req,
  res,
  requestOption,
  responseHeaders = {},
  matcherResult: BproxyConfig.MatcherResult,
  config: BproxyConfig.Config,
  postBodyData,
  postBodyString: string,
): Promise<number> {
  return new Promise(async () => {
    const requestHeaders = { ...req.headers, ...requestOption.headers };
    const debug = matcherResult?.rule?.debug;
    const disableCache = config?.disableCache || matcherResult?.rule?.disableCache;
    if (disableCache) {
      ['cache-control', 'if-none-match', 'if-modified-since'].forEach((key: string) => {
        requestHeaders[key] && delete requestHeaders[key];
        requestHeaders['pragma'] = 'no-cache';
        requestHeaders['cache-control'] = 'no-cache';
      });
    }
    const url =
      matcherResult?.matched && (matcherResult?.filepath || matcherResult?.rule?.redirect) ? req.url : req.httpsURL;
    const options: BproxyConfig.RequestOptions = {
      url: url || req.url,
      method: req.method,
      headers: requestHeaders,
      body: postBodyData || null,
      encoding: null,
      strictSSL: false,
      rejectUnauthorized: false,
      followRedirect: matcherResult?.rule?.followRedirect || false,
    };
    // if (req.httpVersion !== '2.0' && !req.headers?.connection) {
    //   options.headers.connection = 'keep-alive';
    // }
    requestOption.headers = { ...options.headers, ...requestOption.headers };
    Object.assign(options, requestOption);

    const ioRequestParams = {
      url: req.httpsURL || req.requestOriginUrl || options.url,
      method: options.method,
      requestHeaders: options.headers,
      requestId: req.$requestId,
      requestBody: postBodyString,
      matched: matcherResult?.matched,
    };
    ioRequest(ioRequestParams);

    // 暂时不支持 br 解码
    if (
      options.headers['accept-encoding'] &&
      (options.headers['accept-encoding'].includes('br') || options.headers['accept-encoding'].includes('gzip'))
    ) {
      delete options.headers['accept-encoding'];
    }
    const fetch = request(options);
    const isDraftMethod = matcherResult?.rule?.response?.name === 'draft';
    const isStaticFile = checkIsStaticFile(req.url);
    const useTextResponse = disableCache && isStaticFile;
    const decodeResponse = !!debug || useTextResponse || isDraftMethod;

    fetch
      .on('response', function (response) {
        let headers: any = omit(
          { ...response.headers, ...responseHeaders },
          isArray(matcherResult?.rule?.excludeResponseHeaders) ? matcherResult?.rule?.excludeResponseHeaders || [] : [],
        );
        // 去掉headers key的空格
        headers = fromPairs(toPairs(headers).map((arr) => [arr[0].trim(), arr[1]]));
        // 禁用缓存，需要把response header里面的缓存相关的key移除
        if (disableCache) {
          headers = omit(headers, ['cache-control', 'date', 'Date', 'etag', 'last-modified', 'age', 'content-md5']);
        }
        const encoding = get(headers, '["content-encoding"]');
        const isGzip = encoding === 'gzip';
        const showContent = isInspectContentType(headers || {});
        const ip = response?.socket?.remoteAddress;
        const statusCode = response?.statusCode || 500;

        !decodeResponse && res.writeHead(statusCode, headers);

        if (showContent) {
          const body: Buffer[] = [];
          response.on('data', (d: Buffer) => body.push(d));
          response.on('end', () => {
            const buf = Buffer.concat(body);
            let str: any = buf;
            if (isGzip) {
              str = pako.ungzip(new Uint8Array(buf), { to: 'string' });
            } else {
              str = buf.toString();
            }

            // 调试模式
            if (debug) {
              str = insertScriptsToHTML(str, debug);
            }
            // 草稿模式
            if (isDraftMethod) {
              try {
                const json = parseJSON(str);
                (matcherResult as any).rule.response(json);
                str = JSON.stringify(json);
              } catch (err) {
                try {
                  str = (matcherResult as any).rule.response(str);
                } catch (error) {
                  logger.info(error);
                }
              }
            }

            if (decodeResponse) {
              headers = {
                ...headers,
                'content-length': isGzip ? buf.length : str.length,
              };
              if (debug) {
                headers[`${bproxyPrefixHeader}-debug`] = true;
              }
              if (isDraftMethod) {
                headers[`${bproxyPrefixHeader}-draft`] = true;
              }
              if (useTextResponse) {
                headers[`${bproxyPrefixHeader}-disable-cache`] = true;
              }

              delete headers['content-encoding'];
              delete headers['accept-ranges'];
              headers['content-length'] = Buffer.from(str).byteLength;
              res.writeHead(statusCode, headers);
              responseText(str, res);
            }
            ioRequest({
              ...ioRequestParams,
              requestId: req.$requestId,
              responseHeaders: headers,
              responseBody: str,
              statusCode,
              ip,
            });
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
        logger.info('fetch-error', options.url, err.message);
        res.writeHead(500, {});
        res.end(err.message);
        ioRequest({
          requestId: req.$requestId,
          statusCode: 500,
        });
      });

    !decodeResponse && fetch.pipe(res);
  });
}
