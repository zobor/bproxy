/*
 * @Date: 2022-06-24 21:36:22
 * @LastEditors: 张恒 nodejs.js@gmail.com
 * @LastEditTime: 2022-08-13 18:04:33
 * @FilePath: /bp/src/proxy/handleResponse/code.ts
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "responseByCode", {
    enumerable: true,
    get: ()=>responseByCode
});
const _socket = require("../socket/socket");
const _utils = require("../utils/utils");
async function responseByCode(params) {
    const { req , res , postBodyData , delayTime , matcherResult , responseHeaders , requestHeaders  } = params;
    const url = req.httpsURL || req.requestOriginUrl || req.url;
    (0, _socket.ioRequest)({
        matched: true,
        requestId: req.$requestId,
        url,
        method: req.method,
        requestHeaders,
        requestBody: postBodyData === null || postBodyData === void 0 ? void 0 : postBodyData.toString()
    });
    if (delayTime) {
        await (0, _utils.delay)(delayTime);
    }
    (0, _socket.ioRequest)({
        requestId: req.$requestId,
        url,
        method: req.method,
        statusCode: matcherResult.rule.statusCode,
        responseBody: '',
        responseHeaders
    });
    res.writeHead(matcherResult.rule.statusCode, {});
    res.end();
}
