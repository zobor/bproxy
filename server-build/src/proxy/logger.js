"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log4js_1 = __importDefault(require("log4js"));
const config_1 = require("./config");
const dataset_1 = __importDefault(require("./utils/dataset"));
log4js_1.default.configure({
    appenders: {
        bproxyError: { type: 'file', encoding: 'utf-8', filename: config_1.appErrorLogFilePath },
        bproxyInfo: { type: 'file', encoding: 'utf-8', filename: config_1.appInfoLogFilePath },
    },
    categories: { default: { appenders: ['bproxyInfo'], level: 'info' } },
});
const loggerError = log4js_1.default.getLogger('bproxyError');
const logger = log4js_1.default.getLogger('bproxyInfo');
exports.default = {
    info: (...args) => {
        var _a;
        logger.info(...args);
        if ((_a = dataset_1.default === null || dataset_1.default === void 0 ? void 0 : dataset_1.default.config) === null || _a === void 0 ? void 0 : _a.debug) {
            console.info(...args);
        }
    },
    warn: (...args) => {
        var _a;
        logger.warn(...args);
        if ((_a = dataset_1.default === null || dataset_1.default === void 0 ? void 0 : dataset_1.default.config) === null || _a === void 0 ? void 0 : _a.debug) {
            console.warn(...args);
        }
    },
    error: (...args) => {
        var _a;
        loggerError.error(...args);
        if ((_a = dataset_1.default === null || dataset_1.default === void 0 ? void 0 : dataset_1.default.config) === null || _a === void 0 ? void 0 : _a.debug) {
            console.error(...args);
        }
    },
};
