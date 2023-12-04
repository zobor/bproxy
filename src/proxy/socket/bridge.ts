import fs from 'fs';
import { cloneDeep, get, isFunction } from 'lodash';
import * as URL from 'url';
import * as pkg from '../../../package.json';
import { IS_REG_URL } from '../../utils/constant';
import { previewTextFile, showBproxyHome, showSelectPath } from '../api';
import { appInfoLogFilePath } from '../config';
import { updateConfigPathAndWatch } from '../getUserConfig';
import { matcher } from '../matcher';
import { channelManager } from './socket';
import dataset from '../dataset';
import { getLocalIpAddress } from '../utils/ip';
import logger from '../logger';
export * from '../system/os';
export * from '../system/configProxy';

// 规则检测
export const test = async (url: string) => {
  const { config } = dataset;
  if (!IS_REG_URL.test(url)) {
    return {
      error: '不是有效的URL',
    };
  }
  if (config) {
    const matchResult = cloneDeep(matcher(config.rules, url));

    if (!config.sslAll && !matchResult.matched) {
      const urlParsed = URL.parse(url);
      const { protocol, host, port } = urlParsed;
      const hostname = `${host}:${port || 443}`;
      if (protocol === 'https:' && Array.isArray(config.https) && !config.https?.includes(hostname)) {
        return {
          error: `您开启了https白名单，当前url域名(${hostname})不在白名单`,
          help: `请将 ${hostname} 添加到bproxy.config.js的https字段配置中`,
        };
      }
    }

    for (const key in matchResult) {
      if (key === 'rule') {
        for (const k in matchResult.rule) {
          if (k === 'regx' && get(matchResult, 'rule.regx')) {
            matchResult.rule[k] = get(matchResult, 'rule.regx').toString();
            if (isFunction(get(matchResult, 'rule.response'))) {
              matchResult.rule.response = 'function';
            }
          }
        }
      }
    }

    return matchResult;
  }

  return {};
};

// 获取本机IP
export const getLocalIp = async () => {
  return getLocalIpAddress();
};

// 获取代理端口
export const getLocalProxyPort = async () => {
  const { config } = dataset;

  return config?.port;
};

// 获取代理配置
export const getProxyConfig = async () => {
  const { config } = dataset;

  return config;
};

// 获取代理配置文件所在目录
export const getConfigFile = () => dataset.currentConfigPath;

// 获取配置文件内容
export const getConfigFileContent = () => {
  const configFilePath = getConfigFile();

  if (configFilePath) {
    const txt = fs.readFileSync(configFilePath, 'utf-8');

    return txt;
  }

  return '';
};

// 获取当前版本
export const getVersion = (): string => {
  return pkg.version;
};

// 修改配置文件内容
export const setConfigFileContent = (params: { data: string }) => {
  const configFilePath = getConfigFile();
  const { data } = params || {};

  if (configFilePath && data) {
    fs.writeFileSync(configFilePath, data);

    return true;
  }

  return false;
};

// 获取调试页面target对象
export const getDebugTargets = () => {
  return channelManager._targets;
};

// electron: 选择文件路径
export const selectFilePath = () => showSelectPath();

// 打开日志
export const openLogFile = () => {
  previewTextFile(appInfoLogFilePath);
};

// 打开页面，默认打开bproxy官网
export const openWebPage = () => {
  showBproxyHome();
};

// 获取当前运行的平台
export const getRuntimePlatform = () => {
  return dataset.platform;
};

// 切换配置路径
export const setConfigFilePath = ({ filepath }: { filepath: string }) => {
  updateConfigPathAndWatch({ configPath: filepath });
};

// 查看日志
export const getLogContent = () => {
  return fs.readFileSync(appInfoLogFilePath, 'utf-8');
};

// 清空日志
export const clearLogConent = () => {
  return fs.writeFileSync(appInfoLogFilePath, '');
};

// 查看配置
export const showConfigOnTerminal = () => {
  if (dataset.platform === 'app') {
    logger.info('配置文件地址:', dataset.currentConfigPath);
    logger.info('配置详情:\n', dataset.config);
  } else {
    console.log('配置文件地址:', dataset.currentConfigPath);
    console.log('配置详情:\n', dataset.config);
  }
};

// 关闭APP
export const shutdown = () => {
  console.log('bproxy 已关闭');
  process.exit();
};
