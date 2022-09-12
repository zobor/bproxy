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
    getElectronApi: ()=>getElectronApi,
    isApp: ()=>isApp,
    isBash: ()=>isBash,
    showError: ()=>showError,
    previewTextFile: ()=>previewTextFile,
    showBproxyHome: ()=>showBproxyHome,
    showSelectPath: ()=>showSelectPath,
    showUpgrade: ()=>showUpgrade
});
const _logger = /*#__PURE__*/ _interopRequireDefault(require("../logger"));
const _dataset = /*#__PURE__*/ _interopRequireDefault(require("../utils/dataset"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let electronApi = null;
const getElectronApi = ()=>{
    if (!electronApi) {
        electronApi = require('./electronApi');
    }
    return electronApi;
};
const isApp = ()=>_dataset.default.platform === 'app';
const isBash = ()=>_dataset.default.platform === 'bash';
async function showError(text) {
    if (isApp()) {
        return electronApi === null || electronApi === void 0 ? void 0 : electronApi.showErrorDialog(text);
    }
    _logger.default.error(text);
}
async function previewTextFile(appInfoLogFilePath) {
    if (isApp()) {
        return electronApi === null || electronApi === void 0 ? void 0 : electronApi.openAndPreviewTextFile({
            url: appInfoLogFilePath,
            width: 0,
            height: 0
        });
    }
}
async function showBproxyHome() {
    if (isApp()) {
        return electronApi === null || electronApi === void 0 ? void 0 : electronApi.showHomePage();
    }
}
async function showSelectPath() {
    if (isApp()) {
        return electronApi === null || electronApi === void 0 ? void 0 : electronApi.showSelectPathDialog();
    }
}
async function showUpgrade(data) {
    if (isApp()) {
        return electronApi === null || electronApi === void 0 ? void 0 : electronApi.showUpgradeDialog({
            changeLog: (data === null || data === void 0 ? void 0 : data.changeLog) || []
        });
    }
    if (data && data.version) {
        console.log('\n');
        console.log('########################################');
        console.log(`bproxy有新版本（${data.version}）可以升级，请尽快升级`);
        console.log('更新内容如下：');
        console.log(data.changeLog.map((item)=>`  ${item}`).join('\n'));
        console.log('########################################');
        console.log('\n');
    }
}
