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
exports.responseByCode = void 0;
const socket_1 = require("../socket/socket");
const utils_1 = require("../utils/utils");
function responseByCode(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { req, res, postBodyData, delayTime, matcherResult, responseHeaders, requestHeaders } = params;
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
        (0, socket_1.ioRequest)({
            requestId: req.$requestId,
            url,
            method: req.method,
            statusCode: matcherResult.rule.statusCode,
            responseBody: '',
            responseHeaders,
        });
        res.writeHead(matcherResult.rule.statusCode, {});
        res.end();
    });
}
exports.responseByCode = responseByCode;
