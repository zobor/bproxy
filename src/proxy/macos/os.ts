import os from 'os';

// 获取系统名称
export const getOsName = () => {
  return os.platform();
}

// 获取计算机用户名
export const getComputerName = () => {
  return os.hostname().replace(/\.\w+/g, '');
};
