"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>httpMiddleware
});
const _lodash = require("lodash");
const _code = require("./handleResponse/code");
const _file = require("./handleResponse/file");
const _function = require("./handleResponse/function");
const _host = require("./handleResponse/host");
const _proxy = require("./handleResponse/proxy");
const _redirect = require("./handleResponse/redirect");
const _request = require("./handleResponse/request");
const _string = require("./handleResponse/string");
const _matcher = require("./matcher");
const _dataset = /*#__PURE__*/ _interopRequireDefault(require("./utils/dataset"));
const _request1 = require("./utils/request");
const _utils = require("./utils/utils");
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
class httpMiddleware {
    static async proxy(req, res) {
        const { config  } = _dataset.default;
        const { rules =[]  } = config;
        const matcherResult = (0, _matcher.matcher)(rules, req.httpsURL || req.url);
        const responseOptions = {
            headers: {}
        };
        let requestHeaders = req.headers;
        const delayTime = (0, _request1.getDalay)(matcherResult === null || matcherResult === void 0 ? void 0 : matcherResult.rule, config);
        const isPostOrPutMethod = [
            'post',
            'put'
        ].includes(req.method.toLowerCase());
        let postBodyData = undefined;
        if (isPostOrPutMethod) {
            postBodyData = await (0, _request1.getPostBody)(req);
        }
        if (matcherResult.matched) {
            return new Promise(async ()=>{
                var ref, ref1;
                if (!matcherResult.rule) return;
                if (matcherResult === null || matcherResult === void 0 ? void 0 : matcherResult.responseHeaders) {
                    responseOptions.headers = _objectSpread({}, responseOptions.headers, matcherResult.responseHeaders);
                }
                if (matcherResult === null || matcherResult === void 0 ? void 0 : (ref = matcherResult.rule) === null || ref === void 0 ? void 0 : ref.responseHeaders) {
                    responseOptions.headers = _objectSpread({}, responseOptions.headers, matcherResult.rule.responseHeaders);
                }
                if (matcherResult === null || matcherResult === void 0 ? void 0 : (ref1 = matcherResult.rule) === null || ref1 === void 0 ? void 0 : ref1.requestHeaders) {
                    requestHeaders = _objectSpread({}, requestHeaders, matcherResult.rule.requestHeaders);
                }
                const responseHandleParams = {
                    req,
                    res,
                    responseHeaders: responseOptions.headers,
                    requestHeaders,
                    delayTime,
                    matcherResult,
                    postBodyData,
                    config
                };
                // file
                if (matcherResult.rule.file) {
                    return (0, _file.responseLocalFile)(responseHandleParams);
                } else if (matcherResult.rule.path) {
                    return (0, _file.responseLocalPath)(responseHandleParams);
                } else if ((0, _lodash.isFunction)(matcherResult.rule.response)) {
                    return (0, _function.responseByFunction)(responseHandleParams);
                } else if ((0, _lodash.isString)(matcherResult.rule.response)) {
                    return (0, _string.responseByString)(responseHandleParams);
                } else if (matcherResult.rule.statusCode) {
                    return (0, _code.responseByCode)(responseHandleParams);
                } else if ((0, _lodash.isString)(matcherResult.rule.redirect)) {
                    return (0, _redirect.responseByRedirect)(responseHandleParams);
                } else if ((0, _lodash.isString)(matcherResult.rule.proxy)) {
                    return (0, _proxy.responseByProxy)(responseHandleParams);
                } else if ((0, _lodash.isString)(matcherResult.rule.host)) {
                    return (0, _host.responseByHost)(responseHandleParams);
                } else {
                    if (delayTime) {
                        await (0, _utils.delay)(delayTime);
                    }
                    return (0, _request.responseByRequest)(req, res, {}, responseOptions.headers, matcherResult, config, postBodyData);
                }
            });
        }
        if (delayTime) {
            await (0, _utils.delay)(delayTime);
        }
        return (0, _request.responseByRequest)(req, res, {}, responseOptions.headers, {}, config, postBodyData);
    }
}
