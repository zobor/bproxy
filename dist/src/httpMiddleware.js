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
const request = require("request");
const fs = require("fs");
const stream_1 = require("stream");
const _ = require("lodash");
const path = require("path");
const url = require("url");
const fileType = require("file-type");
const rule_1 = require("./rule");
const common_1 = require("./common");
const dataset = {
    cache: {},
};
exports.httpMiddleware = {
    proxy(req, res, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rules } = config;
            const pattern = rule_1.rulesPattern(rules, req.httpsURL || req.url);
            if (pattern.matched) {
                return new Promise(() => {
                    if (!pattern.matchedRule)
                        return;
                    if (pattern.matchedRule.file) {
                        this.proxyLocalFile(pattern.matchedRule.file, res);
                    }
                    else if (pattern.matchedRule.path) {
                        this.proxyLocalFile(path.resolve(pattern.matchedRule.path, pattern.filepath || ''), res);
                    }
                    else if (_.isFunction(pattern.matchedRule.response)) {
                        pattern.matchedRule.response({
                            response: res,
                        });
                    }
                    else if (_.isString(pattern.matchedRule.response)) {
                        res.end(pattern.matchedRule.response);
                    }
                    else if (_.isString(pattern.matchedRule.redirect)) {
                        req.url = pattern.matchedRule.redirect;
                        const redirectUrlParam = url.parse(req.url);
                        if (redirectUrlParam.host && req.headers) {
                            req.headers.host = redirectUrlParam.host;
                        }
                        return this.proxyByRequest(req, res, {}, {});
                    }
                    else if (_.isString(pattern.matchedRule.proxy)) {
                        return this.proxyByRequest(req, res, {
                            proxy: pattern.matchedRule.proxy,
                        }, {});
                    }
                    else if (_.isString(pattern.matchedRule.host)) {
                        return this.proxyByRequest(req, res, {
                            hostname: pattern.matchedRule.host,
                        }, {});
                    }
                    else if (pattern.matchedRule.showLog === true) {
                        return this.proxyByRequest(req, res, {}, {
                            showLog: true,
                            download: pattern.matchedRule.download,
                            config,
                        });
                    }
                    else {
                        console.log('// todo');
                        console.log(pattern);
                    }
                });
            }
            else {
                return this.proxyByRequest(req, res, {}, {});
            }
        });
    },
    proxyByRequest(req, res, requestOption, responseOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                const rHeaders = Object.assign({}, req.headers);
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
                if (responseOptions.showLog) {
                    console.info('URL: ', options.url);
                }
                request(Object.assign(Object.assign({}, options), requestOption), (err, resp, body) => {
                    if (err) {
                        console.error('node http request error:', err);
                        res.end(err);
                        return;
                    }
                    res.writeHead(resp.statusCode, Object.assign(Object.assign({}, resp.headers), responseOptions.headers));
                    res.write(body);
                    res.end();
                    if (responseOptions.download &&
                        responseOptions.config &&
                        responseOptions.config.downloadPath &&
                        !dataset.cache[options.url]) {
                        console.log('download: URL: ', options.url);
                        dataset.cache[options.url] = true;
                        const filetype = fileType(body);
                        if (filetype && filetype.ext) {
                            const downloadFileName = common_1.utils.guid();
                            const downloadFilePath = `${responseOptions.config.downloadPath}/${downloadFileName}.${filetype.ext}`;
                            fs.writeFile(downloadFilePath, body, () => {
                                console.log('download suc: ', downloadFilePath);
                            });
                        }
                    }
                });
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
    proxyLocalFile(filepath, res) {
        try {
            fs.accessSync(filepath, fs.constants.R_OK);
            const readStream = fs.createReadStream(filepath);
            readStream.pipe(res);
        }
        catch (err) {
            const s = new stream_1.Readable();
            s.push('Not Found or Not Acces');
            s.push(null);
            s.pipe(res);
            res.writeHead(404, {});
        }
    },
};
