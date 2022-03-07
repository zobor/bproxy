import * as fs from "fs";
import * as http from "http";
import * as https from "https";
import * as net from "net";
import * as forge from "node-forge";
import * as tls from "tls";
import * as url from "url";
import { ProxyConfig } from "../types/proxy";
import Certificate from "./certifica";
import { httpMiddleware } from "./httpMiddleware";
import { matcher } from "./matcher";
import { ioRequest } from "./socket/socket";
import {
  createHttpHeader, isHttpsHostRegMatch,
  log, utils
} from "./utils/utils";

const { pki } = forge;
let certInstance;
let cert;
let certificatePem;
let certificateKeyPem;
let localCertificate;
let localCertificateKey;

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
  proxy(req: any, socket: any, head: any, config: ProxyConfig): void {
    const { https: httpsList, sslAll } = config;
    const urlParsed = url.parse(`https://${req.url}`);
    const isHttpsMatch = sslAll || isHttpsHostRegMatch(httpsList, urlParsed.host);

    // 没有开启https抓取的队列 直接放过 不需要构建代理服务器
    if (!isHttpsMatch) {
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
    ).then(({
      port: localHttpsPort,
      fakeServer
    }) => {
      this.web(socket, head, "127.0.0.1", localHttpsPort, req, {
        originHost: urlParsed.hostname || '',
        originPort: urlParsed.port ? Number(urlParsed.port) : 0,
        fakeServer,
      });
    });
  },

  web(socket, head, hostname, port, req, others: WebOthers = {}): void {
    const $hostname = others.originHost || hostname;
    const $port = others.originPort || port;
    let timer;
    const socketAgent = net.connect(port, hostname, () => {
      const agent = "bproxy Agent";
      socket
        .on("error", (err) => {
          socketAgent.end();
          socketAgent.destroy();
        })
        .write(
          createHttpHeader(
            `HTTP/${req.httpVersion} 200 Connection Established`,
            {
              "Proxy-agent": `${agent}`,
            }
          )
        );

      socketAgent.write(head);
      socketAgent.pipe(socket).pipe(socketAgent);
    });
    socketAgent.on("error", () => {
      log.warn(`[https socket agent error]: ${$hostname} ${$port}`);
      socketAgent.end();
    });
    socketAgent.on('close', () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    })

    // timer = setTimeout(() => {
    //   if (socketAgent.destroyed || others?.fakeServer?.$url || others?.fakeServer?.$upgrade) {
    //     return;
    //   }
    //   others?.fakeServer?.close();
    //   socketAgent?.end();
    //   socketAgent?.destroy();
    //   socket?.end();
    // }, (10 * 1000));
  },

  startLocalHttpsServer(
    hostname,
    config: ProxyConfig,
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
      const localServer = useHttps ? new https.Server(httpsServerConfig) : new http.Server();
      localServer.listen(0, () => {
        const localAddress = localServer.address();
        if (typeof localAddress === "string" || !localAddress) {
          log.warn(`[local server listen error]: ${hostname}`);
          localServer.close();
          return;
        }
        resolve({
          port: localAddress.port,
          fakeServer: localServer,
        });
      });
      localServer.on("request", (req, res) => {
        const $req = req as any;
        $req.httpsURL = `https://${req.headers.host}${req.url}`;
        $req.url = `http://${req.headers.host}${req.url}`;
        $req.protocol = "https";
        if (!$req.$requestId) {
          $req.$requestId = utils.guid();
        }
        httpMiddleware.proxy(req, res, config);
        (localServer as any).$url = $req.httpsURL;
      });
      // websocket
      localServer.on("upgrade", (proxyReq, proxySocket) => {
        if (proxyReq.method !== "GET" || !proxyReq.headers.upgrade || proxyReq.headers.upgrade.toLowerCase() !== "websocket") {
          proxySocket.destroy();
          return true;
        }

        (localServer as any).$upgrade = true;

        const upgradeURL = `${proxyReq.headers.origin}${proxyReq.url}`;
        const matchResult = matcher(config.rules, upgradeURL);
        const options = {
          host: hostname,
          hostname,
          port,
          headers: proxyReq.headers,
          method: "GET",
          rejectUnauthorized: true,
          agent: false,
          path: proxyReq.url,
        };
        const target = matchResult?.rule?.redirectTarget || matchResult?.rule?.redirect;
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
          options.port = config.port;
        }
        if (!proxyReq.$requestId) {
          proxyReq.$requestId = utils.guid();
        }
        if (!isBproxyDev) {
          ioRequest({
            url: `${proxyReq.headers?.origin}${proxyReq.url}`,
            method: proxyReq.headers.origin.includes("https:") ? "wss" : "ws",
            requestHeaders: proxyReq.headers,
            requestId: proxyReq.$requestId,
          });
        }
        const proxyWsHTTPS = (target || proxyReq.headers?.origin)?.indexOf('https:') === 0 && !isBproxyDev;
        const proxyWsServices = proxyWsHTTPS ? https : http;
        const wsRequest = proxyWsServices.request(options);

        wsRequest.on("upgrade", (r1, s1, h1) => {
          const writeStream = createHttpHeader(
            `HTTP/${req.httpVersion} 101 Switching Protocols`,
            r1.headers
          );
          if (!isBproxyDev) {
            s1.on("data", (d) => {
              ioRequest({
                requestId: proxyReq.$requestId,
                responseBody: d.toString(),
                statusCode: 101,
                responseHeaders: {
                  'content-type': 'text/plain-bproxy',
                }
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
      localServer.on("error", () => {
        log.warn(`[local server error]: ${hostname}`);
        localServer.close();
      });
      localServer.on("clientError", (err) => {
        localServer.close();
      });
    });
  },
};
