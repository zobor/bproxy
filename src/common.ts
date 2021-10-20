/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import chalk from "chalk";
import * as os from 'os';

const { log } = console;

function logLevel(level: string) {
  return (target, key, descriptor) => {
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
  info(msg: any) {}

  @logLevel('error')
  error(msg: any) {}

  @logLevel('debug')
  debug(msg: any) {}

  @logLevel('warn')
  warn(msg: any) {}
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

export const getLocalIpAddress = () => {
  const ifaces = os.networkInterfaces();
  const Ips: any = [];
  for (const dev in ifaces) {
    ifaces[dev].forEach((details) => {
      if (details.family == "IPv4") {
        Ips.push(details.address);
      }
    });
  }
  return Ips;
};

export const isInspectContentType = (headers): boolean => {
  if (!headers || (!headers['content-type'] && !headers.accept)) {
    return false;
  }
  const contentType = headers['content-type'] || '';
  const { accept  ='' } = headers;

  return (
    contentType.includes("application/json") ||
    contentType.includes("x-www-form-urlencoded") ||
    contentType.includes("application/javascript") ||
    contentType.includes("application/x-javascript") ||
    contentType.includes("text/css") ||
    contentType.includes("text/html") ||
    accept.includes("text/")
  );
};
