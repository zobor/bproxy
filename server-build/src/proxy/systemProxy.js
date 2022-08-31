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
exports.autoInstallCertificate = exports.checkSystemProxy = exports.configSystemProxy = exports.setSystemProxyOff = exports.setSystemProxyOn = exports.isMac = void 0;
const config_1 = __importDefault(require("./config"));
const jsBridge_1 = require("./jsBridge");
const proxy_1 = require("./macos/proxy");
const proxy_2 = require("./windows/proxy");
const winShells_1 = require("./windows/winShells");
function isMac() {
    const osName = (0, jsBridge_1.getOsName)();
    return osName === 'darwin';
}
exports.isMac = isMac;
function setSystemProxyOn() {
    if (isMac()) {
        (0, proxy_1.setActiveNetworkProxyStatus)('on');
    }
    else {
        (0, proxy_2.enableSystemProxy)();
    }
}
exports.setSystemProxyOn = setSystemProxyOn;
function setSystemProxyOff() {
    if (isMac()) {
        return (0, proxy_1.setActiveNetworkProxyStatus)('off');
    }
    else {
        return (0, proxy_2.disableSystemProxy)();
    }
}
exports.setSystemProxyOff = setSystemProxyOff;
function configSystemProxy({ host = '127.0.0.1', port = `${config_1.default.port}`, }) {
    if (isMac()) {
        (0, proxy_1.setActiveNetworkProxy)({ host, port });
    }
    else {
        (0, proxy_2.setSystemProxy)({ hostname: host, port });
    }
}
exports.configSystemProxy = configSystemProxy;
function checkSystemProxy({ host = '127.0.0.1', port = `${config_1.default.port}`, }) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    return __awaiter(this, void 0, void 0, function* () {
        if (isMac()) {
            const info = (0, proxy_1.getActiveNetworkProxyInfo)();
            const names = Object.keys(info || {});
            if (!names || !names.length) {
                return false;
            }
            const [device] = names;
            if (((_b = (_a = info[device]) === null || _a === void 0 ? void 0 : _a.http) === null || _b === void 0 ? void 0 : _b.Server) === host &&
                ((_d = (_c = info[device]) === null || _c === void 0 ? void 0 : _c.http) === null || _d === void 0 ? void 0 : _d.Port) === port.toString() &&
                ((_f = (_e = info[device]) === null || _e === void 0 ? void 0 : _e.https) === null || _f === void 0 ? void 0 : _f.Server) === host &&
                ((_h = (_g = info[device]) === null || _g === void 0 ? void 0 : _g.http) === null || _h === void 0 ? void 0 : _h.Port) === port.toString() &&
                ((_k = (_j = info[device]) === null || _j === void 0 ? void 0 : _j.http) === null || _k === void 0 ? void 0 : _k.Enabled) === 'Yes' &&
                ((_m = (_l = info[device]) === null || _l === void 0 ? void 0 : _l.https) === null || _m === void 0 ? void 0 : _m.Enabled) === 'Yes') {
                return true;
            }
            return false;
        }
        else {
            return yield (0, proxy_2.getSystemProxyStatus)({ address: host, port });
        }
    });
}
exports.checkSystemProxy = checkSystemProxy;
function autoInstallCertificate() {
    return __awaiter(this, void 0, void 0, function* () {
        if (isMac()) {
            return (0, jsBridge_1.installMacCertificate)();
        }
        return (0, winShells_1.installCertificate)();
    });
}
exports.autoInstallCertificate = autoInstallCertificate;
