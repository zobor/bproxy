/*
 * @Date: 2022-05-30 22:53:42
 * @LastEditors: 张恒 nodejs.js@gmail.com
 * @LastEditTime: 2022-08-13 20:37:14
 * @FilePath: /bp/src/proxy/macos/os.ts
 */ "use strict";
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
    getOsName: ()=>getOsName,
    getComputerName: ()=>getComputerName,
    installMacCertificate: ()=>installMacCertificate
});
const _childProcess = require("child_process");
const _os = /*#__PURE__*/ _interopRequireDefault(require("os"));
const _config = require("../config");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const getOsName = ()=>{
    return _os.default.platform();
};
const getComputerName = ()=>{
    return _os.default.hostname().replace(/\.\w+/g, '');
};
const installMacCertificate = async ()=>{
    const filepath = _config.certificate === null || _config.certificate === void 0 ? void 0 : _config.certificate.getDefaultCACertPath();
    const bash = `security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ${filepath}`;
    if (_config.env.bash && 0) {
        // `sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ${filepath}`
        const rs = (0, _childProcess.spawnSync)('sudo', bash.split(' ')).stdout.toString();
        return rs;
    } else {
        return `sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ${filepath}`;
    }
};
