import fs from 'fs';
import { isBoolean, isEmpty, isUndefined } from 'lodash';
import path from 'path';
import settings, { appConfigFileName, configModuleTemplate } from './config';
import logger from './logger';
import preload from './configPreload';
import { onConfigFileChange, onConfigFileRuntimeError } from './socket/socket';
import { updateDataSet } from './dataset';

let watcher: any;

const loadUserConfigOrCreate = async (configFilePath: string): Promise<BproxyConfig.Config> => {
  let userConfig = {} as BproxyConfig.Config;

  if (isBoolean(configFilePath) || isUndefined(configFilePath) || isEmpty(configFilePath)) {
    updateDataSet('config', settings);
    return settings;
  }

  const importUserConfig = async (configPath: string) => {
    try {
      delete require.cache[require.resolve(configPath)];
      const newConfig = require(configPath);
      userConfig = { ...settings, ...newConfig };
      updateDataSet('config', await preload(userConfig));
    } catch (err: any) {
      console.error(err);
      logger.error(err.message);
      onConfigFileRuntimeError({
        message: err.message,
        stack: err.stack,
      });
      throw err;
    }
  };
  updateDataSet('currentConfigPath', configFilePath);

  // 当前目录没有bproxy的配置文件
  if (!fs.existsSync(configFilePath)) {
    fs.writeFileSync(configFilePath, configModuleTemplate);
  }
  importUserConfig(configFilePath);

  return userConfig;
};

// 设置配置文件目录
export const updateConfigPathAndWatch = async (params: { configPath: string }): Promise<void> => {
  const { configPath } = params;
  let lastAvailableConfigContent;

  logger.info('{updateConfigPathAndWatch}:', configPath);

  // 参数异常，配置文件路劲没有
  if (!configPath) {
    logger.error('updateConfigPathAndWatch(configPath), configPath is empty');
    throw new Error('updateConfigPathAndWatch(configPath), configPath is empty');
  }

  // 配置文件目录不存在
  if (fs.existsSync(configPath)) {
    updateDataSet('currentConfigPath', configPath);
    const fullFilePath = path.resolve(configPath, appConfigFileName);
    let userConfig;
    try {
      userConfig = await loadUserConfigOrCreate(fullFilePath);
      // 更新最近成功加载的配置内容
      lastAvailableConfigContent = fs.readFileSync(fullFilePath, 'utf-8');
    } catch (err) {
      if (lastAvailableConfigContent) {
        fs.writeFileSync(fullFilePath, lastAvailableConfigContent);
      }
    }

    // 切换配置，需要取消上一次配置文件的监听
    if (watcher?.close) {
      watcher.close();
    }
    // 监听配置文件变化，变化了更新bproxy的临时配置数据
    watcher = fs.watchFile(fullFilePath, { interval: 3000 }, async () => {
      logger.info(`配置文件变更: ${fullFilePath}`);
      try {
        userConfig = await loadUserConfigOrCreate(fullFilePath);
        // ws 广播消息通知
        onConfigFileChange();
        // 更新最近成功加载的配置内容
        lastAvailableConfigContent = fs.readFileSync(fullFilePath, 'utf-8');
      } catch (err) {
        if (lastAvailableConfigContent) {
          fs.writeFileSync(fullFilePath, lastAvailableConfigContent);
        }
      }
    });

    if (userConfig) {
      updateDataSet('config', userConfig);
    }

    logger.info(`✔ 当前运行的配置文件：${fullFilePath}`);
  }
};
