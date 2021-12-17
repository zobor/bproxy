import { getRandStr } from './util';

const { io } = window as any;

const { port } = location;

const $socket = io(`ws://${window.location.hostname}:${port === '8889' ? '8888' : port}`, {
  transports: ['websocket'],
});

(window as any).$socket = $socket;

interface BridgeInvokeParams {
  api: string;
  params?: any;
}

export const bridgeInvoke = ({ api, params = {} }: BridgeInvokeParams) => new Promise((resolve, reject) => {
  const guid = getRandStr(32);
  $socket.on("ioWebInvokeCallback", ({data, err, id}) => {
    if (id === guid) {
      resolve(data);
    }
  });
  $socket.emit("ioWebInvoke", {
    type: api,
    params,
    id: guid,
  });

  setTimeout(() => {
    reject(new Error('invoke timeout'));
  }, 5000);
});

export const onRequest = (callback: any) => {
  $socket.removeAllListeners('request');
  $socket.on('request', callback);
};


export const onConfigFileChange = (callback: any) => {
  $socket.removeAllListeners('onConfigFileChange');
  $socket.on('onConfigFileChange', callback);
};
