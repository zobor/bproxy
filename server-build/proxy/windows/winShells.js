/*
 * @Date: 2022-08-12 21:01:56
 * @LastEditors: 张恒 nodejs.js@gmail.com
 * @LastEditTime: 2022-08-13 22:42:57
 * @FilePath: /bp/src/proxy/windows/winShells.ts
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "installCertificate", {
    enumerable: true,
    get: ()=>installCertificate
});
const _iconvLite = /*#__PURE__*/ _interopRequireDefault(require("iconv-lite"));
const _childProcess = require("child_process");
const _config = require("../config");
const _logger = /*#__PURE__*/ _interopRequireDefault(require("../logger"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function installCertificate() {
    const filepath = _config.certificate.getDefaultCACertPath();
    return new Promise((resolve)=>{
        (0, _childProcess.exec)(`CERTUTIL -addstore -enterprise -f -v root "${filepath}"`, {
            encoding: 'buffer'
        }, (error, stdoutStream)=>{
            const stdout = _iconvLite.default.decode(stdoutStream, 'cp936');
            if (error) {
                _logger.default.error(error);
                resolve({
                    code: 2,
                    msg: '证书安装失败，请手动安装'
                });
            } else {
                _logger.default.info(stdout);
                if (stdout === null || stdout === void 0 ? void 0 : stdout.includes('已经在存储中')) {
                    resolve({
                        code: 0,
                        msg: 'bproxy 证书已经在存储中'
                    });
                } else if (stdout === null || stdout === void 0 ? void 0 : stdout.includes('成功')) {
                    resolve({
                        code: 0,
                        msg: 'bproxy 证书安装成功'
                    });
                } else {
                    resolve({
                        code: 1,
                        msg: '证书安装失败，请手动安装'
                    });
                }
            }
        });
    });
}
