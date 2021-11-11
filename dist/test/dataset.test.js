"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_1 = __importDefault(require("../src/proxy/utils/dataset"));
describe('dataset.ts', () => {
    it('dataset {}', () => {
        dataset_1.default.configPath = '/a';
        expect(!!dataset_1.default.configPath).toBeTruthy();
    });
    it('dataset {}', () => {
        dataset_1.default.configPath = '/b';
        expect(dataset_1.default.configPath).toEqual('/b');
    });
});
