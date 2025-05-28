import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
import request from 'request';
import { isEmpty, isFunction, isNumber, isString, uniq } from 'lodash';
import { checkStringIsFileOrPath } from './utils/file';
import dataset from './dataset';
import { appConfigFileName } from './config';
import logger from './logger';

const REG_IP = /^(\d{1,3}\.){3}\d{1,3}$/;

function checkResponseType(target: any, currentConfigPath: string) {
  // 响应函数
  if (isFunction(target)) {
    return 'response';
  }
  // 响应字符串
  if (isString(target)) {
    // 响应的是URL
    if (/^(https?|wss?):\/\//.test(target)) {
      return 'redirect';
    }
    // 响应IP
    if (REG_IP.test(target)) {
      return 'host';
    }
    // 响应的是文件或者目录
    if (target.startsWith('file://') || target.startsWith('/')) {
      try {
        fs.accessSync(`${target}`, fs.constants.R_OK);
        return 'path';
      } catch (err) {
        console.error(`${target} 路径错误`);
      }
    }

    const pathOrFile = checkStringIsFileOrPath(target, currentConfigPath);

    if (pathOrFile) {
      return pathOrFile;
    }

    return 'response';
  }

  // 响应的是数字
  if (isNumber(target)) {
    return 'statusCode';
  }

  return undefined;
}

function checkSingleRule(rule: BproxyConfig.Rule): BproxyConfig.Rule {
  // 废弃regx参数，使用新参数 url
  if (rule.url) {
    rule.regx = rule.url;
    delete rule.url;
  }

  const currentConfigPath = dataset.currentConfigPath?.replace(appConfigFileName, '') || __dirname;

  if (rule.target) {
    const ruleKey = checkResponseType(rule.target, currentConfigPath);

    if (!ruleKey) {
      console.error('target参数错误');
    } else {
      switch (ruleKey) {
        case 'path':
        case 'file':
          rule[ruleKey] = path.resolve(currentConfigPath, `${rule.target}`);
          break;
        default:
          rule[ruleKey] = rule.target;
          break;
      }

      delete rule['target'];
    }
  }
  if (rule.cors === true) {
    rule.responseHeaders = {
      ...(rule.responseHeaders || {}),
      ...{
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,Accept,X-Requested-With',
      },
    };

    delete rule.cors;
  }
  return rule;
}

function fetch(url) {
  return new Promise((resolve) => {
    request.get(url, (err, response, body) => {
      resolve(body);
    });
  });
}

export default async function preload(params: BproxyConfig.Config): Promise<BproxyConfig.Config> {
  // 规则预处理
  params.rules = params.rules.map(checkSingleRule);

  // 兼容老版本 https 配置
  if (params.sslAll === true) {
    params.https = true;
    delete params.sslAll;
  }

  if (Array.isArray(params.https)) {
    const httpsHosts = params.rules
      .map(rule => {
        const regx = rule.regx;
        if (isString(regx) && regx.startsWith('https://')) {
          const { port, hostname } = url.parse(regx);
          if (hostname) {
            return `${hostname}:${port || 443}`;
          }
        }
        return null;
      })
      .filter(Boolean) as string[];

    params.https = uniq([...params.https, ...httpsHosts]).map(host =>
      /:\d+$/.test(host) ? host : `${host}:443`
    );
  }

  return params;
}
