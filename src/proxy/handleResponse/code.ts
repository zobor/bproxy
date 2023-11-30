import { delay } from '../../utils/utils';
import { ioRequest } from '../socket/socket';

export async function responseByCode(params: Bproxy.HandleResponseParams) {
  const { req, res, postBodyData, delayTime, matcherResult, responseHeaders, requestHeaders } = params;
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
