"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const matcher_1 = require("../src/proxy/matcher");
describe('matcher', () => {
    it('regx is string with *', () => {
        var _a;
        const rs = (0, matcher_1.matcher)([
            {
                regx: 'https://google.com/*',
                redirect: 'http://localhost/',
            }
        ], 'https://google.com/a.js');
        expect(rs.matched).toBeTruthy();
        expect((_a = rs === null || rs === void 0 ? void 0 : rs.rule) === null || _a === void 0 ? void 0 : _a.redirectTarget).toEqual('http://localhost/a.js');
    });
    it('regx is string with * / redirect', () => {
        var _a;
        const rs = (0, matcher_1.matcher)([
            {
                regx: 'https://google.com/*',
                redirect: 'http://localhost/',
                rewrite: (path) => path.replace('_efg', ''),
            }
        ], 'https://google.com/abc_efg.js');
        expect(rs.matched).toBeTruthy();
        expect((_a = rs === null || rs === void 0 ? void 0 : rs.rule) === null || _a === void 0 ? void 0 : _a.redirectTarget).toEqual('http://localhost/abc.js');
        expect(rs === null || rs === void 0 ? void 0 : rs.responseHeaders['x-bproxy-redirect']).toEqual('http://localhost/abc.js');
    });
    it('regx is string with * / path', () => {
        const rs = (0, matcher_1.matcher)([
            {
                regx: 'https://google.com/*$',
                redirect: 'http://localhost/',
            }
        ], 'https://google.com/x/y/z/a.js');
        expect(rs.matched).toBeFalsy();
    });
    it('regx is string with **', () => {
        const rs = (0, matcher_1.matcher)([
            {
                regx: 'https://google.com/**',
                redirect: 'http://localhost/',
            }
        ], 'https://google.com/a.js');
        expect(rs.matched).toBeTruthy();
    });
    it('regx is RegExp', () => {
        var _a;
        const rs = (0, matcher_1.matcher)([
            {
                regx: /(\w+\.js)$/,
                redirect: 'http://localhost/',
            }
        ], 'https://google.com/a.js');
        expect(rs.matched).toBeTruthy();
        expect((_a = rs === null || rs === void 0 ? void 0 : rs.rule) === null || _a === void 0 ? void 0 : _a.redirectTarget).toEqual('http://localhost/a.js');
    });
    it('regx is string', () => {
        const rs = (0, matcher_1.matcher)([
            {
                regx: 'abc.js',
                redirect: 'http://localhost/',
            }
        ], 'https://google.com/abc.js');
        expect(rs.matched).toBeTruthy();
    });
    it('regx is function', () => {
        const rs = (0, matcher_1.matcher)([
            {
                regx: (url) => /(\w+\.js)$/.test(url),
                redirect: 'http://localhost/',
                rewrite: (path) => path.replace('bc', ''),
            }
        ], 'https://google.com/abc.js');
        expect(rs.matched).toBeTruthy();
        expect(rs === null || rs === void 0 ? void 0 : rs.filepath).toEqual('a.js');
    });
    it('regx is function', () => {
        const rs = (0, matcher_1.matcher)([
            {
                redirect: 'http://localhost/',
            }
        ], 'https://google.com/abc.js');
        expect(rs.matched).toBeFalsy();
    });
});
