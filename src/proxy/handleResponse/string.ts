import { bproxyPrefixHeader } from './../config';
import { ioRequest } from '../socket/socket';
import { isLikeJson } from '../utils/check';
import { delay } from '../utils/utils';
import { responseText } from './text';

export async function responseByString(params: Bproxy.HandleResponseParams) {
  const {
    req,
    res,
    postBodyData,
    delayTime,
    matcherResult,
    responseHeaders: respHeaders,
    requestHeaders
  } = params;
  const url = req.httpsURL || req.requestOriginUrl || req.url;
  ioRequest({
    matched: true,
    requestId: req.$requestId,
    url,
    method: req.method,
    requestHeaders,
    requestBody: postBodyData?.toString(),
  });
  if (delayTime) {
    await delay(delayTime);
  }
  const responseHeaders = {
    ...respHeaders,
    'content-type': isLikeJson(matcherResult.rule.response)
      ? 'application/json'
      : 'text/html',
    [`${bproxyPrefixHeader}-string`]: true,
  };
  ioRequest({
    requestId: req.$requestId,
    url,
    method: req.method,
    statusCode: matcherResult.rule.statusCode || 200,
    responseHeaders: {
      ...responseHeaders,
    },
    responseBody: matcherResult.rule.response,
  });
  res.writeHead(200, responseHeaders || {});
  responseText(matcherResult.rule.response, res);
}
