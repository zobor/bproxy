import { Socket } from 'socket.io';
import { InvokeRequestParams, WebInvokeParams } from '../types/proxy';
import * as nativeApi from './invoke';

let instances: Socket[] = [];

const ioWebInvokeApiInstall = () => {
  instances.forEach((socket: Socket) => {
    socket.on('ioWebInvoke', async(payload: WebInvokeParams) => {
      const { type, params } = payload;
      if (type && nativeApi[type]) {
        try {
          const rs = await nativeApi[type](params);
          socket.emit('ioWebInvokeCallback', rs);
        } catch(err) {
          socket.emit('ioWebInvokeCallback', err);
        }
      } else {
        socket.emit('ioWebInvokeCallback', new Error('ioWebInvoke fail, api not found'));
      }
    });
  });
};

export const io = (server) => {
  const io = require('socket.io')(server);
  io.on('connection', (socket: Socket) => {
    socket.emit('test', {msg: 'ws connected!'});
    instances.push(socket);
    ioWebInvokeApiInstall();
    socket.on('disconnect', (() => {
      instances = instances.filter(ins => ins !== socket);
    }));
  });
}

export const emit = (type: string, msg: any) => {
  instances.forEach((io) => {
    io.emit(type, msg);
  });
}

export const ioRequest = (params: InvokeRequestParams) => {
  emit('request', params);
};
