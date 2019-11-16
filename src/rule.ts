import IPattern from '../types/pattern';
import IRule from '../types/rule';

export const rulesPattern = (rules: Array<IRule>, url: string): IPattern => {
  const options:IPattern = {
    delay: 0,
    matched: false,
    responseHeaders: {},
  };
  rules.forEach((rule: IRule) => {
    if (options.matched) return;
    if (!rule.regx) return;
    if (typeof rule.regx === 'object' && rule.regx.constructor === RegExp) {
      options.matched = rule.regx.test(url);
      if (RegExp.$1) {
        options.filepath = RegExp.$1;
      }
    } else if (typeof rule.regx === 'string') {
      options.matched = url.indexOf(rule.regx) > -1;
    } else if (typeof rule.regx === 'function') {
      options.matched = rule.regx(url);
      if (options.matched && RegExp.$1) {
        options.filepath = RegExp.$1;
      }
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
      options.responseHeaders['bproxy-hostip'] = '127.0.0.1';
    }
    if (!options.disableHttpRequest && options.matchedRule && options.matchedRule.host) {
      options.responseHeaders['x-hostip'] = options.matchedRule.host;
    }
    options.responseHeaders['x-bproxy-match'] = 1;
  }
  return options;
}