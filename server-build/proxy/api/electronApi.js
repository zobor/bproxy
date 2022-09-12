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
    defaultWindowSize: ()=>defaultWindowSize,
    showErrorDialog: ()=>showErrorDialog,
    showConfirmDialog: ()=>showConfirmDialog,
    openNewWindow: ()=>openNewWindow,
    openAndPreviewTextFile: ()=>openAndPreviewTextFile,
    showUpgradeDialog: ()=>showUpgradeDialog,
    showHomePage: ()=>showHomePage,
    showSelectPathDialog: ()=>showSelectPathDialog
});
const _electron = require("electron");
const defaultWindowSize = {
    width: 800,
    height: 550
};
async function showErrorDialog(text) {
    if (!_electron.BrowserWindow) {
        return;
    }
    const win = _electron.BrowserWindow.getFocusedWindow() || new _electron.BrowserWindow({
        width: defaultWindowSize.width,
        height: defaultWindowSize.height,
        webPreferences: {
            nodeIntegration: false
        }
    });
    await _electron.dialog.showMessageBox(win, {
        message: 'bproxy error',
        detail: text,
        type: 'error'
    });
}
function showConfirmDialog(title, text, buttons, callbacks) {
    return _electron.dialog.showMessageBox({
        message: title,
        detail: text,
        type: 'none',
        buttons
    }).then(({ response  })=>{
        if (callbacks && callbacks.length && callbacks[response]) {
            callbacks[response]();
        }
    });
}
function openNewWindow({ url , width , height  }) {
    if (!url) {
        return;
    }
    const win = new _electron.BrowserWindow({
        width: width || defaultWindowSize.width,
        height: height || defaultWindowSize.height
    });
    win.loadURL(url);
    return url;
}
function openAndPreviewTextFile({ url , width , height  }) {
    if (!url) {
        return;
    }
    const win = new _electron.BrowserWindow({
        width: width || defaultWindowSize.width,
        height: height || defaultWindowSize.height
    });
    win.loadFile(url);
    return url;
}
function showUpgradeDialog({ url , changeLog =[]  }) {
    showConfirmDialog('可升级提示', `bproxy有新版本可以升级，请尽快升级, 更新内容如下: ${changeLog.join('。')}`, [
        '立即升级',
        '暂不升级'
    ], [
        ()=>{
            openNewWindow({
                url: url || 'http://www.bproxy.cn'
            });
        },
        ()=>{
            console.log('showUpgradeDialog', '用户取消了升级');
        }, 
    ]);
}
function showHomePage(url) {
    openNewWindow({
        url: url || 'http://www.bproxy.cn'
    });
}
function showSelectPathDialog() {
    return new Promise((resolve)=>{
        _electron.dialog.showOpenDialog({
            message: '请选择项目目录',
            properties: [
                'openDirectory'
            ]
        }).then(function(response) {
            if (!response.canceled) {
                resolve(response.filePaths);
            } else {
                resolve(null);
            }
        });
    });
}
