"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>_default
});
const _http = /*#__PURE__*/ _interopRequireWildcard(require("http"));
const _https = /*#__PURE__*/ _interopRequireWildcard(require("https"));
const _lodash = require("lodash");
const _net = /*#__PURE__*/ _interopRequireWildcard(require("net"));
const _tls = /*#__PURE__*/ _interopRequireWildcard(require("tls"));
const _url = /*#__PURE__*/ _interopRequireWildcard(require("url"));
const _certifica = /*#__PURE__*/ _interopRequireDefault(require("./certifica"));
const _httpMiddleware = /*#__PURE__*/ _interopRequireDefault(require("./httpMiddleware"));
const _logger = /*#__PURE__*/ _interopRequireDefault(require("./logger"));
const _matcher = require("./matcher");
const _socket = require("./socket/socket");
const _dataset = /*#__PURE__*/ _interopRequireDefault(require("./utils/dataset"));
const _utils = require("./utils/utils");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
let certInstance;
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
const _default = {
    beforeStart () {
        certInstance = new _certifica.default();
        const { caCertPath  } = certInstance.init();
        return {
            certPath: caCertPath
        };
    },
    // https代理入口
    proxy (req, socket, head) {
        const { config  } = _dataset.default;
        const { https: httpsList = []  } = config;
        const httpsUrl = `https://${req.url}`;
        const urlParsed = _url.parse(httpsUrl);
        const isHttpsMatch = (0, _lodash.isBoolean)(httpsList) && httpsList || (0, _utils.isHttpsHostRegMatch)(httpsList, urlParsed.host);
        const matcherResult = (0, _matcher.matcher)(config.rules || [], httpsUrl);
        // 没有开启https抓取的队列 直接放过 不需要构建代理服务器
        if (!isHttpsMatch && !(matcherResult === null || matcherResult === void 0 ? void 0 : matcherResult.matched)) {
            this.web(socket, head, urlParsed.hostname, urlParsed.port, req, {
                fakeServer: null
            });
            req.$requestId = _utils.utils.guid();
            (0, _socket.ioRequest)({
                requestId: req.$requestId,
                url: `https://${urlParsed.hostname}`,
                method: 'connect',
                requestHeaders: {},
                responseBody: ''
            });
            return;
        }
        this.startLocalHttpsServer(urlParsed.hostname, config, req, socket, head, urlParsed.port).then(({ port: localHttpsPort , fakeServer  })=>{
            this.web(socket, head, '127.0.0.1', localHttpsPort, req, {
                originHost: urlParsed.hostname || '',
                originPort: urlParsed.port ? Number(urlParsed.port) : 0,
                fakeServer
            });
        });
    },
    web (socket, head, hostname, port, req, others = {}) {
        const socketAgent = _net.connect(port, hostname, ()=>{
            const agent = 'bproxy Agent';
            socket.on('error', (err)=>{
                socketAgent.end();
                socketAgent.destroy();
            }).write((0, _utils.createHttpHeader)(`HTTP/${req.httpVersion} 200 Connection Established`, {
                'Proxy-agent': `${agent}`
            }));
            socketAgent.write(head);
            socketAgent.pipe(socket).pipe(socketAgent);
        });
        socketAgent.on('error', (error)=>{
            socketAgent.end();
        });
    },
    startLocalHttpsServer (hostname, config, req, socket, head, port) {
        return new Promise((resolve)=>{
            var ref;
            const isBproxyDev = [
                'bproxy.dev',
                'bproxy.io'
            ].includes(hostname);
            const { certPem , keyPem  } = certInstance.createFakeCertificateByDomain(hostname);
            const httpsServerConfig = {
                key: keyPem,
                cert: certPem,
                SNICallback: (host, done)=>{
                    done(null, _tls.createSecureContext({
                        key: keyPem,
                        cert: certPem
                    }));
                }
            };
            const useHttps = (req === null || req === void 0 ? void 0 : (ref = req.url) === null || ref === void 0 ? void 0 : ref.indexOf(':80')) > -1 ? false : true;
            const localServer = useHttps ? new _https.Server(httpsServerConfig) : new _http.Server();
            localServer.listen(0, ()=>{
                const localAddress = localServer.address();
                if (typeof localAddress === 'string' || !localAddress) {
                    _logger.default.warn(`[local server listen error]: ${hostname}`);
                    localServer.close();
                    return;
                }
                resolve({
                    port: localAddress.port,
                    fakeServer: localServer
                });
            });
            localServer.on('request', (req, res)=>{
                const $req = req;
                $req.httpsURL = `https://${req.headers.host}${req.url}`;
                $req.url = `http://${req.headers.host}${req.url}`;
                $req.protocol = 'https';
                if (!$req.$requestId) {
                    $req.$requestId = _utils.utils.guid();
                }
                _httpMiddleware.default.proxy(req, res);
                localServer.$url = $req.httpsURL;
            });
            // websocket
            localServer.on('upgrade', (proxyReq, proxySocket)=>{
                var ref, ref1, ref2, ref3;
                if (proxyReq.method !== 'GET' || !proxyReq.headers.upgrade || proxyReq.headers.upgrade.toLowerCase() !== 'websocket') {
                    proxySocket.destroy();
                    return true;
                }
                localServer.$upgrade = true;
                const upgradeProtocol = proxyReq.headers.origin.indexOf('https:') === 0 || port === '443' ? 'wss://' : 'ws://';
                const upgradeURL = `${upgradeProtocol}${hostname}${proxyReq.url}`;
                const matchResult = (0, _matcher.matcher)(config.rules, upgradeURL);
                const options = {
                    host: hostname,
                    hostname,
                    port,
                    headers: proxyReq.headers,
                    method: 'GET',
                    rejectUnauthorized: true,
                    agent: false,
                    path: proxyReq.url
                };
                const target = (matchResult === null || matchResult === void 0 ? void 0 : (ref = matchResult.rule) === null || ref === void 0 ? void 0 : ref.redirectTarget) || (matchResult === null || matchResult === void 0 ? void 0 : (ref1 = matchResult.rule) === null || ref1 === void 0 ? void 0 : ref1.redirect);
                if ((matchResult === null || matchResult === void 0 ? void 0 : matchResult.matched) && target) {
                    const urlParsed = _url.parse(target);
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
                    options.port = _dataset.default.config.port;
                }
                if (!proxyReq.$requestId) {
                    proxyReq.$requestId = _utils.utils.guid();
                }
                if (!isBproxyDev) {
                    (0, _socket.ioRequest)({
                        url: upgradeURL,
                        method: proxyReq.headers.origin.includes('https:') ? 'wss' : 'ws',
                        requestHeaders: proxyReq.headers,
                        requestId: proxyReq.$requestId
                    });
                }
                const proxyWsHTTPS = ((ref3 = target || ((ref2 = proxyReq.headers) === null || ref2 === void 0 ? void 0 : ref2.origin)) === null || ref3 === void 0 ? void 0 : ref3.indexOf('https:')) === 0 && !isBproxyDev;
                const proxyWsServices = proxyWsHTTPS ? _https : _http;
                const wsRequest = proxyWsServices.request(options);
                wsRequest.on('upgrade', (r1, s1, h1)=>{
                    const writeStream = (0, _utils.createHttpHeader)(`HTTP/${req.httpVersion} 101 Switching Protocols`, r1.headers);
                    if (!isBproxyDev) {
                        s1.on('data', (frameData)=>{
                            const d = frameData;
                            const fin = (d[0] & 128) == 128;
                            const opcode = d[0] & 15;
                            const isMasked = (d[1] & 128) == 128;
                            const payloadLength = d[1] & 127;
                            const dir = payloadLength === 126 ? 'down' : 'up';
                            if (d.length < 2) {
                                return;
                            }
                            const wsFrameContent = d.slice(fin ? payloadLength === 126 ? 4 : 2 : 0).toString();
                            (0, _socket.ioRequest)({
                                requestId: proxyReq.$requestId,
                                url: upgradeURL,
                                method: proxyReq.headers.origin.includes('https:') ? 'wss' : 'ws',
                                requestHeaders: proxyReq.headers,
                                responseBody: JSON.stringify({
                                    message: wsFrameContent,
                                    dir
                                }),
                                statusCode: 101,
                                responseHeaders: {
                                    'content-type': 'text/plain-bproxy'
                                }
                            });
                        });
                    }
                    proxySocket.write(writeStream);
                    proxySocket.write(h1);
                    s1.pipe(proxySocket).pipe(s1);
                });
                wsRequest.on('error', ()=>{});
                wsRequest.end();
            });
            localServer.on('error', ()=>{
                _logger.default.warn(`[local server error]: ${hostname}`);
                localServer.close();
            });
            localServer.on('clientError', ()=>{
                localServer.close();
            });
        });
    }
};
