"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_1 = require("./socket");
const net = __importStar(require("net"));
const https = __importStar(require("https"));
const tls = __importStar(require("tls"));
const url = __importStar(require("url"));
const forge = __importStar(require("node-forge"));
const fs = __importStar(require("fs"));
const certifica_1 = __importDefault(require("./certifica"));
const httpMiddleware_1 = require("./httpMiddleware");
const utils_1 = require("./utils/utils");
const { pki } = forge;
let certInstance;
let cert;
let certificatePem;
let certificateKeyPem;
let localCertificate;
let localCertificateKey;
exports.default = {
    beforeStart() {
        certInstance = new certifica_1.default();
        cert = certInstance.init();
        certificatePem = fs.readFileSync(cert.caCertPath);
        certificateKeyPem = fs.readFileSync(cert.caKeyPath);
        localCertificate = pki.certificateFromPem(certificatePem);
        localCertificateKey = pki.privateKeyFromPem(certificateKeyPem);
        return {
            certPath: cert.caCertPath,
        };
    },
    proxy(req, socket, head, config) {
        const { https: httpsList, sslAll } = config;
        const urlParsed = url.parse(`https://${req.url}`);
        const host = (urlParsed.host || "").replace(/:\d+/, "");
        this.startLocalHttpsServer(urlParsed.hostname, config, req, socket, head, urlParsed.port).then(({ port: localHttpsPort, fakeServer }) => {
            const isHttpsMatch = sslAll || (0, utils_1.isHttpsHostRegMatch)(httpsList, host);
            if (isHttpsMatch) {
                this.web(socket, head, "127.0.0.1", localHttpsPort, req, {
                    originHost: urlParsed.hostname || '',
                    originPort: urlParsed.port ? Number(urlParsed.port) : 0,
                    fakeServer,
                });
            }
            else {
                this.web(socket, head, urlParsed.hostname, urlParsed.port, req, {
                    fakeServer,
                });
            }
        });
    },
    web(socket, head, hostname, port, req, others = {}) {
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
                .write((0, utils_1.createHttpHeader)(`HTTP/${req.httpVersion} 200 Connection Established`, {
                "Proxy-agent": `${agent}`,
            }));
            socketAgent.write(head);
            socketAgent.pipe(socket).pipe(socketAgent);
        });
        socketAgent.on("error", () => {
            utils_1.log.warn(`[https socket agent error]: ${$hostname} ${$port}`);
            socketAgent.end();
        });
        socketAgent.on('close', () => {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
        });
        timer = setTimeout(() => {
            var _a, _b;
            if (socketAgent.destroyed || (others === null || others === void 0 ? void 0 : others.fakeServer.$url) || ((_a = others === null || others === void 0 ? void 0 : others.fakeServer) === null || _a === void 0 ? void 0 : _a.$upgrade)) {
                return;
            }
            utils_1.log.warn(`[timeout]--> ${$hostname}:${$port} --> ${hostname}:${port}`);
            (_b = others === null || others === void 0 ? void 0 : others.fakeServer) === null || _b === void 0 ? void 0 : _b.close();
            socketAgent === null || socketAgent === void 0 ? void 0 : socketAgent.end();
            socketAgent === null || socketAgent === void 0 ? void 0 : socketAgent.destroy();
            socket === null || socket === void 0 ? void 0 : socket.end();
        }, (5 * 1000));
    },
    startLocalHttpsServer(hostname, config, req, socket, head, port) {
        return new Promise((resolve) => {
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
                },
            });
            localServer.listen(0, () => {
                const localAddress = localServer.address();
                if (typeof localAddress === "string" || !localAddress) {
                    utils_1.log.warn(`[local server listen error]: ${hostname}`);
                    localServer.close();
                    return;
                }
                resolve({
                    port: localAddress.port,
                    fakeServer: localServer,
                });
            });
            localServer.on("request", (req, res) => {
                const $req = req;
                $req.httpsURL = `https://${hostname}${req.url}`;
                $req.url = `http://${hostname}${req.url}`;
                $req.protocol = "https";
                if (!$req.$requestId) {
                    $req.$requestId = utils_1.utils.guid();
                }
                httpMiddleware_1.httpMiddleware.proxy(req, res, config);
                localServer.$url = $req.httpsURL;
            });
            localServer.on("upgrade", (proxyReq, proxySocket) => {
                var _a;
                if (proxyReq.method !== "GET" || !proxyReq.headers.upgrade) {
                    proxySocket.destroy();
                    return true;
                }
                if (proxyReq.headers.upgrade.toLowerCase() !== "websocket") {
                    proxySocket.destroy();
                    return true;
                }
                localServer.$upgrade = true;
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
                if (!proxyReq.$requestId) {
                    proxyReq.$requestId = utils_1.utils.guid();
                }
                (0, socket_1.ioRequest)({
                    url: `${(_a = proxyReq.headers) === null || _a === void 0 ? void 0 : _a.origin}${proxyReq.url}`,
                    method: proxyReq.headers.origin.includes("https:") ? "WSS" : "WS",
                    requestHeaders: proxyReq.headers,
                    requestId: proxyReq.$requestId,
                });
                const wsRequest = https.request(options);
                wsRequest.on("upgrade", (r1, s1, h1) => {
                    const writeStream = (0, utils_1.createHttpHeader)(`HTTP/${req.httpVersion} 101 Switching Protocols`, r1.headers);
                    s1.on("data", (d) => {
                        (0, socket_1.ioRequest)({
                            requestId: proxyReq.$requestId,
                            responseBody: d,
                            statusCode: 101,
                        });
                    });
                    proxySocket.write(writeStream);
                    proxySocket.write(h1);
                    s1.pipe(proxySocket).pipe(s1);
                });
                wsRequest.end();
            });
            localServer.on("error", () => {
                utils_1.log.warn(`[local server error]: ${hostname}`);
                localServer.close();
            });
            localServer.on("clientError", () => {
                utils_1.log.warn(`[local server ClientError]: ${hostname}`);
                localServer.close();
            });
        });
    },
};
