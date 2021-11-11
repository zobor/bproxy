"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __importDefault(require("../src/proxy/command"));
describe('command.ts', () => {
    it('command.test', () => {
        command_1.default.test({
            rawArgs: [, , , 'https://www.google.com'],
        });
    });
    it('run.proxy', () => {
        let error;
        try {
            command_1.default.run({ proxy: 'on', port: 8888 });
            command_1.default.run({ proxy: 'off', port: 8888 });
        }
        catch (err) {
            err = error;
        }
        expect(error === undefined).toBeTruthy();
    });
    it('run.start', () => {
        try {
            command_1.default.start({ port: 8888, config: './' });
        }
        catch (err) {
            console.log(err);
        }
    });
});
