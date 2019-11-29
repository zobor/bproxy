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
const certInstance = new certifica_1.default();
const cert = certInstance.init();
const certificatePem = fs.readFileSync(cert.caCertPath);
const certificateKeyPem = fs.readFileSync(cert.caKeyPath);
const localCertificate = pki.certificateFromPem(certificatePem);
const localCertificateKey = pki.privateKeyFromPem(certificateKeyPem);
exports.default = {
    proxy(req, socket, head, config) {
        const { https, sslAll } = config;
        const urlParsed = url.parse(`https://${req.url}`);
        this.startLocalHttpsServer(urlParsed.hostname, config).then(localHttpsPort => {
            if (sslAll || https.indexOf(`${urlParsed.host}`) > -1) {
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
                console.error('net connect error:', err);
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
            console.error('socketAgent error', { e, hostname, port });
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