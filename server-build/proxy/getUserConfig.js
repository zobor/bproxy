"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "updateConfigPathAndWatch", {
    enumerable: true,
    get: ()=>updateConfigPathAndWatch
});
const _fs = /*#__PURE__*/ _interopRequireDefault(require("fs"));
const _lodash = require("lodash");
const _path = /*#__PURE__*/ _interopRequireDefault(require("path"));
const _config = /*#__PURE__*/ _interopRequireWildcard(require("./config"));
const _logger = /*#__PURE__*/ _interopRequireDefault(require("./logger"));
const _preloadService = /*#__PURE__*/ _interopRequireDefault(require("./preloadService"));
const _socket = require("./socket/socket");
const _dataset = require("./utils/dataset");
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
let watcher;
const loadUserConfigOrCreate = async (configFilePath)=>{
    let userConfig = {};
    if ((0, _lodash.isBoolean)(configFilePath) || (0, _lodash.isUndefined)(configFilePath) || (0, _lodash.isEmpty)(configFilePath)) {
        (0, _dataset.updateDataSet)('config', _config.default);
        return _config.default;
    }
    const importUserConfig = (configPath)=>{
        try {
            delete require.cache[require.resolve(configPath)];
            const newConfig = require(configPath);
            userConfig = _objectSpread({}, _config.default, newConfig);
            (0, _dataset.updateDataSet)('config', (0, _preloadService.default)(userConfig));
        } catch (err) {
            _logger.default.error(err.message);
        }
    };
    (0, _dataset.updateDataSet)('currentConfigPath', configFilePath);
    // 当前目录没有bproxy的配置文件
    if (!_fs.default.existsSync(configFilePath)) {
        _fs.default.writeFileSync(configFilePath, _config.configModuleTemplate);
    }
    importUserConfig(configFilePath);
    return userConfig;
};
const updateConfigPathAndWatch = async (params)=>{
    const { configPath  } = params;
    _logger.default.info('{updateConfigPathAndWatch}:', configPath);
    if (!configPath) {
        _logger.default.error('updateConfigPathAndWatch(configPath), configPath is empty');
        throw new Error('updateConfigPathAndWatch(configPath), configPath is empty');
    }
    if (_fs.default.existsSync(configPath)) {
        (0, _dataset.updateDataSet)('currentConfigPath', configPath);
        const fullFilePath = _path.default.resolve(configPath, _config.appConfigFileName);
        let userConfig = await loadUserConfigOrCreate(fullFilePath);
        // 切换配置，需要取消上一次配置文件的监听
        if (watcher === null || watcher === void 0 ? void 0 : watcher.close) {
            watcher.close();
        }
        // 监听配置文件变化，变化了更新bproxy的临时配置数据
        watcher = _fs.default.watchFile(fullFilePath, {
            interval: 3000
        }, async ()=>{
            _logger.default.info(`配置文件变更: ${fullFilePath}`);
            try {
                userConfig = await loadUserConfigOrCreate(fullFilePath);
                // ws 广播消息通知
                (0, _socket.onConfigFileChange)();
            } catch (err) {}
        });
        (0, _dataset.updateDataSet)('config', userConfig);
        _logger.default.info(`✔ 当前运行的配置文件：${fullFilePath}`);
    }
};
