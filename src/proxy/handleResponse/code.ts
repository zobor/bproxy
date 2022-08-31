/*
 * @Date: 2022-06-24 21:36:22
 * @LastEditors: 张恒 nodejs.js@gmail.com
 * @LastEditTime: 2022-08-13 18:04:33
 * @FilePath: /bp/src/proxy/handleResponse/code.ts
 */
import { ioRequest } from '../socket/socket';
import { delay } from '../utils/utils';

export async function responseByCode(params: Bproxy.HandleResponseParams) {
  const { req, res, postBodyData, delayTime, matcherResult, responseHeaders, requestHeaders } =
    params;
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
  ioRequest({
    requestId: req.$requestId,
    url,
    method: req.method,
    statusCode: matcherResult.rule.statusCode,
    responseBody: '',
    responseHeaders,
  });
  res.writeHead(matcherResult.rule.statusCode, {});
  res.end();
}
