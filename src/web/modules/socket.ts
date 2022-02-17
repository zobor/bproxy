/**
 * web socket实例化
 */
import { getRandStr } from './util';
import WS from './ws';

const port = location.port === '8889' ? '8888' : location.port;
const url = `ws://127.0.0.1:${port}/data`;
export const ws = new WS({ url });

export function onRequest(callback) {
  ws.on('request', ({ payload }) => {
    callback(payload);
  });
}
export function onConfigFileChange(callback) {
  ws.on('onConfigFileChange', callback);
}
export function onDebuggerClientChange(callback) {
  ws.on('onDebuggerClientChange', callback);
}
export function onDebuggerClientChangeUnmount(callback) {
  ws.on('onDebuggerClientChangeUnmount', callback);
}

const bridgeCallback = {};
function bridgeInvokeCallback(rs) {
  const { uuid, payload } = rs || {};
  if (uuid && bridgeCallback[uuid]) {
    bridgeCallback[uuid](payload);
  }
}
export function bridgeInvoke({ api, params = {} }) {
  const uuid = getRandStr(32);
  const data = {
    type: 'bridge',
    method: api,
    uuid,
    payload: params
  };
  ws.send(data);
  ws.once('bridge', bridgeInvokeCallback);
  return new Promise((resolve) => {
    bridgeCallback[uuid] = (data) => {
      resolve(data);
      delete bridgeCallback[uuid];
    };
  });
}
