"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const proxy_1 = require("../src/proxy");
describe("index.ts", () => {
    it("setConfig", () => {
        const a = (0, proxy_1.setConfig)({
            rules: [
                {
                    regx: "a.js",
                    host: "127.0.0.1",
                },
            ],
            port: 8888,
            configFile: './bproxy.conf.js',
            certificate: {
                filename: 'bproxy.conf.js',
                keyFileName: 'bproxy.key',
                name: '',
                organizationName: '',
                OU: '',
                countryName: '',
                provinceName: '',
                localityName: '',
                keySize: 1024,
                getDefaultCABasePath: () => { },
                getDefaultCACertPath: () => { },
                getDefaultCAKeyPath: () => { },
            },
        });
        expect(a.rules[0].host).toEqual("127.0.0.1");
    });
});
