"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "responseByRedirect", {
    enumerable: true,
    get: ()=>responseByRedirect
});
const _url = /*#__PURE__*/ _interopRequireWildcard(require("url"));
const _config = require("../config");
const _utils = require("../utils/utils");
const _request = require("./request");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
async function responseByRedirect(params) {
    const { req , res , postBodyData , delayTime , matcherResult , responseHeaders , config  } = params;
    req.requestOriginUrl = req.url;
    req.url = matcherResult.rule.redirectTarget || matcherResult.rule.redirect;
    const httpsURL = req.httpsURL || req.requestOriginUrl;
    const redirectUrlParam = _url.parse(req.url);
    if (redirectUrlParam.host && req.headers) {
        req.headers.host = redirectUrlParam.host;
    }
    const requestOption = {
        headers: matcherResult.rule.requestHeaders || {}
    };
    responseHeaders[`${_config.bproxyPrefixHeader}-redirect`] = req.url;
    responseHeaders[`${_config.bproxyPrefixHeader}-redirect-origin-url`] = httpsURL || '';
    if (delayTime) {
        await (0, _utils.delay)(delayTime);
    }
    return (0, _request.responseByRequest)(req, res, requestOption, responseHeaders, matcherResult, config, postBodyData);
}
