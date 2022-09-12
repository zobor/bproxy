/*
 * @Date: 2022-07-10 21:36:48
 * @LastEditors: 张恒 nodejs.js@gmail.com
 * @LastEditTime: 2022-08-13 22:50:17
 * @FilePath: /bp/src/proxy/handleResponse/proxy.ts
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "responseByProxy", {
    enumerable: true,
    get: ()=>responseByProxy
});
const _config = require("../config");
const _utils = require("../utils/utils");
const _request = require("./request");
async function responseByProxy(params) {
    const { req , res , postBodyData , delayTime , matcherResult , responseHeaders , config ,  } = params;
    if (delayTime) {
        await (0, _utils.delay)(delayTime);
    }
    const requestOptions = {
        proxy: matcherResult.rule.proxy
    };
    responseHeaders[`${_config.bproxyPrefixHeader}-host`] = matcherResult.rule.proxy;
    return (0, _request.responseByRequest)(req, res, requestOptions, responseHeaders, matcherResult, config, postBodyData);
}
