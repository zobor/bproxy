"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rulesPattern = exports.url2regx = void 0;
const _ = require("lodash");
exports.url2regx = (url) => {
    const newUrl = url
        .replace(/\./g, '\\.')
        .replace(/\//g, '\\/')
        .replace(/\*/g, '([^/]+)$');
    return new RegExp(newUrl);
};
exports.rulesPattern = (rules, url) => {
    const options = {
        delay: 0,
        matched: false,
        responseHeaders: {},
    };
    rules.forEach((rule) => {
        if (options.matched)
            return;
        if (!rule.regx)
            return;
        if (_.isString(rule.regx) && rule.regx.indexOf('*') > -1) {
            rule.regx = exports.url2regx(rule.regx);
        }
        if (_.isRegExp(rule.regx)) {
            options.matched = rule.regx.test(url);
            if (RegExp.$1)
                options.filepath = RegExp.$1;
        }
        else if (_.isString(rule.regx)) {
            options.matched = url.indexOf(rule.regx) > -1;
        }
        else if (_.isFunction(rule.regx)) {
            options.matched = rule.regx(url);
            if (options.matched && RegExp.$1)
                options.filepath = RegExp.$1;
        }
        if (options.matched) {
            options.matchedRule = rule;
        }
    });
    if (options.matched) {
        'filepath|path|status|jsonp|response'.split('|').forEach((item) => {
            if (options.disableHttpRequest)
                return;
            if (options.matchedRule && Object.hasOwnProperty.call(options.matchedRule, item)) {
                options.disableHttpRequest = true;
            }
        });
    }
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
};
