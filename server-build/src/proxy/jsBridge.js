"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearLogConent = exports.getLogContent = exports.setConfigFilePath = exports.getRuntimePlatform = exports.openWebPage = exports.openLogFile = exports.selectFilePath = exports.getDebugTargets = exports.setConfigFileContent = exports.getVersion = exports.getConfigFileContent = exports.getConfigFile = exports.getProxyConfig = exports.getLocalProxyPort = exports.getLocalIp = exports.test = void 0;
const fs_1 = __importDefault(require("fs"));
const lodash_1 = require("lodash");
const URL = __importStar(require("url"));
const pkg = __importStar(require("../../package.json"));
const constant_1 = require("../utils/constant");
const config_1 = require("./config");
const electronApi_1 = require("./electronApi");
const getUserConfig_1 = require("./getUserConfig");
const matcher_1 = require("./matcher");
const socket_1 = require("./socket/socket");
const dataset_1 = __importDefault(require("./utils/dataset"));
const ip_1 = require("./utils/ip");
__exportStar(require("./macos/os"), exports);
__exportStar(require("./systemProxy"), exports);
const test = (url) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { config } = dataset_1.default;
    if (!constant_1.IS_REG_URL.test(url)) {
        return {
            error: '不是有效的URL',
        };
    }
    if (config) {
        const matchResult = (0, lodash_1.cloneDeep)((0, matcher_1.matcher)(config.rules, url));
        if (!config.sslAll && !matchResult.matched) {
            const urlParsed = URL.parse(url);
            const { protocol, host, port } = urlParsed;
            const hostname = `${host}:${port || 443}`;
            if (protocol === 'https:' &&
                Array.isArray(config.https) &&
                !((_a = config.https) === null || _a === void 0 ? void 0 : _a.includes(hostname))) {
                return {
                    error: `您开启了https白名单，当前url域名(${hostname})不在白名单`,
                    help: `请将 ${hostname} 添加到bproxy.config.js的https字段配置中`,
                };
            }
        }
        for (const key in matchResult) {
            if (key === 'rule') {
                for (const k in matchResult.rule) {
                    if (k === 'regx' && (0, lodash_1.get)(matchResult, 'rule.regx')) {
                        matchResult.rule[k] = (0, lodash_1.get)(matchResult, 'rule.regx').toString();
                    }
                }
            }
        }
        return matchResult;
    }
    return {};
});
exports.test = test;
const getLocalIp = () => __awaiter(void 0, void 0, void 0, function* () {
    return (0, ip_1.getLocalIpAddress)();
});
exports.getLocalIp = getLocalIp;
const getLocalProxyPort = () => __awaiter(void 0, void 0, void 0, function* () {
    const { config } = dataset_1.default;
    return config === null || config === void 0 ? void 0 : config.port;
});
exports.getLocalProxyPort = getLocalProxyPort;
const getProxyConfig = () => __awaiter(void 0, void 0, void 0, function* () {
    const { config } = dataset_1.default;
    return config;
});
exports.getProxyConfig = getProxyConfig;
const getConfigFile = () => dataset_1.default.currentConfigPath;
exports.getConfigFile = getConfigFile;
const getConfigFileContent = () => {
    const configFilePath = (0, exports.getConfigFile)();
    if (configFilePath) {
        const txt = fs_1.default.readFileSync(configFilePath, 'utf-8');
        return txt;
    }
    return '';
};
exports.getConfigFileContent = getConfigFileContent;
const getVersion = () => {
    return pkg.version;
};
exports.getVersion = getVersion;
const setConfigFileContent = (params) => {
    const configFilePath = (0, exports.getConfigFile)();
    const { data } = params || {};
    if (configFilePath && data) {
        fs_1.default.writeFileSync(configFilePath, data);
        return true;
    }
    return false;
};
exports.setConfigFileContent = setConfigFileContent;
const getDebugTargets = () => {
    return socket_1.channelManager._targets;
};
exports.getDebugTargets = getDebugTargets;
const selectFilePath = () => (0, electronApi_1.showSelectPathDialog)();
exports.selectFilePath = selectFilePath;
const openLogFile = () => {
    (0, electronApi_1.openAndPreviewTextFile)({ url: config_1.appInfoLogFilePath, width: 0, height: 0 });
};
exports.openLogFile = openLogFile;
const openWebPage = () => {
    (0, electronApi_1.showHomePage)();
};
exports.openWebPage = openWebPage;
const getRuntimePlatform = () => {
    return dataset_1.default.platform;
};
exports.getRuntimePlatform = getRuntimePlatform;
const setConfigFilePath = ({ filepath }) => {
    (0, getUserConfig_1.updateConfigPathAndWatch)({ configPath: filepath });
};
exports.setConfigFilePath = setConfigFilePath;
const getLogContent = () => {
    return fs_1.default.readFileSync(config_1.appInfoLogFilePath, 'utf-8');
};
exports.getLogContent = getLogContent;
const clearLogConent = () => {
    return fs_1.default.writeFileSync(config_1.appInfoLogFilePath, '');
};
exports.clearLogConent = clearLogConent;
