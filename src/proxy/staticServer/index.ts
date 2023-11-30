import * as fs from 'fs';
import * as path from 'path';
import url from 'url';
import { getResponseContentType } from '../../utils/check';
import { rootPath, webRelativePath } from '../config';

const webPublic = 'web-build';
const webBaseUrl = '/web';
const webPageHTML = "<script>window.location.replace('/web/');</script>";

function calcCharRepeatCount(str: string, c: string) {
  let count = 0;
  str.split('').map((item) => {
    if (item === c) {
      count += 1;
    }
  });

  return count;
}

const inspectResponse = (req, res) => {
  const isTemplageRequest =
    (req.url.startsWith(webBaseUrl) && calcCharRepeatCount(req.url, '/') === 2) || req.url === webBaseUrl;
  const filepath = isTemplageRequest
    ? path.resolve(__dirname, `${webRelativePath}${webPublic}/index.html`)
    : path.resolve(__dirname, req.url.replace(/^\/web\//, `${webRelativePath}${webPublic}/`));

  try {
    if (!fs.existsSync(filepath)) {
      throw new Error(`file not found: ${filepath}`);
    }
    const readStream = fs.createReadStream(filepath);
    const headers = {};
    if (filepath.includes('.html')) {
      headers['content-type'] = 'text/html; charset=utf-8';
    } else if (filepath.includes('.js')) {
      headers['content-type'] = 'text/javascript; charset=utf-8';
    } else if (filepath.includes('.css')) {
      headers['content-type'] = 'text/css; charset=utf-8';
    } else if (filepath.includes('.svg')) {
      headers['content-type'] = 'image/svg+xml';
    }
    res.writeHead(200, headers);
    readStream.pipe(res);
  } catch (err) {
    res.writeHead(404, {});
    res.end(`404\n${filepath}`);
  }
};

function httpServer(req, res) {
  const headers = {};
  const { pathname = '' } = url.parse(req.url);
  const $404 = () => {
    res.writeHead(404, headers);
    res.end('404');
  };
  if (!pathname) {
    $404();
    return;
  }
  let localFile = path.resolve(rootPath, pathname.slice(1));
  // 目录，查找html入口文件
  if (pathname.endsWith('/')) {
    localFile = path.resolve(localFile, 'index.html');
    if (!fs.existsSync(localFile)) {
      $404();
      return;
    }
  }

  if (fs.existsSync(localFile)) {
    const fileSuffix = localFile.slice(localFile.lastIndexOf('.') + 1);
    const contentType = getResponseContentType(fileSuffix);
    if (contentType) {
      headers['content-type'] = contentType;
    }
    res.writeHead(200, headers);
    fs.createReadStream(localFile).pipe(res);
  } else {
    $404();
  }
}

export const staticServer = (req: any, res: any, certConfig: any) => {
  if (req.url.startsWith('/static/')) {
    return httpServer(req, res);
  }
  switch (req.url) {
    case '/':
      res.end(webPageHTML);
      break;

    case '/install':
      try {
        const readStream = fs.createReadStream(certConfig.certPath);
        res.writeHead(200, {
          'content-type': 'application/x-x509-ca-cert; charset=utf-8',
          'Content-Disposition': 'attachment;filename=bproxy.ca.cer',
        });
        readStream.pipe(res);
      } catch (err) {
        res.writeHead(404, {});
        res.end('404');
      }
      break;

    default:
      if (req.url.startsWith('/web') || req.url.startsWith(webBaseUrl)) {
        inspectResponse(req, res);
        return;
      }
      res.end('404');
      break;
  }
};
