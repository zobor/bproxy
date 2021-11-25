"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onRequest = exports.bridgeInvoke = void 0;
const socket_io_client_1 = require("socket.io-client");
const util_1 = require("./util");
const { port } = location;
const $socket = (0, socket_io_client_1.io)(`ws://${window.location.hostname}:${port === '8889' ? '8888' : port}`, {
    transports: ['websocket'],
});
window.$socket = $socket;
const bridgeInvoke = ({ api, params = {} }) => new Promise((resolve, reject) => {
    const guid = (0, util_1.getRandStr)(32);
    $socket.on("ioWebInvokeCallback", ({ data, err, id }) => {
        if (id === guid) {
            resolve(data);
        }
    });
    $socket.emit("ioWebInvoke", {
        type: api,
        params,
        id: guid,
    });
    setTimeout(() => {
        reject(new Error('invoke timeout'));
    }, 5000);
});
exports.bridgeInvoke = bridgeInvoke;
const onRequest = (callback) => {
    $socket.removeAllListeners('request');
    $socket.on('request', callback);
};
exports.onRequest = onRequest;
