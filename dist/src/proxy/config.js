"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const config = {
    port: 8888,
    configFile: path.resolve(process.cwd(), 'bproxy.config.js'),
    https: [],
    sslAll: true,
    host: [],
    rules: [
        {
            regx: 'baidu.com/bproxy',
            response: 'hello bproxy\n',
        }
    ],
    certificate: {
        filename: 'bproxy.ca.crt',
        keyFileName: 'bproxy.ca.key.pem',
        name: 'B Proxy CA',
        organizationName: 'zoborzhang',
        OU: 'https://github.com/zobor/bproxy',
        countryName: 'CN',
        provinceName: 'HuBei',
        localityName: 'WuHan',
        keySize: 2048,
        getDefaultCABasePath() {
            const userHome = process.env.HOME || process.env.USERPROFILE || process.cwd();
            return path.resolve(userHome, './.AppData/bproxy');
        },
        getDefaultCACertPath() {
            return path.resolve(this.getDefaultCABasePath(), this.filename);
        },
        getDefaultCAKeyPath() {
            return path.resolve(this.getDefaultCABasePath(), this.keyFileName);
        },
    },
};
exports.default = config;
