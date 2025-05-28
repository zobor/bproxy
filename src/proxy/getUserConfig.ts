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
export const updateConfigPathAndWatch = async ({ configPath }: { configPath: string }): Promise<void> => {
  if (!configPath) {
    logger.error('updateConfigPathAndWatch(configPath), configPath is empty');
    throw new Error('updateConfigPathAndWatch(configPath), configPath is empty');
  }

  if (!fs.existsSync(configPath)) {
    logger.error(`Config path does not exist: ${configPath}`);
    throw new Error(`Config path does not exist: ${configPath}`);
  }

  updateDataSet('currentConfigPath', configPath);
  const fullFilePath = path.resolve(configPath, appConfigFileName);
  let lastAvailableConfigContent: string | undefined;
  let userConfig: BproxyConfig.Config | undefined;

  const loadAndUpdateConfig = async () => {
    try {
      userConfig = await loadUserConfigOrCreate(fullFilePath);
      lastAvailableConfigContent = fs.readFileSync(fullFilePath, 'utf-8');
      updateDataSet('config', userConfig);
      onConfigFileChange();
    } catch (err) {
      logger.error(`Failed to load config: ${(err as Error).message}`);
      if (lastAvailableConfigContent) {
        fs.writeFileSync(fullFilePath, lastAvailableConfigContent);
      }
    }
  };

  // Stop previous watcher if exists
  if (watcher?.close) {
    watcher.close();
  }

  // Initial load
  await loadAndUpdateConfig();

  // Watch for changes
  watcher = fs.watchFile(fullFilePath, { interval: 3000 }, loadAndUpdateConfig);

  logger.info(`✔ 当前运行的配置文件：${fullFilePath}`);
};
