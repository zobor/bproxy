import { omit } from 'lodash';
import * as path from 'path';
import JSONFormat from '../web/libs/jsonFormat';
import { getComputerName } from './macos/os';

// 配置文件名
export const appConfigFileName = 'bproxy.config.js';
// 数据存储目录
export const appDataPath = path.resolve(process.env.HOME || process.env.USERPROFILE || process.cwd(), './.AppData/bproxy');
// 配置文件路径
export const appConfigFilePath = path.resolve(appDataPath, appConfigFileName);
// 错误日志文件
export const appErrorLogFilePath = path.resolve(appDataPath, 'logs/error.log');
// 常规日志文件
export const appInfoLogFilePath = path.resolve(appDataPath, 'logs/info.log');
// 临时目录
export const appTempPath = process.env.TEMP;

const config: BproxyConfig.Config = {
  debug: true,
  port: 8888,
  https: true,
  highPerformanceMode: false,
  rules: [
    {
      url: 'https://qq.com/bproxy',
      target: 'hello bproxy\n',
    }
  ],
}
export default config;

export const certificate = {
  filename: 'bproxy.ca.crt',
  keyFileName: 'bproxy.ca.key.pem',
  name: `bproxy CA(${getComputerName()})`,
  organizationName: 'zoborzhang',
  OU: 'https://github.com/zobor/bproxy',
  countryName: 'CN',
  provinceName: 'HuBei',
  localityName: 'WuHan',
  keySize: 2048,
  getDefaultCABasePath(): string {
    return appDataPath;
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
};
// 配置文件模版
export const configTemplate = omit(config, ['certificate']);
// 配置文件模版 字符串
export const configTemplateString = JSON.stringify(configTemplate);
// commonnJs 格式配置文件模版 字符串
export const configModuleTemplate = `module.exports = ${JSONFormat(configTemplate)}`;
// 环境变量
export const env = {
  bash: process.env.NODE_ENV === 'bash',
};

export const bproxyPrefixHeader = 'x-bproxy';
