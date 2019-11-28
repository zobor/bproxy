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
const request = require("request");
const semver = require("semver");
const settings_1 = require("./settings");
const child_process_1 = require("child_process");
const pkg = require("../package.json");
const certifica_1 = require("./certifica");
const common_1 = require("./common");
const i18n_1 = require("./i18n");
const localServer_1 = require("./localServer");
exports.default = {
    run(params) {
        return __awaiter(this, void 0, void 0, function* () {
            this.report();
            const verLatest = yield this.getLatestVersion();
            if (semver.lt(pkg.version, verLatest)) {
                common_1.cm.error(`检测到有版本更新，请立即升级到最新版本: ${verLatest}, 当前版本: ${pkg.version}\nUsage: npm install bproxy@latest -g`);
                return '';
            }
            common_1.cm.info(`当前版本: ${verLatest}`);
            if (params.install) {
                this.install();
            }
            else if (params.proxy) {
                this.proxy(params.proxy, params.port);
            }
            else if (params.start) {
                this.start(params);
            }
            return verLatest;
        });
    },
    getLatestVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                request.get('https://raw.githubusercontent.com/zobor/bproxy/master/package.json', (err, res, body) => {
                    resolve(JSON.parse(body).version);
                });
            });
        });
    },
    report() {
        request.get(`http://pingtcss.qq.com/pingd?dm=zobor.me&pvi=67181574951438293&si=s106251574951438294&url=/&arg=&ty=0&rdm=&rurl=&rarg=&adt=&r2=500704279&scr=1440x900&scl=24-bit&lg=zh-cn&tz=-8&ext=version=2.0.14&random=${+new Date}`);
    },
    install() {
        const ca = new certifica_1.default();
        const installStatus = ca.install();
        if (installStatus && !installStatus.create) {
            common_1.cm.warn(i18n_1.default.CERT_EXIST);
            return;
        }
        if (installStatus && installStatus.caCertPath) {
            common_1.cm.info(`${i18n_1.default.CREATE_CERT_SUC}: ${installStatus.caCertPath}`);
        }
        else {
            common_1.cm.error(i18n_1.default.CREATE_CERT_FAIL);
            return;
        }
        if (process.platform === 'darwin') {
            const sh = `sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ${installStatus.caCertPath}`;
            const param = sh.split(' ');
            const cmd = param.shift();
            common_1.cm.warn(i18n_1.default.TRUST_CERT_PWD);
            child_process_1.spawn(cmd || 'sudo', param);
            common_1.cm.info(i18n_1.default.CERT_INSTALL_FAIL);
        }
        else {
            common_1.cm.warn(i18n_1.default.INSTALL_TIPS);
        }
    },
    proxy(proxy, port) {
        const sysProxyPort = port || settings_1.default.port;
        if (typeof proxy === 'boolean') {
            common_1.cm.warn(`Usage:\n${pkg.name} --proxy [off|on]`);
        }
        else if (proxy === 'on') {
            child_process_1.spawn('networksetup', ['-setautoproxystate', 'Wi-Fi', 'off']);
            child_process_1.spawn('networksetup', ['-setwebproxy', 'Wi-Fi', '127.0.0.1', `${sysProxyPort}`]);
            child_process_1.spawn('networksetup', ['-setsecurewebproxy', 'Wi-Fi', '127.0.0.1', `${sysProxyPort}`]);
        }
        else if (proxy === 'off') {
            child_process_1.spawn('networksetup', ['-setautoproxystate', 'Wi-Fi', 'off']);
            child_process_1.spawn('networksetup', ['-setwebproxystate', 'Wi-Fi', 'off']);
            child_process_1.spawn('networksetup', ['-setsecurewebproxystate', 'Wi-Fi', 'off']);
        }
    },
    start(params) {
        const port = params.port || 0;
        const configPath = params.config;
        localServer_1.default.start(port, configPath);
    },
};
