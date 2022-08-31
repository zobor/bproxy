"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
const fs = __importStar(require("fs"));
const http = __importStar(require("http"));
const https = __importStar(require("https"));
const lodash_1 = require("lodash");
const net = __importStar(require("net"));
const forge = __importStar(require("node-forge"));
const tls = __importStar(require("tls"));
const url = __importStar(require("url"));
const certifica_1 = __importDefault(require("./certifica"));
const httpMiddleware_1 = __importDefault(require("./httpMiddleware"));
const logger_1 = __importDefault(require("./logger"));
const matcher_1 = require("./matcher");
const socket_1 = require("./socket/socket");
const dataset_1 = __importDefault(require("./utils/dataset"));
const utils_1 = require("./utils/utils");
const { pki } = forge;
let certInstance;
let cert;
let certificatePem;
let certificateKeyPem;
let localCertificate;
let localCertificateKey;
const wsFrameFormat = `
Frame format:
​​
      0                   1                   2                   3
      0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
     +-+-+-+-+-------+-+-------------+-------------------------------+
     |F|R|R|R| opcode|M| Payload len |    Extended payload length    |
     |I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
     |N|V|V|V|       |S|             |   (if payload len==126/127)   |
     | |1|2|3|       |K|             |                               |
     +-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
     |     Extended payload length continued, if payload len == 127  |
     + - - - - - - - - - - - - - - - +-------------------------------+
     |                               |Masking-key, if MASK set to 1  |
     +-------------------------------+-------------------------------+
     | Masking-key (continued)       |          Payload Data         |
     +-------------------------------- - - - - - - - - - - - - - - - +
     :                     Payload Data continued ...                :
     + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
     |                     Payload Data continued ...                |
     +---------------------------------------------------------------+
`;
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
    proxy(req, socket, head) {
        const { config } = dataset_1.default;
        const { https: httpsList = [] } = config;
        const httpsUrl = `https://${req.url}`;
        const urlParsed = url.parse(httpsUrl);
        const isHttpsMatch = ((0, lodash_1.isBoolean)(httpsList) && httpsList) ||
            (0, utils_1.isHttpsHostRegMatch)(httpsList, urlParsed.host);
        const matcherResult = (0, matcher_1.matcher)(config.rules || [], httpsUrl);
        if (!isHttpsMatch && !(matcherResult === null || matcherResult === void 0 ? void 0 : matcherResult.matched)) {
            this.web(socket, head, urlParsed.hostname, urlParsed.port, req, {
                fakeServer: null,
            });
            req.$requestId = utils_1.utils.guid();
            (0, socket_1.ioRequest)({
                requestId: req.$requestId,
                url: `https://${urlParsed.hostname}`,
                method: 'connect',
                requestHeaders: {},
                responseBody: '',
            });
            return;
        }
        this.startLocalHttpsServer(urlParsed.hostname, config, req, socket, head, urlParsed.port).then(({ port: localHttpsPort, fakeServer }) => {
            this.web(socket, head, '127.0.0.1', localHttpsPort, req, {
                originHost: urlParsed.hostname || '',
                originPort: urlParsed.port ? Number(urlParsed.port) : 0,
                fakeServer,
            });
        });
    },
    web(socket, head, hostname, port, req, others = {}) {
        const socketAgent = net.connect(port, hostname, () => {
            const agent = 'bproxy Agent';
            socket
                .on('error', (err) => {
                socketAgent.end();
                socketAgent.destroy();
            })
                .write((0, utils_1.createHttpHeader)(`HTTP/${req.httpVersion} 200 Connection Established`, {
                'Proxy-agent': `${agent}`,
            }));
            socketAgent.write(head);
            socketAgent.pipe(socket).pipe(socketAgent);
        });
        socketAgent.on('error', (error) => {
            socketAgent.end();
        });
    },
    startLocalHttpsServer(hostname, config, req, socket, head, port) {
        return new Promise((resolve) => {
            var _a;
            const isBproxyDev = ['bproxy.dev', 'bproxy.io'].includes(hostname);
            const certificate = certInstance.createFakeCertificateByDomain(localCertificate, localCertificateKey, hostname);
            const certPem = pki.certificateToPem(certificate.cert);
            const keyPem = pki.privateKeyToPem(certificate.key);
            const httpsServerConfig = {
                key: keyPem,
                cert: certPem,
                SNICallback: (host, done) => {
                    done(null, tls.createSecureContext({
                        key: keyPem,
                        cert: certPem,
                    }));
                },
            };
            const useHttps = ((_a = req === null || req === void 0 ? void 0 : req.url) === null || _a === void 0 ? void 0 : _a.indexOf(':80')) > -1 ? false : true;
            const localServer = useHttps
                ? new https.Server(httpsServerConfig)
                : new http.Server();
            localServer.listen(0, () => {
                const localAddress = localServer.address();
                if (typeof localAddress === 'string' || !localAddress) {
                    logger_1.default.warn(`[local server listen error]: ${hostname}`);
                    localServer.close();
                    return;
                }
                resolve({
                    port: localAddress.port,
                    fakeServer: localServer,
                });
            });
            localServer.on('request', (req, res) => {
                const $req = req;
                $req.httpsURL = `https://${req.headers.host}${req.url}`;
                $req.url = `http://${req.headers.host}${req.url}`;
                $req.protocol = 'https';
                if (!$req.$requestId) {
                    $req.$requestId = utils_1.utils.guid();
                }
                httpMiddleware_1.default.proxy(req, res);
                localServer.$url = $req.httpsURL;
            });
            localServer.on('upgrade', (proxyReq, proxySocket) => {
                var _a, _b, _c, _d;
                if (proxyReq.method !== 'GET' ||
                    !proxyReq.headers.upgrade ||
                    proxyReq.headers.upgrade.toLowerCase() !== 'websocket') {
                    proxySocket.destroy();
                    return true;
                }
                localServer.$upgrade = true;
                const upgradeProtocol = proxyReq.headers.origin.indexOf('https:') === 0 || port === '443'
                    ? 'wss://'
                    : 'ws://';
                const upgradeURL = `${upgradeProtocol}${hostname}${proxyReq.url}`;
                const matchResult = (0, matcher_1.matcher)(config.rules, upgradeURL);
                const options = {
                    host: hostname,
                    hostname,
                    port,
                    headers: proxyReq.headers,
                    method: 'GET',
                    rejectUnauthorized: true,
                    agent: false,
                    path: proxyReq.url,
                };
                const target = ((_a = matchResult === null || matchResult === void 0 ? void 0 : matchResult.rule) === null || _a === void 0 ? void 0 : _a.redirectTarget) || ((_b = matchResult === null || matchResult === void 0 ? void 0 : matchResult.rule) === null || _b === void 0 ? void 0 : _b.redirect);
                if ((matchResult === null || matchResult === void 0 ? void 0 : matchResult.matched) && target) {
                    const urlParsed = url.parse(target);
                    if ((urlParsed === null || urlParsed === void 0 ? void 0 : urlParsed.hostname) && (urlParsed === null || urlParsed === void 0 ? void 0 : urlParsed.port)) {
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
                    options.port = dataset_1.default.config.port;
                }
                if (!proxyReq.$requestId) {
                    proxyReq.$requestId = utils_1.utils.guid();
                }
                if (!isBproxyDev) {
                    (0, socket_1.ioRequest)({
                        url: upgradeURL,
                        method: proxyReq.headers.origin.includes('https:') ? 'wss' : 'ws',
                        requestHeaders: proxyReq.headers,
                        requestId: proxyReq.$requestId,
                    });
                }
                const proxyWsHTTPS = ((_d = (target || ((_c = proxyReq.headers) === null || _c === void 0 ? void 0 : _c.origin))) === null || _d === void 0 ? void 0 : _d.indexOf('https:')) === 0 &&
                    !isBproxyDev;
                const proxyWsServices = proxyWsHTTPS ? https : http;
                const wsRequest = proxyWsServices.request(options);
                wsRequest.on('upgrade', (r1, s1, h1) => {
                    const writeStream = (0, utils_1.createHttpHeader)(`HTTP/${req.httpVersion} 101 Switching Protocols`, r1.headers);
                    if (!isBproxyDev) {
                        s1.on('data', (frameData) => {
                            const d = frameData;
                            const fin = (d[0] & 128) == 128;
                            const opcode = d[0] & 15;
                            const isMasked = (d[1] & 128) == 128;
                            const payloadLength = d[1] & 127;
                            const dir = payloadLength === 126 ? 'down' : 'up';
                            if (d.length < 2) {
                                return;
                            }
                            const wsFrameContent = d
                                .slice(fin ? (payloadLength === 126 ? 4 : 2) : 0)
                                .toString();
                            (0, socket_1.ioRequest)({
                                requestId: proxyReq.$requestId,
                                url: upgradeURL,
                                method: proxyReq.headers.origin.includes('https:')
                                    ? 'wss'
                                    : 'ws',
                                requestHeaders: proxyReq.headers,
                                responseBody: JSON.stringify({
                                    message: wsFrameContent,
                                    dir,
                                }),
                                statusCode: 101,
                                responseHeaders: {
                                    'content-type': 'text/plain-bproxy',
                                },
                            });
                        });
                    }
                    proxySocket.write(writeStream);
                    proxySocket.write(h1);
                    s1.pipe(proxySocket).pipe(s1);
                });
                wsRequest.on('error', () => { });
                wsRequest.end();
            });
            localServer.on('error', () => {
                logger_1.default.warn(`[local server error]: ${hostname}`);
                localServer.close();
            });
            localServer.on('clientError', () => {
                localServer.close();
            });
        });
    },
};
