import { getOsName } from "./invoke";
import { getActiveNetworkProxyInfo, getActiveNetworkProxyStatus, setActiveNetworkProxy, setActiveNetworkProxyStatus } from "./macos/proxy";
import { disableSystemProxy, enableSystemProxy, getSystemProxyStatus, setSystemProxy } from "./windows/proxy";

// 是否是mac系统
export function isMac() {
  const osName = getOsName();

  return osName === 'darwin';
}

// 开启系统代理
export function setSystemProxyOn() {
  if (isMac()) {
    setActiveNetworkProxyStatus('on');
  } else {
    enableSystemProxy();
  }
}

// 关闭系统代理
export function setSystemProxyOff() {
  if (isMac()) {
    setActiveNetworkProxyStatus('off');
  } else {
    disableSystemProxy();
  }
}

// 配置系统代理
export function configSystemProxy({
  host = '127.0.0.1',
  port = '8888',
}: {
  host?: string;
  port?: string;
}) {
  if (isMac()) {
    setActiveNetworkProxy({ host, port });
  } else {
    setSystemProxy({hostname: host, port});
  }
}

// 检查系统代理
export async function checkSystemProxy({
  host = '127.0.0.1',
  port = '8888',
}: {
  host?: string;
  port?: string;
}) {
  if (isMac()) {
    const info = getActiveNetworkProxyInfo();
    const names = Object.keys(info || {});
    if (!names || !names.length) {
      return false;
    }
    const [device] = names;
    if (info[device]?.http?.Server === host && info[device]?.http?.Port === port.toString() && info[device]?.https?.Server === host && info[device]?.http?.Port === port.toString() && info[device]?.http?.Enabled === 'Yes' && info[device]?.https?.Enabled === 'Yes') {
      return true;
    }
    return false;
  } else {
    return await getSystemProxyStatus({address: host, port});
  }
}

// (async() => {
//   // configSystemProxy({});
//   setSystemProxyOff();
//   console.log(await checkSystemProxy({}));
// })();