import { spawnSync } from "child_process";
import os from 'os';
import { obj } from './polyfill';

export const getNetworkServices = (): string[] => {
  const txt = spawnSync('networksetup', ['-listallnetworkservices']).stdout.toString();
  return txt.split('\n').filter(item => !item.includes('that a network service') && !!item);
};

export const getActiveNetwork = () => {
  const list: string[] = [];
  getNetworkServices().map(deviceName => {
    const txt = spawnSync('networksetup', ['-getinfo', deviceName]).stdout.toString();
    if (/IP\saddress:\s\d+/.test(txt)) {
      list.push(deviceName);
    }
  });
  return list;
};

export const setNetworkProxyStatus = ({ deviceName, status}: {
  deviceName: string;
  status: 'off'|'on';
}) => {
  spawnSync('networksetup', ['-setwebproxystate', deviceName, status]);
  spawnSync('networksetup', ['-setsecurewebproxystate', deviceName, status]);
};

export const setActiveNetworkProxyStatus = (status: 'off' | 'on') => {
  const list = getActiveNetwork();
  list.map(deviceName => {
    setNetworkProxyStatus({deviceName, status});
  });
};

export const setNetworkProxy = ({deviceName, host, port}: { deviceName: string ;host: string; port: string}) => {
  spawnSync('networksetup', ['-setautoproxystate', deviceName, 'off']);
  spawnSync('networksetup', ['-setwebproxy', deviceName, host, port]);
  spawnSync('networksetup', ['-setsecurewebproxy', deviceName, host, port]);
  setActiveNetworkProxyStatus('on');
};

export const setActiveNetworkProxy = ({host, port}: {host: string; port: string}) => {
  const list = getActiveNetwork();
  list.map(deviceName => {
    spawnSync('networksetup', ['-setautoproxystate', deviceName, 'off']);
    setNetworkProxy({deviceName, host, port});
    setActiveNetworkProxyStatus('on');
  });
};

export const getNetworkHttpProxyInfo = (deviceName: string) => {
  return obj.fromEntries(spawnSync('networksetup', ['-getwebproxy', deviceName]).stdout.toString().split('\n').filter(item => !!item).map(item => {
    return item.split(': ');
  }));
};

export const getNetworkHttpsProxyInfo = (deviceName: string) => {
  return obj.fromEntries(spawnSync('networksetup', ['-getsecurewebproxy', deviceName]).stdout.toString().split('\n').filter(item => !!item).map(item => {
    return item.split(': ');
  }));
};

export const getActiveNetworkProxyInfo = () => {
  const list = getActiveNetwork();
  const result: {[key: string]: any} = {};
  list.map(deviceName => {
    const http = getNetworkHttpProxyInfo(deviceName);
    const https = getNetworkHttpsProxyInfo(deviceName);

    result[deviceName] = {
      http, https,
    };
  });

  return result;
};

export const getActiveNetworkProxyStatus = () => {
  const data = getActiveNetworkProxyInfo();
  const result = {};
  Object.keys(data).map(deviceName => {
    const {http, https} = data[deviceName];
    const enable = http?.Enabled === 'Yes' && https?.Enabled === 'Yes' && !!http?.Server && !!https?.Server && !!https?.Port && !!http?.Port;
    result[deviceName] = enable;
  });

  return result;
};

export const getOsName = () => {
  return os.platform();
}

export const getComputerName = () => {
  return os.hostname().replace(/\.\w+/g, '');
};
