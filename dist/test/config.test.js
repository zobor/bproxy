"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../src/proxy/config"));
describe("config.ts", () => {
    it("config", () => {
        expect(Object.keys(config_1.default).length > 3).toBeTruthy();
    });
    it('config.certificate.getDefaultCABasePath', () => {
        var _a;
        const filepath = (_a = config_1.default.certificate) === null || _a === void 0 ? void 0 : _a.getDefaultCABasePath();
        expect(filepath.length > 10).toBeTruthy();
    });
    it('config.certificate.getDefaultCACertPath', () => {
        var _a;
        const filepath = (_a = config_1.default.certificate) === null || _a === void 0 ? void 0 : _a.getDefaultCACertPath();
        expect(filepath.length > 10).toBeTruthy();
    });
    it('config.certificate.getDefaultCAKeyPath', () => {
        var _a;
        const filepath = (_a = config_1.default.certificate) === null || _a === void 0 ? void 0 : _a.getDefaultCAKeyPath();
        expect(filepath.length > 10).toBeTruthy();
    });
});
