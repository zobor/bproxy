"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onRequest = exports.getServerIp = exports.testRule = void 0;
const socket_io_client_1 = require("socket.io-client");
const $socket = (0, socket_io_client_1.io)(`ws://${window.location.hostname}:8888`, {
    transports: ['websocket'],
});
window.$socket = $socket;
const testRule = (url) => new Promise((resolve, reject) => {
    $socket.on("ioWebInvokeCallback", (rs) => {
        resolve(rs);
    });
    $socket.emit("ioWebInvoke", {
        type: "test",
        params: url,
    });
    setTimeout(() => {
        reject(new Error('invoke timeout'));
    }, 5000);
});
exports.testRule = testRule;
const getServerIp = () => new Promise((resolve, reject) => {
    $socket.on("ioWebInvokeCallback", (rs) => {
        resolve(rs);
    });
    $socket.emit("ioWebInvoke", {
        type: "getLocalIp",
        params: {},
    });
    setTimeout(() => {
        reject(new Error('invoke timeout'));
    }, 5000);
});
exports.getServerIp = getServerIp;
const onRequest = (callback) => {
    $socket.removeAllListeners('request');
    $socket.on('request', callback);
};
exports.onRequest = onRequest;
