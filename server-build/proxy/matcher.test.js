"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _lodash = require("lodash");
const _matcher = require("./matcher");
const _preloadService = /*#__PURE__*/ _interopRequireDefault(require("./preloadService"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
describe('matcher', ()=>{
    it('matcher without regx', ()=>{
        const rs = (0, _matcher.matcher)((0, _preloadService.default)({
            rules: [
                {}
            ]
        }).rules, 'https://v.qq.com/google');
        expect(rs.matched).toBeFalsy();
    });
    // string
    it('matcher normal string url', ()=>{
        var ref;
        const rs = (0, _matcher.matcher)((0, _preloadService.default)({
            rules: [
                {
                    url: 'google',
                    target: ''
                }, 
            ]
        }).rules, 'https://v.qq.com/google');
        expect(rs.matched).toBeTruthy();
        expect(rs.delay).toEqual(0);
        expect((0, _lodash.get)(rs, `responseHeaders['x-bproxy-matched']`)).toBeTruthy();
        expect(rs === null || rs === void 0 ? void 0 : (ref = rs.rule) === null || ref === void 0 ? void 0 : ref.target).toEqual('');
    });
    // string like regx
    it('matcher regx like url', ()=>{
        var ref;
        const rs = (0, _matcher.matcher)((0, _preloadService.default)({
            rules: [
                {
                    url: 'qq.com',
                    target: ''
                }, 
            ]
        }).rules, 'https://v.qq.com');
        expect(rs.matched).toBeTruthy();
        expect(rs.delay).toEqual(0);
        expect((0, _lodash.get)(rs, `responseHeaders['x-bproxy-matched']`)).toBeTruthy();
        expect(rs === null || rs === void 0 ? void 0 : (ref = rs.rule) === null || ref === void 0 ? void 0 : ref.target).toEqual('');
    });
    it('matcher regx like url, with *', ()=>{
        var ref;
        const rs = (0, _matcher.matcher)((0, _preloadService.default)({
            rules: [
                {
                    url: 'qq.com/*',
                    target: ''
                }, 
            ]
        }).rules, 'https://v.qq.com/a.html');
        expect(rs.matched).toBeTruthy();
        expect(rs.delay).toEqual(0);
        expect((0, _lodash.get)(rs, `responseHeaders['x-bproxy-matched']`)).toBeTruthy();
        expect(rs === null || rs === void 0 ? void 0 : (ref = rs.rule) === null || ref === void 0 ? void 0 : ref.target).toEqual('');
    });
    it('matcher regx like url, with *, error case', ()=>{
        var ref;
        const rs = (0, _matcher.matcher)((0, _preloadService.default)({
            rules: [
                {
                    url: 'qq.com/*',
                    target: ''
                }, 
            ]
        }).rules, 'https://v.qq.com/a/b/c');
        expect(rs.matched).toBeTruthy();
        expect(rs.delay).toEqual(0);
        expect((0, _lodash.get)(rs, `responseHeaders['x-bproxy-matched']`)).toBeTruthy();
        expect(rs === null || rs === void 0 ? void 0 : (ref = rs.rule) === null || ref === void 0 ? void 0 : ref.target).toEqual('');
        console.log(rs);
    });
    // regx
    it('matcher regx type', ()=>{
        var ref;
        const rs = (0, _matcher.matcher)((0, _preloadService.default)({
            rules: [
                {
                    url: /\/google\/(\S+)/,
                    redirect: 'https://qq.com/google/'
                }, 
            ]
        }).rules, 'https://v.qq.com/abc/google/index.html');
        expect(rs.matched).toBeTruthy();
        expect(rs.delay).toEqual(0);
        expect((0, _lodash.get)(rs, `responseHeaders['x-bproxy-matched']`)).toBeTruthy();
        expect(rs === null || rs === void 0 ? void 0 : (ref = rs.rule) === null || ref === void 0 ? void 0 : ref.redirect).toEqual('https://qq.com/google/');
        expect((0, _lodash.get)(rs, 'rule.redirectTarget')).toEqual('https://qq.com/google/index.html');
    });
    it('matcher regx type error case', ()=>{
        const rs = (0, _matcher.matcher)((0, _preloadService.default)({
            rules: [
                {
                    url: /\/google$/,
                    target: ''
                }, 
            ]
        }).rules, 'https://v.qq.com/google/a.html');
        expect(rs.matched).toBeFalsy();
        expect(rs.delay).toEqual(undefined);
        expect((0, _lodash.get)(rs, `responseHeaders['x-bproxy-matched']`)).toEqual(undefined);
        expect(rs.rule === undefined).toBeTruthy();
    });
    it('matcher regx function type', ()=>{
        var ref;
        const rs = (0, _matcher.matcher)((0, _preloadService.default)({
            rules: [
                {
                    url: (url)=>{
                        return url.includes('/google2');
                    },
                    target: ''
                }, 
            ]
        }).rules, 'https://v.qq.com/google');
        expect(rs.matched).toBeFalsy();
        expect(rs.delay).toEqual(undefined);
        expect((0, _lodash.get)(rs, `responseHeaders['x-bproxy-matched']`)).toEqual(undefined);
        expect(rs === null || rs === void 0 ? void 0 : (ref = rs.rule) === null || ref === void 0 ? void 0 : ref.target).toEqual(undefined);
    });
// string
});
