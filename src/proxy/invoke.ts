import LocalServer from './localServer';
import { matcher } from './matcher';
import settings from './config';
import dataset from './utils/dataset';
import { getLocalIpAddress } from './utils/ip';
export * from './system';

export const test = async (url: string) => {
  const { configPath } = dataset;
  const { config = {} as any } = await LocalServer.loadUserConfig(configPath || '', settings);
  const matchResult = matcher(config.rules, url);

  return matchResult;
}

export const getLocalIp = async() => {
  return getLocalIpAddress();
};

export const getLocalProxyPort = async() => {
  const { config } = dataset;

  return config?.port;
}
