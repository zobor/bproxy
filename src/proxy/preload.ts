import * as fs from 'fs';
import _ from "lodash";

const REG_IP = /^(\d{1,3}\.){3}\d{1,3}$/;

function checkResponseType(target: any) {
  // 响应函数
  if (_.isFunction(target)) {
    return 'response';
  }
  // 响应字符串
  if (_.isString(target)) {
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
        fs.accessSync(`${target}`, fs.constants.R_OK)
        return 'path';
      } catch(err) {
        console.error(`${target} 路径错误`);
      }
    }

    return 'response';
  }

  // 响应的是数字
  if (_.isNumber(target)) {
    return 'statusCode';
  }

  return undefined;
}


function checkSingleRule(rule: any) {
  // 废弃regx参数，使用新参数 url
  if (rule.url) {
    rule.regx = rule.url;
    delete rule.url;
  }
  if (rule.target) {
    const ruleKey = checkResponseType(rule.target);
    if (!ruleKey) {
      console.error('target参数错误');
    } else {
      rule[ruleKey] = rule.target;
      delete rule.target;
    }
  }
  if (rule.cors === true) {
    rule.responseHeaders = {...(rule.responseHeader || {}), ...{
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Accept,X-Requested-With',
    }};

    delete rule.cors;
  }
  return {
    ...rule,
  };
}

export default function preload(params: any) {
  params.rules = params.rules.map(rule => checkSingleRule(rule)) as any;

  // 兼容老版本
  if (params.sslAll === true) {
    params.https = true;
    delete params.sslAll;
  }

  return params;
}
