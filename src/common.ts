import chalk from "chalk";

const { log } = console;

function logLevel(level: string) {
  return function (target, key, descriptor) {
    descriptor.value = function(message) {
      target.printf(message, level);
    }
  }
}

class Common {
  printf(message: string, level: string): void {
    const info = level === 'info' ? chalk.green('[INFO]') : 
    ( level === 'error' ? chalk.redBright('[ERROR]') : 
        ( level === 'debug' ? chalk.gray('[DEBUG]') : 
          ( level === 'warn' ? chalk.yellowBright('[WARN]') : '')
        )
    );
    const msg = typeof message === 'object' ?
      JSON.stringify(message) : message;
    log(`${info} ${chalk.hex('#ccc')(msg)}`);
  }

  @logLevel('info')
  info(msg) {}

  @logLevel('error')
  error(msg) {}

  @logLevel('debug')
  debug(msg) {}

  @logLevel('warn')
  warn(msg) {}
};

const cm = new Common();

export {
  cm,
}
export const utils = {
  guid: (len = 36) => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.slice(0, len).replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  uuid: (len = 12) => {
    return Buffer.from(utils.guid())
      .toString('base64')
      .replace(/[/=+]/g, '').slice(0, len);
  },
}