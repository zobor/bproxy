"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseByRequest = void 0;
const config_1 = require("./../config");
const socket_1 = require("../socket/socket");
const pako_1 = __importDefault(require("pako"));
const request_1 = __importDefault(require("request"));
const lodash_1 = require("lodash");
const is_1 = require("../utils/is");
const utils_1 = require("../utils/utils");
const text_1 = require("./text");
const dataset_1 = __importDefault(require("../utils/dataset"));
function responseByRequest(req, res, requestOption, responseHeaders = {}, matcherResult, config, postBodyData) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(() => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const requestHeaders = Object.assign(Object.assign({}, req.headers), requestOption.headers);
            const highPerformanceMode = (_a = dataset_1.default === null || dataset_1.default === void 0 ? void 0 : dataset_1.default.config) === null || _a === void 0 ? void 0 : _a.highPerformanceMode;
            const debug = (_b = matcherResult === null || matcherResult === void 0 ? void 0 : matcherResult.rule) === null || _b === void 0 ? void 0 : _b.debug;
            if ((config === null || config === void 0 ? void 0 : config.disableCache) || ((_c = matcherResult === null || matcherResult === void 0 ? void 0 : matcherResult.rule) === null || _c === void 0 ? void 0 : _c.disableCache)) {
                ['cache-control', 'if-none-match', 'if-modified-since'].forEach((key) => {
                    requestHeaders[key] && delete requestHeaders[key];
                    requestHeaders['pragma'] = 'no-cache';
                    requestHeaders['cache-control'] = 'no-cache';
                });
            }
            const url = (matcherResult === null || matcherResult === void 0 ? void 0 : matcherResult.matched) && ((matcherResult === null || matcherResult === void 0 ? void 0 : matcherResult.filepath) || ((_d = matcherResult === null || matcherResult === void 0 ? void 0 : matcherResult.rule) === null || _d === void 0 ? void 0 : _d.redirect)) ? req.url : req.httpsURL;
            const options = {
                url: url || req.url,
                method: req.method,
                headers: requestHeaders,
                body: postBodyData || null,
                encoding: null,
                strictSSL: false,
                rejectUnauthorized: false,
                followRedirect: false,
            };
            if (req.httpVersion !== '2.0' && !((_e = req.headers) === null || _e === void 0 ? void 0 : _e.connection)) {
                options.headers.connection = 'keep-alive';
            }
            requestOption.headers = Object.assign(Object.assign({}, options.headers), requestOption.headers);
            const rOpts = Object.assign(Object.assign({}, options), requestOption);
            const ioRequestParams = {
                url: req.httpsURL || req.requestOriginUrl || options.url,
                method: rOpts.method,
                requestHeaders: rOpts.headers,
                requestId: req.$requestId,
                requestBody: rOpts.body && !highPerformanceMode ? rOpts.body.toString() : null,
                matched: matcherResult === null || matcherResult === void 0 ? void 0 : matcherResult.matched,
            };
            (0, socket_1.ioRequest)(ioRequestParams);
            const fetch = (0, request_1.default)(rOpts)
                .on('response', function (response) {
                var _a, _b, _c;
                let headers = (0, lodash_1.omit)(Object.assign(Object.assign({}, response.headers), responseHeaders), (0, lodash_1.isArray)((_a = matcherResult === null || matcherResult === void 0 ? void 0 : matcherResult.rule) === null || _a === void 0 ? void 0 : _a.excludeResponseHeaders)
                    ? ((_b = matcherResult === null || matcherResult === void 0 ? void 0 : matcherResult.rule) === null || _b === void 0 ? void 0 : _b.excludeResponseHeaders) || []
                    : []);
                headers = (0, lodash_1.fromPairs)((0, lodash_1.toPairs)(headers).map((arr) => [arr[0].trim(), arr[1]]));
                const encoding = (0, lodash_1.get)(headers, '["content-encoding"]');
                const isGzip = encoding === 'gzip';
                const showContent = (0, is_1.isInspectContentType)(headers || {});
                const ip = (_c = response === null || response === void 0 ? void 0 : response.socket) === null || _c === void 0 ? void 0 : _c.remoteAddress;
                const statusCode = (response === null || response === void 0 ? void 0 : response.statusCode) || 500;
                !debug && res.writeHead(statusCode, headers);
                if (showContent && !highPerformanceMode) {
                    const body = [];
                    response.on('data', (d) => body.push(d));
                    response.on('end', () => {
                        const buf = Buffer.concat(body);
                        let str = buf;
                        if (isGzip) {
                            str = pako_1.default.ungzip(new Uint8Array(buf), { to: 'string' });
                        }
                        else if (!encoding) {
                            str = buf.toString();
                        }
                        if (debug) {
                            const txt = (0, utils_1.hookConsoleLog)(str, debug);
                            let resData = txt;
                            if (isGzip) {
                                resData = pako_1.default.gzip(txt);
                            }
                            headers = Object.assign(Object.assign({}, headers), { [`${config_1.bproxyPrefixHeader}-debug`]: true });
                            res.writeHead(statusCode, Object.assign(Object.assign({}, headers), { 'content-length': resData.length }));
                            (0, text_1.responseText)(resData, res);
                            (0, socket_1.ioRequest)(Object.assign(Object.assign({}, ioRequestParams), { requestId: req.$requestId, responseHeaders: headers, responseBody: txt, statusCode }));
                        }
                        else {
                            (0, socket_1.ioRequest)(Object.assign(Object.assign({}, ioRequestParams), { requestId: req.$requestId, responseHeaders: headers, responseBody: str, statusCode,
                                ip }));
                        }
                    });
                }
                else {
                    (0, socket_1.ioRequest)(Object.assign(Object.assign({}, ioRequestParams), { requestId: req.$requestId, responseHeaders: headers, statusCode,
                        ip }));
                }
            })
                .on('error', (err) => {
                res.writeHead(500, {});
                res.end(err.message);
                (0, socket_1.ioRequest)({
                    requestId: req.$requestId,
                    statusCode: 500,
                });
            });
            if (!debug) {
                fetch.pipe(res);
            }
        }));
    });
}
exports.responseByRequest = responseByRequest;
