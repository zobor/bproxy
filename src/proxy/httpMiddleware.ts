import { isFunction, isString } from 'lodash';
import { responseByCode } from './handleResponse/code';
import { responseLocalFile, responseLocalPath } from './handleResponse/file';
import { responseByFunction } from './handleResponse/function';
import { responseByHost } from './handleResponse/host';
import { responseByProxy } from './handleResponse/proxy';
import { responseByRedirect } from './handleResponse/redirect';
import { responseByRequest } from './handleResponse/request';
import { responseByString } from './handleResponse/string';
import { matcher } from './matcher';
import dataset from './dataset';
import { getDalay, getPostBody } from './utils/request';
import { delay } from '../utils/utils';
import responseByDraft from './handleResponse/draft';
import logger from './logger';

export default class httpMiddleware {
  static async proxy(req: any, res: any): Promise<number> {
    const { config } = dataset;
    const { rules = [] } = config;
    const matcherResult = matcher(rules, req.httpsURL || req.url);
    const responseOptions = {
      headers: {},
    };
    let requestHeaders = req.headers;
    const delayTime = getDalay(matcherResult?.rule, config);
    const isPostOrPutMethod = ['post', 'put'].includes(req.method.toLowerCase());
    let postBodyData: Buffer | undefined = undefined;
    let postBodyString = '';

    if (isPostOrPutMethod) {
      const [rs1, rs2] = await getPostBody(req);
      postBodyData = rs1;
      postBodyString = rs2 || rs1.toString();
    }

    if (matcherResult.matched) {
      return new Promise(async () => {
        if (!matcherResult.rule) return;
        if (matcherResult?.responseHeaders) {
          responseOptions.headers = {
            ...responseOptions.headers,
            ...matcherResult.responseHeaders,
          };
        }
        if (matcherResult?.rule?.responseHeaders) {
          responseOptions.headers = {
            ...responseOptions.headers,
            ...matcherResult.rule.responseHeaders,
          };
        }

        if (matcherResult?.rule?.requestHeaders) {
          requestHeaders = {
            ...requestHeaders,
            ...matcherResult.rule.requestHeaders,
          };
        }

        const responseHandleParams = {
          req,
          res,
          responseHeaders: responseOptions.headers,
          requestHeaders,
          delayTime,
          matcherResult,
          postBodyData,
          postBodyString,
          config,
        };

        // file
        if (matcherResult.rule.file) {
          return responseLocalFile(responseHandleParams);
        }
        // path
        else if (matcherResult.rule.path) {
          return responseLocalPath(responseHandleParams);
        }
        // function
        else if (isFunction(matcherResult.rule.response)) {
          if (matcherResult.rule.response.name === 'draft') {
            return responseByDraft(responseHandleParams);
          }
          return responseByFunction(responseHandleParams);
        }
        // 3.2.  rule.response.string
        else if (isString(matcherResult.rule.response)) {
          return responseByString(responseHandleParams);
        }
        // rule.statusCode
        else if (matcherResult.rule.statusCode) {
          return responseByCode(responseHandleParams);
        }
        // network response
        // 4. rule.redirect
        else if (isString(matcherResult.rule.redirect)) {
          return responseByRedirect(responseHandleParams);
        }
        // rule.proxy
        else if (isString(matcherResult.rule.proxy)) {
          return responseByProxy(responseHandleParams);
        }
        // rule.host
        else if (isString(matcherResult.rule.host)) {
          return responseByHost(responseHandleParams);
        }
        // yapi
        else if (matcherResult.rule.yapi) {
          const origin = matcherResult.rule.yapiHost || 'http://yapi.dz11.com/mock';
          const matchedPath: string = req.url.match(matcherResult.rule.regx)[0];
          const url = `${origin}/${matcherResult.rule.yapi}${
            matchedPath.startsWith('/') ? matchedPath : `/${matchedPath}`
          }`;
          logger.info('yapi mock origin url:', url);

          matcherResult.rule.redirect = url;

          return responseByRedirect(responseHandleParams);
        } else {
          if (delayTime) {
            await delay(delayTime);
          }
          return responseByRequest(
            req,
            res,
            {},
            responseOptions.headers,
            matcherResult,
            config,
            postBodyData,
            postBodyString,
          );
        }
      });
    }

    if (delayTime) {
      await delay(delayTime);
    }
    return responseByRequest(req, res, {}, responseOptions.headers, {}, config, postBodyData, postBodyString);
  }
}
