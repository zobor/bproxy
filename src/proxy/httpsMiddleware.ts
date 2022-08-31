import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import { isBoolean } from 'lodash';
import * as net from 'net';
import * as forge from 'node-forge';
import * as tls from 'tls';
import * as url from 'url';
import Certificate from './certifica';
import httpMiddleware from './httpMiddleware';
import logger from './logger';
import { matcher } from './matcher';
import { ioRequest } from './socket/socket';
import dataset from './utils/dataset';
import { createHttpHeader, isHttpsHostRegMatch, utils } from './utils/utils';

const { pki } = forge;
let certInstance;
let cert;
let certificatePem;
let certificateKeyPem;
let localCertificate;
let localCertificateKey;

const wsFrameFormat = `
Frame format:
​​
      0                   1                   2                   3
      0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
     +-+-+-+-+-------+-+-------------+-------------------------------+
     |F|R|R|R| opcode|M| Payload len |    Extended payload length    |
     |I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
     |N|V|V|V|       |S|             |   (if payload len==126/127)   |
     | |1|2|3|       |K|             |                               |
     +-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
     |     Extended payload length continued, if payload len == 127  |
     + - - - - - - - - - - - - - - - +-------------------------------+
     |                               |Masking-key, if MASK set to 1  |
     +-------------------------------+-------------------------------+
     | Masking-key (continued)       |          Payload Data         |
     +-------------------------------- - - - - - - - - - - - - - - - +
     :                     Payload Data continued ...                :
     + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
     |                     Payload Data continued ...                |
     +---------------------------------------------------------------+
`;

interface CertConfig {
  certPath: string;
}

interface WebOthers {
  originHost?: string;
  originPort?: number;
  fakeServer?: any;
}

export default {
  beforeStart(): CertConfig {
    certInstance = new Certificate();
    cert = certInstance.init();
    certificatePem = fs.readFileSync(cert.caCertPath);
    certificateKeyPem = fs.readFileSync(cert.caKeyPath);
    localCertificate = pki.certificateFromPem(certificatePem);
    localCertificateKey = pki.privateKeyFromPem(certificateKeyPem);

    return {
      certPath: cert.caCertPath,
    };
  },

  // https代理入口
  proxy(req: any, socket: any, head: any): void {
    const { config } = dataset;
    const { https: httpsList = [] } = config;
    const httpsUrl = `https://${req.url}`;
    const urlParsed = url.parse(httpsUrl);
    const isHttpsMatch =
      (isBoolean(httpsList) && httpsList) ||
      isHttpsHostRegMatch(httpsList, urlParsed.host);
    const matcherResult = matcher(config.rules || [], httpsUrl);

    // 没有开启https抓取的队列 直接放过 不需要构建代理服务器
    if (!isHttpsMatch && !matcherResult?.matched) {
      this.web(socket, head, urlParsed.hostname, urlParsed.port, req, {
        fakeServer: null,
      });
      req.$requestId = utils.guid();
      ioRequest({
        requestId: req.$requestId,
        url: `https://${urlParsed.hostname}`,
        method: 'connect',
        requestHeaders: {},
        responseBody: '',
      });
      return;
    }

    this.startLocalHttpsServer(
      urlParsed.hostname,
      config,
      req,
      socket,
      head,
      urlParsed.port
    ).then(({ port: localHttpsPort, fakeServer }) => {
      this.web(socket, head, '127.0.0.1', localHttpsPort, req, {
        originHost: urlParsed.hostname || '',
        originPort: urlParsed.port ? Number(urlParsed.port) : 0,
        fakeServer,
      });
    });
  },

  web(socket, head, hostname, port, req, others: WebOthers = {}): void {
    const socketAgent = net.connect(port, hostname, () => {
      const agent = 'bproxy Agent';
      socket
        .on('error', (err) => {
          socketAgent.end();
          socketAgent.destroy();
        })
        .write(
          createHttpHeader(
            `HTTP/${req.httpVersion} 200 Connection Established`,
            {
              'Proxy-agent': `${agent}`,
            }
          )
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
    config: BproxyConfig.Config,
    req,
    socket,
    head,
    port
  ): Promise<{
    port: number;
    fakeServer: any;
  }> {
    return new Promise((resolve) => {
      const isBproxyDev = ['bproxy.dev', 'bproxy.io'].includes(hostname);
      const certificate = certInstance.createFakeCertificateByDomain(
        localCertificate,
        localCertificateKey,
        hostname
      );
      const certPem = pki.certificateToPem(certificate.cert);
      const keyPem = pki.privateKeyToPem(certificate.key);
      const httpsServerConfig = {
        key: keyPem,
        cert: certPem,
        SNICallback: (host, done): void => {
          done(
            null,
            tls.createSecureContext({
              key: keyPem,
              cert: certPem,
            })
          );
        },
      };
      const useHttps = req?.url?.indexOf(':80') > -1 ? false : true;
      const localServer = useHttps
        ? new https.Server(httpsServerConfig)
        : new http.Server();
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
        if (!$req.$requestId) {
          $req.$requestId = utils.guid();
        }
        httpMiddleware.proxy(req, res);
        (localServer as any).$url = $req.httpsURL;
      });
      // websocket
      localServer.on('upgrade', (proxyReq, proxySocket) => {
        if (
          proxyReq.method !== 'GET' ||
          !proxyReq.headers.upgrade ||
          proxyReq.headers.upgrade.toLowerCase() !== 'websocket'
        ) {
          proxySocket.destroy();
          return true;
        }

        (localServer as any).$upgrade = true;

        const upgradeProtocol =
          proxyReq.headers.origin.indexOf('https:') === 0 || port === '443'
            ? 'wss://'
            : 'ws://';
        const upgradeURL = `${upgradeProtocol}${hostname}${proxyReq.url}`;
        const matchResult = matcher(config.rules, upgradeURL);
        const options = {
          host: hostname,
          hostname,
          port,
          headers: proxyReq.headers,
          method: 'GET',
          rejectUnauthorized: true,
          agent: false,
          path: proxyReq.url,
        };
        const target =
          matchResult?.rule?.redirectTarget || matchResult?.rule?.redirect;
        if (matchResult?.matched && target) {
          const urlParsed = url.parse(target);
          if (urlParsed?.hostname && urlParsed?.port) {
            options.host = urlParsed.hostname;
            options.hostname = urlParsed.hostname;
            options.headers.host = urlParsed.hostname;
            options.port = urlParsed.port;
          }
        }
        if (isBproxyDev) {
          options.host = '127.0.0.1';
          options.hostname = '127.0.0.1';
          options.headers.host = '127.0.0.1';
          options.port = dataset.config.port;
        }
        if (!proxyReq.$requestId) {
          proxyReq.$requestId = utils.guid();
        }
        if (!isBproxyDev) {
          ioRequest({
            url: upgradeURL,
            method: proxyReq.headers.origin.includes('https:') ? 'wss' : 'ws',
            requestHeaders: proxyReq.headers,
            requestId: proxyReq.$requestId,
          });
        }
        const proxyWsHTTPS =
          (target || proxyReq.headers?.origin)?.indexOf('https:') === 0 &&
          !isBproxyDev;
        const proxyWsServices = proxyWsHTTPS ? https : http;
        const wsRequest = proxyWsServices.request(options);

        wsRequest.on('upgrade', (r1, s1, h1) => {
          const writeStream = createHttpHeader(
            `HTTP/${req.httpVersion} 101 Switching Protocols`,
            r1.headers
          );
          if (!isBproxyDev) {
            s1.on('data', (frameData) => {
              const d = frameData;
              const fin = (d[0] & 128) == 128;
              const opcode = d[0] & 15;
              const isMasked = (d[1] & 128) == 128;
              const payloadLength = d[1] & 127;
              const dir = payloadLength === 126 ? 'down' : 'up';

              if (d.length < 2) {
                return;
              }

              const wsFrameContent = d
                .slice(fin ? (payloadLength === 126 ? 4 : 2) : 0)
                .toString();

              ioRequest({
                requestId: proxyReq.$requestId,
                url: upgradeURL,
                method: proxyReq.headers.origin.includes('https:')
                  ? 'wss'
                  : 'ws',
                requestHeaders: proxyReq.headers,
                responseBody: JSON.stringify({
                  message: wsFrameContent,
                  dir,
                }),
                statusCode: 101,
                responseHeaders: {
                  'content-type': 'text/plain-bproxy',
                },
              });
            });
          }
          proxySocket.write(writeStream);
          proxySocket.write(h1);
          s1.pipe(proxySocket).pipe(s1);
        });
        wsRequest.on('error', () => {});
        wsRequest.end();
      });
      localServer.on('error', () => {
        logger.warn(`[local server error]: ${hostname}`);
        localServer.close();
      });
      localServer.on('clientError', () => {
        localServer.close();
      });
    });
  },
};
