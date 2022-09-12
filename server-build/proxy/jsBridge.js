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
    test: ()=>test,
    getLocalIp: ()=>getLocalIp,
    getLocalProxyPort: ()=>getLocalProxyPort,
    getProxyConfig: ()=>getProxyConfig,
    getConfigFile: ()=>getConfigFile,
    getConfigFileContent: ()=>getConfigFileContent,
    getVersion: ()=>getVersion,
    setConfigFileContent: ()=>setConfigFileContent,
    getDebugTargets: ()=>getDebugTargets,
    selectFilePath: ()=>selectFilePath,
    openLogFile: ()=>openLogFile,
    openWebPage: ()=>openWebPage,
    getRuntimePlatform: ()=>getRuntimePlatform,
    setConfigFilePath: ()=>setConfigFilePath,
    getLogContent: ()=>getLogContent,
    clearLogConent: ()=>clearLogConent
});
const _fs = /*#__PURE__*/ _interopRequireDefault(require("fs"));
const _lodash = require("lodash");
const _url = /*#__PURE__*/ _interopRequireWildcard(require("url"));
const _packageJson = /*#__PURE__*/ _interopRequireWildcard(require("../../package.json"));
const _constant = require("../utils/constant");
const _api = require("./api");
const _config = require("./config");
const _getUserConfig = require("./getUserConfig");
const _matcher = require("./matcher");
const _socket = require("./socket/socket");
const _dataset = /*#__PURE__*/ _interopRequireDefault(require("./utils/dataset"));
const _ip = require("./utils/ip");
_exportStar(require("./macos/os"), exports);
_exportStar(require("./systemProxy"), exports);
function _exportStar(from, to) {
    Object.keys(from).forEach(function(k) {
        if (k !== "default" && !Object.prototype.hasOwnProperty.call(to, k)) Object.defineProperty(to, k, {
            enumerable: true,
            get: function() {
                return from[k];
            }
        });
    });
    return from;
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
const test = async (url)=>{
    const { config  } = _dataset.default;
    if (!_constant.IS_REG_URL.test(url)) {
        return {
            error: '不是有效的URL'
        };
    }
    if (config) {
        const matchResult = (0, _lodash.cloneDeep)((0, _matcher.matcher)(config.rules, url));
        if (!config.sslAll && !matchResult.matched) {
            var ref;
            const urlParsed = _url.parse(url);
            const { protocol , host , port  } = urlParsed;
            const hostname = `${host}:${port || 443}`;
            if (protocol === 'https:' && Array.isArray(config.https) && !((ref = config.https) === null || ref === void 0 ? void 0 : ref.includes(hostname))) {
                return {
                    error: `您开启了https白名单，当前url域名(${hostname})不在白名单`,
                    help: `请将 ${hostname} 添加到bproxy.config.js的https字段配置中`
                };
            }
        }
        for(const key in matchResult){
            if (key === 'rule') {
                for(const k in matchResult.rule){
                    if (k === 'regx' && (0, _lodash.get)(matchResult, 'rule.regx')) {
                        matchResult.rule[k] = (0, _lodash.get)(matchResult, 'rule.regx').toString();
                    }
                }
            }
        }
        return matchResult;
    }
    return {};
};
const getLocalIp = async ()=>{
    return (0, _ip.getLocalIpAddress)();
};
const getLocalProxyPort = async ()=>{
    const { config  } = _dataset.default;
    return config === null || config === void 0 ? void 0 : config.port;
};
const getProxyConfig = async ()=>{
    const { config  } = _dataset.default;
    return config;
};
const getConfigFile = ()=>_dataset.default.currentConfigPath;
const getConfigFileContent = ()=>{
    const configFilePath = getConfigFile();
    if (configFilePath) {
        const txt = _fs.default.readFileSync(configFilePath, 'utf-8');
        return txt;
    }
    return '';
};
const getVersion = ()=>{
    return _packageJson.version;
};
const setConfigFileContent = (params)=>{
    const configFilePath = getConfigFile();
    const { data  } = params || {};
    if (configFilePath && data) {
        _fs.default.writeFileSync(configFilePath, data);
        return true;
    }
    return false;
};
const getDebugTargets = ()=>{
    return _socket.channelManager._targets;
};
const selectFilePath = ()=>(0, _api.showSelectPath)();
const openLogFile = ()=>{
    (0, _api.previewTextFile)(_config.appInfoLogFilePath);
};
const openWebPage = ()=>{
    (0, _api.showBproxyHome)();
};
const getRuntimePlatform = ()=>{
    return _dataset.default.platform;
};
const setConfigFilePath = ({ filepath  })=>{
    (0, _getUserConfig.updateConfigPathAndWatch)({
        configPath: filepath
    });
};
const getLogContent = ()=>{
    return _fs.default.readFileSync(_config.appInfoLogFilePath, 'utf-8');
};
const clearLogConent = ()=>{
    return _fs.default.writeFileSync(_config.appInfoLogFilePath, '');
};
