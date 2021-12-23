import { bridgeInvoke } from './socket';

export const ruleTestInvoke = async (url: string) => {
  const rs = await bridgeInvoke({
    api: 'test',
    params: url,
  });
  return rs;
};