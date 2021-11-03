"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalIp = exports.test = void 0;
const localServer_1 = __importDefault(require("./localServer"));
const matcher_1 = require("./matcher");
const config_1 = __importDefault(require("./config"));
const dataset_1 = __importDefault(require("./utils/dataset"));
const ip_1 = require("./utils/ip");
const test = (url) => {
    const { configPath } = dataset_1.default;
    const { config = {} } = localServer_1.default.loadUserConfig(configPath || '', config_1.default);
    const matchResult = (0, matcher_1.matcher)(config.rules, url);
    console.log('匹配完成', Date.now(), matchResult);
    return matchResult;
};
exports.test = test;
const getLocalIp = () => {
    return (0, ip_1.getLocalIpAddress)();
};
exports.getLocalIp = getLocalIp;
