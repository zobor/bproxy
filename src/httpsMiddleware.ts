import * as net from 'net';
import * as https from 'https';
import * as tls from 'tls';
import * as url from 'url';
import * as forge  from 'node-forge';
import * as fs from 'fs';
import Certificate from './certifica';
import { ICertificateCreateRes } from '../types/certificate';
import { IRule } from '../types/rule';
import httpMiddleware from './httpMiddleware';
import { hostname } from 'os';

const { pki } = forge;
const certInstance = new Certificate()
const cert = certInstance.init();
const certificatePem = fs.readFileSync(cert.caCertPath);
const certificateKeyPem = fs.readFileSync(cert.caKeyPath);
const localCertificate = pki.certificateFromPem(certificatePem);
const localCertificateKey = pki.privateKeyFromPem(certificateKeyPem);


export default {
  proxy(req: any, socket: any, head: any, rules: Array<IRule>): void{
    this.mergeCertificate(hostname, rules).then((localHttpsPort) => {
      const urlParsed = url.parse(`https://${req.url}`);
      this.web(socket, head, urlParsed.hostname, urlParsed.port);
    });
  },

  web(socket, head, hostname, port) {
    const socketAgent = net.connect(port, hostname, () => {
      const agent = 'bproxy Agent';
      socket
        .on('error', (err) => {
          // todo
          console.error(err);
        })
        .write([
          'HTTP/1.1 200 Connection Established\r\n',
          `Proxy-agent: ${agent}\r\n`,
          '\r\n',
        ].join(''));

      socketAgent.write(head);
      socketAgent.pipe(socket);
      socket.pipe(socketAgent);
    });
    // socketAgent.on('data', (e) => { });
    socketAgent.on('error', (e) => {
      console.error({ e, hostname, port });
    });
  },

  mergeCertificate(hostname, rules: Array<IRule>) {
    return new Promise((resolve) => {
      this.requestCertificate(hostname).then((certificate:ICertificateCreateRes) => {
        const certPem = pki.certificateToPem(certificate.cert);
        const keyPem = pki.privateKeyToPem(certificate.key);
        const localServer = new https.Server({
          key: keyPem,
          cert: certPem,
          SNICallback: (host, done) => {
            done(null, tls.createSecureContext({
              key: pki.privateKeyToPem(certificate.key),
              cert: pki.certificateToPem(certificate.cert),
            }));
          },
        });
        const localServerData = {
          cert: certificate.cert,
          key: certificate.key,
          server: localServer,
          port: 0,
        };
        localServer.listen(0, () => {
          const localAddress = localServer.address();
          if (typeof localAddress === 'string' || !localAddress) {
            console.error(localAddress);
            return;
          }
          localServerData.port = localAddress.port;
          resolve(localServerData.port);
        });
        localServer.on('request', (req, res) => {
          req.httpsURL = `https://${hostname}${req.url}`;
          req.url = `http://${hostname}${req.url}`;
          req.protocol = 'https';
          httpMiddleware.proxy(req, res, rules);
        });
        localServer.on('error', (err) => {
          console.error(err);
        });
        localServer.on('clientError', (e) => {
          console.error('localServer.clientError', e);
        });
      }).catch((err) => {
        console.error(err);
      });
    });
  },

  requestCertificate(hostname): Promise<ICertificateCreateRes> {
    return new Promise((resolve) => {
      resolve(certInstance.createFakeCertificateByDomain(
        localCertificate,
        localCertificateKey,
        hostname,
      ));
    });
  }
};