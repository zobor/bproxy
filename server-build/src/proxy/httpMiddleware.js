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
const lodash_1 = require("lodash");
const code_1 = require("./handleResponse/code");
const file_1 = require("./handleResponse/file");
const function_1 = require("./handleResponse/function");
const host_1 = require("./handleResponse/host");
const proxy_1 = require("./handleResponse/proxy");
const redirect_1 = require("./handleResponse/redirect");
const request_1 = require("./handleResponse/request");
const string_1 = require("./handleResponse/string");
const matcher_1 = require("./matcher");
const dataset_1 = __importDefault(require("./utils/dataset"));
const request_2 = require("./utils/request");
const utils_1 = require("./utils/utils");
class httpMiddleware {
    static proxy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { config } = dataset_1.default;
            const { rules = [] } = config;
            const matcherResult = (0, matcher_1.matcher)(rules, req.httpsURL || req.url);
            const responseOptions = {
                headers: {},
            };
            let requestHeaders = req.headers;
            const delayTime = (0, request_2.getDalay)(matcherResult === null || matcherResult === void 0 ? void 0 : matcherResult.rule, config);
            const isPostOrPutMethod = ['post', 'put'].includes(req.method.toLowerCase());
            let postBodyData = undefined;
            if (isPostOrPutMethod) {
                postBodyData = yield (0, request_2.getPostBody)(req);
            }
            if (matcherResult.matched) {
                return new Promise(() => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    if (!matcherResult.rule)
                        return;
                    if (matcherResult === null || matcherResult === void 0 ? void 0 : matcherResult.responseHeaders) {
                        responseOptions.headers = Object.assign(Object.assign({}, responseOptions.headers), matcherResult.responseHeaders);
                    }
                    if ((_a = matcherResult === null || matcherResult === void 0 ? void 0 : matcherResult.rule) === null || _a === void 0 ? void 0 : _a.responseHeaders) {
                        responseOptions.headers = Object.assign(Object.assign({}, responseOptions.headers), matcherResult.rule.responseHeaders);
                    }
                    if ((_b = matcherResult === null || matcherResult === void 0 ? void 0 : matcherResult.rule) === null || _b === void 0 ? void 0 : _b.requestHeaders) {
                        requestHeaders = Object.assign(Object.assign({}, requestHeaders), matcherResult.rule.requestHeaders);
                    }
                    const responseHandleParams = {
                        req,
                        res,
                        responseHeaders: responseOptions.headers,
                        requestHeaders,
                        delayTime,
                        matcherResult,
                        postBodyData,
                        config,
                    };
                    if (matcherResult.rule.file) {
                        return (0, file_1.responseLocalFile)(responseHandleParams);
                    }
                    else if (matcherResult.rule.path) {
                        return (0, file_1.responseLocalPath)(responseHandleParams);
                    }
                    else if ((0, lodash_1.isFunction)(matcherResult.rule.response)) {
                        return (0, function_1.responseByFunction)(responseHandleParams);
                    }
                    else if ((0, lodash_1.isString)(matcherResult.rule.response)) {
                        return (0, string_1.responseByString)(responseHandleParams);
                    }
                    else if (matcherResult.rule.statusCode) {
                        return (0, code_1.responseByCode)(responseHandleParams);
                    }
                    else if ((0, lodash_1.isString)(matcherResult.rule.redirect)) {
                        return (0, redirect_1.responseByRedirect)(responseHandleParams);
                    }
                    else if ((0, lodash_1.isString)(matcherResult.rule.proxy)) {
                        return (0, proxy_1.responseByProxy)(responseHandleParams);
                    }
                    else if ((0, lodash_1.isString)(matcherResult.rule.host)) {
                        return (0, host_1.responseByHost)(responseHandleParams);
                    }
                    else {
                        if (delayTime) {
                            yield (0, utils_1.delay)(delayTime);
                        }
                        return (0, request_1.responseByRequest)(req, res, {}, responseOptions.headers, matcherResult, config, postBodyData);
                    }
                }));
            }
            if (delayTime) {
                yield (0, utils_1.delay)(delayTime);
            }
            return (0, request_1.responseByRequest)(req, res, {}, responseOptions.headers, {}, config, postBodyData);
        });
    }
}
exports.default = httpMiddleware;
;
