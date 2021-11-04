import * as path from 'path';
import { ProxyConfig } from '../types/proxy';

const config: ProxyConfig = {
  port: 8888,
  configFile: path.resolve(process.cwd(), 'bproxy.config.js'),
  https: [],
  sslAll: true,
  host: [],
  rules: [
    {
      regx: 'baidu.com/bproxy',
      response: 'hello bproxy\n',
    }
  ],
  certificate: {
    filename: 'bproxy.ca.crt',
    keyFileName: 'bproxy.ca.key.pem',
    name: 'B Proxy CA',
    organizationName: 'zoborzhang',
    OU: 'https://github.com/zobor/bproxy',
    countryName: 'CN',
    provinceName: 'HuBei',
    localityName: 'WuHan',
    keySize: 2048,
    getDefaultCABasePath(): string {
      const userHome = process.env.HOME || process.env.USERPROFILE || process.cwd();
      return path.resolve(userHome, './.AppData/bproxy');
    },
    getDefaultCACertPath(): string {
      return path.resolve(
        this.getDefaultCABasePath(),
        this.filename,
      );
    },
    getDefaultCAKeyPath(): string {
      return path.resolve(
        this.getDefaultCABasePath(),
        this.keyFileName,
      );
    },
  },
}

export default config;
