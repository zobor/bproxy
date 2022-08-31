import * as fs from 'fs';
import * as path from 'path';
import { ioRequest } from '../socket/socket';
import { getFileTypeFromSuffix, getResponseContentType } from '../utils/file';
import { delay, safeDecodeUrl } from '../utils/utils';
import { bproxyPrefixHeader } from './../config';
import { responseText } from './text';

function responseByLocalFile(
  filepath: string,
  res: any,
  responseHeaders: any = {},
  req: any
): void {
  try {
    fs.accessSync(filepath, fs.constants.R_OK);
    const readStream = fs.createReadStream(filepath);
    const suffix = getFileTypeFromSuffix(filepath);
    const fileContentType = getResponseContentType(suffix);
    if (fileContentType && !responseHeaders['content-type']) {
      responseHeaders['content-type'] = fileContentType;
    }
    res.writeHead(200, responseHeaders);

    let responseBody = '不支持预览';
    if (['json', 'js', 'css', 'html', 'svg'].includes(suffix)) {
      responseBody = fs.readFileSync(filepath, 'utf-8');
    }

    ioRequest({
      method: req.method,
      requestId: req.$requestId,
      responseHeaders: {
        ...responseHeaders,
        [`${bproxyPrefixHeader}-file`]: filepath,
      },
      statusCode: 200,
      responseBody,
      url: req.httpsURL || req.requestOriginUrl || req.url,
    });

    readStream.pipe(res);
  } catch (err) {
    console.log(err);
    res.writeHead(404, {
      'content-type': 'text/html; charset=utf-8;'
    });
    responseText(`<div style="color:red;">404: Not Found or Not Access:
      (${filepath}).
      <br>Error: ${JSON.stringify(err)}
    </div>`, res);
    ioRequest({
      method: req.method,
      requestId: req.$requestId,
      responseHeaders,
      statusCode: 404,
      url: req.httpsURL || req.requestOriginUrl || req.url,
    });
  }
}

export async function responseLocalFile(params: Bproxy.HandleResponseParams) {
  const { req, res, postBodyData, delayTime, matcherResult, responseHeaders, requestHeaders } =
    params;

  ioRequest({
    matched: true,
    requestId: req.$requestId,
    url: req.httpsURL || req.requestOriginUrl || req.url,
    method: req.method,
    requestHeaders: requestHeaders,
    requestBody: postBodyData?.toString(),
  });
  if (delayTime) {
    await delay(delayTime);
  }
  const filepath = path.resolve(matcherResult.rule.file);
  responseByLocalFile(
    safeDecodeUrl(filepath),
    res,
    responseHeaders,
    req
  );
}

export async function responseLocalPath(params) {
  const { req, res, postBodyData, delayTime, matcherResult, responseHeaders, requestHeaders } =
    params;
  ioRequest({
    matched: true,
    requestId: req.$requestId,
    url: req.httpsURL || req.requestOriginUrl || req.url,
    method: req.method,
    statusCode: matcherResult.rule.statusCode,
    requestHeaders: requestHeaders,
    requestBody: postBodyData?.toString(),
  });
  if (delayTime) {
    await delay(delayTime);
  }
  const filepath = path.resolve(matcherResult.rule.path, matcherResult.rule.filepath || '');
  responseByLocalFile(
    safeDecodeUrl(filepath),
    res,
    responseHeaders,
    req
  );
}
