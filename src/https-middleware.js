const net = require('net')
const url = require('url')
const ca = require('./common/ca')
const forge = require('node-forge');
const pki = forge.pki;
const https = require('https')
const fs = require('fs')
const httpProxy = require('./http-proxy')
const _ = require('./common/util');
const tls = require('tls');

const rs = ca.init();
const certificatePem = fs.readFileSync(rs.caCertPath);
const certificateKeyPem = fs.readFileSync(rs.caKeyPath);
const localCertificate = forge.pki.certificateFromPem(certificatePem);
const localCertificateKey = forge.pki.privateKeyFromPem(certificateKeyPem);
const timeout = 5000;

class httpsMiddleware {
  constructor() { }

  proxy(req, socket, head, config) {
    this.config = config
    return new Promise((resolve, reject) => {
      let httpsParams = url.parse('https://' + req.url);
      this.connect(req, socket, head, httpsParams.hostname, httpsParams.port);
    })
  }

  connect(req, socket, head, hostname, port) {
    if (this.config.enableSSLProxying === 'all') {
      this.mergeCertificate(hostname, port).then(localProxyPort => {
        this.web(req, socket, head, '127.0.0.1', localProxyPort)
      })
    }
    // disable
    else if (!this.config.enableSSLProxying) {
      this.web(req, socket, head, hostname, port);
    }
    // enable and inWhiteList
    else if (this.config.enableSSLProxying &&
      this.config.SSLProxyList.length &&
      this.config.SSLProxyList.indexOf(`${hostname}:${port}`) > -1
    ) {
      this.mergeCertificate(hostname, port).then(localProxyPort => {
        this.web(req, socket, head, '127.0.0.1', localProxyPort)
      })
    } else {
      this.web(req, socket, head, hostname, port);
    }
  }

  web(req, socket, head, hostname, port) {
    var socketAgent = net.connect(port, hostname, () => {
      var agent = "bproxy Agent";
      socket
      .on('error', err => {
        _.error(`net.socket.write.error: ${hostname}:${port} : ${JSON.stringify(err)}`)
        socketAgent.end();
      })
      .write([
        'HTTP/1.1 200 Connection Established\r\n',
        `Proxy-agent: ${agent}\r\n`,
        '\r\n'
      ].join(''))

      socketAgent.write(head);
      socketAgent.pipe(socket);
      socket.pipe(socketAgent);
    });
    socketAgent.on('data', (e) => { });
    socketAgent.on('error', (e) => {
      e.host = `${hostname}:${port}`;
      _.error(`[HTTPS CONNECT]: ${JSON.stringify(e)}`);
    });
  }

  mergeCertificate(hostname, port) {
    return new Promise((resolve, reject) => {
      this.requestCertificate(hostname, port).then((certificate) => {
        var certPem = pki.certificateToPem(certificate.cert);
        var keyPem = pki.privateKeyToPem(certificate.key);
        var localServer = new https.Server({
          key: keyPem,
          cert: certPem,
          SNICallback: (hostname, done) => {
            done(null, tls.createSecureContext({
              key: pki.privateKeyToPem(certificate.key),
              cert: pki.certificateToPem(certificate.cert)
            }));
          }
        });
        var localServerData = {
          cert: certificate.cert,
          key: certificate.key,
          server: localServer,
          port: 0
        };
        localServer.listen(0, () => {
          localServerData.port = localServer.address().port;
          resolve(localServerData.port);
        });
        localServer.on('request', (req, res) => {
          req.httpsURL = 'https://' + hostname + req.url
          req.url = 'http://' + hostname + req.url
          req.protocol = 'https'
          httpProxy(req, res, this.config)
        });
        localServer.on('error', (e) => {
          _.error(`[localServer]: ${JSON.stringify(e)}`);
        });
      }).catch((e) => {
        _.error(`[requestCertificate]: ${JSON.stringify(e)}`);
      });
    });
  }

  requestCertificate(hostname, port) {
    return new Promise((resolve, reject) => {
      var certificate;
      var requestConfig = {
        method: 'HEAD',
        port: port,
        host: hostname,
        path: '/'
      }
      var _resolve = function (cert) {
        resolve(cert);
      }
      var req = https.request(requestConfig, (resp) => {
        try {
          var serverCertificate = resp.socket.getPeerCertificate();
          const isSSLDisabled = this.config.forceHTTPList.indexOf(hostname) > -1;
          if (serverCertificate && serverCertificate.raw && !isSSLDisabled) {
            certificate = ca.createFakeCertificateByCA(localCertificateKey, localCertificate, serverCertificate);
          } else {
            certificate = ca.createFakeCertificateByDomain(localCertificateKey, localCertificate, hostname);
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
            hostname
          );
          _resolve(certificate);
        }
      });
      req.on('error', (e) => {
        if (!certificate) {
          certificate = ca.createFakeCertificateByDomain(
            localCertificateKey,
            localCertificate,
            hostname
          );
          _resolve(certificate);
        }
      });
      req.end();
    });
  }

}

module.exports = new httpsMiddleware()
