import { ioRequest } from './socket';
import * as net from "net";
import * as https from "https";
import * as tls from "tls";
import * as url from "url";
import * as forge from "node-forge";
import * as fs from "fs";
import Certificate from "./certifica";
import { httpMiddleware } from "./httpMiddleware";
import { createHttpHeader, utils } from "./utils/utils";
import { ProxyConfig } from "../types/proxy";

const { pki } = forge;
let certInstance;
let cert;
let certificatePem;
let certificateKeyPem;
let localCertificate;
let localCertificateKey;

const isHttpsHostRegMatch = (httpsList, hostname): boolean => {
  let rs;
  for (let i = 0, len = httpsList.length; i < len; i++) {
    if (rs) {
      break;
    }
    const httpsItem = httpsList[i];
    if (typeof httpsItem === 'string') {
      rs = httpsItem === hostname;
    } else {
      rs = httpsItem.test(hostname.replace(':443'));
    }
  }
  return rs;
};

interface CertConfig {
  certPath: string;
}

export default {
  beforeStart (): CertConfig {
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
    const host = (urlParsed.host || '').replace(/:\d+/, '');

    this.startLocalHttpsServer(urlParsed.hostname, config, req, socket, head).then(localHttpsPort => {
      const isHttpsMatch = sslAll || isHttpsHostRegMatch(httpsList, host);
      if ( isHttpsMatch ) {
        this.web(socket, head, '127.0.0.1', localHttpsPort);
      } else {
        this.web(socket, head, urlParsed.hostname, urlParsed.port);
      }
    });
  },

  web(socket, head, hostname, port): void {
    const socketAgent = net.connect(port, hostname, () => {
      const agent = "bproxy Agent";
      socket
        .on("error", (err) => {
          // todo
          console.log("net error", err);
          socketAgent.end();
        })
        .write(
          createHttpHeader("HTTP/1.1 200 Connection Established", {
            "Proxy-agent": `${agent}`,
          })
        );

      socketAgent.write(head);
      socketAgent.pipe(socket).pipe(socketAgent);
    });
    socketAgent.on("error", e => {
      console.error('socketAgent error', JSON.stringify({ err: e.message, hostname, port }).slice(0, 100));
    });
  },

  startLocalHttpsServer(hostname, config: ProxyConfig, req, socket, head): Promise<number> {
    return new Promise(resolve => {
      const certificate = certInstance.createFakeCertificateByDomain(
        localCertificate,
        localCertificateKey,
        hostname
      );
      const certPem = pki.certificateToPem(certificate.cert);
      const keyPem = pki.privateKeyToPem(certificate.key);
      const localServer = new https.Server({
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
        }
      });
      localServer.listen(0, () => {
        const localAddress = localServer.address();
        if (typeof localAddress === "string" || !localAddress) {
          console.error('https server error: ', localAddress);
          return;
        }
        resolve(localAddress.port);
      });
      localServer.on("request", (req, res) => {
        const $req = req as any;
        $req.httpsURL = `https://${hostname}${req.url}`;
        $req.url = `http://${hostname}${req.url}`;
        $req.protocol = "https";
        if (!$req.$requestId) {
          $req.$requestId = utils.guid();
        }
        httpMiddleware.proxy(req, res, config);
      });
      // websocket
      localServer.on('upgrade', (proxyReq, proxySocket, proxyHead) => {
          if (proxyReq.method !== "GET" || !proxyReq.headers.upgrade) {
            proxySocket.destroy();
            return true;
          }

          if (proxyReq.headers.upgrade.toLowerCase() !== "websocket") {
            proxySocket.destroy();
            return true;
          }
          const options = {
              host: hostname,
              hostname,
              port: 443,
              headers: proxyReq.headers,
              method: 'GET',
              rejectUnauthorized: true,
              agent: false,
              path: proxyReq.url,
          };
          if (!proxyReq.$requestId) {
            proxyReq.$requestId = utils.guid();
          }
          ioRequest({
            url: `${proxyReq.headers?.origin}${proxyReq.url}`,
            method: 'ws',
            requestHeader: proxyReq.headers,
            requestId: proxyReq.$requestId,
          });
          const wsRequest = https.request(options);
          wsRequest.on('upgrade', (r1, s1, h1) => {
              const writeStream = createHttpHeader('HTTP/1.1 101 Switching Protocols', r1.headers);
              s1.on('data', d => {
                ioRequest({
                  requestId: proxyReq.$requestId,
                  responseBody: d,
                  statusCode: 101,
                });
              });
              s1.on('end', () => {
                console.log('end');
              })
              proxySocket.write(writeStream);
              proxySocket.write(h1);
              s1.pipe(proxySocket).pipe(s1);
          });
          wsRequest.end();
      });
      localServer.on("error", err => {
        console.error("localServer.error", err.toString().slice(0, 100));
      });
      localServer.on("clientError", e => {
        console.error(`localServer.clientError(${hostname})`, JSON.stringify(e).slice(0, 100));
      });

    });
  }
};
