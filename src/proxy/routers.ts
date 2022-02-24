import * as fs from 'fs';
import * as path from 'path';

export const isLocal = (url: string): boolean => {
  return !(url.startsWith('http') || url.startsWith('https')) && !url.includes('/socket.io/');
}

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bproxy</title>
</head>
<body>
<script>
window.location.replace('/inspect');
</script>
</body>
</html>
`;

const inspectResponse = (req, res) => {
  const filepath = req.url === '/inspect' ? path.resolve(__dirname, '../../index.html') : path.resolve(__dirname, req.url.replace(/^\/dist\//, '../../'));

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
    }  else if (filepath.includes('.svg')) {
      headers['content-type'] = 'image/svg+xml';
    }
    res.writeHead(200, headers);
    readStream.pipe(res);
  } catch(err) {
    res.writeHead(404, {});
    res.end('404');
  }
};

const responseChromeDev = (req, res) => {
  const headers = {};
  let { url } = req;
  url = url.replace(/\?\S+/, '');
  let chromeRoot = path.resolve(__dirname, '../../chrome-dev-tools/');
  if (!fs.existsSync(chromeRoot)) {
    chromeRoot = path.resolve(__dirname, '../../../chrome-dev-tools/');
    if (!fs.existsSync(chromeRoot)) {
      console.log(`文件查找失败：${chromeRoot}`);
      process.exit(0);
    }
  }
  if (url === '/chrome-dev-tools/') {
    const file = fs.createReadStream(path.resolve(chromeRoot, 'devtools_app.html'));
    file.pipe(res);
    headers['content-type'] = 'text/html; charset=utf-8';
    res.writeHead(200, headers);
    return;
  }
  const filename = url.replace('/chrome-dev-tools/', '');
  if (filename.includes('.js')) {
    headers['content-type'] = 'text/javascript; charset=utf-8';
  }else if (filename.includes('.css')) {
    headers['content-type'] = 'text/css; charset=utf-8';
  }  else if (filename.includes('.svg')) {
    headers['content-type'] = 'image/svg+xml';
  }
  const file = fs.createReadStream(path.resolve(chromeRoot, filename));
  file.pipe(res);
  res.writeHead(200, headers);
};

export const requestJac = (req, res, certConfig) => {
  if (req.url.startsWith('/chrome-dev-tools')) {
    return responseChromeDev(req, res);
  }
  switch (req.url) {
    case '/':
      res.end(html);
      break;

    case '/install':
      try {
        const readStream = fs.createReadStream(certConfig.certPath);
        res.writeHead(200, {
          'content-type': 'application/x-x509-ca-cert; charset=utf-8',
          'Content-Disposition': 'attachment;filename=bproxy.ca.cer',
        });
        readStream.pipe(res);
      } catch(err) {
        res.writeHead(404, {});
        res.end('404');
      }
      break;
    default:
      if (req.url.startsWith('/dist') || req.url.startsWith('/inspect')) {
        inspectResponse(req, res);
        return;
      }
      res.end('404');
      break;
  }
};
