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
exports.updateConfigPathAndWatch = void 0;
const fs_1 = __importDefault(require("fs"));
const lodash_1 = require("lodash");
const path_1 = __importDefault(require("path"));
const config_1 = __importStar(require("./config"));
const logger_1 = __importDefault(require("./logger"));
const preloadService_1 = __importDefault(require("./preloadService"));
const socket_1 = require("./socket/socket");
const dataset_1 = require("./utils/dataset");
let watcher;
const loadUserConfigOrCreate = (configFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    let userConfig = {};
    if ((0, lodash_1.isBoolean)(configFilePath) ||
        (0, lodash_1.isUndefined)(configFilePath) ||
        (0, lodash_1.isEmpty)(configFilePath)) {
        (0, dataset_1.updateDataSet)('config', config_1.default);
        return config_1.default;
    }
    const importUserConfig = (configPath) => {
        try {
            delete require.cache[require.resolve(configPath)];
            const newConfig = require(configPath);
            userConfig = Object.assign(Object.assign({}, config_1.default), newConfig);
            (0, dataset_1.updateDataSet)('config', (0, preloadService_1.default)(userConfig));
        }
        catch (err) {
            logger_1.default.error(err.message);
        }
    };
    (0, dataset_1.updateDataSet)('currentConfigPath', configFilePath);
    if (!fs_1.default.existsSync(configFilePath)) {
        fs_1.default.writeFileSync(configFilePath, config_1.configModuleTemplate);
    }
    importUserConfig(configFilePath);
    return userConfig;
});
const updateConfigPathAndWatch = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { configPath } = params;
    logger_1.default.info('{updateConfigPathAndWatch}:', configPath);
    if (!configPath) {
        logger_1.default.error('updateConfigPathAndWatch(configPath), configPath is empty');
        throw new Error('updateConfigPathAndWatch(configPath), configPath is empty');
    }
    if (fs_1.default.existsSync(configPath)) {
        (0, dataset_1.updateDataSet)('currentConfigPath', configPath);
        const fullFilePath = path_1.default.resolve(configPath, config_1.appConfigFileName);
        let userConfig = yield loadUserConfigOrCreate(fullFilePath);
        if (watcher === null || watcher === void 0 ? void 0 : watcher.close) {
            watcher.close();
        }
        watcher = fs_1.default.watchFile(fullFilePath, { interval: 3000 }, () => __awaiter(void 0, void 0, void 0, function* () {
            logger_1.default.info(`配置文件变更: ${fullFilePath}`);
            try {
                userConfig = yield loadUserConfigOrCreate(fullFilePath);
                (0, socket_1.onConfigFileChange)();
            }
            catch (err) { }
        }));
        (0, dataset_1.updateDataSet)('config', userConfig);
        logger_1.default.info(`✔ 当前运行的配置文件：${fullFilePath}`);
    }
});
exports.updateConfigPathAndWatch = updateConfigPathAndWatch;
