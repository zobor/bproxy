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
const http = __importStar(require("http"));
const _ = __importStar(require("lodash"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const config_1 = __importDefault(require("./config"));
const httpMiddleware_1 = require("./httpMiddleware");
const httpsMiddleware_1 = __importDefault(require("./httpsMiddleware"));
const routers_1 = require("./routers");
const socket_1 = require("./socket");
const ip_1 = require("./utils/ip");
const utils_1 = require("./utils/utils");
const dataset_1 = __importDefault(require("./utils/dataset"));
const confirm_1 = require("./utils/confirm");
const config_2 = __importDefault(require("./config"));
const jsonFormat_1 = __importDefault(require("../web/libs/jsonFormat"));
class LocalServer {
    static start(port, configPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const { config = {}, configPath: confPath = '' } = yield this.loadUserConfig(configPath, config_1.default);
            dataset_1.default.configPath = configPath;
            if (_.isEmpty(config) || _.isEmpty(confPath)) {
                return;
            }
            let appConfig = config;
            port && (appConfig.port = port);
            fs.watchFile(confPath, { interval: 1000 }, () => {
                utils_1.log.info(`配置文件已更新: ${confPath}`);
                try {
                    delete require.cache[require.resolve(confPath)];
                    appConfig = require(confPath);
                }
                catch (err) { }
            });
            const server = new http.Server();
            const certConfig = httpsMiddleware_1.default.beforeStart();
            (0, socket_1.io)(server);
            server.listen(appConfig.port, () => {
                server.on('request', (req, res) => {
                    var _a;
                    if ((0, routers_1.isLocal)(req.url || '')) {
                        if ((_a = req.url) === null || _a === void 0 ? void 0 : _a.includes('/socket.io/')) {
                            return;
                        }
                        (0, routers_1.requestJac)(req, res, certConfig);
                        return;
                    }
                    const $req = req;
                    if (!$req.$requestId) {
                        $req.$requestId = utils_1.utils.guid();
                    }
                    httpMiddleware_1.httpMiddleware.proxy($req, res, appConfig);
                });
                server.on('connect', (req, socket, head) => {
                    const $req = req;
                    if (!$req.$requestId) {
                        $req.$requestId = utils_1.utils.guid();
                    }
                    httpsMiddleware_1.default.proxy($req, socket, head, appConfig);
                });
            });
            const ips = (0, ip_1.getLocalIpAddress)();
            ips.forEach((ip) => {
                utils_1.log.info(`本地代理服务器启动成功: http://${ip}:${appConfig.port}`);
            });
        });
    }
    static loadUserConfig(configPath, defaultSettings) {
        return __awaiter(this, void 0, void 0, function* () {
            let mixConfig, userConfigPath;
            const res = {};
            if (_.isBoolean(configPath) || _.isUndefined(configPath)) {
                userConfigPath = '.';
            }
            const requireUserConfig = (confPath) => {
                try {
                    const userConfig = require(confPath);
                    mixConfig = Object.assign(Object.assign({}, defaultSettings), userConfig);
                    res.configPath = confPath;
                    res.config = mixConfig;
                }
                catch (err) { }
            };
            if (userConfigPath || _.isString(configPath)) {
                const confPath = path.resolve(userConfigPath || configPath, 'bproxy.config.js');
                if (!fs.existsSync(confPath)) {
                    const userInput = yield (0, confirm_1.userConfirm)(`当前目录没有找到bproxy.config.js, 是否自动创建？(Y/n)`);
                    if (userInput.toString().toLocaleUpperCase() === 'Y') {
                        const defaultConfig = _.omit(Object.assign({}, config_2.default), ['configFile', 'certificate']);
                        const template = [
                            'const { setConfig } = require(\'bproxy\');',
                            `const config = setConfig(${(0, jsonFormat_1.default)(defaultConfig, null, 2, 100)});`,
                            'module.exports = config;',
                        ];
                        fs.writeFileSync(confPath, template.join('\n'));
                    }
                }
                requireUserConfig(confPath);
            }
            return res;
        });
    }
}
exports.default = LocalServer;
