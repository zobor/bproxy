"use strict";
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
exports.showUpgrade = exports.showSelectPath = exports.showBproxyHome = exports.previewTextFile = exports.showError = exports.isBash = exports.isApp = exports.getElectronApi = void 0;
const logger_1 = __importDefault(require("../logger"));
const dataset_1 = __importDefault(require("../utils/dataset"));
let electronApi = null;
const getElectronApi = () => {
    if (!electronApi) {
        electronApi = require('./electronApi');
    }
    return electronApi;
};
exports.getElectronApi = getElectronApi;
const isApp = () => dataset_1.default.platform === 'app';
exports.isApp = isApp;
const isBash = () => dataset_1.default.platform === 'bash';
exports.isBash = isBash;
function showError(text) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((0, exports.isApp)()) {
            return electronApi === null || electronApi === void 0 ? void 0 : electronApi.showErrorDialog(text);
        }
        logger_1.default.error(text);
    });
}
exports.showError = showError;
function previewTextFile(appInfoLogFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((0, exports.isApp)()) {
            return electronApi === null || electronApi === void 0 ? void 0 : electronApi.openAndPreviewTextFile({ url: appInfoLogFilePath, width: 0, height: 0 });
        }
    });
}
exports.previewTextFile = previewTextFile;
function showBproxyHome() {
    return __awaiter(this, void 0, void 0, function* () {
        if ((0, exports.isApp)()) {
            return electronApi === null || electronApi === void 0 ? void 0 : electronApi.showHomePage();
        }
    });
}
exports.showBproxyHome = showBproxyHome;
function showSelectPath() {
    return __awaiter(this, void 0, void 0, function* () {
        if ((0, exports.isApp)()) {
            return electronApi === null || electronApi === void 0 ? void 0 : electronApi.showSelectPathDialog();
        }
    });
}
exports.showSelectPath = showSelectPath;
function showUpgrade(data) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((0, exports.isApp)()) {
            return electronApi === null || electronApi === void 0 ? void 0 : electronApi.showUpgradeDialog({ changeLog: (data === null || data === void 0 ? void 0 : data.changeLog) || [] });
        }
        if (data && data.version) {
            console.log('\n');
            console.log('########################################');
            console.log(`bproxy有新版本（${data.version}）可以升级，请尽快升级`);
            console.log('更新内容如下：');
            console.log(data.changeLog.map((item) => `  ${item}`).join('\n'));
            console.log('########################################');
            console.log('\n');
        }
    });
}
exports.showUpgrade = showUpgrade;
