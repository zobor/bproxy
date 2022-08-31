import * as fs from 'fs';
import * as path from 'path';
import { isFunction, isNumber, isString, omit } from 'lodash';
import { checkStringIsFileOrPath } from './utils/file';
import dataset from './utils/dataset';
import { appConfigFileName } from './config';

const REG_IP = /^(\d{1,3}\.){3}\d{1,3}$/;

function checkResponseType(target: any, currentConfigPath: string) {
  // 响应函数
  if (isFunction(target)) {
    return 'response';
  }
  // 响应字符串
  if (isString(target)) {
    // 响应的是URL
    if (/https?:\/\//.test(target)) {
      return 'redirect';
    }
    // 响应IP
    if (REG_IP.test(target)) {
      return 'host';
    }
    // 响应的是文件或者目录
    if (target.indexOf('file://') === 0 || target.indexOf('/') === 0) {
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

  const currentConfigPath =
    dataset.currentConfigPath?.replace(appConfigFileName, '') || __dirname;

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
        'Access-Control-Allow-Headers':
          'Content-Type,Accept,X-Requested-With',
      },
    };

    delete rule.cors;
  }
  return rule;
}

export default function preload(params: BproxyConfig.Config): BproxyConfig.Config {
  // 遍历所有的规则
  params.rules = params.rules.map((rule: BproxyConfig.Rule) =>
    checkSingleRule(rule)
  );

  // 兼容老版本
  if (params.sslAll === true) {
    params.https = true;
    delete params.sslAll;
  }

  return params;
}
