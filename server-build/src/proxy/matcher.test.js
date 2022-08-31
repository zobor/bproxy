"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const matcher_1 = require("./matcher");
const preloadService_1 = __importDefault(require("./preloadService"));
describe('matcher', () => {
    it('matcher without regx', () => {
        const rs = (0, matcher_1.matcher)((0, preloadService_1.default)({
            rules: [{}],
        }).rules, 'https://v.qq.com/google');
        expect(rs.matched).toBeFalsy();
    });
    it('matcher normal string url', () => {
        var _a;
        const rs = (0, matcher_1.matcher)((0, preloadService_1.default)({
            rules: [
                {
                    url: 'google',
                    target: '',
                },
            ],
        }).rules, 'https://v.qq.com/google');
        expect(rs.matched).toBeTruthy();
        expect(rs.delay).toEqual(0);
        expect((0, lodash_1.get)(rs, `responseHeaders['x-bproxy-matched']`)).toBeTruthy();
        expect((_a = rs === null || rs === void 0 ? void 0 : rs.rule) === null || _a === void 0 ? void 0 : _a.target).toEqual('');
    });
    it('matcher regx like url', () => {
        var _a;
        const rs = (0, matcher_1.matcher)((0, preloadService_1.default)({
            rules: [
                {
                    url: 'qq.com',
                    target: '',
                },
            ],
        }).rules, 'https://v.qq.com');
        expect(rs.matched).toBeTruthy();
        expect(rs.delay).toEqual(0);
        expect((0, lodash_1.get)(rs, `responseHeaders['x-bproxy-matched']`)).toBeTruthy();
        expect((_a = rs === null || rs === void 0 ? void 0 : rs.rule) === null || _a === void 0 ? void 0 : _a.target).toEqual('');
    });
    it('matcher regx like url, with *', () => {
        var _a;
        const rs = (0, matcher_1.matcher)((0, preloadService_1.default)({
            rules: [
                {
                    url: 'qq.com/*',
                    target: '',
                },
            ],
        }).rules, 'https://v.qq.com/a.html');
        expect(rs.matched).toBeTruthy();
        expect(rs.delay).toEqual(0);
        expect((0, lodash_1.get)(rs, `responseHeaders['x-bproxy-matched']`)).toBeTruthy();
        expect((_a = rs === null || rs === void 0 ? void 0 : rs.rule) === null || _a === void 0 ? void 0 : _a.target).toEqual('');
    });
    it('matcher regx like url, with *, error case', () => {
        var _a;
        const rs = (0, matcher_1.matcher)((0, preloadService_1.default)({
            rules: [
                {
                    url: 'qq.com/*',
                    target: '',
                },
            ],
        }).rules, 'https://v.qq.com/a/b/c');
        expect(rs.matched).toBeTruthy();
        expect(rs.delay).toEqual(0);
        expect((0, lodash_1.get)(rs, `responseHeaders['x-bproxy-matched']`)).toBeTruthy();
        expect((_a = rs === null || rs === void 0 ? void 0 : rs.rule) === null || _a === void 0 ? void 0 : _a.target).toEqual('');
        console.log(rs);
    });
    it('matcher regx type', () => {
        var _a;
        const rs = (0, matcher_1.matcher)((0, preloadService_1.default)({
            rules: [
                {
                    url: /\/google\/(\S+)/,
                    redirect: 'https://qq.com/google/',
                },
            ],
        }).rules, 'https://v.qq.com/abc/google/index.html');
        expect(rs.matched).toBeTruthy();
        expect(rs.delay).toEqual(0);
        expect((0, lodash_1.get)(rs, `responseHeaders['x-bproxy-matched']`)).toBeTruthy();
        expect((_a = rs === null || rs === void 0 ? void 0 : rs.rule) === null || _a === void 0 ? void 0 : _a.redirect).toEqual('https://qq.com/google/');
        expect((0, lodash_1.get)(rs, 'rule.redirectTarget')).toEqual('https://qq.com/google/index.html');
    });
    it('matcher regx type error case', () => {
        const rs = (0, matcher_1.matcher)((0, preloadService_1.default)({
            rules: [
                {
                    url: /\/google$/,
                    target: '',
                },
            ],
        }).rules, 'https://v.qq.com/google/a.html');
        expect(rs.matched).toBeFalsy();
        expect(rs.delay).toEqual(undefined);
        expect((0, lodash_1.get)(rs, `responseHeaders['x-bproxy-matched']`)).toEqual(undefined);
        expect(rs.rule === undefined).toBeTruthy();
    });
    it('matcher regx function type', () => {
        var _a;
        const rs = (0, matcher_1.matcher)((0, preloadService_1.default)({
            rules: [
                {
                    url: (url) => {
                        return url.includes('/google2');
                    },
                    target: '',
                },
            ],
        }).rules, 'https://v.qq.com/google');
        expect(rs.matched).toBeFalsy();
        expect(rs.delay).toEqual(undefined);
        expect((0, lodash_1.get)(rs, `responseHeaders['x-bproxy-matched']`)).toEqual(undefined);
        expect((_a = rs === null || rs === void 0 ? void 0 : rs.rule) === null || _a === void 0 ? void 0 : _a.target).toEqual(undefined);
    });
});
