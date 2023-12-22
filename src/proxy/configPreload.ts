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

async function yapiPreload(params) {
  if (!isEmpty(params)) {
    logger.info('yapiPreload params', params);
  }
  for (const yapi of params?.yapi || []) {
    try {
      const host = params?.yapiHost ? params.yapiHost : 'http://yapi.dz11.com'
      const listURL = `${host}/api/interface/list?page=1&limit=100&project_id=${yapi.id}&token=${yapi.token}`;
      logger.info('yapi list api url:', listURL);
      const rs = (await fetch(listURL)) as string;
      const json = JSON.parse(rs);
      const urlList = (json?.data?.list || []).filter((item) => item.status === 'done');
      urlList.forEach((item: any) => {
        logger.info(`yapi project: ${yapi.id} item`, item);
        if (!item.path) return;
        params.rules.push({
          url: item.path,
          yapi: yapi.id,
        });
      });
    } catch (err) {}
  }
}

export default async function preload(params: BproxyConfig.Config): Promise<BproxyConfig.Config> {
  await yapiPreload(params);
  // 遍历所有的规则
  params.rules = params.rules.map((rule: BproxyConfig.Rule) => checkSingleRule(rule));

  // 兼容老版本
  if (params.sslAll === true) {
    params.https = true;
    delete params.sslAll;
  }

  if (Array.isArray(params.https)) {
    params.rules.forEach((rule) => {
      const { regx } = rule;
      if (isString(regx) && regx.startsWith('https://')) {
        const { port, hostname } = url.parse(regx);
        const httpsScheme = `${hostname}:${port || 443}`;
        (params.https as any).push(httpsScheme);
      }
    });
    params.https = uniq(params.https).map(host => {
      if (!/:\d+$/.test(host)) {
        return `${host}:443`;
      }
      return host;
    });
  }

  return params;
}
