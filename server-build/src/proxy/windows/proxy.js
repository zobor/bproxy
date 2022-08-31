"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSystemProxyStatus = exports.setSystemProxy = exports.enableSystemProxy = exports.disableSystemProxy = void 0;
const child_process_1 = require("child_process");
const REG_PATH = 'HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings';
const WINDOWS_QUERY_PROXY = `reg query "${REG_PATH}"`;
const REG_ADD = `reg add "${REG_PATH}"`;
const WINDOWS_PROXY_ENABLE_REGEX = /ProxyEnable\s+REG_DWORD\s+0x1/;
function disableSystemProxy() {
    const sh = `${REG_ADD} /v ProxyEnable /t REG_DWORD /d 0 /f`;
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(sh, (error, stdout) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(true);
            }
        });
    });
}
exports.disableSystemProxy = disableSystemProxy;
function enableSystemProxy() {
    const sh = `${REG_ADD} /v ProxyEnable /t REG_DWORD /d 1 /f`;
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(sh, (error, stdout) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(true);
            }
        });
    });
}
exports.enableSystemProxy = enableSystemProxy;
function setSystemProxy({ hostname = '127.0.0.1', port = '8888', }) {
    const sh = `${REG_ADD} /v ProxyServer /t REG_SZ /d ${hostname}:${port} /f & ` +
        `${REG_ADD} /v ProxyEnable /t REG_DWORD /d 1 /f`;
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(sh, (error, stdout) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(true);
            }
        });
    });
}
exports.setSystemProxy = setSystemProxy;
function getSystemProxyStatus({ address = '127.0.0.1', port = '8888', }) {
    const currentProxyRegex = new RegExp(`ProxyServer\\s+REG_SZ\\s+${address}:${port}`);
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(WINDOWS_QUERY_PROXY, (error, stdout) => {
            if (error || !stdout.length) {
                reject(error);
            }
            else if (WINDOWS_PROXY_ENABLE_REGEX.test(stdout) &&
                currentProxyRegex.test(stdout)) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        });
    });
}
exports.getSystemProxyStatus = getSystemProxyStatus;
