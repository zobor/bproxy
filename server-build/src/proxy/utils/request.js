"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUpgrade = exports.getDalay = exports.getPostBody = void 0;
const request_1 = __importDefault(require("request"));
const package_json_1 = require(".././../../package.json");
const version_1 = require("./version");
const getPostBody = (req) => {
    return new Promise((resolve) => {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        req.on('end', () => {
            resolve(Buffer.concat(body));
        });
    });
};
exports.getPostBody = getPostBody;
const getDalay = (rule, config) => {
    return (rule === null || rule === void 0 ? void 0 : rule.delay) || (config === null || config === void 0 ? void 0 : config.delay) || 0;
};
exports.getDalay = getDalay;
const checkUpgrade = () => {
    return new Promise((resolve) => {
        request_1.default.get('http://www.bproxy.cn/version.json', (err, response, body) => {
            if (body) {
                try {
                    const versionData = JSON.parse(body);
                    if ((0, version_1.checkVersion)(package_json_1.version, versionData.version) < 0) {
                        resolve(versionData);
                    }
                    else {
                        resolve(null);
                    }
                }
                catch (err) { }
            }
        });
    });
};
exports.checkUpgrade = checkUpgrade;
