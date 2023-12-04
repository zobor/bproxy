import chalk from 'chalk';
import http from 'http';
import https from 'https';
import http2 from 'http2';
import * as url from 'url';
import * as packageJson from '../../package.json';
import { isLocalServerRequest } from '../utils/is';
import { guid } from '../utils/utils';
import Certificate from './certifica';
import config from './config';
import httpMiddleware from './httpMiddleware';
import httpsMiddleware from './httpsMiddleware';
import { wsApi, wss } from './socket/socket';
import { staticServer } from './staticServer';
import { getLocalIpAddress } from './utils/ip';

const pkg: any = packageJson;

// 设置请求id
function setRequestId(req: any) {
  req.$requestId = req.$requestId || guid();
}

// 拦截http请求
export function httpProxy(req, res, certConfig) {
  if (isLocalServerRequest(req.url || '')) {
    staticServer(req, res, certConfig);
  } else {
    setRequestId(req);
    httpMiddleware.proxy(req, res);
  }
}

// 拦截https请求
export function httpsProxy(req, socket, head) {
  setRequestId(req);
  httpsMiddleware.proxy(req, socket, head);
}

// 拦截websocket请求
export function websocketProxy(req, socket, head) {
  const urlObj: any = url.parse(req.url, true);
  const pathname = urlObj.pathname.split('/');

  const type = pathname[1];
  const id = pathname[2];

  setRequestId(req);

  if (type === 'target' || type === 'client') {
    wss.handleUpgrade(req, socket, head, (ws: any) => {
      ws.type = type;
      ws.id = id;
      const q: any = urlObj.query;
      switch (type) {
        case 'target':
          Object.assign(ws, {
            pageURL: q.url,
            title: q.title,
            favicon: q.favicon,
            ua: q.ua,
          });
          break;
        default:
          ws.target = q.target;
      }
      wss.emit('connection', ws, req);
    });
  } else if (type === 'data') {
    wss.handleUpgrade(req, socket, head, wsApi);
  } else {
    httpsMiddleware.ws(req, socket, head);
  }
}

export function afterLocalServerStartSuccess() {
  const [ip] = getLocalIpAddress();
  console.log(
    [
      `${chalk.gray('✔')} bproxy[${chalk.green(pkg.version)}] 启动成功✨`,
      `${chalk.gray('✔')} 操作面板地址：${chalk.magenta(`http://localhost:${config.port}`)}`,
      ip
        ? `${chalk.gray('✔')} 手机端远程调试代理配置： IP:${chalk.magenta(ip)}\t端口:${chalk.magenta(config.port)}`
        : '',
    ]
      .filter((item) => item)
      .join('\n'),
  );
}

export function startLocalServer2(certConfig, config) {
  const server = http.createServer((req, res) => {
    httpProxy(req, res, certConfig);
  });

  server.listen(config.port, () => {
    // https
    server.on('connect', httpsProxy);
    // ws
    server.on('upgrade', websocketProxy);
  });
  return server;
}

export function startLocalServer3(certConfig, config) {
  const certInstance = new Certificate();
  const { certPem, keyPem } = certInstance.createFakeCertificateByDomain('localhost');
  const server = https.createServer(
    {
      key: keyPem,
      cert: certPem,
    },
    (req, res) => {
      console.log(1111, req.url, req.headers);
      httpProxy(req, res, certConfig);
    },
  );

  server.listen(config.port, () => {
    // https
    server.on('connect', (req, socket, head) => {
      console.log(2222, req.url);
      httpsProxy(req, socket, head);
    });
    // ws
    server.on('upgrade', websocketProxy);
  });
  return server;
}

export function startLocalServer4(certConfig, config) {
  const certInstance = new Certificate();
  const { certPem: cert, keyPem: key } = certInstance.createFakeCertificateByDomain('localhost');
  const server = http2.createSecureServer({ cert, key });

  // server.on('request', (req, res) => {
  //   console.log(1111, req.url, req.headers);
  //   httpProxy(req, res, certConfig);
  // });

  server.on('error', (err) => console.error(err));

  server.on('stream', (stream, headers, flags) => {
    const path = headers[':path'];
    stream.respond({
      'content-type': 'text/html; charset=utf-8',
      ':status': 200,
    });
    stream.end('111');
  });

  server.listen(config.port, () => {
    // https
    // server.on('connect', (req, socket, head) => {
    //   console.log(3333, req);
    //   httpsProxy(req, socket, head);
    // });
    // // ws
    // server.on('upgrade', websocketProxy);
  });
  return server;
}

export const startLocalServer = startLocalServer2;
