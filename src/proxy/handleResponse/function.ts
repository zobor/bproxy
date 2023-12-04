import { bproxyPrefixHeader } from './../config';
import { isString, isUndefined } from 'lodash';
import { isObject } from '../../utils/is';
import { ioRequest } from '../socket/socket';
import request from 'request';
import { isPromise } from '../../utils/is';
import { delay } from '../../utils/utils';

export async function responseByFunction(params: Bproxy.HandleResponseParams) {
  const { req, res, postBodyData, delayTime, matcherResult, responseHeaders, requestHeaders } = params;

  const requestUrl = req.httpsURL || req.requestOriginUrl || req.url;

  ioRequest({
    matched: true,
    requestId: req.$requestId,
    url: requestUrl,
    method: req.method,
    requestHeaders,
    requestBody: postBodyData?.toString(),
  });
  if (delayTime) {
    await delay(delayTime);
  }
  const rs = matcherResult.rule.response({
    req,
    response: res,
    fetch: request,
    request: req,
    rules: matcherResult?.rule,
    body: postBodyData,
  });
  let resData: any;
  if (isPromise(rs)) {
    resData = await rs;
  } else {
    resData = rs;
  }

  responseHeaders[`${bproxyPrefixHeader}-function`] = true;

  if (isUndefined(resData)) {
    ioRequest({
      requestId: req.$requestId,
      url: requestUrl,
      method: req.method,
      responseBody: 'function 方式代理中，无法查看内容',
      statusCode: 200,
      responseHeaders,
    });
    return;
  }
  const resDestructObject = isObject(resData)
    ? resData
    : {
        data: isString(resData) ? resData : JSON.stringify(resData),
        headers: {},
        statusCode: 200,
      };
  const { data, headers, statusCode = 200 } = resDestructObject;
  const respHeaders = {
    ...(headers || {
      'content-type': 'bproxy/log',
    }),
    ...responseHeaders,
  };
  ioRequest({
    requestId: req.$requestId,
    url: requestUrl,
    method: req.method,
    responseBody: data,
    statusCode: statusCode,
    responseHeaders: respHeaders,
  });
  res.writeHead(statusCode, respHeaders);
  res.end(data);
}
