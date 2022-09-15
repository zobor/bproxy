import iconv from 'iconv-lite';
import { exec } from 'child_process';
import {certificate} from '../../config';
import logger from '../../logger';

export function installCertificate() {
  const filepath = certificate.getDefaultCACertPath();

  return new Promise((resolve) => {
    exec(`CERTUTIL -addstore -enterprise -f -v root "${filepath}"`, {encoding: 'buffer'}, (error, stdoutStream) => {
      const stdout = iconv.decode(stdoutStream, 'cp936');
      if (error) {
        logger.error(error);
        resolve({
          code: 2,
          msg: '证书安装失败，请手动安装',
        });
      } else {
        logger.info(stdout);
        if (stdout?.includes('已经在存储中')) {
          resolve({
            code: 0,
            msg: 'bproxy 证书已经在存储中',
          });
        } else if (stdout?.includes('成功')) {
          resolve({
            code: 0,
            msg: 'bproxy 证书安装成功',
          });
        } else {
          resolve({
            code: 1,
            msg: '证书安装失败，请手动安装',
          });
        }
      }
    });
  })
}
