import { Command } from 'commander';
import * as pkg from '../../package.json';
import commands from './command';
import { log } from './utils/utils';

const program = new Command();

if (process.argv.length === 2) process.argv.push('-h');
program
  .version(pkg.version)
  .option('-s ,--start', 'Start bproxy')
  .option('-c, --config [value]', 'Specifies the profile path')
  .option('-p, --port [value]', 'Specify the app port')
  .option('-i, --install', 'Install bproxy certificate(OSX)')
  .option('-x, --proxy [value]', 'Turn on/off system proxy')
  .option('-t, --test [value]', 'test url match or not')
  .parse(process.argv);

commands.run(program as any);

process.on('uncaughtException', (err) => {
  log.error(`uncaughtException: ${JSON.stringify(err.stack)}`);
});
