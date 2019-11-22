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