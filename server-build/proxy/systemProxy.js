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
    isMac: ()=>isMac,
    setSystemProxyOn: ()=>setSystemProxyOn,
    setSystemProxyOff: ()=>setSystemProxyOff,
    configSystemProxy: ()=>configSystemProxy,
    checkSystemProxy: ()=>checkSystemProxy,
    autoInstallCertificate: ()=>autoInstallCertificate
});
const _config = /*#__PURE__*/ _interopRequireDefault(require("./config"));
const _jsBridge = require("./jsBridge");
const _proxy = require("./macos/proxy");
const _proxy1 = require("./windows/proxy");
const _winShells = require("./windows/winShells");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function isMac() {
    const osName = (0, _jsBridge.getOsName)();
    return osName === 'darwin';
}
function setSystemProxyOn() {
    if (isMac()) {
        (0, _proxy.setActiveNetworkProxyStatus)('on');
    } else {
        (0, _proxy1.enableSystemProxy)();
    }
}
function setSystemProxyOff() {
    if (isMac()) {
        return (0, _proxy.setActiveNetworkProxyStatus)('off');
    } else {
        return (0, _proxy1.disableSystemProxy)();
    }
}
function configSystemProxy({ host ='127.0.0.1' , port =`${_config.default.port}`  }) {
    if (isMac()) {
        (0, _proxy.setActiveNetworkProxy)({
            host,
            port
        });
    } else {
        (0, _proxy1.setSystemProxy)({
            hostname: host,
            port
        });
    }
}
async function checkSystemProxy({ host ='127.0.0.1' , port =`${_config.default.port}`  }) {
    if (isMac()) {
        var ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, ref10, ref11;
        const info = (0, _proxy.getActiveNetworkProxyInfo)();
        const names = Object.keys(info || {});
        if (!names || !names.length) {
            return false;
        }
        const [device] = names;
        if (((ref = info[device]) === null || ref === void 0 ? void 0 : (ref1 = ref.http) === null || ref1 === void 0 ? void 0 : ref1.Server) === host && ((ref2 = info[device]) === null || ref2 === void 0 ? void 0 : (ref3 = ref2.http) === null || ref3 === void 0 ? void 0 : ref3.Port) === port.toString() && ((ref4 = info[device]) === null || ref4 === void 0 ? void 0 : (ref5 = ref4.https) === null || ref5 === void 0 ? void 0 : ref5.Server) === host && ((ref6 = info[device]) === null || ref6 === void 0 ? void 0 : (ref7 = ref6.http) === null || ref7 === void 0 ? void 0 : ref7.Port) === port.toString() && ((ref8 = info[device]) === null || ref8 === void 0 ? void 0 : (ref9 = ref8.http) === null || ref9 === void 0 ? void 0 : ref9.Enabled) === 'Yes' && ((ref10 = info[device]) === null || ref10 === void 0 ? void 0 : (ref11 = ref10.https) === null || ref11 === void 0 ? void 0 : ref11.Enabled) === 'Yes') {
            return true;
        }
        return false;
    } else {
        return await (0, _proxy1.getSystemProxyStatus)({
            address: host,
            port
        });
    }
}
async function autoInstallCertificate() {
    if (isMac()) {
        return (0, _jsBridge.installMacCertificate)();
    }
    return (0, _winShells.installCertificate)();
}
