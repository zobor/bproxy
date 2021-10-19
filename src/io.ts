const instances: any = [];
export const io = (server) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const $io = require('socket.io')(server);
  $io.on('connection', function(socket){
    console.log('a user connected');
    socket.emit('test', {name: 22});
    instances.push(socket);
  });
}

export const emit = (type: string, msg: any) => {
  instances.forEach((io) => {
    io.emit(type, msg);
  })
}

interface IoRequestParams {
  url?: string;
  method?: string;
  requestHeader?: object;
  requestId: string;
  requestBody?: string;
  responseHeader?: object;
  responseBody?: string;
  statusCode?: number;
}
export const ioRequest = (params: IoRequestParams) => {
  emit('request', params);
};
