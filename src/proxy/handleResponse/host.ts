import { bproxyPrefixHeader } from './../config';
import { delay } from '../utils/utils';
import { responseByRequest } from './request';

export async function responseByHost(params: Bproxy.HandleResponseParams) {
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
    hostname: matcherResult.rule.host,
  };

  responseHeaders[`${bproxyPrefixHeader}-host`] = matcherResult.rule.host;

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
