const net = require('net')
const url = require('url')
const colors = require('colors')
const ca = require('./common/ca')
const forge = require('node-forge');
const pki = forge.pki;
const https = require('https')
const fs = require('fs')
const httpMiddleware = require('./http-middleware')

var tls                 = require('tls');
var rs                  = ca.init();
var certificatePem      = fs.readFileSync(rs.caCertPath);
var certificateKeyPem   = fs.readFileSync(rs.caKeyPath);
var localCertificate    = forge.pki.certificateFromPem(certificatePem);
var localCertificateKey = forge.pki.privateKeyFromPem(certificateKeyPem);

class httpsMiddleware {
  constructor() {}

  proxy(req, socket, head) {
    return new Promise((resolve, reject) => {
      let httpsParams = url.parse('https://' + req.url);
      this.connect(req, socket, head, httpsParams.hostname, httpsParams.port);
    })
  }

  connect(req, socket, head, hostname, port) {
    this.mergeCertificate(hostname, port).then(localProxyPort => {
      this.web(req, socket, head, '127.0.0.1', localProxyPort)
    })
  }

  web(req, socket, head, hostname, port) {
    var socketAgent = net.connect(port, hostname, () => {
      var agent = "bproxy Agent";
      socket.write([
        'HTTP/1.1 200 Connection Established\r\n',
        `Proxy-agent: ${agent}\r\n`,
        '\r\n'
      ].join(''))
      socketAgent.write(head);
      socketAgent.pipe(socket);
      socket.pipe(socketAgent);
    });
    socketAgent.on('data', (e) => {});
    socketAgent.on('error', (e) => {
      console.log(colors.red(e));
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
          httpMiddleware.proxy(req, res)
          .catch((error)=>{
            res.end(error)
          })
          .then((httpRequest)=>{
            httpRequest.pipe(res)
          })
        });
        localServer.on('error', (e) => {
          console.log(colors.red(e));
        });
      }).catch((e) => {
        console.log(colors.red(e));
      });
    });
  }

  requestCertificate(hostname, port){
    return new Promise( (resolve, reject)=>{
      var certificate;
      var requestConfig;
      if (0) {
        requestConfig = {
          method: 'HEAD',
          // host: 'proxy.company.com',
          port: 8080,
          path: 'https://' + hostname
        }
      }else{
        requestConfig = {
          method: 'HEAD',
          port: port,
          host: hostname,
          path: '/'
        }
      }
      var _resolve = function(cert){
        resolve(cert);
      }
      var req = https.request(requestConfig, (resp)=>{
        try {
          var serverCertificate = resp.socket.getPeerCertificate();
          if (serverCertificate && serverCertificate.raw) {
            certificate = ca.createFakeCertificateByCA(localCertificateKey, localCertificate, serverCertificate);
          } else {
            certificate = ca.createFakeCertificateByDomain(localCertificateKey, localCertificate, hostname);
          }
          _resolve(certificate);
        } catch (e) {
          reject(e);
        }
      });
      req.setTimeout(4000, ()=>{
        if (!certificate) {
          certificate = ca.createFakeCertificateByDomain(localCertificateKey, localCertificate, hostname);
          _resolve(certificate);
        }
      });
      req.on('error', (e)=>{
        if (!certificate) {
          certificate = ca.createFakeCertificateByDomain(localCertificateKey, localCertificate, hostname);
          _resolve(certificate);
        }
      });
      req.end();
    });
  }

}

module.exports = new httpsMiddleware()