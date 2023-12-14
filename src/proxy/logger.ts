// import log4js from 'log4js';
// import { appErrorLogFilePath, appInfoLogFilePath } from './config';
// import dataset from './dataset';

// log4js.configure({
//   appenders: {
//     bproxyError: { type: 'file', encoding: 'utf-8', filename: appErrorLogFilePath },
//     bproxyInfo: { type: 'file', encoding: 'utf-8', filename: appInfoLogFilePath },
//   },
//   categories: { default: { appenders: ['bproxyInfo'], level: 'info' } },
// });

// const loggerError = log4js.getLogger('bproxyError');
// const logger = log4js.getLogger('bproxyInfo');

export default {
  info: (...args: any) => {
    // logger.info(...(args as [any[]]));
    // if (dataset?.config?.debug) {
    //   console.info(...(args as [any[]]));
    // }
  },
  warn: (...args: any) => {
    // logger.warn(...(args as [any[]]));
    // if (dataset?.config?.debug) {
    //   console.warn(...(args as [any[]]));
    // }
  },
  error: (...args: any) => {
    // loggerError.error(...(args as [any[]]));
    // if (dataset?.config?.debug) {
    //   console.error(...(args as [any[]]));
    // }
  },
};
