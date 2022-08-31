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
exports.onDebuggerClientChange = exports.onConfigFileChange = exports.ioRequest = exports.ioInit = exports.emit = exports.wsApi = exports.channelManager = exports.wss = void 0;
const nativeApi = __importStar(require("../jsBridge"));
const ws_1 = require("ws");
const ChannelManager_1 = __importDefault(require("./ChannelManager"));
const logger_1 = __importDefault(require("../logger"));
exports.channelManager = new ChannelManager_1.default();
let instances = [];
function bridgeApi(type, method, params, uuid, ws) {
    return __awaiter(this, void 0, void 0, function* () {
        if (method && nativeApi[method]) {
            logger_1.default.info(`桥接调用[${method}]`, params);
            const rs = yield nativeApi[method](params);
            ws.send(JSON.stringify({ type, method, payload: rs, uuid }));
            if (!['getLogContent'].includes(method)) {
                logger_1.default.info(`桥接调用的结果[${method}]`, rs);
            }
        }
    });
}
const wsApi = (ws) => {
    instances.push(ws);
    ws.onmessage = (e) => {
        const wsData = JSON.parse(e.data);
        const { type, method, payload, uuid } = wsData;
        switch (type) {
            case 'bridge':
                bridgeApi(type, method, payload, uuid, ws);
                break;
            case 'syncMessage':
                ws.send(JSON.stringify(e.data));
                break;
            default:
                break;
        }
    };
    ws.onclose = (ws) => {
        instances = instances.filter(ins => ins !== ws);
    };
};
exports.wsApi = wsApi;
const emit = (type, msg) => {
    instances.forEach((ws) => ws.send(JSON.stringify({ type, payload: msg })));
};
exports.emit = emit;
const ioInit = (server) => {
    exports.wss = new ws_1.WebSocket.Server({ noServer: server ? true : false });
    exports.wss.on('connection', (ws) => {
        const { type } = ws;
        if (type === 'client') {
            const { id, target } = ws;
            exports.channelManager.createClient(id, ws, target);
        }
        else if (type === 'target') {
            const { id, pageURL, title, favicon, ua } = ws;
            exports.channelManager.createTarget(id, ws, pageURL, title, favicon, ua);
        }
    });
};
exports.ioInit = ioInit;
const ioRequest = (params) => {
    (0, exports.emit)('request', params);
};
exports.ioRequest = ioRequest;
const onConfigFileChange = () => {
    (0, exports.emit)('onConfigFileChange', {});
};
exports.onConfigFileChange = onConfigFileChange;
const onDebuggerClientChange = () => {
    (0, exports.emit)('onDebuggerClientChange', {});
};
exports.onDebuggerClientChange = onDebuggerClientChange;
exports.channelManager.on('target_changed', () => {
    (0, exports.onDebuggerClientChange)();
});
