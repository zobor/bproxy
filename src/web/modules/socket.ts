/**
 * web socket实例化
 */
import { getRandStr } from './util';
import WS from './ws';

const port = location.port === '8889' ? '8888' : location.port;
const url = `ws://${location.hostname}:${port}/data`;

export const ws = new WS({ url, autoConnect: location.pathname?.includes('/web/') });

const cache: any = {};

// 监听请求回调
export function onRequest(callback) {
  if (cache.onRequest) {
    cache.onRequest.unsubscribe();
  }
  cache.onRequest = ws.on('request', ({ payload }) => {
    callback(payload);
  });
}

// 监听配置文件变化
export function onConfigFileChange(callback) {
  if (cache.onConfigFileChange) {
    cache.onConfigFileChange.unsubscribe();
  }
  cache.onConfigFileChange = ws.on('onConfigFileChange', callback);
}

// 监听weinre对象变化
export function onDebuggerClientChange(callback) {
  if (cache.onDebuggerClientChange) {
    cache.onDebuggerClientChange.unsubscribe();
  }
  cache.onDebuggerClientChange = ws.on('onDebuggerClientChange', callback);

  return cache.onDebuggerClientChange;
}

// 监听配置文件的错误
export function onConfigFileRuntimeError(callback: any) {
  if (cache.onConfigFileRuntimeError) {
    cache.onConfigFileRuntimeError.unsubscribe();
  }
  cache.onConfigFileRuntimeError = ws.on('onConfigFileRuntimeError', callback);

  return cache.onConfigFileRuntimeError;
}

// 调用桥接
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
    payload: params,
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
