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
exports.responseByString = void 0;
const config_1 = require("./../config");
const socket_1 = require("../socket/socket");
const check_1 = require("../utils/check");
const utils_1 = require("../utils/utils");
const text_1 = require("./text");
function responseByString(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { req, res, postBodyData, delayTime, matcherResult, responseHeaders: respHeaders, requestHeaders } = params;
        const url = req.httpsURL || req.requestOriginUrl || req.url;
        (0, socket_1.ioRequest)({
            matched: true,
            requestId: req.$requestId,
            url,
            method: req.method,
            requestHeaders,
            requestBody: postBodyData === null || postBodyData === void 0 ? void 0 : postBodyData.toString(),
        });
        if (delayTime) {
            yield (0, utils_1.delay)(delayTime);
        }
        const responseHeaders = Object.assign(Object.assign({}, respHeaders), { 'content-type': (0, check_1.isLikeJson)(matcherResult.rule.response)
                ? 'application/json'
                : 'text/html', [`${config_1.bproxyPrefixHeader}-string`]: true });
        (0, socket_1.ioRequest)({
            requestId: req.$requestId,
            url,
            method: req.method,
            statusCode: matcherResult.rule.statusCode || 200,
            responseHeaders: Object.assign({}, responseHeaders),
            responseBody: matcherResult.rule.response,
        });
        res.writeHead(200, responseHeaders || {});
        (0, text_1.responseText)(matcherResult.rule.response, res);
    });
}
exports.responseByString = responseByString;
