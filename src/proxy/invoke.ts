import LocalServer from './localServer';
import { matcher } from './matcher';
import settings from './config';
import dataset from './utils/dataset';

export const test = (url: string) => {
  const { configPath } = dataset;
  const { config = {} as any } = LocalServer.loadUserConfig(configPath || '', settings);
  const matchResult = matcher(config.rules, url);
  console.log('匹配完成',Date.now(),  matchResult);

  return matchResult;
}
