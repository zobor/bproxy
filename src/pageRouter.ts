import * as fs from 'fs';

export const isLocal = (url: string): boolean => {
  return ['/', '/install'].includes(url);
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

export const requestJac = (req, res, certConfig) => {
  switch (req.url) {
    case '/':
      res.end(html);
      break;

    case '/install':
      const readStream = fs.createReadStream(certConfig.certPath);
      res.writeHead(200, {
        'content-type': 'application/x-x509-ca-cert; charset=utf-8',
      });
      readStream.pipe(res);
      break;
    default:
      res.end('404');
      break;
  }
};
