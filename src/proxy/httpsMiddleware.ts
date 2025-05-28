import * as http from 'http';
import * as https from 'https';
import { isBoolean } from 'lodash';
import * as net from 'net';
import * as tls from 'tls';
import * as url from 'url';
import { isHttpsHostRegMatch } from '../utils/check';
import { createHttpHeader } from '../utils/http';
import { guid } from '../utils/utils';
import Certificate from './certifica';
import dataset from './dataset';
import httpMiddleware from './httpMiddleware';
import logger from './logger';
import { matcher } from './matcher';
import parseWebSocketMessage from './socket/parseFrame';
import { ioRequest } from './socket/socket';
import { isHttpsWithIp } from './utils/ip';

// 类型定义集中管理
interface CertConfig {
  certPath: string;
  keyPath: string;
}

interface WebSocketOptions {
  host?: string;
  hostname: string;
  port: string | number;
  path: string;
  headers: http.OutgoingHttpHeaders;
  method?: string;
  rejectUnauthorized?: boolean;
  agent?: boolean;
}

interface WebOthers {
  originHost?: string;
  originPort?: number;
  fakeServer?: http.Server | https.Server;
}

interface LocalServerResponse {
  port: number;
  fakeServer: http.Server | https.Server;
}

// 常量提取
const LOCALHOST = '127.0.0.1';
const BPROXY_DEV = 'bproxy.dev';
const HTTP_VERSION = '1.1';

let certInstance;

export default {
  beforeStart(): CertConfig {
    certInstance = new Certificate();
    const { caCertPath, caKeyPath } = certInstance.init();

    return {
      certPath: caCertPath,
      keyPath: caKeyPath,
    };
  },

  // https代理入口
  proxy(req: any, socket: any, head: any): void {
    const { config } = dataset;
    const { https: httpsList = [] } = config;
    const httpsUrl = `https://${req.url}`;
    const urlParsed = url.parse(httpsUrl);
    // https是否在白名单
    const isHttpsMatch = (isBoolean(httpsList) && httpsList) || isHttpsHostRegMatch(httpsList, urlParsed.host);
    const matcherResult = matcher(config.rules || [], httpsUrl);

    // 不需要构建代理服务器:
    // 1、https不在白名单
    // 2、没有开启https
    // 3、https的url不被规则匹配
    // 4、hostname是IP的
    if ((!isHttpsMatch && !matcherResult?.matched) || isHttpsWithIp(req.url)) {
      ioRequest({
        requestId: req.$requestId,
        url: `https://${urlParsed.hostname}`,
        method: 'connect',
        requestHeaders: {},
        requestBody: '',
      });
      this.web(socket, head, urlParsed.hostname || '', urlParsed.port || 443, req, {
      fakeServer: undefined,
      });
      return;
    }

    this.startLocalHttpsServer(urlParsed.hostname, urlParsed.host, urlParsed.port, config, req, socket, head).then(
      ({ port: localHttpsPort, fakeServer }) => {
        this.web(socket, head, LOCALHOST, localHttpsPort, req, {
          originHost: urlParsed.hostname || '',
          originPort: urlParsed.port ? Number(urlParsed.port) : 0,
          fakeServer,
        });
      },
    );
  },

  web(socket, head, hostname, port, req, others: WebOthers = {}): void {
    const { originHost, originPort } = others;
    const passByLocalServer = !!others.fakeServer;
    const sendToWeb = (ext = {}) => {
      if (!passByLocalServer) {
        ioRequest({
          requestId: req.$requestId,
          method: 'connect',
          statusCode: 200,
          responseHeaders: {},
          responseBody: '',
          ...ext,
        });
      }
    };
    const socketAgent = net.connect(port, hostname, () => {
      const agent = 'bproxy Agent';
      const httpVersion = req.httpVersion;
      sendToWeb({ ip: socketAgent.remoteAddress, requestHeaders: req.headers });
      socket
        .on('error', (err) => {
          socketAgent.end();
          socketAgent.destroy();
        })
        .write(
          createHttpHeader(`HTTP/${httpVersion} 200 Connection Established`, {
            'Proxy-agent': `${agent}`,
          }),
        );

      socketAgent.write(head);
      socketAgent.pipe(socket).pipe(socketAgent);
    });
    socketAgent.on('error', (error) => {
      socketAgent.end();
    });
  },

  startLocalHttpsServer(
    hostname,
    host,
    port: string | number = 443,
    config: BproxyConfig.Config,
    req,
    socket,
    head,
  ): Promise<LocalServerResponse> {
    return new Promise((resolve) => {
      const isBproxyDev = [BPROXY_DEV].includes(hostname);
      const { certPem, keyPem } = certInstance.createFakeCertificateByDomain(hostname);
      const httpsServerConfig = {
        key: keyPem,
        cert: certPem,
        SNICallback: (host, done): void => {
          done(
            null,
            tls.createSecureContext({
              key: keyPem,
              cert: certPem,
            }),
          );
        },
      };

      const useHttps = req?.url?.indexOf(':80') > -1 ? false : true;
      const localServer = useHttps ? new https.Server(httpsServerConfig) : new http.Server();

      localServer.listen(0, () => {
        const localAddress = localServer.address();
        if (typeof localAddress === 'string' || !localAddress) {
          logger.warn(`[local server listen error]: ${hostname}`);
          localServer.close();
          return;
        }
        resolve({
          port: localAddress.port,
          fakeServer: localServer,
        });
      });

      localServer.on('request', (req, res) => {
        const $req = req as any;
        $req.httpsURL = `https://${req.headers.host}${req.url}`;
        $req.url = `http://${req.headers.host}${req.url}`;
        $req.protocol = 'https';
        $req.$requestId = $req.$requestId || guid();
        httpMiddleware.proxy(req, res);
        (localServer as any).$url = $req.httpsURL;
      });

      localServer.on('upgrade', (proxyReq, proxySocket) => {
        if (
          proxyReq.method !== 'GET' ||
          !proxyReq.headers.upgrade ||
          proxyReq.headers.upgrade.toLowerCase() !== 'websocket'
        ) {
          proxySocket.destroy();
          return true;
        }

        const upgradeProtocol = proxyReq.headers.origin?.includes('https:') || port === '443' ? 'wss://' : 'ws://';
        const upgradeURL = `${upgradeProtocol}${port === 443 ? hostname : host}${proxyReq.url}`;

        const matchResult = matcher(config.rules, upgradeURL.replace(':443', '').replace(':80', '')) ||
                          matcher(config.rules, upgradeURL);

        logger.info('upgradeURL', matchResult, upgradeURL);
        const options: WebSocketOptions = {
          host: hostname,
          hostname,
          port,
          headers: proxyReq.headers,
          method: 'GET',
          rejectUnauthorized: false,
          agent: false,
          path: proxyReq.url,
        };

        const target = matchResult?.rule?.redirectTarget || matchResult?.rule?.redirect;
        if (matchResult?.matched && target) {
          const urlParsed = url.parse(target || '');
          const defaultPort = urlParsed.protocol === 'https:' ? 443 : 80;
          if (urlParsed?.hostname) {
            options.host = urlParsed.hostname;
            options.hostname = urlParsed.hostname;
            options.headers.host = urlParsed.hostname || '';
            options.port = urlParsed.port ? parseInt(urlParsed.port) : defaultPort;
          }
        }

        if (isBproxyDev) {
          options.host = LOCALHOST;
          options.hostname = LOCALHOST;
          options.headers.host = LOCALHOST;
          options.port = dataset.config.port;
        }

        proxyReq.$requestId = proxyReq.$requestId || guid();
        if (!isBproxyDev) {
          ioRequest({
            url: upgradeURL,
            method: proxyReq.headers.origin?.includes('https:') ? 'wss' : 'ws',
            requestHeaders: proxyReq.headers,
            requestId: proxyReq.$requestId,
          });
        }

        const proxyWsHTTPS = (target || proxyReq.headers?.origin)?.includes('https:') && !isBproxyDev;
        const proxyWsServices = proxyWsHTTPS ? https : http;
        const wsRequest = proxyWsServices.request(options);

        const sendToWeb = (data: string) => {
          ioRequest({
            requestId: proxyReq.$requestId,
            url: upgradeURL,
            method: proxyReq.headers.origin?.includes('https:') ? 'wss' : 'ws',
            requestHeaders: proxyReq.headers,
            responseBody: JSON.stringify({
              time: +Date.now(),
              data,
            }),
            statusCode: 101,
            responseHeaders: {
              'content-type': 'text/plain-bproxy',
            },
          });
        };

        wsRequest.on('upgrade', (r1, s1, h1) => {
          const writeStream = createHttpHeader(`HTTP/${HTTP_VERSION} 101 Switching Protocols`, r1.headers);
          if (!isBproxyDev) {
            const output: any = [];
            s1.on('data', (frame) => {
              parseWebSocketMessage(frame, output, sendToWeb);
            });
          }
          proxySocket.write(writeStream);
          proxySocket.write(h1);
          s1.pipe(proxySocket).pipe(s1);
        });

        wsRequest.on('error', (err) => {
          logger.error('wsRequest error', upgradeURL, err);
        });
        wsRequest.end();
      });

      localServer.on('error', () => {
        logger.error(`[local server error]: ${hostname}`);
        localServer.close();
      });

      localServer.on('clientError', () => {
        localServer.close();
      });
    });
  },

  ws(req, socket, head) {
    const wsUrl = req.url.replace('http://', 'ws://');
    const urlParse = url.parse(req.url);
    const defaultPort = urlParse.protocol === 'https:' ? 443 : 80;
    const options: WebSocketOptions = {
      hostname: urlParse.hostname || 'localhost',
      port: urlParse.port ? parseInt(urlParse.port) : defaultPort,
      path: urlParse.path || '/',
      headers: {
        ...req.headers,
      },
    };
    logger.info('wsUrl', wsUrl, options);
    const reqProxy = http.request(options);
    reqProxy.on('upgrade', (r1, s1, h1) => {
      logger.info('upgrade', r1.statusCode, wsUrl);
      const writeStream = createHttpHeader(`HTTP/${HTTP_VERSION} ${r1.statusCode} Switching Protocols`, r1.headers);
      socket.write(writeStream);
      socket.write(h1);
      s1.pipe(socket).pipe(s1);
    });
    reqProxy.on('error', (proxyError) => {
      logger.error('ws proxyError', wsUrl, proxyError);
    });
    reqProxy.end();
  },
};



