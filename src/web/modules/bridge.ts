/**
 * 桥接方法
 */
import { bridgeInvoke } from './socket';

// bproxy规则测试
export const ruleTestInvoke = async (url: string) => {
  const rs = await bridgeInvoke({
    api: 'test',
    params: url,
  });
  return rs;
};

// 更新配置文件
export const updateConfigFile = async (
  regx: string,
  file: string,
  content: string
) => {
  const configFilePath = await bridgeInvoke({
    api: 'getConfigFile',
  });
  const rs = await bridgeInvoke({
    api: 'mapFile',
    params: {
      regx,
      file,
      content,
      configFilePath,
    },
  });
  return rs;
};

// 获取配置文件地址
export const getConfigFilePath = async () =>
  await bridgeInvoke({
    api: 'getConfigFile',
  });

// 插入一条页面调试规则
export const insertRemoteInspectRule = async({urlPath, configFilePath}) => {
  return await bridgeInvoke({api: 'mapPage', params: {
    regx: urlPath,
    configFilePath,
  }});
}