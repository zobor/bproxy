"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const pkg = __importStar(require("../../package.json"));
const command_1 = __importDefault(require("./command"));
const utils_1 = require("./utils/utils");
const program = new commander_1.Command();
if (process.argv.length === 2)
    process.argv.push('-h');
program
    .version(pkg.version)
    .option('-s ,--start', 'Start bproxy')
    .option('-c, --config [value]', 'Specifies the profile path')
    .option('-p, --port [value]', 'Specify the app port')
    .option('-i, --install', 'Install bproxy certificate(OSX)')
    .option('-x, --proxy [value]', 'Turn on/off system proxy')
    .option('-t, --test [value]', 'test url match or not')
    .parse(process.argv);
command_1.default.run(program);
process.on('uncaughtException', (err) => {
    utils_1.log.error(`uncaughtException: ${JSON.stringify(err.stack)}`);
});
