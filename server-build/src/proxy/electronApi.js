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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserWindow = exports.dialog = exports.showSelectPathDialog = exports.showHomePage = exports.showUpgradeDialog = exports.openAndPreviewTextFile = exports.openNewWindow = exports.showConfirmDialog = exports.showErrorDialog = exports.defaultWindowSize = void 0;
const electron_1 = require("electron");
Object.defineProperty(exports, "dialog", { enumerable: true, get: function () { return electron_1.dialog; } });
Object.defineProperty(exports, "BrowserWindow", { enumerable: true, get: function () { return electron_1.BrowserWindow; } });
exports.defaultWindowSize = {
    width: 800,
    height: 550,
};
function showErrorDialog(text) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!electron_1.BrowserWindow) {
            return;
        }
        const win = electron_1.BrowserWindow.getFocusedWindow() ||
            new electron_1.BrowserWindow({
                width: exports.defaultWindowSize.width,
                height: exports.defaultWindowSize.height,
                webPreferences: {
                    nodeIntegration: false,
                },
            });
        yield electron_1.dialog.showMessageBox(win, {
            message: 'bproxy error',
            detail: text,
            type: 'error',
        });
    });
}
exports.showErrorDialog = showErrorDialog;
function showConfirmDialog(title, text, buttons, callbacks) {
    return electron_1.dialog
        .showMessageBox({
        message: title,
        detail: text,
        type: 'none',
        buttons,
    })
        .then(({ response }) => {
        if (callbacks && callbacks.length && callbacks[response]) {
            callbacks[response]();
        }
    });
}
exports.showConfirmDialog = showConfirmDialog;
function openNewWindow({ url, width, height, }) {
    if (!url) {
        return;
    }
    const win = new electron_1.BrowserWindow({
        width: width || exports.defaultWindowSize.width,
        height: height || exports.defaultWindowSize.height,
    });
    win.loadURL(url);
    return url;
}
exports.openNewWindow = openNewWindow;
function openAndPreviewTextFile({ url, width, height }) {
    if (!url) {
        return;
    }
    const win = new electron_1.BrowserWindow({
        width: width || exports.defaultWindowSize.width,
        height: height || exports.defaultWindowSize.height,
    });
    win.loadFile(url);
    return url;
}
exports.openAndPreviewTextFile = openAndPreviewTextFile;
function showUpgradeDialog({ url, changeLog = [] }) {
    showConfirmDialog('可升级提示', `bproxy有新版本可以升级，请尽快升级, 更新内容如下: ${changeLog.join('。')}`, ['立即升级', '暂不升级'], [
        () => {
            openNewWindow({ url: url || 'http://www.bproxy.cn' });
        },
        () => {
            console.log('showUpgradeDialog', '用户取消了升级');
        },
    ]);
}
exports.showUpgradeDialog = showUpgradeDialog;
function showHomePage(url) {
    openNewWindow({ url: url || 'http://www.bproxy.cn' });
}
exports.showHomePage = showHomePage;
function showSelectPathDialog() {
    return new Promise((resolve) => {
        electron_1.dialog
            .showOpenDialog({
            message: '请选择项目目录',
            properties: ['openDirectory'],
        })
            .then(function (response) {
            if (!response.canceled) {
                resolve(response.filePaths);
            }
            else {
                resolve(null);
            }
        });
    });
}
exports.showSelectPathDialog = showSelectPathDialog;
