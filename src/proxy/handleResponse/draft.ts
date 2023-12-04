import { delay } from '../../utils/utils';
import { bproxyPrefixHeader } from '../config';
import { responseByRequest } from './request';

export default async function responseByDraft(params: Bproxy.HandleResponseParams) {
  const { req, res, postBodyData, postBodyString, delayTime, matcherResult, responseHeaders, config } = params;

  if (delayTime) {
    await delay(delayTime);
  }

  responseHeaders[`${bproxyPrefixHeader}-draft`] = true;

  const requestOptions: any = {};

  if (matcherResult.rule.proxy) {
    requestOptions.proxy = matcherResult.rule.proxy;
  }
  if (matcherResult.rule.host) {
    requestOptions.host = matcherResult.rule.host;
  }

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
