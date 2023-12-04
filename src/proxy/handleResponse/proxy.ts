import { delay } from '../../utils/utils';
import { bproxyPrefixHeader } from '../config';
import { responseByRequest } from './request';

export async function responseByProxy(params: Bproxy.HandleResponseParams) {
  const { req, res, postBodyData, postBodyString, delayTime, matcherResult, responseHeaders, config } = params;
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
    postBodyData,
    postBodyString,
  );
}
