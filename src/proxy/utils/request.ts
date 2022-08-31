/*
 * @Date: 2022-08-11 22:43:08
 * @LastEditors: 张恒 nodejs.js@gmail.com
 * @LastEditTime: 2022-08-13 19:00:38
 * @FilePath: /bp/src/proxy/utils/request.ts
 */
import request from 'request';
import { version } from '.././../../package.json';
import { checkVersion } from './version';

export const getPostBody = (req: any): Promise<Buffer> => {
  return new Promise((resolve) => {
    const body: Array<Buffer> = [];
    req.on('data', (chunk: Buffer) => {
      body.push(chunk);
    });
    req.on('end', () => {
      resolve(Buffer.concat(body));
    });
  });
}

export const getDalay = (rule?: BproxyConfig.Rule, config?: BproxyConfig.Config) => {
  return rule?.delay || config?.delay || 0;
}

export const checkUpgrade = () => {
  return new Promise((resolve) => {
    request.get('http://www.bproxy.cn/version.json', (err, response, body) => {
      if (body) {
        try {
          const versionData = JSON.parse(body);
          if (checkVersion(version, versionData.version) < 0) {
            resolve(versionData);
          } else {
            resolve(null);
          }
        } catch(err) {}
      }
    });
  });
};
