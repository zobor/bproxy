"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "responseByString", {
    enumerable: true,
    get: ()=>responseByString
});
const _config = require("./../config");
const _socket = require("../socket/socket");
const _check = require("../utils/check");
const _utils = require("../utils/utils");
const _text = require("./text");
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === 'function') {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpreadProps(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
async function responseByString(params) {
    const { req , res , postBodyData , delayTime , matcherResult , responseHeaders: respHeaders , requestHeaders  } = params;
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
    const responseHeaders = _objectSpreadProps(_objectSpread({}, respHeaders), {
        'content-type': (0, _check.isLikeJson)(matcherResult.rule.response) ? 'application/json' : 'text/html',
        [`${_config.bproxyPrefixHeader}-string`]: true
    });
    (0, _socket.ioRequest)({
        requestId: req.$requestId,
        url,
        method: req.method,
        statusCode: matcherResult.rule.statusCode || 200,
        responseHeaders: _objectSpread({}, responseHeaders),
        responseBody: matcherResult.rule.response
    });
    res.writeHead(200, responseHeaders || {});
    (0, _text.responseText)(matcherResult.rule.response, res);
}
