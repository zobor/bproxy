import fs from 'fs';
import path from 'path';
import * as mkdirp from 'mkdirp';
import { matcher } from './matcher';
import dataset from './utils/dataset';
import { getLocalIpAddress } from './utils/ip';
export * from './system';

export const test = async (url: string) => {
  const { config } = dataset;
  if (config) {
    const matchResult = matcher(config.rules, url);

    for (const key in matchResult) {
      if (key === 'rule') {
        for (const k in matchResult.rule) {
          if (k === 'regx' && matchResult && matchResult.rule && matchResult.rule[k]) {
            matchResult.rule[k] = matchResult.rule[k].toString();
          }
        }
      }
    }

    return matchResult;
  }

  return {};
}

export const getLocalIp = async() => {
  return getLocalIpAddress();
};

export const getLocalProxyPort = async() => {
  const { config } = dataset;

  return config?.port;
}

export const getConfigFile = () => {
  const { configPath } = dataset;

  return configPath;
};

export const mapFile = (params: {
  regx: string;
  file: string;
  configFilePath: string;
  content: string;
}) => {
  const { regx, file, configFilePath, content } = params;
  const mockFilePath = `./mock/${file}`;
  const rule = `
config.rules.push({
  regx: '${regx}',
  file: '${mockFilePath}'
});
  `;
  let success = true;
  try {
    mkdirp.sync('./mock');
    fs.writeFileSync(mockFilePath, content);
    const configText = fs.readFileSync(path.resolve(configFilePath), 'utf-8');
    const newConfig = configText.replace('module.exports', `\n${rule}\nmodule.exports`);
    fs.writeFileSync(path.resolve(configFilePath), newConfig);
  } catch(err) {
    success = false;
  }

  return success;
};
