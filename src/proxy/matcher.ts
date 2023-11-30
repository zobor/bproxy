import { cloneDeep, isFunction, isRegExp, isString } from 'lodash';
import * as URL from 'url';
import { bproxyPrefixHeader } from './config';
import { isNeedTransformString2RegExp, url2regx, getRegxLastMatchGroup } from '../utils/utils';

export function matcher(rules: BproxyConfig.Rule[], url: string): BproxyConfig.MatcherResult {
  const options: BproxyConfig.MatcherResult = {
    delay: 0,
    matched: false,
    responseHeaders: {},
  };
  if (URL.parse(url)?.query?.includes('bproxy=1')) {
    options.matched = true;
    options.rule = {
      regx: url,
      debug: true,
    };
  }
  if (URL.parse(url)?.query?.includes('bproxy=2')) {
    options.matched = true;
    options.rule = {
      regx: url,
      debug: 'vconsole',
    };
  }
  cloneDeep(rules).forEach((rule: BproxyConfig.Rule) => {
    if (options.matched) return;
    if (!rule.regx) {
      return;
    }
    const getRegExp$N = rule.getRegExp$N || getRegxLastMatchGroup;
    // string with *、.、()、*、$
    if (isString(rule.regx) && isNeedTransformString2RegExp(rule.regx)) {
      rule.regx = url2regx(rule.regx);
    }
    // RegExp
    if (isRegExp(rule.regx)) {
      options.matched = rule.regx.test(url);
      const matchedPath = getRegExp$N();
      if (matchedPath) {
        if (rule.redirect) {
          rule.redirectTarget = `${rule.redirect}${rule.rewrite ? rule.rewrite(matchedPath) : matchedPath}`;
        } else if (rule.path) {
          rule.filepath = `${rule.rewrite ? rule.rewrite(matchedPath) : matchedPath}`;
        }
      }
    } else if (isString(rule.regx)) {
      // string
      options.matched = url.includes(rule.regx);
    } else if (isFunction(rule.regx)) {
      // function method return matcher result
      options.matched = rule.regx(url);
      const matchedPath = getRegExp$N();
      if (options.matched && matchedPath) {
        if (rule.redirect) {
          rule.redirectTarget = `${rule.redirect}${rule.rewrite ? rule.rewrite(matchedPath) : matchedPath}`;
        } else if (rule.path) {
          rule.filepath = `${rule.rewrite ? rule.rewrite(matchedPath) : matchedPath}`;
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
