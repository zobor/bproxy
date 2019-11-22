import * as program from 'commander';
import * as pkg from '../package.json';
import commands from './command';
import { cm } from './common';

if (process.argv.length === 2) process.argv.push('-h');
program
  .version(pkg.version)
  .option('-s ,--start', 'Start bproxy')
  .option('-c, --config [value]', 'Specifies the profile path')
  .option('-p, --port [value]', 'Specify the app port')
  .option('-i, --install', 'Install bproxy certificate(OSX)')
  .option('-x, --proxy [value]', 'Turn on/off system proxy')
  .parse(process.argv);

commands.run(program);

process.on('uncaughtException', (err) => {
  cm.error(`uncaughtException: ${JSON.stringify(err.stack)}`);
});