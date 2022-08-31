"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installCertificate = void 0;
const iconv_lite_1 = __importDefault(require("iconv-lite"));
const child_process_1 = require("child_process");
const config_1 = require("../config");
const logger_1 = __importDefault(require("../logger"));
function installCertificate() {
    const filepath = config_1.certificate.getDefaultCACertPath();
    return new Promise((resolve) => {
        (0, child_process_1.exec)(`CERTUTIL -addstore -enterprise -f -v root "${filepath}"`, { encoding: 'buffer' }, (error, stdoutStream) => {
            const stdout = iconv_lite_1.default.decode(stdoutStream, 'cp936');
            if (error) {
                logger_1.default.error(error);
                resolve({
                    code: 2,
                    msg: '证书安装失败，请手动安装',
                });
            }
            else {
                logger_1.default.info(stdout);
                if (stdout === null || stdout === void 0 ? void 0 : stdout.includes('已经在存储中')) {
                    resolve({
                        code: 0,
                        msg: 'bproxy 证书已经在存储中',
                    });
                }
                else if (stdout === null || stdout === void 0 ? void 0 : stdout.includes('成功')) {
                    resolve({
                        code: 0,
                        msg: 'bproxy 证书安装成功',
                    });
                }
                else {
                    resolve({
                        code: 1,
                        msg: '证书安装失败，请手动安装',
                    });
                }
            }
        });
    });
}
exports.installCertificate = installCertificate;
