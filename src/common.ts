import dataset from './dataset';
import chalk from "chalk";

const { log } = console;

export default {
  printf(message: string, level: string): void {
    if (!dataset.debug) return;
    let info;
    switch(level) {
      case 'info':
        info = chalk.green('[INFO]');
        break;
      case 'error':
        info = chalk.redBright('[ERROR]');
        break;
      case 'debug':
        info = chalk.gray('[DEBUG]');
        break;
      case 'warn':
        info = chalk.yellowBright('[WARN]');
        break;
    }
    const msg = typeof message === 'object' ?
      JSON.stringify(message) : message;
    log(`${info} ${chalk.hex('#ccc')(msg)}`);
  },
  info(message: any): void {
    this.printf(message, 'info');
  },
  debug(message: any): void {
    this.printf(message, 'debug');
  },
  error(message: any): void {
    this.printf(message, 'error');
  },
  warn(message: any) {
    this.printf(message, 'warn');
  },
};
