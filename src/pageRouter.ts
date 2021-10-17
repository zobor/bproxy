import * as fs from 'fs';

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

<h1><a href="/install">安装证书</a></h1>
</body>
</html>
`;

const inspectResponse = (req, res) => {
  const urlMap = {
    '/inspect': './inspect/index.html',
  };
  const filepath = (urlMap[req.url] || req.url).replace(/^\//, './');

  try {
    if (!fs.existsSync(filepath)) {
      throw 404;
    }
    const readStream = fs.createReadStream(filepath);
    res.writeHead(200, {});
    readStream.pipe(res);
  } catch(err) {
    res.writeHead(404, {});
    res.end('404');
  }
};

export const requestJac = (req, res, certConfig) => {
  switch (req.url) {
    case '/':
      res.end(html);
      break;

    case '/install':
      try {
        const readStream = fs.createReadStream(certConfig.certPath);
        res.writeHead(200, {
          'content-type': 'application/x-x509-ca-cert; charset=utf-8',
        });
        readStream.pipe(res);
      } catch(err) {
        res.writeHead(404, {});
        res.end('404');
      }
      break;
    default:
      if (req.url.startsWith('/inspect')) {
        inspectResponse(req, res);
        return;
      }
      res.end('404');
      break;
  }
};
