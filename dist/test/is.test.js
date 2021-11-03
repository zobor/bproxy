"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_1 = require("../src/proxy/utils/is");
describe('is.ts', () => {
    it('isInspectContentType', () => {
        expect((0, is_1.isInspectContentType)({})).toBeFalsy();
    });
    it('isInspectContentType', () => {
        expect((0, is_1.isInspectContentType)({ 'content-type': 'application/json' })).toBeTruthy();
    });
    it('isInspectContentType', () => {
        expect((0, is_1.isInspectContentType)({ 'content-type': 'x-www-form-urlencoded' })).toBeTruthy();
    });
    it('isInspectContentType', () => {
        expect((0, is_1.isInspectContentType)({ 'content-type': 'application/x-javascript' })).toBeTruthy();
    });
    it('isInspectContentType', () => {
        expect((0, is_1.isInspectContentType)({ 'content-type': 'text/html' })).toBeTruthy();
    });
    it('isInspectContentType', () => {
        expect((0, is_1.isInspectContentType)({ 'content-type': 'text/html' })).toBeTruthy();
    });
    it('isInspectContentType', () => {
        expect((0, is_1.isInspectContentType)({ 'accept': 'text/html' })).toBeTruthy();
    });
});
