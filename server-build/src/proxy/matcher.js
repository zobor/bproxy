"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matcher = void 0;
const lodash_1 = require("lodash");
const config_1 = require("./config");
const utils_1 = require("./utils/utils");
function matcher(rules, url) {
    const options = {
        delay: 0,
        matched: false,
        responseHeaders: {},
    };
    (0, lodash_1.cloneDeep)(rules).forEach((rule) => {
        if (options.matched)
            return;
        if (!rule.regx) {
            return;
        }
        if ((0, lodash_1.isString)(rule.regx) && (0, utils_1.isNeedTransformString2RegExp)(rule.regx)) {
            rule.regx = (0, utils_1.url2regx)(rule.regx);
        }
        if ((0, lodash_1.isRegExp)(rule.regx)) {
            options.matched = rule.regx.test(url);
            if (RegExp.$1) {
                if (rule.redirect) {
                    rule.redirectTarget = `${rule.redirect}${rule.rewrite ? rule.rewrite(RegExp.$1) : RegExp.$1}`;
                }
                else if (rule.path) {
                    rule.filepath = `${rule.rewrite ? rule.rewrite(RegExp.$1) : RegExp.$1}`;
                }
            }
        }
        else if ((0, lodash_1.isString)(rule.regx)) {
            options.matched = url.includes(rule.regx);
        }
        else if ((0, lodash_1.isFunction)(rule.regx)) {
            options.matched = rule.regx(url);
            if (options.matched && RegExp.$1) {
                if (rule.redirect) {
                    rule.redirectTarget = `${rule.redirect}${rule.rewrite ? rule.rewrite(RegExp.$1) : RegExp.$1}`;
                }
                else if (rule.path) {
                    rule.filepath = `${rule.rewrite ? rule.rewrite(RegExp.$1) : RegExp.$1}`;
                }
            }
        }
        if (options.matched) {
            options.rule = (0, lodash_1.cloneDeep)(rule);
        }
    });
    if (options.matched && options.responseHeaders) {
        options.responseHeaders[`${config_1.bproxyPrefixHeader}-matched`] = true;
    }
    return options.matched ? options : { matched: false };
}
exports.matcher = matcher;
