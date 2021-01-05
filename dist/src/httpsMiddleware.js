"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const https = require("https");
const tls = require("tls");
const url = require("url");
const forge = require("node-forge");
const fs = require("fs");
const certifica_1 = require("./certifica");
const httpMiddleware_1 = require("./httpMiddleware");
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
        }
        else {
            rs = httpsItem.test(hostname.replace(':443'));
        }
    }
    return rs;
};
exports.default = {
    beforeStart() {
        certInstance = new certifica_1.default();
        cert = certInstance.init();
        certificatePem = fs.readFileSync(cert.caCertPath);
        certificateKeyPem = fs.readFileSync(cert.caKeyPath);
        localCertificate = pki.certificateFromPem(certificatePem);
        localCertificateKey = pki.privateKeyFromPem(certificateKeyPem);
    },
    proxy(req, socket, head, config) {
        const { https, sslAll } = config;
        const urlParsed = url.parse(`https://${req.url}`);
        const host = urlParsed.host || '';
        this.startLocalHttpsServer(urlParsed.hostname, config).then(localHttpsPort => {
            const isHttpsMatch = sslAll || isHttpsHostRegMatch(https, host);
            console.log('isHttpsMatch', isHttpsMatch, 'host', host);
            if (isHttpsMatch) {
                this.web(socket, head, '127.0.0.1', localHttpsPort);
            }
            else {
                this.web(socket, head, urlParsed.hostname, urlParsed.port);
            }
        });
    },
    web(socket, head, hostname, port) {
        const socketAgent = net.connect(port, hostname, () => {
            const agent = "bproxy Agent";
            socket.on("error", err => {
                console.error('net connect error:', {
                    err,
                    info: {
                        hostname,
                        port,
                    },
                });
                socketAgent.end();
            })
                .write([
                "HTTP/1.1 200 Connection Established\r\n",
                `Proxy-agent: ${agent}\r\n`,
                "\r\n"
            ].join(""));
            socketAgent.write(head);
            socketAgent.pipe(socket);
            socket.pipe(socketAgent);
        });
        socketAgent.on("error", e => {
            console.error('socketAgent error', JSON.stringify({ err: e.message, hostname, port }));
        });
    },
    startLocalHttpsServer(hostname, config) {
        return new Promise(resolve => {
            const certificate = certInstance.createFakeCertificateByDomain(localCertificate, localCertificateKey, hostname);
            const certPem = pki.certificateToPem(certificate.cert);
            const keyPem = pki.privateKeyToPem(certificate.key);
            const localServer = new https.Server({
                key: keyPem,
                cert: certPem,
                SNICallback: (host, done) => {
                    done(null, tls.createSecureContext({
                        key: keyPem,
                        cert: certPem,
                    }));
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
                httpMiddleware_1.httpMiddleware.proxy(req, res, config);
            });
            localServer.on("error", err => {
                console.error("localServer.error", err);
            });
            localServer.on("clientError", e => {
            });
        });
    }
};
