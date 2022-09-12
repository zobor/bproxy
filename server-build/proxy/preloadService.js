"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>preload
});
const _fs = /*#__PURE__*/ _interopRequireWildcard(require("fs"));
const _path = /*#__PURE__*/ _interopRequireWildcard(require("path"));
const _lodash = require("lodash");
const _file = require("./utils/file");
const _dataset = /*#__PURE__*/ _interopRequireDefault(require("./utils/dataset"));
const _config = require("./config");
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
const REG_IP = /^(\d{1,3}\.){3}\d{1,3}$/;
function checkResponseType(target, currentConfigPath) {
    // 响应函数
    if ((0, _lodash.isFunction)(target)) {
        return 'response';
    }
    // 响应字符串
    if ((0, _lodash.isString)(target)) {
        // 响应的是URL
        if (/https?:\/\//.test(target)) {
            return 'redirect';
        }
        // 响应IP
        if (REG_IP.test(target)) {
            return 'host';
        }
        // 响应的是文件或者目录
        if (target.indexOf('file://') === 0 || target.indexOf('/') === 0) {
            try {
                _fs.accessSync(`${target}`, _fs.constants.R_OK);
                return 'path';
            } catch (err) {
                console.error(`${target} 路径错误`);
            }
        }
        const pathOrFile = (0, _file.checkStringIsFileOrPath)(target, currentConfigPath);
        if (pathOrFile) {
            return pathOrFile;
        }
        return 'response';
    }
    // 响应的是数字
    if ((0, _lodash.isNumber)(target)) {
        return 'statusCode';
    }
    return undefined;
}
function checkSingleRule(rule) {
    var ref;
    // 废弃regx参数，使用新参数 url
    if (rule.url) {
        rule.regx = rule.url;
        delete rule.url;
    }
    const currentConfigPath = ((ref = _dataset.default.currentConfigPath) === null || ref === void 0 ? void 0 : ref.replace(_config.appConfigFileName, '')) || __dirname;
    if (rule.target) {
        const ruleKey = checkResponseType(rule.target, currentConfigPath);
        if (!ruleKey) {
            console.error('target参数错误');
        } else {
            switch(ruleKey){
                case 'path':
                case 'file':
                    rule[ruleKey] = _path.resolve(currentConfigPath, `${rule.target}`);
                    break;
                default:
                    rule[ruleKey] = rule.target;
                    break;
            }
            delete rule['target'];
        }
    }
    if (rule.cors === true) {
        rule.responseHeaders = _objectSpread({}, rule.responseHeaders || {}, {
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Accept,X-Requested-With'
        });
        delete rule.cors;
    }
    return rule;
}
function preload(params) {
    // 遍历所有的规则
    params.rules = params.rules.map((rule)=>checkSingleRule(rule));
    // 兼容老版本
    if (params.sslAll === true) {
        params.https = true;
        delete params.sslAll;
    }
    return params;
}
