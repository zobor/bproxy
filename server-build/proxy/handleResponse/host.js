"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "responseByHost", {
    enumerable: true,
    get: ()=>responseByHost
});
const _config = require("./../config");
const _utils = require("../utils/utils");
const _request = require("./request");
async function responseByHost(params) {
    const { req , res , postBodyData , delayTime , matcherResult , responseHeaders , config ,  } = params;
    if (delayTime) {
        await (0, _utils.delay)(delayTime);
    }
    const requestOptions = {
        hostname: matcherResult.rule.host
    };
    responseHeaders[`${_config.bproxyPrefixHeader}-host`] = matcherResult.rule.host;
    return (0, _request.responseByRequest)(req, res, requestOptions, responseHeaders, matcherResult, config, postBodyData);
}
