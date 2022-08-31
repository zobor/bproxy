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
exports.responseByFunction = void 0;
const config_1 = require("./../config");
const lodash_1 = require("lodash");
const is_1 = require("./../utils/is");
const socket_1 = require("../socket/socket");
const request_1 = __importDefault(require("request"));
const utils_1 = require("../utils/utils");
const is_2 = require("../utils/is");
function responseByFunction(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { req, res, postBodyData, delayTime, matcherResult, responseHeaders, requestHeaders } = params;
        const requestUrl = req.httpsURL || req.requestOriginUrl || req.url;
        (0, socket_1.ioRequest)({
            matched: true,
            requestId: req.$requestId,
            url: requestUrl,
            method: req.method,
            requestHeaders,
            requestBody: postBodyData === null || postBodyData === void 0 ? void 0 : postBodyData.toString(),
        });
        if (delayTime) {
            yield (0, utils_1.delay)(delayTime);
        }
        const rs = matcherResult.rule.response({
            response: res,
            fetch: request_1.default,
            request: request_1.default,
            rules: matcherResult === null || matcherResult === void 0 ? void 0 : matcherResult.rule,
            body: postBodyData,
        });
        let resData;
        if ((0, is_2.isPromise)(rs)) {
            resData = yield rs;
        }
        else {
            resData = rs;
        }
        responseHeaders[`${config_1.bproxyPrefixHeader}-function`] = true;
        if ((0, lodash_1.isUndefined)(resData)) {
            (0, socket_1.ioRequest)({
                requestId: req.$requestId,
                url: requestUrl,
                method: req.method,
                responseBody: 'function 方式代理中，无法查看内容',
                statusCode: 200,
                responseHeaders,
            });
            return;
        }
        const resDestructObject = (0, is_1.isObject)(resData) ? resData : {
            data: (0, lodash_1.isString)(resData) ? resData : JSON.stringify(resData),
            headers: {},
            statusCode: 200,
        };
        const { data, headers, statusCode = 200 } = resDestructObject;
        const respHeaders = Object.assign(Object.assign({}, (headers || {
            'content-type': 'bproxy/log',
        })), responseHeaders);
        (0, socket_1.ioRequest)({
            requestId: req.$requestId,
            url: requestUrl,
            method: req.method,
            responseBody: data,
            statusCode: statusCode,
            responseHeaders: respHeaders,
        });
        res.writeHead(statusCode, respHeaders);
        res.end(data);
    });
}
exports.responseByFunction = responseByFunction;
