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

interface HttpRequest {
  url: string;
  method: string;
  headers: Record<string, string | number | boolean | null>;
  httpsURL?: string;
}

interface HttpResponse {
  setHeader: (name: string, value: string) => void;
  end: (data?: any) => void;
}

export default class httpMiddleware {
  private static async handleDelay(delayTime?: number) {
    if (delayTime) {
      await delay(delayTime);
    }
  }

  static async proxy(req: HttpRequest, res: HttpResponse): Promise<number> {
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
      if (!matcherResult.rule) {
        await this.handleDelay(delayTime);
        return responseByRequest(req, res, {}, responseOptions.headers, {}, config, postBodyData, postBodyString);
      }

      try {
        // 处理headers
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
        else {
          await this.handleDelay(delayTime);
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
      } catch (e) {
        logger.error('Proxy middleware error:', e);
        return 500; // 返回500错误状态码
      }
    }

    await this.handleDelay(delayTime);
    return responseByRequest(req, res, {}, responseOptions.headers, {}, config, postBodyData, postBodyString);
  }
}



