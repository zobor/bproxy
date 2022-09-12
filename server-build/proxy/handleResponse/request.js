"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "responseByRequest", {
    enumerable: true,
    get: ()=>responseByRequest
});
const _config = require("./../config");
const _socket = require("../socket/socket");
const _pako = /*#__PURE__*/ _interopRequireDefault(require("pako"));
const _request = /*#__PURE__*/ _interopRequireDefault(require("request"));
const _lodash = require("lodash");
const _is = require("../utils/is");
const _utils = require("../utils/utils");
const _text = require("./text");
const _dataset = /*#__PURE__*/ _interopRequireDefault(require("../utils/dataset"));
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
async function responseByRequest(req, res, requestOption, responseHeaders = {}, matcherResult, config, postBodyData) {
    return new Promise(async ()=>{
        var ref, ref1, ref2, ref3, ref4;
        const requestHeaders = _objectSpread({}, req.headers, requestOption.headers);
        const highPerformanceMode = _dataset.default === null || _dataset.default === void 0 ? void 0 : (ref = _dataset.default.config) === null || ref === void 0 ? void 0 : ref.highPerformanceMode;
        const debug = matcherResult === null || matcherResult === void 0 ? void 0 : (ref1 = matcherResult.rule) === null || ref1 === void 0 ? void 0 : ref1.debug;
        if ((config === null || config === void 0 ? void 0 : config.disableCache) || (matcherResult === null || matcherResult === void 0 ? void 0 : (ref2 = matcherResult.rule) === null || ref2 === void 0 ? void 0 : ref2.disableCache)) {
            [
                'cache-control',
                'if-none-match',
                'if-modified-since'
            ].forEach((key)=>{
                requestHeaders[key] && delete requestHeaders[key];
                requestHeaders['pragma'] = 'no-cache';
                requestHeaders['cache-control'] = 'no-cache';
            });
        }
        const url = (matcherResult === null || matcherResult === void 0 ? void 0 : matcherResult.matched) && ((matcherResult === null || matcherResult === void 0 ? void 0 : matcherResult.filepath) || (matcherResult === null || matcherResult === void 0 ? void 0 : (ref3 = matcherResult.rule) === null || ref3 === void 0 ? void 0 : ref3.redirect)) ? req.url : req.httpsURL;
        const options = {
            url: url || req.url,
            method: req.method,
            headers: requestHeaders,
            body: postBodyData || null,
            encoding: null,
            strictSSL: false,
            rejectUnauthorized: false,
            followRedirect: false
        };
        if (req.httpVersion !== '2.0' && !((ref4 = req.headers) === null || ref4 === void 0 ? void 0 : ref4.connection)) {
            options.headers.connection = 'keep-alive';
        }
        // todo deep assign object
        requestOption.headers = _objectSpread({}, options.headers, requestOption.headers);
        const rOpts = _objectSpread({}, options, requestOption);
        const ioRequestParams = {
            url: req.httpsURL || req.requestOriginUrl || options.url,
            method: rOpts.method,
            requestHeaders: rOpts.headers,
            requestId: req.$requestId,
            requestBody: rOpts.body && !highPerformanceMode ? rOpts.body.toString() : null,
            matched: matcherResult === null || matcherResult === void 0 ? void 0 : matcherResult.matched
        };
        (0, _socket.ioRequest)(ioRequestParams);
        const fetch = (0, _request.default)(rOpts).on('response', function(response) {
            var ref, ref1, ref2;
            let headers = (0, _lodash.omit)(_objectSpread({}, response.headers, responseHeaders), (0, _lodash.isArray)(matcherResult === null || matcherResult === void 0 ? void 0 : (ref = matcherResult.rule) === null || ref === void 0 ? void 0 : ref.excludeResponseHeaders) ? (matcherResult === null || matcherResult === void 0 ? void 0 : (ref1 = matcherResult.rule) === null || ref1 === void 0 ? void 0 : ref1.excludeResponseHeaders) || [] : []);
            headers = (0, _lodash.fromPairs)((0, _lodash.toPairs)(headers).map((arr)=>[
                    arr[0].trim(),
                    arr[1]
                ]));
            const encoding = (0, _lodash.get)(headers, '["content-encoding"]');
            const isGzip = encoding === 'gzip';
            const showContent = (0, _is.isInspectContentType)(headers || {});
            const ip = response === null || response === void 0 ? void 0 : (ref2 = response.socket) === null || ref2 === void 0 ? void 0 : ref2.remoteAddress;
            const statusCode = (response === null || response === void 0 ? void 0 : response.statusCode) || 500;
            !debug && res.writeHead(statusCode, headers);
            if (showContent && !highPerformanceMode) {
                const body = [];
                response.on('data', (d)=>body.push(d));
                response.on('end', ()=>{
                    const buf = Buffer.concat(body);
                    let str = buf;
                    if (isGzip) {
                        str = _pako.default.ungzip(new Uint8Array(buf), {
                            to: 'string'
                        });
                    } else if (!encoding) {
                        str = buf.toString();
                    }
                    if (debug) {
                        const txt = (0, _utils.hookConsoleLog)(str, debug);
                        let resData = txt;
                        if (isGzip) {
                            resData = _pako.default.gzip(txt);
                        }
                        headers = _objectSpreadProps(_objectSpread({}, headers), {
                            [`${_config.bproxyPrefixHeader}-debug`]: true
                        });
                        res.writeHead(statusCode, _objectSpreadProps(_objectSpread({}, headers), {
                            'content-length': resData.length
                        }));
                        (0, _text.responseText)(resData, res);
                        (0, _socket.ioRequest)(_objectSpreadProps(_objectSpread({}, ioRequestParams), {
                            requestId: req.$requestId,
                            responseHeaders: headers,
                            responseBody: txt,
                            statusCode
                        }));
                    } else {
                        (0, _socket.ioRequest)(_objectSpreadProps(_objectSpread({}, ioRequestParams), {
                            requestId: req.$requestId,
                            responseHeaders: headers,
                            responseBody: str,
                            statusCode,
                            ip
                        }));
                    }
                });
            } else {
                (0, _socket.ioRequest)(_objectSpreadProps(_objectSpread({}, ioRequestParams), {
                    requestId: req.$requestId,
                    responseHeaders: headers,
                    statusCode,
                    ip
                }));
            }
        }).on('error', (err)=>{
            res.writeHead(500, {});
            res.end(err.message);
            (0, _socket.ioRequest)({
                requestId: req.$requestId,
                statusCode: 500
            });
        });
        if (!debug) {
            // put response to proxy response
            fetch.pipe(res);
        }
    });
}
