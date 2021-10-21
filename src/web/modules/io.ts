import { io } from "socket.io-client";

const $socket = io(`ws://${window.location.hostname}:8888`, {
  transports: ['websocket'],
});

(window as any).$socket = $socket;

$socket.on('test', (data) => {
  console.log(data);
});


export const testRule = (url: string): Promise<object> =>
  new Promise((resolve, reject) => {
    $socket.on("ioWebInvokeCallback", (rs) => {
      resolve(rs);
    });
    $socket.emit("ioWebInvoke", {
      type: "test",
      params: url,
    });

    setTimeout(() => {
      reject(new Error('invoke timeout'));
    }, 5000);
  });

export const onRequest = (callback: any) => {
  $socket.on('request', callback)
};
