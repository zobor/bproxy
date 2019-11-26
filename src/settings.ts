import * as path from 'path';

export default {
  port: 8888,
  configFile: path.resolve(process.cwd(), 'bproxy.conf.js'),
  downloadPath: '',
  https: [],
  sslAll: false,
  host: [],
  rules: [],
  certificate: {
    filename: 'bproxy.ca.crt',
    keyFileName: 'bproxy.ca.key.pem',
    name: 'bproxy-cert',
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