"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "responseByFunction", {
    enumerable: true,
    get: ()=>responseByFunction
});
const _config = require("./../config");
const _lodash = require("lodash");
const _is = require("./../utils/is");
const _socket = require("../socket/socket");
const _request = /*#__PURE__*/ _interopRequireDefault(require("request"));
const _utils = require("../utils/utils");
const _is1 = require("../utils/is");
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
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
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
async function responseByFunction(params) {
    const { req , res , postBodyData , delayTime , matcherResult , responseHeaders , requestHeaders  } = params;
    const requestUrl = req.httpsURL || req.requestOriginUrl || req.url;
    (0, _socket.ioRequest)({
        matched: true,
        requestId: req.$requestId,
        url: requestUrl,
        method: req.method,
        requestHeaders,
        requestBody: postBodyData === null || postBodyData === void 0 ? void 0 : postBodyData.toString()
    });
    if (delayTime) {
        await (0, _utils.delay)(delayTime);
    }
    const rs = matcherResult.rule.response({
        response: res,
        fetch: _request.default,
        request: _request.default,
        rules: matcherResult === null || matcherResult === void 0 ? void 0 : matcherResult.rule,
        body: postBodyData
    });
    let resData;
    if ((0, _is1.isPromise)(rs)) {
        resData = await rs;
    } else {
        resData = rs;
    }
    responseHeaders[`${_config.bproxyPrefixHeader}-function`] = true;
    if ((0, _lodash.isUndefined)(resData)) {
        (0, _socket.ioRequest)({
            requestId: req.$requestId,
            url: requestUrl,
            method: req.method,
            responseBody: 'function 方式代理中，无法查看内容',
            statusCode: 200,
            responseHeaders
        });
        return;
    }
    const resDestructObject = (0, _is.isObject)(resData) ? resData : {
        data: (0, _lodash.isString)(resData) ? resData : JSON.stringify(resData),
        headers: {},
        statusCode: 200
    };
    const { data , headers , statusCode =200  } = resDestructObject;
    const respHeaders = _objectSpread({}, headers || {
        'content-type': 'bproxy/log'
    }, responseHeaders);
    (0, _socket.ioRequest)({
        requestId: req.$requestId,
        url: requestUrl,
        method: req.method,
        responseBody: data,
        statusCode: statusCode,
        responseHeaders: respHeaders
    });
    res.writeHead(statusCode, respHeaders);
    res.end(data);
}
