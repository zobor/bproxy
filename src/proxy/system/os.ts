import os from 'os';
import { exec } from 'child_process';
import logger from '../logger';

// 获取系统名称
export const getOsName = () => {
  return os.platform();
};

// 获取计算机用户名
export const getComputerName = () => {
  return process.env.USER || process.env.LOGNAME || os.hostname().replace(/\.\w+/g, '');
};

// 是否是mac系统
export function isMac() {
  const osName = getOsName();

  return osName === 'darwin';
}

// 复制到剪切板
export function updateClipboard(str: string) {
  logger.info('复制到剪切板', str);
  if (isMac()) {
    exec('pbcopy').stdin?.end(str);
  } else {
    exec('clip').stdin?.end(str);
  }
}
