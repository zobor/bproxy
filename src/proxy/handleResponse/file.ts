import * as fs from 'fs';
import * as path from 'path';
import { getFileTypeFromSuffix, getResponseContentType } from '../../utils/check';
import { delay, encodeUnicode, safeDecodeUrl } from '../../utils/utils';
import { ioRequest } from '../socket/socket';
import { insertScriptsToHTML } from '../utils/utils';
import { bproxyPrefixHeader } from './../config';
import { responseText } from './text';

function responseByLocalFile(
  filepath: string,
  res: any,
  $responseHeaders: any = {},
  req: any,
  matcherResult: any,
): void {
  const responseHeaders = { ...$responseHeaders };
  responseHeaders[`${bproxyPrefixHeader}-file`] = filepath.replace(/[^\x00-\xff]/g, (a) => {
    return encodeUnicode(a);
  });
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

    if (matcherResult?.rule?.debug) {
      responseBody = insertScriptsToHTML(responseBody, matcherResult.rule.debug);
    }

    ioRequest({
      method: req.method,
      requestId: req.$requestId,
      responseHeaders: {
        ...responseHeaders,
      },
      statusCode: 200,
      responseBody,
      url: req.httpsURL || req.requestOriginUrl || req.url,
    });

    if (matcherResult?.rule?.debug) {
      responseText(responseBody, res);
    } else {
      readStream.pipe(res);
    }
  } catch (err) {
    console.log(err);
    res.writeHead(404, {
      'content-type': 'text/html; charset=utf-8;',
    });
    responseText(
      `<div style="color:red;">404: Not Found or Not Access:
      (${filepath}).
      <br>Error: ${JSON.stringify(err)}
    </div>`,
      res,
    );
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
  const { req, res, postBodyData, delayTime, matcherResult, responseHeaders, requestHeaders } = params;

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
  responseByLocalFile(safeDecodeUrl(filepath), res, responseHeaders, req, matcherResult);
}

export async function responseLocalPath(params) {
  const { req, res, postBodyData, delayTime, matcherResult, responseHeaders, requestHeaders } = params;
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
  responseByLocalFile(safeDecodeUrl(filepath), res, responseHeaders, req, matcherResult);
}
