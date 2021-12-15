import * as _ from 'lodash';
import path from 'path';
import MatcherResult, { ProxyRule } from '../types/proxy';
import { url2regx } from './utils/utils';

export const matcher = (rules: ProxyRule[], url: string): MatcherResult => {
  const options: MatcherResult = {
    delay: 0,
    matched: false,
    responseHeaders:  {},
  };
  rules.concat([
    {
      regx: 'https://bproxy.dev/socket.io.min.js',
      file: `${path.resolve(__dirname, '../web/libs/socket.io.min.js')}`,
    },
  ]).forEach((rule: ProxyRule) => {
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
      if (RegExp.$1 ) {
        if (rule.redirect) {
          rule.redirectTarget = `${rule.redirect}${rule.rewrite ? rule.rewrite(RegExp.$1) : RegExp.$1}`;
        } else if (rule.path) {
          rule.filepath = `${rule.rewrite ? rule.rewrite(RegExp.$1) : RegExp.$1}`;
        }
      }
    } else if (_.isString(rule.regx)) {
      // string
      options.matched = url.includes(rule.regx);
    } else if (_.isFunction(rule.regx)) {
      // function method return matcher result
      options.matched = rule.regx(url);
      if (options.matched && RegExp.$1) {
        if (rule.redirect) {
          rule.redirectTarget = `${rule.redirect}${rule.rewrite ? rule.rewrite(RegExp.$1) : RegExp.$1}`;
        } else if (rule.path) {
          rule.filepath = `${rule.rewrite ? rule.rewrite(RegExp.$1) : RegExp.$1}`;
        }
      }
    }
    // matched and get this rule
    if (options.matched) {
      options.rule = _.cloneDeep(rule);
    }
  });

  // matched rule and add extend headers
  if (options.matched) {
    options.responseHeaders['x-bproxy-matched'] = true;
    if (options?.rule?.host) {
      options.responseHeaders['x-bproxy-hostip'] = options.rule.host;
    }
    if (options?.rule?.redirectTarget) {
      options.responseHeaders['x-bproxy-redirect'] = options.rule.redirectTarget;
    }
  }
  return options;
}
