"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ip_1 = require("../src/proxy/utils/ip");
describe('ip.ts', () => {
    it('getLocalIpAddress', () => {
        const ips = (0, ip_1.getLocalIpAddress)();
        expect(Array.isArray(ips)).toBeTruthy();
    });
});
