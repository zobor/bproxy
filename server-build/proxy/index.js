"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>LocalServer
});
const _fs = /*#__PURE__*/ _interopRequireWildcard(require("fs"));
const _http = /*#__PURE__*/ _interopRequireWildcard(require("http"));
const _lodash = require("lodash");
const _url = /*#__PURE__*/ _interopRequireWildcard(require("url"));
const _packageJson = /*#__PURE__*/ _interopRequireWildcard(require("../../package.json"));
const _api = require("./api");
const _config = require("./config");
const _getUserConfig = require("./getUserConfig");
const _httpMiddleware = /*#__PURE__*/ _interopRequireDefault(require("./httpMiddleware"));
const _httpsMiddleware = /*#__PURE__*/ _interopRequireDefault(require("./httpsMiddleware"));
const _logger = /*#__PURE__*/ _interopRequireDefault(require("./logger"));
const _socket = require("./socket/socket");
const _staticServer = require("./staticServer");
const _systemProxy = require("./systemProxy");
const _dataset = /*#__PURE__*/ _interopRequireWildcard(require("./utils/dataset"));
const _is = require("./utils/is");
const _request = require("./utils/request");
const _utils = require("./utils/utils");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const pkg = _packageJson;
class LocalServer {
    // 启动前的检查
    static async beforeStart() {
        _logger.default.info('当前运行环境', _dataset.default.platform);
        // 检查bproxy app默认的配置，不存在就创建一个
        await this.checkDefaultConfigAndCreateOne();
        // 检查bash环境的配置
        this.checkPWDConfig();
        // 检查 app 环境的配置
        this.checkAppLastTimeConfig();
        // 检查是否最新版本
        this.checkUpgrade();
    }
    static async checkUpgrade() {
        (0, _request.checkUpgrade)().then((data)=>{
            (0, _api.showUpgrade)(data);
        });
    }
    // 检查配置默认配置文件
    static async checkDefaultConfigAndCreateOne() {
        if (!_fs.existsSync(_config.appConfigFilePath)) {
            _fs.writeFileSync(_config.appConfigFilePath, _config.configModuleTemplate);
        }
        return true;
    }
    static async checkPWDConfig() {
        if ((0, _api.isApp)()) {
            return;
        }
        // bash 环境使用当面目录承载配置
        (0, _getUserConfig.updateConfigPathAndWatch)({
            configPath: process.cwd()
        });
    }
    static async checkAppLastTimeConfig() {
        if (_dataset.default.platform !== 'app') {
            return;
        }
        const { prevConfigPath  } = _dataset.default;
        if (prevConfigPath) {
            // 使用上一次使用的配置文件路径
            (0, _getUserConfig.updateConfigPathAndWatch)({
                configPath: prevConfigPath
            });
        } else {
            // 没有历史记录，使用上一次的
            (0, _getUserConfig.updateConfigPathAndWatch)({
                configPath: _config.appDataPath
            });
        }
    }
    static async start() {
        await this.beforeStart();
        const { config  } = _dataset.default;
        if ((0, _lodash.isEmpty)(config)) {
            _logger.default.error('启动失败，找不到配置');
            await (0, _utils.delay)(1000);
            process.exit(0);
        }
        // 启动立即开启系统代理
        this.enableBproxySystemProxy(config.port || 8888);
        const server = new _http.Server();
        const certConfig = _httpsMiddleware.default.beforeStart();
        // websocket server
        (0, _socket.ioInit)(server);
        server.listen(config.port, ()=>{
            // http
            server.on('request', (req, res)=>{
                if ((0, _is.isLocalServerRequest)(req.url || '')) {
                    var ref;
                    if ((ref = req.url) === null || ref === void 0 ? void 0 : ref.includes('/socket.io/')) {
                        return;
                    }
                    (0, _staticServer.staticServer)(req, res, certConfig);
                    return;
                }
                const $req = req;
                if (!$req.$requestId) {
                    $req.$requestId = _utils.utils.guid();
                }
                _httpMiddleware.default.proxy($req, res);
            });
            // https
            server.on('connect', (req, socket, head)=>{
                // 重置URL到本地服务
                if (req.url === 'bproxy.io:80') {
                    req.url = `localhost:${_dataset.default.config.port}`;
                }
                const $req = req;
                if (!$req.$requestId) {
                    $req.$requestId = _utils.utils.guid();
                }
                _httpsMiddleware.default.proxy($req, socket, head);
            });
            // ws
            server.on('upgrade', (req, socket, head)=>{
                const urlObj = _url.parse(req.url, true);
                const pathname = urlObj.pathname.split('/');
                const type = pathname[1];
                const id = pathname[2];
                if (type === 'target' || type === 'client') {
                    _socket.wss.handleUpgrade(req, socket, head, (ws)=>{
                        ws.type = type;
                        ws.id = id;
                        const q = urlObj.query;
                        if (type === 'target') {
                            ws.pageURL = q.url;
                            ws.title = q.title;
                            ws.favicon = q.favicon;
                            ws.ua = q.ua;
                        } else {
                            ws.target = q.target;
                        }
                        _socket.wss.emit('connection', ws, req);
                    });
                } else if (type === 'data') {
                    _socket.wss.handleUpgrade(req, socket, head, (ws)=>{
                        (0, _socket.wsApi)(ws);
                    });
                } else {
                    socket.destroy();
                }
            });
        });
        _logger.default.info(`✔ bproxy[${pkg.version}] 启动成功✨`);
        _logger.default.info(`✔ 操作面板地址：${`http://127.0.0.1:${config.port}`}`);
        this.errorCatch();
        this.afterStart();
    }
    static afterStart() {
        (0, _dataset.updateDataSet)('ready', true);
    }
    static async enableBproxySystemProxy(port) {
        return (0, _systemProxy.configSystemProxy)({
            host: '127.0.0.1'
        });
    }
    static async disableBproxySystemProxy() {
        return (0, _systemProxy.setSystemProxyOff)();
    }
    static async errorCatch() {
        process.on('uncaughtException', async (err)=>{
            var ref;
            // 端口被占用，停止启动
            if (err === null || err === void 0 ? void 0 : (ref = err.message) === null || ref === void 0 ? void 0 : ref.includes('address already in use')) {
                _logger.default.error(`ERROR: 端口被占用，请检查bproxy是否已启动。`);
                if (_dataset.default.platform === 'app') {
                    await (0, _api.showError)('端口被占用，请检查bproxy是否已启动');
                }
                process.exit();
            } else {
                _logger.default.error(`uncaughtException: ${JSON.stringify(err.stack)}`);
            }
        });
        // process.stdin.resume();
        process.on('exit', this.afterCloseNodeJsProcess);
        process.on('SIGINT', this.afterCloseNodeJsProcess);
    }
    static async afterCloseNodeJsProcess() {
        _logger.default.info('close bproxy');
        await LocalServer.disableBproxySystemProxy();
        await (0, _utils.delay)(100);
        process.exit(0);
    }
}
