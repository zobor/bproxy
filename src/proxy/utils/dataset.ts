import path from 'path';
import logger from '../logger';

// 临时数据结构
const dataset: Bproxy.DataSet = {
  platform: 'bash',
  prevConfigPath: '',
  currentConfigPath: '',
  ready: false,
} as Bproxy.DataSet;

const getDefaultRulesList = (port: number) => [
  // {
  //   regx: 'https://bproxy.dev/socket.io.min.js',
  //   file: `${path.resolve(__dirname, '../../web/libs/socket.io.min.js')}`,
  // },
  {
    regx: 'https://bproxy.dev/inspect.js',
    file: `${path.resolve(__dirname, '../../utils/inspect.umd.js')}`,
  },
  {
    regx: /https?:\/\/bproxy\.io/,
    redirect: `https://localhost:${port || 8888}`,
    responseHeaders: {
      'access-control-allow-origin': '*',
      'access-control-allow-credentials': 'true',
      'access-control-allow-headers': '*',
    },
  },
];

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
      config.https = dataset.config.https.concat([
        'bproxy.dev:443',
        'bproxy.io:443',
      ]);
    }
    config.rules = [...getDefaultRulesList(config.port), ...(config.rules || [])];

    dataset.config = config;
  }
};

export default dataset;
