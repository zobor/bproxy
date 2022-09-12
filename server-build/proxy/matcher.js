/*
 * @Date: 2022-07-10 21:36:48
 * @LastEditors: 张恒 nodejs.js@gmail.com
 * @LastEditTime: 2022-08-14 22:19:56
 * @FilePath: /bp/src/proxy/matcher.ts
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "matcher", {
    enumerable: true,
    get: ()=>matcher
});
const _lodash = require("lodash");
const _config = require("./config");
const _utils = require("./utils/utils");
function matcher(rules, url) {
    const options = {
        delay: 0,
        matched: false,
        responseHeaders: {}
    };
    (0, _lodash.cloneDeep)(rules).forEach((rule)=>{
        if (options.matched) return;
        if (!rule.regx) {
            return;
        }
        // string with *、.、()、*、$
        if ((0, _lodash.isString)(rule.regx) && (0, _utils.isNeedTransformString2RegExp)(rule.regx)) {
            rule.regx = (0, _utils.url2regx)(rule.regx);
        }
        // RegExp
        if ((0, _lodash.isRegExp)(rule.regx)) {
            options.matched = rule.regx.test(url);
            if (RegExp.$1) {
                if (rule.redirect) {
                    rule.redirectTarget = `${rule.redirect}${rule.rewrite ? rule.rewrite(RegExp.$1) : RegExp.$1}`;
                } else if (rule.path) {
                    rule.filepath = `${rule.rewrite ? rule.rewrite(RegExp.$1) : RegExp.$1}`;
                }
            }
        } else if ((0, _lodash.isString)(rule.regx)) {
            // string
            options.matched = url.includes(rule.regx);
        } else if ((0, _lodash.isFunction)(rule.regx)) {
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
            options.rule = (0, _lodash.cloneDeep)(rule);
        }
    });
    // matched rule and add extend headers
    if (options.matched && options.responseHeaders) {
        options.responseHeaders[`${_config.bproxyPrefixHeader}-matched`] = true;
    }
    return options.matched ? options : {
        matched: false
    };
}
