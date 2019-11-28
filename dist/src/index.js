"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
const pkg = require("../package.json");
const command_1 = require("./command");
const common_1 = require("./common");
if (process.argv.length === 2)
    process.argv.push('-h');
program
    .version(pkg.version)
    .option('-s ,--start', 'Start bproxy')
    .option('-c, --config [value]', 'Specifies the profile path')
    .option('-p, --port [value]', 'Specify the app port')
    .option('-i, --install', 'Install bproxy certificate(OSX)')
    .option('-x, --proxy [value]', 'Turn on/off system proxy')
    .parse(process.argv);
command_1.default.run(program);
process.on('uncaughtException', (err) => {
    common_1.cm.error(`uncaughtException: ${JSON.stringify(err.stack)}`);
});
