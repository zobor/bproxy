import * as nativeApi from './invokeApi';

const instances: any = [];

const ioWebInvokeApiInstal = () => {
  instances.forEach(socket => {
    socket.on('ioWebInvoke', (payload: any) => {
      const { type, params } = payload;
      if (type && nativeApi[type]) {
        const rs = nativeApi[type](params);
        socket.emit('ioWebInvokeCallback', rs);
      } else {
        console.error('[error]', 'ioWebInvoke fail, api not found');
      }
    })
  })
};

export const io = (server) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const $io = require('socket.io')(server);
  $io.on('connection', function(socket){
    console.info('a user connected');
    socket.emit('test', {msg: 'ws connected!'});
    instances.push(socket);
    ioWebInvokeApiInstal();
  });
}

export const emit = (type: string, msg: any) => {
  instances.forEach((io) => {
    io.emit(type, msg);
  });
}

interface IoRequestParams {
  url?: string;
  method?: string;
  requestHeader?: object;
  requestId: string;
  requestBody?: string;
  responseHeader?: object;
  responseBody?: any;
  statusCode?: number;
}
export const ioRequest = (params: IoRequestParams) => {
  emit('request', params);
};
