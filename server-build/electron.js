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
const { app, BrowserWindow } = require('electron');
const bproxy = require('./src/proxy').default;
const { checkUpgrade } = require('./src/proxy/utils/request');
const { showUpgradeDialog } = require('./src/proxy/electronApi');
const { updateDataSet } = require('./src/proxy/utils/dataset');
updateDataSet('platform', 'app');
let win;
function createWindow() {
    return __awaiter(this, void 0, void 0, function* () {
        yield bproxy.start();
        win = new BrowserWindow({
            width: '100%',
            height: '100%',
            webPreferences: {
                nodeIntegration: false,
            },
        });
        win.maximize();
        if (process.env.NODE_ENV === 'dev') {
            win.loadURL('http://127.0.0.1:8889');
            win.webContents.openDevTools();
        }
        else {
            win.loadURL('http://127.0.0.1:8888');
        }
        win.on('closed', () => {
            win = null;
        });
        checkUpgrade().then(data => {
            if (data && data.version) {
                showUpgradeDialog({ url: data.downloadURL, changeLog: data.changeLog });
            }
        });
    });
}
app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});
