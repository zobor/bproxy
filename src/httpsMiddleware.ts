import * as net from "net";
import * as https from "https";
import * as tls from "tls";
import * as url from "url";
import * as forge from "node-forge";
import * as fs from "fs";
import * as _ from 'lodash';
import Certificate from "./certifica";
import { IConfig } from '../types/config';
import { httpMiddleware } from "./httpMiddleware";

const { pki } = forge;
let certInstance;
let cert;
let certificatePem;
let certificateKeyPem;
let localCertificate;
let localCertificateKey;

const isHttpsHostRegMatch = (httpsList, hostname) => {
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

export default {
  beforeStart (): void{
    certInstance = new Certificate();
    cert = certInstance.init();
    certificatePem = fs.readFileSync(cert.caCertPath);
    certificateKeyPem = fs.readFileSync(cert.caKeyPath);
    localCertificate = pki.certificateFromPem(certificatePem);
    localCertificateKey = pki.privateKeyFromPem(certificateKeyPem);
  },

  // https代理入口
  proxy(req: any, socket: any, head: any, config: IConfig): void {
    const { https, sslAll } = config;
    const urlParsed = url.parse(`https://${req.url}`);
    const host = urlParsed.host || '';
    this.startLocalHttpsServer(urlParsed.hostname, config).then(localHttpsPort => {
      const isHttpsMatch = sslAll || isHttpsHostRegMatch(https, host);
      console.log('isHttpsMatch', isHttpsMatch, 'host', host);
      if ( isHttpsMatch ) {
        this.web(socket, head, '127.0.0.1', localHttpsPort);
      } else {
        this.web(socket, head, urlParsed.hostname, urlParsed.port);
      }
    });
  },

  web(socket, head, hostname, port) {
    const socketAgent = net.connect(port, hostname, () => {
      const agent = "bproxy Agent";
      socket.on("error", () => {
        // todo
        socketAgent.end();
      })
        .write([
          "HTTP/1.1 200 Connection Established\r\n",
          `Proxy-agent: ${agent}\r\n`,
          "\r\n"].join(""));

      socketAgent.write(head);
      socketAgent.pipe(socket);
      socket.pipe(socketAgent);
    });
    socketAgent.on("error", e => {
      console.error('socketAgent error', JSON.stringify({ err: e.message, hostname, port }));
    });
  },

  startLocalHttpsServer(hostname, config: IConfig): Promise<number> {
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
        SNICallback: (host, done) => {
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
        req.httpsURL = `https://${hostname}${req.url}`;
        req.url = `http://${hostname}${req.url}`;
        req.protocol = "https";
        httpMiddleware.proxy(req, res, config);
      });
      localServer.on("error", err => {
        console.error("localServer.error", err);
      });
      localServer.on("clientError", e => {
        // console.error(`localServer.clientError(${hostname})`, JSON.stringify(e));
      });
    });
  }
};
