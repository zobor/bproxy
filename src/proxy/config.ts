import * as path from 'path';
import { ProxyConfig } from '../types/proxy';
import { getComputerName } from './macos/os';

const config: ProxyConfig = {
  port: 8888,
  configFile: path.resolve(process.cwd(), 'bproxy.config.js'),
  https: [],
  sslAll: true,
  host: [],
  weinre: {
    verbose: false,
    debug: false,
    readTimeout: 5,
    deathTimeout: 15,
    httpPort: 9527,
  },
  rules: [
    {
      regx: 'https://google.com/bproxy',
      response: 'hello bproxy\n',
    }
  ],
  certificate: {
    filename: 'bproxy.ca.crt',
    keyFileName: 'bproxy.ca.key.pem',
    name: `B Proxy CA(${getComputerName()})`,
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
