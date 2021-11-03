import LocalServer from './localServer';
import { matcher } from './matcher';
import settings from './config';
import dataset from './utils/dataset';
import { getLocalIpAddress } from './utils/ip';

export const test = (url: string) => {
  const { configPath } = dataset;
  const { config = {} as any } = LocalServer.loadUserConfig(configPath || '', settings);
  const matchResult = matcher(config.rules, url);
  console.log('匹配完成',Date.now(),  matchResult);

  return matchResult;
}

export const getLocalIp = () => {
  return getLocalIpAddress();
};
