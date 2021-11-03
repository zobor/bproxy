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
class LocalServer {
    static start(port, configPath) {
        const { config = {}, configPath: confPath = '' } = this.loadUserConfig(configPath, config_1.default);
        dataset_1.default.configPath = configPath;
        if (_.isEmpty(config) || _.isEmpty(confPath)) {
            return;
        }
        let appConfig = config;
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
    }
    static loadUserConfig(configPath, defaultSettings) {
        let mixConfig, userConfigPath;
        const res = {};
        if (_.isBoolean(configPath) || _.isUndefined(configPath)) {
            userConfigPath = '.';
        }
        if (userConfigPath || _.isString(configPath)) {
            const confPath = path.resolve(userConfigPath || configPath, 'bproxy.conf.js');
            if (!fs.existsSync(confPath)) {
                console.error('当前目录下没有找到bproxy.conf.js, 请先创建:', confPath);
                return res;
            }
            else {
                try {
                    const userConfig = require(confPath);
                    mixConfig = Object.assign(Object.assign({}, defaultSettings), userConfig);
                    res.configPath = confPath;
                    res.config = mixConfig;
                }
                catch (err) { }
            }
        }
        return res;
    }
}
exports.default = LocalServer;
