/*
 * @Date: 2022-07-10 21:36:48
 * @LastEditors: 张恒 nodejs.js@gmail.com
 * @LastEditTime: 2022-08-14 22:19:56
 * @FilePath: /bp/src/proxy/matcher.ts
 */
import { cloneDeep, isFunction, isRegExp, isString } from 'lodash';
import { bproxyPrefixHeader } from './config';
import { isNeedTransformString2RegExp, url2regx } from './utils/utils';

export function matcher(rules: BproxyConfig.Rule[], url: string): BproxyConfig.MatcherResult {
  const options: BproxyConfig.MatcherResult = {
    delay: 0,
    matched: false,
    responseHeaders: {},
  };
  cloneDeep(rules).forEach((rule: BproxyConfig.Rule) => {
    if (options.matched) return;
    if (!rule.regx) {
      return;
    }
    // string with *、.、()、*、$
    if (isString(rule.regx) && isNeedTransformString2RegExp(rule.regx)) {
      rule.regx = url2regx(rule.regx);
    }
    // RegExp
    if (isRegExp(rule.regx)) {
      options.matched = rule.regx.test(url);
      if (RegExp.$1) {
        if (rule.redirect) {
          rule.redirectTarget = `${rule.redirect}${
            rule.rewrite ? rule.rewrite(RegExp.$1) : RegExp.$1
          }`;
        } else if (rule.path) {
          rule.filepath = `${
            rule.rewrite ? rule.rewrite(RegExp.$1) : RegExp.$1
          }`;
        }
      }
    } else if (isString(rule.regx)) {
      // string
      options.matched = url.includes(rule.regx);
    } else if (isFunction(rule.regx)) {
      // function method return matcher result
      options.matched = rule.regx(url);
      if (options.matched && RegExp.$1) {
        if (rule.redirect) {
          rule.redirectTarget = `${rule.redirect}${
            rule.rewrite ? rule.rewrite(RegExp.$1) : RegExp.$1
          }`;
        } else if (rule.path) {
          rule.filepath = `${
            rule.rewrite ? rule.rewrite(RegExp.$1) : RegExp.$1
          }`;
        }
      }
    }
    // matched and get this rule
    if (options.matched) {
      options.rule = cloneDeep(rule);
    }
  });

  // matched rule and add extend headers
  if (options.matched && options.responseHeaders) {
    options.responseHeaders[`${bproxyPrefixHeader}-matched`] = true;
  }
  return options.matched ? options : { matched: false };
}
