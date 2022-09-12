"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>_default
});
const _log4Js = /*#__PURE__*/ _interopRequireDefault(require("log4js"));
const _config = require("./config");
const _dataset = /*#__PURE__*/ _interopRequireDefault(require("./utils/dataset"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
_log4Js.default.configure({
    appenders: {
        bproxyError: {
            type: 'file',
            encoding: 'utf-8',
            filename: _config.appErrorLogFilePath
        },
        bproxyInfo: {
            type: 'file',
            encoding: 'utf-8',
            filename: _config.appInfoLogFilePath
        }
    },
    categories: {
        default: {
            appenders: [
                'bproxyInfo'
            ],
            level: 'info'
        }
    }
});
const loggerError = _log4Js.default.getLogger('bproxyError');
const logger = _log4Js.default.getLogger('bproxyInfo');
const _default = {
    info: (...args)=>{
        var ref;
        logger.info(...args);
        if (_dataset.default === null || _dataset.default === void 0 ? void 0 : (ref = _dataset.default.config) === null || ref === void 0 ? void 0 : ref.debug) {
            console.info(...args);
        }
    },
    warn: (...args)=>{
        var ref;
        logger.warn(...args);
        if (_dataset.default === null || _dataset.default === void 0 ? void 0 : (ref = _dataset.default.config) === null || ref === void 0 ? void 0 : ref.debug) {
            console.warn(...args);
        }
    },
    error: (...args)=>{
        var ref;
        loggerError.error(...args);
        if (_dataset.default === null || _dataset.default === void 0 ? void 0 : (ref = _dataset.default.config) === null || ref === void 0 ? void 0 : ref.debug) {
            console.error(...args);
        }
    }
};
