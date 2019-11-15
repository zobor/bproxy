import * as program from 'commander';
import * as pkg from '../package.json';
import commands from './command';

if (process.argv.length === 2) process.argv.push('-h');
program
  .version(pkg.version)
  .option('-s ,--start', 'start bproxy')
  .option('-c, --config [value]', 'specifies the profile path')
  .option('-p, --port [value]', 'specify the app port')
  .option('-i, --install', 'install bproxy certificate')
  .option('-x, --proxy [value]', 'turn on/off system proxy')
  .parse(process.argv);

commands.run(program);
