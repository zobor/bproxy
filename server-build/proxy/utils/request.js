/*
 * @Date: 2022-08-11 22:43:08
 * @LastEditors: 张恒 nodejs.js@gmail.com
 * @LastEditTime: 2022-08-13 19:00:38
 * @FilePath: /bp/src/proxy/utils/request.ts
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getPostBody: ()=>getPostBody,
    getDalay: ()=>getDalay,
    checkUpgrade: ()=>checkUpgrade
});
const _request = /*#__PURE__*/ _interopRequireDefault(require("request"));
const _packageJson = require(".././../../package.json");
const _version = require("./version");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const getPostBody = (req)=>{
    return new Promise((resolve)=>{
        const body = [];
        req.on('data', (chunk)=>{
            body.push(chunk);
        });
        req.on('end', ()=>{
            resolve(Buffer.concat(body));
        });
    });
};
const getDalay = (rule, config)=>{
    return (rule === null || rule === void 0 ? void 0 : rule.delay) || (config === null || config === void 0 ? void 0 : config.delay) || 0;
};
const checkUpgrade = ()=>{
    return new Promise((resolve)=>{
        _request.default.get('http://www.bproxy.cn/version.json', (err, response, body)=>{
            if (body) {
                try {
                    const versionData = JSON.parse(body);
                    if ((0, _version.checkVersion)(_packageJson.version, versionData.version) < 0) {
                        resolve(versionData);
                    } else {
                        resolve(null);
                    }
                } catch (err1) {}
            }
        });
    });
};
