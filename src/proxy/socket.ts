import { Socket } from 'socket.io';
import { InvokeRequestParams, WebInvokeParams } from '../types/proxy';
import * as nativeApi from './invoke';

let instances: Socket[] = [];

const ioWebInvokeApiInstall = () => {
  instances.forEach((socket: Socket) => {
    socket.on('ioWebInvoke', async(payload: WebInvokeParams) => {
      const { type, params, id } = payload;
      if (type && nativeApi[type]) {
        try {
          const rs = await nativeApi[type](params);
          socket.emit('ioWebInvokeCallback', {
            data: rs,
            id,
          });
        } catch(err) {
          socket.emit('ioWebInvokeCallback', {
            error: err,
            id,
          });
        }
      } else {
        socket.emit('ioWebInvokeCallback', {
          error: new Error('ioWebInvoke fail, api not found'),
          id,
        });
      }
    });
  });
};

export const emit = (type: string, msg: any) => {
  instances.forEach((io) => {
    io.emit(type, msg);
  });
}

export const io = (server) => {
  const io = require('socket.io')(server);
  io.on('connection', (socket: Socket) => {
    socket.emit('init', {msg: 'ws connected!'});
    instances.push(socket);
    ioWebInvokeApiInstall();
    socket.on('disconnect', (() => {
      instances = instances.filter(ins => ins !== socket);
    }));
    socket.on('transferCode', (rs) => {
      emit('transferCode', rs);
    });
    socket.on('transferCodeCallback', (rs) => {
      emit('transferCodeCallback', rs);
    });
    socket.on('syncRemotePageLogs', (rs) => {
      emit('syncRemotePageLogs', rs);
    });
  });
}

export const ioRequest = (params: InvokeRequestParams) => {
  emit('request', params);
};

export const onConfigFileChange = () => {
  emit('onConfigFileChange', {});
};
