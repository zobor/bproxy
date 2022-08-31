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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bproxyPrefixHeader = exports.env = exports.configModuleTemplate = exports.configTemplateString = exports.configTemplate = exports.certificate = exports.appTempPath = exports.appInfoLogFilePath = exports.appErrorLogFilePath = exports.appConfigFilePath = exports.appDataPath = exports.appConfigFileName = void 0;
const lodash_1 = require("lodash");
const path = __importStar(require("path"));
const jsonFormat_1 = __importDefault(require("../web/libs/jsonFormat"));
const os_1 = require("./macos/os");
exports.appConfigFileName = 'bproxy.config.js';
exports.appDataPath = path.resolve(process.env.HOME || process.env.USERPROFILE || process.cwd(), './.AppData/bproxy');
exports.appConfigFilePath = path.resolve(exports.appDataPath, exports.appConfigFileName);
exports.appErrorLogFilePath = path.resolve(exports.appDataPath, 'logs/error.log');
exports.appInfoLogFilePath = path.resolve(exports.appDataPath, 'logs/info.log');
exports.appTempPath = process.env.TEMP;
const config = {
    debug: true,
    port: 8888,
    https: true,
    highPerformanceMode: false,
    rules: [
        {
            url: 'https://google.com/bproxy',
            target: 'hello bproxy\n',
        }
    ],
};
exports.default = config;
exports.certificate = {
    filename: 'bproxy.ca.crt',
    keyFileName: 'bproxy.ca.key.pem',
    name: `B Proxy CA(${(0, os_1.getComputerName)()})`,
    organizationName: 'zoborzhang',
    OU: 'https://github.com/zobor/bproxy',
    countryName: 'CN',
    provinceName: 'HuBei',
    localityName: 'WuHan',
    keySize: 2048,
    getDefaultCABasePath() {
        return exports.appDataPath;
    },
    getDefaultCACertPath() {
        return path.resolve(this.getDefaultCABasePath(), this.filename);
    },
    getDefaultCAKeyPath() {
        return path.resolve(this.getDefaultCABasePath(), this.keyFileName);
    },
};
exports.configTemplate = (0, lodash_1.omit)(config, ['certificate']);
exports.configTemplateString = JSON.stringify(exports.configTemplate);
exports.configModuleTemplate = `module.exports = ${(0, jsonFormat_1.default)(exports.configTemplate)}`;
exports.env = {
    bash: process.env.NODE_ENV === 'bash',
};
exports.bproxyPrefixHeader = 'x-bproxy';
