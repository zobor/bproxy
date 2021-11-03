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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ioRequest = exports.emit = exports.io = void 0;
const nativeApi = __importStar(require("./invoke"));
let instances = [];
const ioWebInvokeApiInstall = () => {
    instances.forEach((socket) => {
        socket.on('ioWebInvoke', (payload) => {
            const { type, params } = payload;
            if (type && nativeApi[type]) {
                try {
                    const rs = nativeApi[type](params);
                    socket.emit('ioWebInvokeCallback', rs);
                }
                catch (err) {
                    socket.emit('ioWebInvokeCallback', err);
                }
            }
            else {
                socket.emit('ioWebInvokeCallback', new Error('ioWebInvoke fail, api not found'));
            }
        });
    });
};
const io = (server) => {
    const io = require('socket.io')(server);
    io.on('connection', (socket) => {
        socket.emit('test', { msg: 'ws connected!' });
        instances.push(socket);
        ioWebInvokeApiInstall();
        socket.on('disconnect', (() => {
            instances = instances.filter(ins => ins !== socket);
        }));
    });
};
exports.io = io;
const emit = (type, msg) => {
    instances.forEach((io) => {
        io.emit(type, msg);
    });
};
exports.emit = emit;
const ioRequest = (params) => {
    (0, exports.emit)('request', params);
};
exports.ioRequest = ioRequest;
