"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
const fs = __importStar(require("fs"));
const http = __importStar(require("http"));
const lodash_1 = require("lodash");
const url = __importStar(require("url"));
const packageJson = __importStar(require("../../package.json"));
const config_1 = require("./config");
const getUserConfig_1 = require("./getUserConfig");
const httpMiddleware_1 = __importDefault(require("./httpMiddleware"));
const httpsMiddleware_1 = __importDefault(require("./httpsMiddleware"));
const logger_1 = __importDefault(require("./logger"));
const socket_1 = require("./socket/socket");
const staticServer_1 = require("./staticServer");
const systemProxy_1 = require("./systemProxy");
const dataset_1 = __importDefault(require("./utils/dataset"));
const is_1 = require("./utils/is");
const request_1 = require("./utils/request");
const utils_1 = require("./utils/utils");
let showErrorDialog = (arg) => { };
if (dataset_1.default.platform === 'app') {
    const electronApi = require('./electronApi');
    showErrorDialog = electronApi.showErrorDialog;
}
const pkg = packageJson;
class LocalServer {
    static beforeStart() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info('当前运行环境', dataset_1.default.platform);
            yield this.checkDefaultConfigAndCreateOne();
            this.checkPWDConfig();
            this.checkAppLastTimeConfig();
            this.checkUpgrade();
        });
    }
    static checkUpgrade() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, request_1.checkUpgrade)().then((data) => {
                if (data && data.version) {
                    console.log('\n');
                    console.log('########################################');
                    console.log(`bproxy有新版本（${data.version}）可以升级，请尽快升级`);
                    console.log('更新内容如下：');
                    console.log(data.changeLog.map((item) => `  ${item}`).join('\n'));
                    console.log('########################################');
                    console.log('\n');
                }
            });
        });
    }
    static checkDefaultConfigAndCreateOne() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs.existsSync(config_1.appConfigFilePath)) {
                fs.writeFileSync(config_1.appConfigFilePath, config_1.configModuleTemplate);
            }
            return true;
        });
    }
    static checkPWDConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            if (dataset_1.default.platform !== 'bash') {
                return;
            }
            (0, getUserConfig_1.updateConfigPathAndWatch)({
                configPath: process.cwd(),
            });
        });
    }
    static checkAppLastTimeConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            if (dataset_1.default.platform !== 'app') {
                return;
            }
            const { prevConfigPath } = dataset_1.default;
            if (prevConfigPath) {
                (0, getUserConfig_1.updateConfigPathAndWatch)({
                    configPath: prevConfigPath,
                });
            }
            else {
                (0, getUserConfig_1.updateConfigPathAndWatch)({
                    configPath: config_1.appDataPath,
                });
            }
        });
    }
    static start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.beforeStart();
            const { config } = dataset_1.default;
            if ((0, lodash_1.isEmpty)(config)) {
                logger_1.default.error('启动失败，找不到配置');
                yield (0, utils_1.delay)(1000);
                process.exit(0);
            }
            this.enableBproxySystemProxy(config.port || 8888);
            const server = new http.Server();
            const certConfig = httpsMiddleware_1.default.beforeStart();
            (0, socket_1.ioInit)(server);
            server.listen(config.port, () => {
                server.on('request', (req, res) => {
                    var _a;
                    if ((0, is_1.isLocalServerRequest)(req.url || '')) {
                        if ((_a = req.url) === null || _a === void 0 ? void 0 : _a.includes('/socket.io/')) {
                            return;
                        }
                        (0, staticServer_1.staticServer)(req, res, certConfig);
                        return;
                    }
                    const $req = req;
                    if (!$req.$requestId) {
                        $req.$requestId = utils_1.utils.guid();
                    }
                    httpMiddleware_1.default.proxy($req, res);
                });
                server.on('connect', (req, socket, head) => {
                    if (req.url === 'bproxy.io:80') {
                        req.url = `localhost:${dataset_1.default.config.port}`;
                    }
                    const $req = req;
                    if (!$req.$requestId) {
                        $req.$requestId = utils_1.utils.guid();
                    }
                    httpsMiddleware_1.default.proxy($req, socket, head);
                });
                server.on('upgrade', (req, socket, head) => {
                    const urlObj = url.parse(req.url, true);
                    const pathname = urlObj.pathname.split('/');
                    const type = pathname[1];
                    const id = pathname[2];
                    if (type === 'target' || type === 'client') {
                        socket_1.wss.handleUpgrade(req, socket, head, (ws) => {
                            ws.type = type;
                            ws.id = id;
                            const q = urlObj.query;
                            if (type === 'target') {
                                ws.pageURL = q.url;
                                ws.title = q.title;
                                ws.favicon = q.favicon;
                                ws.ua = q.ua;
                            }
                            else {
                                ws.target = q.target;
                            }
                            socket_1.wss.emit('connection', ws, req);
                        });
                    }
                    else if (type === 'data') {
                        socket_1.wss.handleUpgrade(req, socket, head, (ws) => {
                            (0, socket_1.wsApi)(ws);
                        });
                    }
                    else {
                        socket.destroy();
                    }
                });
            });
            logger_1.default.info(`✔ bproxy[${pkg.version}] 启动成功✨`);
            logger_1.default.info(`✔ 操作面板地址：${`http://127.0.0.1:${config.port}`}`);
            this.errorCatch();
        });
    }
    static enableBproxySystemProxy(port) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, systemProxy_1.configSystemProxy)({ host: '127.0.0.1' });
        });
    }
    static disableBproxySystemProxy() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, systemProxy_1.setSystemProxyOff)();
        });
    }
    static errorCatch() {
        return __awaiter(this, void 0, void 0, function* () {
            process.on('uncaughtException', (err) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if ((_a = err === null || err === void 0 ? void 0 : err.message) === null || _a === void 0 ? void 0 : _a.includes('address already in use')) {
                    logger_1.default.error(`ERROR: 端口被占用，请检查bproxy是否已启动。`);
                    if (dataset_1.default.platform === 'app') {
                        yield showErrorDialog('端口被占用，请检查bproxy是否已启动');
                    }
                    process.exit();
                }
                else {
                    logger_1.default.error(`uncaughtException: ${JSON.stringify(err.stack)}`);
                }
            }));
            process.on('exit', this.afterCloseNodeJsProcess);
            process.on('SIGINT', this.afterCloseNodeJsProcess);
        });
    }
    static afterCloseNodeJsProcess() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info('close bproxy');
            yield LocalServer.disableBproxySystemProxy();
            yield (0, utils_1.delay)(100);
            process.exit(0);
        });
    }
}
exports.default = LocalServer;
