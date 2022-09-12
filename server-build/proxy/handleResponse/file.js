"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    responseLocalFile: ()=>responseLocalFile,
    responseLocalPath: ()=>responseLocalPath
});
const _fs = /*#__PURE__*/ _interopRequireWildcard(require("fs"));
const _path = /*#__PURE__*/ _interopRequireWildcard(require("path"));
const _socket = require("../socket/socket");
const _file = require("../utils/file");
const _utils = require("../utils/utils");
const _config = require("./../config");
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
function responseByLocalFile(filepath, res, responseHeaders = {}, req) {
    try {
        _fs.accessSync(filepath, _fs.constants.R_OK);
        const readStream = _fs.createReadStream(filepath);
        const suffix = (0, _file.getFileTypeFromSuffix)(filepath);
        const fileContentType = (0, _file.getResponseContentType)(suffix);
        if (fileContentType && !responseHeaders['content-type']) {
            responseHeaders['content-type'] = fileContentType;
        }
        res.writeHead(200, responseHeaders);
        let responseBody = '不支持预览';
        if ([
            'json',
            'js',
            'css',
            'html',
            'svg'
        ].includes(suffix)) {
            responseBody = _fs.readFileSync(filepath, 'utf-8');
        }
        (0, _socket.ioRequest)({
            method: req.method,
            requestId: req.$requestId,
            responseHeaders: _objectSpreadProps(_objectSpread({}, responseHeaders), {
                [`${_config.bproxyPrefixHeader}-file`]: filepath
            }),
            statusCode: 200,
            responseBody,
            url: req.httpsURL || req.requestOriginUrl || req.url
        });
        readStream.pipe(res);
    } catch (err) {
        console.log(err);
        res.writeHead(404, {
            'content-type': 'text/html; charset=utf-8;'
        });
        (0, _text.responseText)(`<div style="color:red;">404: Not Found or Not Access:
      (${filepath}).
      <br>Error: ${JSON.stringify(err)}
    </div>`, res);
        (0, _socket.ioRequest)({
            method: req.method,
            requestId: req.$requestId,
            responseHeaders,
            statusCode: 404,
            url: req.httpsURL || req.requestOriginUrl || req.url
        });
    }
}
async function responseLocalFile(params) {
    const { req , res , postBodyData , delayTime , matcherResult , responseHeaders , requestHeaders  } = params;
    (0, _socket.ioRequest)({
        matched: true,
        requestId: req.$requestId,
        url: req.httpsURL || req.requestOriginUrl || req.url,
        method: req.method,
        requestHeaders: requestHeaders,
        requestBody: postBodyData === null || postBodyData === void 0 ? void 0 : postBodyData.toString()
    });
    if (delayTime) {
        await (0, _utils.delay)(delayTime);
    }
    const filepath = _path.resolve(matcherResult.rule.file);
    responseByLocalFile((0, _utils.safeDecodeUrl)(filepath), res, responseHeaders, req);
}
async function responseLocalPath(params) {
    const { req , res , postBodyData , delayTime , matcherResult , responseHeaders , requestHeaders  } = params;
    (0, _socket.ioRequest)({
        matched: true,
        requestId: req.$requestId,
        url: req.httpsURL || req.requestOriginUrl || req.url,
        method: req.method,
        statusCode: matcherResult.rule.statusCode,
        requestHeaders: requestHeaders,
        requestBody: postBodyData === null || postBodyData === void 0 ? void 0 : postBodyData.toString()
    });
    if (delayTime) {
        await (0, _utils.delay)(delayTime);
    }
    const filepath = _path.resolve(matcherResult.rule.path, matcherResult.rule.filepath || '');
    responseByLocalFile((0, _utils.safeDecodeUrl)(filepath), res, responseHeaders, req);
}
