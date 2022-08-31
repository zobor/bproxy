/*
 * @Date: 2022-08-12 21:01:56
 * @LastEditors: 张恒 nodejs.js@gmail.com
 * @LastEditTime: 2022-08-13 22:44:53
 * @FilePath: /bp/src/proxy/socket/socket.ts
 */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as nativeApi from '../jsBridge';

import { WebSocket } from 'ws';
import ChannelManager from './ChannelManager';
import logger from '../logger';

export let wss;
export const channelManager = new ChannelManager();

let instances: any[] = [];

async function bridgeApi(type, method, params, uuid, ws) {
  if (method && nativeApi[method]) {
    logger.info(`桥接调用[${method}]`, params);
    const rs = await nativeApi[method](params);
    ws.send(JSON.stringify({type, method, payload: rs, uuid}));
    if (!['getLogContent'].includes(method)) {
      logger.info(`桥接调用的结果[${method}]`, rs);
    }
  }
}

export const wsApi = (ws) => {
  instances.push(ws);
  ws.onmessage = (e) => {
    const wsData = JSON.parse(e.data);
    const { type, method, payload, uuid } = wsData;
    switch(type) {
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
}

export const emit = (type: string, msg: any) => {
  instances.forEach((ws) => ws.send(JSON.stringify({ type, payload: msg })));
}

export const ioInit = (server) => {
  wss = new WebSocket.Server({ noServer: server ? true: false });
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
}

export const ioRequest = (params: BproxyHTTP.InvokeRequestParams) => {
  emit('request', params);
};

export const onConfigFileChange = () => {
  emit('onConfigFileChange', {});
};

export const onDebuggerClientChange = () => {
  emit('onDebuggerClientChange', {});
};

channelManager.on('target_changed', () => {
  onDebuggerClientChange();
});
