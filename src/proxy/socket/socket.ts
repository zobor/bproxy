import * as nativeApi from './bridge';
import { WebSocket } from 'ws';
import ChannelManager from './ChannelManager';
import { parseJSON } from '../../utils/utils';
// import logger from '../logger';

export let wss: any;
export const channelManager = new ChannelManager();

let instances: any[] = [];

async function bridgeApi(type, method, params, uuid, ws) {
  if (method && nativeApi[method]) {
    // logger.info(`桥接调用[${method}]`, params);
    const rs = await nativeApi[method](params);
    ws.send(JSON.stringify({ type, method, payload: rs, uuid }));
    if (!['getLogContent'].includes(method)) {
      // logger.info(`桥接调用的结果[${method}]`, rs);
    }
  }
}

export const wsApi = (ws) => {
  instances.push(ws);
  ws.onmessage = (e) => {
    const wsData = parseJSON(e.data);
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
    instances = instances.filter((ins) => ins !== ws);
  };
};

export const emit = (type: string, msg: any) => {
  instances.forEach((ws) => ws.send(JSON.stringify({ type, payload: msg })));
};

export const ioInit = (server) => {
  wss = new WebSocket.Server({ noServer: server ? true : false });
  wss.on('connection', (ws) => {
    const { type } = ws;
    if (type === 'client') {
      const { id, target } = ws;
      channelManager.createClient(id, ws, target);
    } else if (type === 'target') {
      const { id, pageURL, title, favicon, ua } = ws;
      channelManager.createTarget(id, ws, pageURL, title, favicon, ua);
    }
  });
};

export const ioRequest = (params: BproxyHTTP.InvokeRequestParams) => {
  emit('request', params);
};

export const onConfigFileChange = () => {
  emit('onConfigFileChange', {});
};

export const onConfigFileRuntimeError = (data: any) => {
  emit('onConfigFileRuntimeError', data || {});
};

export const onDebuggerClientChange = () => {
  emit('onDebuggerClientChange', {});
};

channelManager.on('target_changed', onDebuggerClientChange);
