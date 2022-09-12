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
    appConfigFileName: ()=>appConfigFileName,
    appDataPath: ()=>appDataPath,
    appConfigFilePath: ()=>appConfigFilePath,
    appErrorLogFilePath: ()=>appErrorLogFilePath,
    appInfoLogFilePath: ()=>appInfoLogFilePath,
    appTempPath: ()=>appTempPath,
    default: ()=>_default,
    certificate: ()=>certificate,
    configTemplate: ()=>configTemplate,
    configTemplateString: ()=>configTemplateString,
    configModuleTemplate: ()=>configModuleTemplate,
    env: ()=>env,
    bproxyPrefixHeader: ()=>bproxyPrefixHeader,
    webRelativePath: ()=>webRelativePath
});
const _lodash = require("lodash");
const _path = /*#__PURE__*/ _interopRequireWildcard(require("path"));
const _jsonFormat = /*#__PURE__*/ _interopRequireDefault(require("../utils/jsonFormat"));
const _os = require("./macos/os");
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
const appConfigFileName = 'bproxy.config.js';
const appDataPath = _path.resolve(process.env.HOME || process.env.USERPROFILE || process.cwd(), './.AppData/bproxy');
const appConfigFilePath = _path.resolve(appDataPath, appConfigFileName);
const appErrorLogFilePath = _path.resolve(appDataPath, 'logs/error.log');
const appInfoLogFilePath = _path.resolve(appDataPath, 'logs/info.log');
const appTempPath = process.env.TEMP;
const config = {
    debug: true,
    port: 8888,
    https: true,
    highPerformanceMode: false,
    rules: [
        {
            url: 'https://qq.com/bproxy',
            target: 'hello bproxy\n'
        }
    ]
};
const _default = config;
const certificate = {
    filename: 'bproxy.ca.crt',
    keyFileName: 'bproxy.ca.key.pem',
    name: `bproxy CA(${(0, _os.getComputerName)()})`,
    organizationName: 'zoborzhang',
    OU: 'https://github.com/zobor/bproxy',
    countryName: 'CN',
    provinceName: 'HuBei',
    localityName: 'WuHan',
    keySize: 2048,
    getDefaultCABasePath () {
        return appDataPath;
    },
    getDefaultCACertPath () {
        return _path.resolve(this.getDefaultCABasePath(), this.filename);
    },
    getDefaultCAKeyPath () {
        return _path.resolve(this.getDefaultCABasePath(), this.keyFileName);
    }
};
const configTemplate = (0, _lodash.omit)(config, [
    'certificate'
]);
const configTemplateString = JSON.stringify(configTemplate);
const configModuleTemplate = `module.exports = ${(0, _jsonFormat.default)(configTemplate)}`;
const env = {
    bash: process.env.NODE_ENV === 'bash'
};
const bproxyPrefixHeader = 'x-bproxy';
const webRelativePath = '../../../';
