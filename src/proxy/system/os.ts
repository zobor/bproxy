import os from 'os';

// 获取系统名称
export const getOsName = () => {
  return os.platform();
};

// 获取计算机用户名
export const getComputerName = () => {
  return os.hostname().replace(/\.\w+/g, '');
};

// 是否是mac系统
export function isMac() {
  const osName = getOsName();

  return osName === 'darwin';
}

