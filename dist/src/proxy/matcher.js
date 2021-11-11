"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.matcher = void 0;
const _ = __importStar(require("lodash"));
const utils_1 = require("./utils/utils");
const matcher = (rules, url) => {
    var _a, _b;
    const options = {
        delay: 0,
        matched: false,
        responseHeaders: {},
    };
    rules.forEach((rule) => {
        if (options.matched)
            return;
        if (!rule.regx) {
            return;
        }
        if (_.isString(rule.regx) && rule.regx.includes('*')) {
            rule.regx = (0, utils_1.url2regx)(rule.regx);
        }
        if (_.isRegExp(rule.regx)) {
            options.matched = rule.regx.test(url);
            if (RegExp.$1 && rule.redirect) {
                rule.redirectTarget = `${rule.redirect}${rule.rewrite ? rule.rewrite(RegExp.$1) : RegExp.$1}`;
            }
        }
        else if (_.isString(rule.regx)) {
            options.matched = url.includes(rule.regx);
        }
        else if (_.isFunction(rule.regx)) {
            options.matched = rule.regx(url);
            if (options.matched && RegExp.$1) {
                options.filepath = rule.rewrite ? rule.rewrite(RegExp.$1) : RegExp.$1;
            }
        }
        if (options.matched) {
            options.rule = rule;
        }
    });
    if (options.matched) {
        options.responseHeaders['x-bproxy-matched'] = true;
        if ((_a = options === null || options === void 0 ? void 0 : options.rule) === null || _a === void 0 ? void 0 : _a.host) {
            options.responseHeaders['x-bproxy-hostip'] = options.rule.host;
        }
        if ((_b = options === null || options === void 0 ? void 0 : options.rule) === null || _b === void 0 ? void 0 : _b.redirectTarget) {
            options.responseHeaders['x-bproxy-redirect'] = options.rule.redirectTarget;
        }
    }
    return options;
};
exports.matcher = matcher;
