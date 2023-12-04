/**
 * 桥接方法
 */
import { resolve } from 'dns';
import bp from './bp';
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
export const updateConfigFile = async (regx: string, file: string, content: string) => {
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
export const insertRemoteInspectRule = async ({ urlPath, configFilePath }) => {
  return await bridgeInvoke({
    api: 'mapPage',
    params: {
      regx: urlPath,
      configFilePath,
    },
  });
};

// 获取配置文件内容
export const getConfigContent = () =>
  bridgeInvoke({
    api: 'getConfigFileContent',
  });
// 设置配置文件内容
export const setConfigContent = (content: string) =>
  bridgeInvoke({
    api: 'setConfigFileContent',
    params: {
      data: content,
    },
  });

export const updateConfigFilePath = (filepath: string) => {
  return bridgeInvoke({
    api: 'setConfigFilePath',
    params: {
      filepath,
    },
  });
};

// 获取配置端口
export const getProxyPort = () =>
  bridgeInvoke({
    api: 'getLocalProxyPort',
  });

// 获取本机局域网IP
export const getLocalIP = () =>
  bridgeInvoke({
    api: 'getLocalIp',
  });

// 获取系统名称
export const getOsName = () =>
  bridgeInvoke({
    api: 'getOsName',
  });

export const selectConfig = () => {
  return bridgeInvoke({
    api: 'selectFilePath',
  });
};
// 获取调试目标页面
export const getDebugTargets = () => bridgeInvoke({ api: 'getDebugTargets' });

// 获取bproxy版本号
export const getVersion = () => bridgeInvoke({ api: 'getVersion' });

// 检查系统代理桥接
export const checkSystemProxy = (host, port) => bridgeInvoke({ api: 'checkSystemProxy', params: { host, port } });

// 检查系统代理
export const checkProxy = async () => {
  const port = await getProxyPort();
  return await checkSystemProxy('127.0.0.1', port);
};

// 配置系统代理桥接
export const configSystemProxy = (host, port) => bridgeInvoke({ api: 'configSystemProxy', params: { host, port } });

// 关闭系统代理
export const disActiveProxy = () => bridgeInvoke({ api: 'setSystemProxyOff' });

// 打开系统代理
export const activeProxy = async () => {
  const port = await getProxyPort();
  return configSystemProxy('127.0.0.1', port);
};

export const installCertificate = () => {
  return bridgeInvoke({ api: 'autoInstallCertificate' });
};

// 查看日志
export const showBproxyLog = () => {
  return bridgeInvoke({ api: 'openLogFile' });
};

// 打开首页
export const openHomePage = () => {
  return bridgeInvoke({ api: 'openWebPage' });
};

// 获取当前运行平台环境
let runtimePlatform: any = '';
export const getRuntimePlatform = () => {
  return new Promise((resolve) => {
    if (runtimePlatform) {
      resolve(runtimePlatform);
    }
    bridgeInvoke({ api: 'getRuntimePlatform' }).then((rs) => {
      runtimePlatform = rs;
      resolve(rs);
    });
  });
};

// 查看日志内容
export const getLogContent = () => {
  return bridgeInvoke({ api: 'getLogContent' });
};

export const clearLogConent = () => {
  return bridgeInvoke({ api: 'clearLogConent' });
};

export const showConfigOnTerminal = () => {
  return bridgeInvoke({ api: 'showConfigOnTerminal' });
};

bp.getRuntimePlatform = getRuntimePlatform;

export const closeApp = () => {
  return bridgeInvoke({ api: 'shutdown' });
};
