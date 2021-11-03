"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const request = __importStar(require("request"));
const config_1 = __importDefault(require("./config"));
const child_process_1 = require("child_process");
const pkg = __importStar(require("../../package.json"));
const certifica_1 = __importDefault(require("./certifica"));
const localServer_1 = __importDefault(require("./localServer"));
const matcher_1 = require("./matcher");
const utils_1 = require("./utils/utils");
exports.default = {
    run(params) {
        return __awaiter(this, void 0, void 0, function* () {
            this.report();
            let verLatest;
            if (params.install) {
                this.install();
            }
            else if (params.proxy) {
                this.proxy(params.proxy, params.port);
            }
            else if (params.start) {
                this.start(params);
            }
            else if (params.test) {
                this.test(params);
            }
            return verLatest;
        });
    },
    report() {
        request.get(`https://z3.cnzz.com/stat.htm?id=1278865075&r=http%3A%2F%2Fregx.vip%2F&lg=zh-cn&ntime=none&cnzz_eid=117682865-1634900721-null&showp=1920x1080&p=http%3A%2F%2Fregx.vip%2Fbproxy&t=Bproxy&umuuid=17ca7ad415558d-06ccc278d12621-5a402f16-1fa400-17ca7ad415644b&h=1&rnd=${parseInt((+new Date / 1000).toString(), 10)}`);
    },
    install() {
        const ca = new certifica_1.default();
        const installStatus = ca.install();
        if (installStatus && installStatus.caCertPath) {
            utils_1.log.info(`证书创建成功: ${installStatus.caCertPath}`);
        }
        else {
            utils_1.log.error('证书创建失败～');
            return;
        }
        if (process.platform === 'darwin') {
            const sh = `sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ${installStatus.caCertPath}`;
            const param = sh.split(' ');
            const cmd = param.shift();
            utils_1.log.warn('信任证书，你需要可能需要输入计算机密码授权');
            (0, child_process_1.spawn)(cmd || 'sudo', param);
            utils_1.log.info('证书安装失败');
        }
        else {
            utils_1.log.warn('自动安装证书目前只支持MacOS系统，其他系统请双击证书安装！');
        }
    },
    proxy(proxy, port) {
        const sysProxyPort = port || config_1.default.port;
        console.log(111, process.platform);
        if (process.platform !== 'darwin') {
            utils_1.log.warn('设置系统代理指令，不支持当前系统');
            return;
        }
        if (typeof proxy === 'boolean') {
            utils_1.log.warn(`Usage:\n${pkg.name} --proxy [off|on]`);
        }
        else if (proxy === 'on') {
            (0, child_process_1.spawn)('networksetup', ['-setautoproxystate', 'Wi-Fi', 'off']);
            (0, child_process_1.spawn)('networksetup', ['-setwebproxy', 'Wi-Fi', '127.0.0.1', `${sysProxyPort}`]);
            (0, child_process_1.spawn)('networksetup', ['-setsecurewebproxy', 'Wi-Fi', '127.0.0.1', `${sysProxyPort}`]);
        }
        else if (proxy === 'off') {
            (0, child_process_1.spawn)('networksetup', ['-setautoproxystate', 'Wi-Fi', 'off']);
            (0, child_process_1.spawn)('networksetup', ['-setwebproxystate', 'Wi-Fi', 'off']);
            (0, child_process_1.spawn)('networksetup', ['-setsecurewebproxystate', 'Wi-Fi', 'off']);
        }
    },
    start(params) {
        const port = params.port || 0;
        localServer_1.default.start(port, params.config);
    },
    test(params) {
        const [, , , url] = params.rawArgs;
        const configPath = params.config;
        const { config = {} } = localServer_1.default.loadUserConfig(configPath, config_1.default);
        const matchResult = (0, matcher_1.matcher)(config.rules, url);
        utils_1.log.info(`匹配结果：${matchResult.matched}`);
        return false;
    }
};
