/*
 * @Date: 2022-07-10 21:36:48
 * @LastEditors: 张恒 nodejs.js@gmail.com
 * @LastEditTime: 2022-08-13 22:50:17
 * @FilePath: /bp/src/proxy/handleResponse/proxy.ts
 */
import { bproxyPrefixHeader } from '../config';
import { delay } from '../utils/utils';
import { responseByRequest } from './request';

export async function responseByProxy(params: Bproxy.HandleResponseParams) {
  const {
    req,
    res,
    postBodyData,
    delayTime,
    matcherResult,
    responseHeaders,
    config,
  } = params;
  if (delayTime) {
    await delay(delayTime);
  }
  const requestOptions = {
    proxy: matcherResult.rule.proxy,
  };

  responseHeaders[`${bproxyPrefixHeader}-host`] = matcherResult.rule.proxy;

  return responseByRequest(
    req,
    res,
    requestOptions,
    responseHeaders,
    matcherResult,
    config,
    postBodyData
  );
}
