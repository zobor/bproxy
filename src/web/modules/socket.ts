/**
 * web socket实例化
 */
import { onLogRecive } from '../components/CodeRunner/watchLogs';
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
  timeout?: number;
}


// 消息监听 --- 网络日志请求
export const onRequest = (callback: any) => {
  $socket.removeAllListeners('request');
  $socket.on('request', callback);
};

// 消息监听 --- 配置文件更新
export const onConfigFileChange = (callback: any) => {
  $socket.removeAllListeners('onConfigFileChange');
  $socket.on('onConfigFileChange', callback);
};

// 接口 --- 桥接调用
export const bridgeInvoke = ({ api, params = {}, timeout = 5000 }: BridgeInvokeParams) => new Promise((resolve, reject) => {
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
    reject(new Error(`[invoke timeout] ${api}`));
  }, timeout);
});

// 接口 --- 远程代码调用
export const remoteInvoke = (code: string, timeout?: number) => new Promise((resolve, reject) => {
  const guid = getRandStr(32);
  $socket.on("transferCodeCallback", ({data, err, id}) => {
    if (id === guid) {
      resolve(data);
    }
  });
  $socket.emit("transferCode", {
    code,
    id: guid,
  });

  setTimeout(() => {
    reject(new Error('remote invoke timeout'));
  }, timeout || 5000);
});


$socket.on('syncRemotePageLogs', (data: any) => {
  onLogRecive(data);
});
