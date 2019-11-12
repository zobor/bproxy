/* eslint class-methods-use-this: 0 */
const net = require('net');
const url = require('url');
const forge = require('node-forge');

const { pki } = forge;
const https = require('https');
const fs = require('fs');
const tls = require('tls');
const httpProxy = require('./http-proxy');
const _ = require('./common/util');
const ca = require('./common/ca');

const rs = ca.init();
const certificatePem = fs.readFileSync(rs.caCertPath);
const certificateKeyPem = fs.readFileSync(rs.caKeyPath);
const localCertificate = forge.pki.certificateFromPem(certificatePem);
const localCertificateKey = forge.pki.privateKeyFromPem(certificateKeyPem);

class HTTPSMiddleware {
  proxy(req, socket, head, config) {
    this.config = config;
    return new Promise(() => {
      const httpsParams = url.parse(`https://${req.url}`);
      this.connect(req, socket, head, httpsParams.hostname, httpsParams.port);
    });
  }

  connect(req, socket, head, hostname, port) {
    if (this.config.enableSSLProxying === 'all') {
      this.mergeCertificate(hostname, port).then((localProxyPort) => {
        this.web(req, socket, head, '127.0.0.1', localProxyPort);
      });
    } else if (!this.config.enableSSLProxying) {
      this.web(req, socket, head, hostname, port);
    } else if (this.config.enableSSLProxying
      && this.config.SSLProxyList.length
      && this.config.SSLProxyList.indexOf(`${hostname}:${port}`) > -1
    ) {
      this.mergeCertificate(hostname, port).then((localProxyPort) => {
        this.web(req, socket, head, '127.0.0.1', localProxyPort);
      });
    } else {
      this.web(req, socket, head, hostname, port);
    }
  }

  web(req, socket, head, hostname, port) {
    const startTime = +new Date();
    const socketAgent = net.connect(port, hostname, () => {
      const agent = 'bproxy Agent';
      socket
        .on('error', (err) => {
          _.error(`net.socket.write.error: ${hostname}:${port} : ${JSON.stringify(err)}`);
          socketAgent.end();
        })
        .write([
          'HTTP/1.1 200 Connection Established\r\n',
          `Proxy-agent: ${agent}\r\n`,
          '\r\n',
        ].join(''));

      socketAgent.write(head);
      socketAgent.pipe(socket);
      socket.pipe(socketAgent);
      const endTime = +new Date();
      console.log(`[INFO][${endTime - startTime}ms] https connect`)
    });
    // socketAgent.on('data', (e) => { });
    socketAgent.on('error', (e) => {
      e.host = `${hostname}:${port}`;
      _.error(`[HTTPS CONNECT]: ${JSON.stringify(e)}`);
    });
  }

  mergeCertificate(hostname, port) {
    return new Promise((resolve) => {
      const startTime = +new Date();
      this.requestCertificate(hostname, port).then((certificate) => {
        const endTime = +new Date();
        _.info(`[DEBUG][${endTime - startTime}ms] requestCertificate`);
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
          localServerData.port = localServer.address().port;
          resolve(localServerData.port);
        });
        localServer.on('request', (req, res) => {
          req.httpsURL = `https://${hostname}${req.url}`;
          req.url = `http://${hostname}${req.url}`;
          req.protocol = 'https';
          httpProxy(req, res, this.config);
        });
        localServer.on('error', (e) => {
          _.error(`[localServer]: ${JSON.stringify(e)}`);
        });
        // localServer.on('close', (e) => {
        // });
        localServer.on('clientError', (e) => {
          console.error('localServer.clientError', e);
        });
      }).catch((e) => {
        _.error(`[requestCertificate]: ${JSON.stringify(e)}`);
      });
    });
  }

  requestCertificate(hostname, port) {
    return new Promise((resolve, reject) => {
      let certificate;
      const requestConfig = {
        method: 'HEAD',
        port,
        host: hostname,
        path: '/',
      };
      /* eslint no-underscore-dangle: 0 */
      const _resolve = function _resolve(cert) {
        resolve(cert);
      };
      const startTime = +new Date();
      const req = https.request(requestConfig, (resp) => {
        const endTime = +new Date();
        console.log(`[INFO][${endTime - startTime}ms] https.request`);
        try {
          const serverCertificate = resp.socket.getPeerCertificate();
          const isSSLDisabled = this.config.forceHTTPList.indexOf(hostname) > -1;
          if (serverCertificate && serverCertificate.raw && !isSSLDisabled) {
            const startTime2 = +new Date();
            certificate = ca.createFakeCertificateByCA(
              localCertificateKey,
              localCertificate,
              serverCertificate,
            );
            const endTime2 = +new Date();
            console.log(`[INFO][${endTime2 - startTime2}ms] createFakeCertificateByCA`);
          } else {
            certificate = ca.createFakeCertificateByDomain(
              localCertificateKey,
              localCertificate,
              hostname,
            );
          }
          _resolve(certificate);
        } catch (e) {
          reject(e);
        }
      });
      req.setTimeout(4000, () => {
        if (!certificate) {
          certificate = ca.createFakeCertificateByDomain(
            localCertificateKey,
            localCertificate,
            hostname,
          );
          _resolve(certificate);
        }
      });
      req.on('error', () => {
        if (!certificate) {
          certificate = ca.createFakeCertificateByDomain(
            localCertificateKey,
            localCertificate,
            hostname,
          );
          _resolve(certificate);
        }
      });
      req.end();
    });
  }
}

module.exports = new HTTPSMiddleware();
