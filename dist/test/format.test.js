"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const format_1 = require("../src/proxy/utils/format");
describe('format.ts', () => {
    it('formatSeconds', () => {
        expect((0, format_1.formatSeconds)(500)).toEqual('500ms');
        expect((0, format_1.formatSeconds)(1340)).toEqual('1.3s');
        expect((0, format_1.formatSeconds)(1350)).toEqual('1.4s');
    });
});
