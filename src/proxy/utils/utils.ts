import chalk from "chalk";

const { log: terminalLog } = console;

function logLevel(level: string) {
  return (target, key, descriptor) => {
    descriptor.value = function(message) {
      target.printf(message, level);
    }
  }
}

class Logger {
  printf(message: string, level: string): void {
    const info = level === 'info' ? chalk.green('[INFO]') :
    ( level === 'error' ? chalk.redBright('[ERROR]') :
        ( level === 'debug' ? chalk.gray('[DEBUG]') :
          ( level === 'warn' ? chalk.yellowBright('[WARN]') : '')
        )
    );
    const msg = typeof message === 'object' ?
      JSON.stringify(message) : message;
      terminalLog(`${info} ${chalk.hex('#ccc')(msg)}`);
  }

  @logLevel('info')
  info(msg: any) {}

  @logLevel('error')
  error(msg: any) {}

  @logLevel('debug')
  debug(msg: any) {}

  @logLevel('warn')
  warn(msg: any) {}
};

export const log = new Logger();

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
};

export const createHttpHeader = (line, headers) => {
  return (
    Object.keys(headers)
      .reduce(
        function (head, key) {
          const value = headers[key];

          if (!Array.isArray(value)) {
            head.push(key + ": " + value);
            return head;
          }

          for (let i = 0; i < value.length; i++) {
            head.push(key + ": " + value[i]);
          }
          return head;
        },
        [line]
      )
      .join("\r\n") + "\r\n\r\n"
  );
};
