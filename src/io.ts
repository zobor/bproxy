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

const requestList = [];
interface IIoRequestParams {
  url: string;
  params: object;
  requestHeader: object;
}
export const ioRequest = (params: IIoRequestParams) => {
  emit('request', params);
};
