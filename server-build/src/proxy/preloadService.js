"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const lodash_1 = require("lodash");
const file_1 = require("./utils/file");
const dataset_1 = __importDefault(require("./utils/dataset"));
const config_1 = require("./config");
const REG_IP = /^(\d{1,3}\.){3}\d{1,3}$/;
function checkResponseType(target, currentConfigPath) {
    if ((0, lodash_1.isFunction)(target)) {
        return 'response';
    }
    if ((0, lodash_1.isString)(target)) {
        if (/https?:\/\//.test(target)) {
            return 'redirect';
        }
        if (REG_IP.test(target)) {
            return 'host';
        }
        if (target.indexOf('file://') === 0 || target.indexOf('/') === 0) {
            try {
                fs.accessSync(`${target}`, fs.constants.R_OK);
                return 'path';
            }
            catch (err) {
                console.error(`${target} 路径错误`);
            }
        }
        const pathOrFile = (0, file_1.checkStringIsFileOrPath)(target, currentConfigPath);
        if (pathOrFile) {
            return pathOrFile;
        }
        return 'response';
    }
    if ((0, lodash_1.isNumber)(target)) {
        return 'statusCode';
    }
    return undefined;
}
function checkSingleRule(rule) {
    var _a;
    if (rule.url) {
        rule.regx = rule.url;
        delete rule.url;
    }
    const currentConfigPath = ((_a = dataset_1.default.currentConfigPath) === null || _a === void 0 ? void 0 : _a.replace(config_1.appConfigFileName, '')) || __dirname;
    if (rule.target) {
        const ruleKey = checkResponseType(rule.target, currentConfigPath);
        if (!ruleKey) {
            console.error('target参数错误');
        }
        else {
            switch (ruleKey) {
                case 'path':
                case 'file':
                    rule[ruleKey] = path.resolve(currentConfigPath, `${rule.target}`);
                    break;
                default:
                    rule[ruleKey] = rule.target;
                    break;
            }
            delete rule['target'];
        }
    }
    if (rule.cors === true) {
        rule.responseHeaders = Object.assign(Object.assign({}, (rule.responseHeaders || {})), {
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Accept,X-Requested-With',
        });
        delete rule.cors;
    }
    return rule;
}
function preload(params) {
    params.rules = params.rules.map((rule) => checkSingleRule(rule));
    if (params.sslAll === true) {
        params.https = true;
        delete params.sslAll;
    }
    return params;
}
exports.default = preload;
