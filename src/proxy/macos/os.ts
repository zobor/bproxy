/*
 * @Date: 2022-05-30 22:53:42
 * @LastEditors: 张恒 nodejs.js@gmail.com
 * @LastEditTime: 2022-08-13 20:37:14
 * @FilePath: /bp/src/proxy/macos/os.ts
 */
import { spawnSync } from "child_process";
import os from 'os';
import config, { env, certificate } from '../config';


// 获取系统名称
export const getOsName = () => {
  return os.platform();
}

// 获取计算机用户名
export const getComputerName = () => {
  return os.hostname().replace(/\.\w+/g, '');
};

export const installMacCertificate = async() => {
  const filepath = certificate?.getDefaultCACertPath();
  const bash = `security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ${filepath}`;
  if (env.bash && 0) {
    // `sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ${filepath}`
    const rs = spawnSync('sudo', bash.split(' ')).stdout.toString();
    return rs;
  } else {
    return `sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ${filepath}`;
  }
}
