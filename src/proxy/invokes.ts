import LocalServer from './localServer';
import { rulesPattern } from './rule';
import settings from './settings';

export const test = (url: string) => {
  const { configPath } = settings;
  const { config = {} as any } = LocalServer.loadUserConfig(configPath, settings);
  const matchResult = rulesPattern(config.rules, url);
  console.log('匹配完成',Date.now(),  matchResult);

  return matchResult;
}
