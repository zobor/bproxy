import * as _ from 'lodash';
import MatcherResult, { ProxyRule } from '../types/proxy';
import { url2regx } from './utils/utils';

export const matcher = (rules: ProxyRule[], url: string): MatcherResult => {
  const options: MatcherResult = {
    delay: 0,
    matched: false,
  };
  rules.forEach((rule: ProxyRule) => {
    if (options.matched) return;
    if (!rule.regx) {
      return;
    }
    // string with *
    if (_.isString(rule.regx) && rule.regx.includes('*')) {
      rule.regx = url2regx(rule.regx);
    }
    // RegExp
    if (_.isRegExp(rule.regx)) {
      options.matched = rule.regx.test(url);
      if (RegExp.$1 && rule.redirect) {
        rule.redirectTarget = `${rule.redirect}${rule.rewrite ? rule.rewrite(RegExp.$1) : RegExp.$1}`;
      }
    } else if (_.isString(rule.regx)) {
      // string
      options.matched = url.includes(rule.regx);
    } else if (_.isFunction(rule.regx)) {
      // function method return matcher result
      options.matched = rule.regx(url);
      if (options.matched && RegExp.$1) {
        options.filepath = rule.rewrite ? rule.rewrite(RegExp.$1) : RegExp.$1;
      }
    }
    // matched and get this rule
    if (options.matched) {
      options.rule = rule;
    }
  });

  // matched rule and add extend headers
  // if (options.matched) {
  //   options.responseHeaders = options.responseHeaders || {};
  //   if (options.disableHttpRequest) {
  //     options.responseHeaders['x-bproxy-host'] = '127.0.0.1';
  //   }
  //   if (!options.disableHttpRequest && options?.rule?.host) {
  //     options.responseHeaders['x-bproxy-hostip'] = options.rule.host;
  //   }
  //   options.responseHeaders['x-bproxy-match'] = true;
  // }
  return options;
}
