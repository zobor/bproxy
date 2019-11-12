// const fs = require('fs');
// const http = require('http');
const HTTPMiddleware = require('./http-middleware');
const _ = require('./common/util');
// const cert = require('./common/cert.js');
// const uiServerPort = require('./config').socketPort;


// function handler(req, res) {
//   if (req.url === '/') {
//     req.url = '/index.html';
//   }
//   if (req.url === '/install') {
//     req.url = '/install.html';
//   }
//   if (req.url === '/settings') {
//     req.url = '/settings.html';
//   }
//   if (req.url === '/cert.crt') {
//     res.writeHead(200, {
//       'Content-Type': 'application/octet-stream',
//     });
//     const certPath = cert.getDefaultCACertPath();
//     _.info(`证书的路径: ${_.color.underline.magenta(certPath)}`);
//     res.end(fs.readFileSync(certPath));
//   }
// }

function proxy(req, res, config) {
  /* eslint no-underscore-dangle: 0 */
  if (!req.__sid__) req.__sid__ = _.newGuid();
  let httpProxy = new HTTPMiddleware({ config });
  let pattern = httpProxy.init(req, res);

  const start = function start() {
    httpProxy.proxy()
      .catch((error) => {
        res.end(error);
      })
      .then((r) => {
        if (r.headers && r.headers.connection === 'close') {
          /* eslint no-param-reassign: 0 */
          delete r.headers.connection;
        }
        res.writeHead(r.statusCode, r.headers);
        res.write(r.body);
        res.end();
        httpProxy = null;
        pattern = null;
      });
  };
  const delay = (pattern && pattern.rule && pattern.rule.delay)
    || (httpProxy.config && httpProxy.config.delay);
  if (delay) {
    setTimeout(start, delay);
  } else {
    start();
  }
}

// const app = http.createServer(handler);
// app.listen(uiServerPort);

module.exports = proxy;
