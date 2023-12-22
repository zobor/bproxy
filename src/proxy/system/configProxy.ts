import config from '../config';
import {
  getActiveNetworkProxyInfo,
  getActiveNetworkProxyStatus,
  setActiveNetworkProxy,
  setActiveNetworkProxyStatus,
} from './macos/proxy';
import { disableSystemProxy, enableSystemProxy, getSystemProxyStatus, setSystemProxy } from './windows/proxy';
import { installCertificate } from './windows/installCertificate';
import { isMac } from './os';
import { installMacCertificate } from './macos/installCertificate';
import storage, { STORAGE_KEYS } from '../storage';
import logger from '../logger';
import chalk from 'chalk';

async function saveSystemProxyFlag(v: string) {
  if (storage?.setItem) {
    await storage.setItem(STORAGE_KEYS.SYSTEM_PROXY, v);
  }
}

// 开启系统代理
export async function setSystemProxyOn() {
  await saveSystemProxyFlag('1');
  logger.info(`${chalk.gray('✔ 系统代理开关：已开启')}`);
  if (isMac()) {
    setActiveNetworkProxyStatus('on');
  } else {
    enableSystemProxy();
  }
}

// 关闭系统代理
export async function setSystemProxyOff() {
  await saveSystemProxyFlag('0');
  logger.info(`${chalk.gray('✔ 系统代理开关：未开启')}`);
  if (isMac()) {
    return setActiveNetworkProxyStatus('off');
  } else {
    return disableSystemProxy();
  }
}

// 配置系统代理
export async function configSystemProxy({
  host = '127.0.0.1',
  port = `${config.port}`,
}: {
  host?: string;
  port?: string;
}) {
  await saveSystemProxyFlag('1');
  logger.info(`${chalk.gray('✔ 系统代理开关：已开启')}`);
  if (isMac()) {
    setActiveNetworkProxy({ host, port });
  } else {
    setSystemProxy({ hostname: host, port });
  }
}

// 检查系统代理
export async function checkSystemProxy({
  host = '127.0.0.1',
  port = `${config.port}`,
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
    if (
      info[device]?.http?.Server === host &&
      info[device]?.http?.Port === port.toString() &&
      info[device]?.https?.Server === host &&
      info[device]?.http?.Port === port.toString() &&
      info[device]?.http?.Enabled === 'Yes' &&
      info[device]?.https?.Enabled === 'Yes'
    ) {
      return true;
    }
    return false;
  } else {
    return await getSystemProxyStatus({ address: host, port });
  }
}

export async function autoInstallCertificate() {
  if (isMac()) {
    return installMacCertificate();
  }
  return installCertificate();
}

export async function getNetWorkProxyStatus() {
  if (isMac()) {
    return getActiveNetworkProxyStatus();
  }
  return {};
}

export async function getNetworkProxyInfo() {
  if (isMac()) {
    return getActiveNetworkProxyInfo();
  }
}
