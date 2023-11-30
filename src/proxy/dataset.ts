import { getDefaultRulesList } from './bproxyRules';
import logger from './logger';

// 临时数据结构
const dataset: Bproxy.DataSet = {
  platform: 'bash',
  prevConfigPath: '',
  currentConfigPath: '',
  ready: false,
} as Bproxy.DataSet;

// 更新临时数据
export const updateDataSet = (key: keyof Bproxy.DataSet, value: any) => {
  if (dataset.ready) {
    logger.info(`{updateDataSet}{${key}}:`, value);
  }
  dataset[key] = value as never;

  if (key === 'config') {
    const config: any = dataset.config;
    // 内置的 https cdn
    if (Array.isArray(dataset?.config?.https)) {
      config.https = dataset.config.https.concat(['bproxy.dev:443']);
    }

    // 整合
    config.rules = [...getDefaultRulesList(), ...(config.rules || [])];

    dataset.config = config;
  }
};

export default dataset;

export const isApp = () => dataset.platform === 'app';

export const isBash = () => dataset.platform === 'bash';
