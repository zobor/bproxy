import * as nativeApi from './invoke';

interface InvokeRequestParams {
  url?: string;
  method?: string;
  requestHeader?: object;
  requestId: string;
  requestBody?: string;
  responseHeader?: object;
  responseBody?: any;
  statusCode?: number;
}

let instances: any = [];

const ioWebInvokeApiInstal = () => {
  instances.forEach(socket => {
    socket.on('ioWebInvoke', (payload: any) => {
      const { type, params } = payload;
      if (type && nativeApi[type]) {
        try {
          const rs = nativeApi[type](params);
          socket.emit('ioWebInvokeCallback', rs);
        } catch(err) {
          socket.emit('ioWebInvokeCallback', err);
        }
      } else {
        socket.emit('ioWebInvokeCallback', new Error('ioWebInvoke fail, api not found'));
      }
    })
  })
};

export const io = (server) => {
  const $io = require('socket.io')(server);
  $io.on('connection', function(socket){
    socket.emit('test', {msg: 'ws connected!'});
    instances.push(socket);
    ioWebInvokeApiInstal();
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
