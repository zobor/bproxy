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
exports.httpMiddleware = void 0;
const request_1 = __importDefault(require("request"));
const fs = __importStar(require("fs"));
const stream_1 = require("stream");
const _ = __importStar(require("lodash"));
const path = __importStar(require("path"));
const url = __importStar(require("url"));
const matcher_1 = require("./matcher");
const socket_1 = require("./socket");
const is_1 = require("./utils/is");
const utils_1 = require("./utils/utils");
exports.httpMiddleware = {
    responseByText(text, res) {
        const s = new stream_1.Readable();
        s.push(text);
        s.push(null);
        s.pipe(res);
    },
    proxy(req, res, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rules } = config;
            const matcherResult = (0, matcher_1.matcher)(rules, req.httpsURL || req.url);
            const resOptions = {
                headers: {},
            };
            if (matcherResult.matched) {
                return new Promise(() => {
                    var _a;
                    if (!matcherResult.rule)
                        return;
                    if (matcherResult === null || matcherResult === void 0 ? void 0 : matcherResult.responseHeaders) {
                        resOptions.headers = Object.assign({}, matcherResult.responseHeaders);
                    }
                    if ((_a = matcherResult === null || matcherResult === void 0 ? void 0 : matcherResult.rule) === null || _a === void 0 ? void 0 : _a.responseHeaders) {
                        resOptions.headers = Object.assign({}, matcherResult.rule.responseHeaders);
                    }
                    if (matcherResult.rule.file) {
                        this.proxyLocalFile(matcherResult.rule.file, res, resOptions.headers);
                    }
                    else if (matcherResult.rule.path) {
                        this.proxyLocalFile(path.resolve(matcherResult.rule.path, matcherResult.rule.filepath || ''), res, resOptions.headers);
                    }
                    else if (_.isFunction(matcherResult.rule.response)) {
                        matcherResult.rule.response({
                            response: res,
                            request: request_1.default,
                            req,
                            rules: matcherResult === null || matcherResult === void 0 ? void 0 : matcherResult.rule,
                        });
                    }
                    else if (_.isString(matcherResult.rule.response)) {
                        this.responseByText(matcherResult.rule.response, res);
                    }
                    else if (matcherResult.rule.statusCode) {
                        res.writeHead(matcherResult.rule.statusCode, {});
                        res.end(matcherResult.rule.statusCode.toString());
                        (0, socket_1.ioRequest)({
                            requestId: req.$requestId,
                            url: req.requestOriginUrl || req.url,
                            method: req.method,
                            statusCode: matcherResult.rule.statusCode,
                        });
                        console.log({
                            requestId: req.$requestId,
                            url: req.requestOriginUrl || req.url,
                            method: req.method,
                            statusCode: matcherResult.rule.statusCode,
                        });
                    }
                    else if (_.isString(matcherResult.rule.redirect)) {
                        req.requestOriginUrl = req.url;
                        req.url = matcherResult.rule.redirectTarget || matcherResult.rule.redirect;
                        req.httpsURL = req.url;
                        const redirectUrlParam = url.parse(req.url);
                        if (redirectUrlParam.host && req.headers) {
                            req.headers.host = redirectUrlParam.host;
                        }
                        const requestOption = {
                            headers: matcherResult.rule.requestHeaders || {}
                        };
                        return this.proxyByRequest(req, res, requestOption, resOptions, matcherResult);
                    }
                    else if (_.isString(matcherResult.rule.proxy)) {
                        return this.proxyByRequest(req, res, {
                            proxy: matcherResult.rule.proxy,
                        }, resOptions, matcherResult);
                    }
                    else if (_.isString(matcherResult.rule.host)) {
                        return this.proxyByRequest(req, res, {
                            hostname: matcherResult.rule.host,
                        }, resOptions, matcherResult);
                    }
                    else {
                    }
                });
            }
            else {
                return this.proxyByRequest(req, res, {}, resOptions);
            }
        });
    },
    proxyByRequest(req, res, requestOption, responseOptions, matcherResult) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(() => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const rHeaders = Object.assign(Object.assign({}, req.headers), requestOption.headers);
                if (!_.isEmpty(requestOption)) {
                    ['cache-control', 'if-none-match', 'if-modified-since'].forEach((key) => {
                        rHeaders[key] && delete rHeaders[key];
                        rHeaders['pragma'] = 'no-cache';
                        rHeaders['cache-control'] = 'no-cache';
                    });
                }
                const options = {
                    url: req.httpsURL || req.url,
                    method: req.method,
                    headers: rHeaders,
                    body: null,
                    encoding: null,
                    strictSSL: false,
                    rejectUnauthorized: false,
                    followRedirect: false,
                };
                if (['post', 'put'].includes(req.method.toLowerCase())) {
                    options.body = yield this.getPostBody(req);
                }
                if (req.httpVersion !== '2.0' && !((_a = req.headers) === null || _a === void 0 ? void 0 : _a.connection)) {
                    options.headers.connection = 'keep-alive';
                }
                if (req.httpVersion === '1.0' && options.headers['transfer-encoding']) {
                    delete options.headers['transfer-encoding'];
                }
                requestOption.headers = Object.assign(Object.assign({}, options.headers), requestOption.headers);
                const rOpts = Object.assign(Object.assign({}, options), requestOption);
                (0, socket_1.ioRequest)({
                    url: req.requestOriginUrl || options.url,
                    method: rOpts.method,
                    requestHeaders: rOpts.headers,
                    requestId: req.$requestId,
                    requestBody: rOpts.body,
                    matched: matcherResult === null || matcherResult === void 0 ? void 0 : matcherResult.matched,
                });
                (0, request_1.default)(rOpts)
                    .on("response", function (response) {
                    const responseHeaders = Object.assign(Object.assign({}, response.headers), responseOptions.headers);
                    if ((0, is_1.isInspectContentType)(Object.assign(Object.assign({}, rOpts.headers), responseHeaders))) {
                        const body = [];
                        response
                            .on("data", (data) => {
                            body.push(data);
                        })
                            .on("end", () => {
                            const buf = Buffer.concat(body);
                            (0, socket_1.ioRequest)({
                                requestId: req.$requestId,
                                responseBody: buf,
                            });
                        });
                    }
                    (0, socket_1.ioRequest)({
                        requestId: req.$requestId,
                        url: req.requestOriginUrl || options.url,
                        method: rOpts.method,
                        responseHeaders,
                        statusCode: response.statusCode,
                    });
                    res.writeHead(response.statusCode, responseHeaders);
                })
                    .on("error", (err) => {
                    utils_1.log.warn(`[http request error]: ${err.message}\n  url--->${rOpts.url}`);
                    res.writeHead(500, {});
                    res.end(err.message);
                })
                    .pipe(res);
            }));
        });
    },
    getPostBody(req) {
        return new Promise((resolve) => {
            const body = [];
            req.on('data', (chunk) => {
                body.push(chunk);
            });
            req.on('end', () => {
                resolve(Buffer.concat(body));
            });
        });
    },
    proxyLocalFile(filepath, res, resHeaders = {}) {
        try {
            fs.accessSync(filepath, fs.constants.R_OK);
            const readStream = fs.createReadStream(filepath);
            res.writeHead(200, resHeaders);
            readStream.pipe(res);
        }
        catch (err) {
            const s = new stream_1.Readable();
            res.writeHead(404, {});
            s.push('404: Not Found or Not Access');
            s.push(null);
            s.pipe(res);
        }
    },
};
