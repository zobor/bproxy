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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ioRequest = exports.emit = exports.io = void 0;
const nativeApi = __importStar(require("./invoke"));
let instances = [];
const ioWebInvokeApiInstall = () => {
    instances.forEach((socket) => {
        socket.on('ioWebInvoke', (payload) => __awaiter(void 0, void 0, void 0, function* () {
            const { type, params, id } = payload;
            if (type && nativeApi[type]) {
                try {
                    const rs = yield nativeApi[type](params);
                    socket.emit('ioWebInvokeCallback', {
                        data: rs,
                        id,
                    });
                }
                catch (err) {
                    socket.emit('ioWebInvokeCallback', {
                        error: err,
                        id,
                    });
                }
            }
            else {
                socket.emit('ioWebInvokeCallback', {
                    error: new Error('ioWebInvoke fail, api not found'),
                    id,
                });
            }
        }));
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
