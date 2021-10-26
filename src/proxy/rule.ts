import * as _ from 'lodash';
import ProxyPattern, { ProxyRule } from '../types/proxy';

export const url2regx = (url: string): RegExp => {
  const newUrl = url
    .replace(/\./g, '\\.')
    .replace(/\//g, '\\/')
    .replace(/\*\*/g, '(\\S+)')
    .replace(/\*/g, '([^\\/]+)');
  return new RegExp(newUrl);
};

export const rulesPattern = (rules: Array<ProxyRule>, url: string): ProxyPattern => {
  const options: ProxyPattern = {
    delay: 0,
    matched: false,
    responseHeaders: {},
  };
  rules.forEach((rule: ProxyRule) => {
    if (options.matched) return;
    if (!rule.regx) return;
    if (_.isString(rule.regx) && rule.regx.includes('*')) {
      rule.regx = url2regx(rule.regx);
    }
    if (_.isRegExp(rule.regx)) {
      options.matched = rule.regx.test(url);
      if (RegExp.$1) {
        if (rule.redirect) {
          rule.redirectTarget = `${rule.redirect}${RegExp.$1}`;
        }
      }
    } else if (_.isString(rule.regx)) {
      options.matched = url.includes(rule.regx);
    } else if (_.isFunction(rule.regx)) {
      options.matched = rule.regx(url);
      if (options.matched && RegExp.$1) options.filepath = RegExp.$1;
    }
    // matched and get this rule
    if (options.matched) {
      options.matchedRule = rule;
    }
  });

  // response rule use local file and disable http request
  if (options.matched) {
    'filepath|path|status|jsonp|response'.split('|').forEach((item) => {
      if (options.disableHttpRequest) return;
      if (options.matchedRule && Object.hasOwnProperty.call(options.matchedRule, item)) {
        options.disableHttpRequest = true;
      }
    });
  }
  // matched rule and add extend headers
  if (options.matched) {
    options.responseHeaders = options.responseHeaders || {};
    if (options.disableHttpRequest) {
      options.responseHeaders['BPROXY-HOSTIP'] = '127.0.0.1';
    }
    if (!options.disableHttpRequest && options?.matchedRule?.host) {
      options.responseHeaders['X-HOSTIP'] = options.matchedRule.host;
    }
    options.responseHeaders['X-BPROXY-MATCH'] = true;
  }
  return options;
}