/**
 * web socket实例化
 */
import { getRandStr } from './util';
import WS from './ws';

const port = location.port === '8889' ? '8888' : location.port;
const url = `ws://127.0.0.1:${port}/data`;
export const ws = new WS({ url });

const cache: any = {};

export function onRequest(callback) {
  if (cache.onRequest) {
    cache.onRequest.unsubscribe();
  }
  cache.onRequest = ws.on('request', ({ payload }) => {
    callback(payload);
  });
}
export function onConfigFileChange(callback) {
  if (cache.onConfigFileChange) {
    cache.onConfigFileChange.unsubscribe();
  }
  cache.onConfigFileChange = ws.on('onConfigFileChange', callback);
}
export function onDebuggerClientChange(callback) {
  if (cache.onDebuggerClientChange) {
    cache.onDebuggerClientChange.unsubscribe();
  }
  cache.onDebuggerClientChange = ws.on('onDebuggerClientChange', callback);
}
export function onDebuggerClientChangeUnmount(callback) {
  if (cache.onDebuggerClientChangeUnmount) {
    cache.onDebuggerClientChangeUnmount.unsubscribe();
  }
  cache.onDebuggerClientChangeUnmount = ws.on('onDebuggerClientChangeUnmount', callback);
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
