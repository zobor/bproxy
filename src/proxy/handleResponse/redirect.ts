import * as url from 'url';
import { bproxyPrefixHeader } from '../config';
import { delay } from '../utils/utils';
import { responseByRequest } from './request';


export async function responseByRedirect(params: Bproxy.HandleResponseParams) {
  const { req, res, postBodyData, delayTime, matcherResult, responseHeaders, config } =
    params;

  req.requestOriginUrl = req.url;
  req.url = matcherResult.rule.redirectTarget || matcherResult.rule.redirect;
  const httpsURL = req.httpsURL || req.requestOriginUrl;
  const redirectUrlParam = url.parse(req.url);
  if (redirectUrlParam.host && req.headers) {
    req.headers.host = redirectUrlParam.host;
  }
  const requestOption = {
    headers: matcherResult.rule.requestHeaders || {},
  };

  responseHeaders[`${bproxyPrefixHeader}-redirect`] = req.url;
  responseHeaders[`${bproxyPrefixHeader}-redirect-origin-url`] = httpsURL || '';

  if (delayTime) {
    await delay(delayTime);
  }

  return responseByRequest(
    req,
    res,
    requestOption,
    responseHeaders,
    matcherResult,
    config,
    postBodyData
  );
}
