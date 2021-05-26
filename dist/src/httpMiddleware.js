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
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpMiddleware = void 0;
const request = require("request");
const fs = require("fs");
const stream_1 = require("stream");
const _ = require("lodash");
const path = require("path");
const url = require("url");
const rule_1 = require("./rule");
const common_1 = require("./common");
const dataset = {
    cache: {},
};
exports.httpMiddleware = {
    responseByText(text, res) {
        const s = new stream_1.Readable();
        s.push(text);
        s.push(null);
        s.pipe(res);
    },
    proxy(req, res, config) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { rules } = config;
            const pattern = rule_1.rulesPattern(rules, req.httpsURL || req.url);
            const resOptions = {
                headers: {},
                showLog: (_a = pattern === null || pattern === void 0 ? void 0 : pattern.matchedRule) === null || _a === void 0 ? void 0 : _a.showLog
            };
            if (pattern.matched) {
                return new Promise(() => {
                    var _a;
                    if (!pattern.matchedRule)
                        return;
                    if ((_a = pattern === null || pattern === void 0 ? void 0 : pattern.matchedRule) === null || _a === void 0 ? void 0 : _a.responseHeaders) {
                        resOptions.headers = Object.assign({}, pattern.matchedRule.responseHeaders);
                    }
                    if (pattern.matchedRule.file) {
                        this.proxyLocalFile(pattern.matchedRule.file, res, resOptions.headers);
                    }
                    else if (pattern.matchedRule.path) {
                        this.proxyLocalFile(path.resolve(pattern.matchedRule.path, pattern.filepath || ''), res, resOptions.headers);
                    }
                    else if (_.isFunction(pattern.matchedRule.response)) {
                        pattern.matchedRule.response({
                            response: res,
                            request,
                            req,
                        });
                    }
                    else if (_.isString(pattern.matchedRule.response)) {
                        this.responseByText(pattern.matchedRule.response, res);
                    }
                    else if (pattern.matchedRule.statusCode) {
                        res.end();
                    }
                    else if (_.isString(pattern.matchedRule.redirect)) {
                        req.url = pattern.matchedRule.redirect;
                        if (pattern.matchedRule.filepath) {
                            req.url = `${req.url}${pattern.matchedRule.filepath}`;
                        }
                        req.httpsURL = req.url;
                        const redirectUrlParam = url.parse(req.url);
                        if (redirectUrlParam.host && req.headers) {
                            req.headers.host = redirectUrlParam.host;
                        }
                        return this.proxyByRequest(req, res, {
                            headers: pattern.matchedRule.requestHeaders || {}
                        }, resOptions, pattern);
                    }
                    else if (_.isString(pattern.matchedRule.proxy)) {
                        return this.proxyByRequest(req, res, {
                            proxy: pattern.matchedRule.proxy,
                        }, resOptions);
                    }
                    else if (_.isString(pattern.matchedRule.host)) {
                        return this.proxyByRequest(req, res, {
                            hostname: pattern.matchedRule.host,
                        }, resOptions);
                    }
                    else if (pattern.matchedRule.showLog === true) {
                        return this.proxyByRequest(req, res, {}, Object.assign(Object.assign({}, resOptions), {
                            showLog: true,
                            download: pattern.matchedRule.download,
                            config,
                        }));
                    }
                    else {
                        console.log('// todo');
                        console.log(pattern);
                    }
                });
            }
            else {
                return this.proxyByRequest(req, res, {}, resOptions);
            }
        });
    },
    proxyByRequest(req, res, requestOption, responseOptions, pattern = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(() => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const rHeaders = Object.assign(Object.assign({}, req.headers), requestOption.headers);
                const options = {
                    url: req.httpsURL || req.url,
                    method: req.method,
                    headers: rHeaders,
                    body: null,
                    encoding: null,
                    strictSSL: false,
                    rejectUnauthorized: false,
                };
                if (req.method.toLowerCase() === 'post') {
                    options.body = yield this.getPOSTBody(req);
                }
                if (responseOptions.download &&
                    responseOptions.config &&
                    responseOptions.config.downloadPath &&
                    !dataset.cache[options.url]) {
                    const downloadFileName = common_1.utils.uuid(12);
                    const parseUrl = url.parse(options.url);
                    const fileName = (parseUrl.pathname || '').split('/').pop();
                    if (fileName) {
                        const filetype = fileName.split('.').pop();
                        if (filetype) {
                            request(Object.assign(Object.assign({}, options), requestOption)).pipe(fs.createWriteStream(`${responseOptions.config.downloadPath}/${downloadFileName}.${filetype}`));
                            return;
                        }
                    }
                }
                requestOption.headers = Object.assign(Object.assign({}, options.headers), requestOption.headers);
                const rOpts = Object.assign(Object.assign({}, options), requestOption);
                if (responseOptions.showLog) {
                    console.log('---request.options---\n', rOpts);
                    if (rOpts.method === 'POST') {
                        console.log('---request.body---\n', rOpts.body.toString());
                    }
                }
                if (responseOptions.showLog && rOpts.headers['accept-encoding']) {
                    delete rOpts.headers['accept-encoding'];
                }
                if (((_a = pattern === null || pattern === void 0 ? void 0 : pattern.matchedRule) === null || _a === void 0 ? void 0 : _a.OPTIONS2POST) && req.method === 'OPTIONS') {
                    rOpts.method = 'POST';
                }
                request(rOpts)
                    .on("response", function (response) {
                    if (responseOptions.showLog) {
                        console.log('---response.headers---\n', Object.assign(Object.assign({}, response.headers), responseOptions.headers));
                        const body = [];
                        response.on('data', (data) => {
                            body.push(data);
                        }).on('end', () => {
                            const buf = Buffer.concat(body);
                            console.log('---response.body---\n', buf.toString());
                        });
                    }
                    res.writeHead(response.statusCode, Object.assign(Object.assign({}, response.headers), responseOptions.headers));
                })
                    .pipe(res);
            }));
        });
    },
    getPOSTBody(req) {
        return new Promise((resolve) => {
            const body = [];
            req.on('data', (chunk) => {
                body.push(chunk);
            });
            req.on('end', () => {
                resolve(Buffer.concat(body));
            });
            req.on('error', (err) => {
                console.error(err);
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
            s.push('404: Not Found or Not Acces');
            s.push(null);
            s.pipe(res);
        }
    },
};
