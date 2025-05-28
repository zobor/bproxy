import log4js from 'log4js';
import { appErrorLogFilePath, appInfoLogFilePath } from './config';
import dataset from './dataset';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const MAX_LOG_SIZE = 1024 * 1024; // 1MB
const compressLog = (filePath: string) => {
  const compressedPath = `${filePath}.${Date.now()}.gz`;
  const input = fs.createReadStream(filePath);
  const output = fs.createWriteStream(compressedPath);
  const gzip = zlib.createGzip();
  input.pipe(gzip).pipe(output);
  fs.unlinkSync(filePath);
};

const checkAndRotateLog = (filePath: string) => {
  try {
    const stats = fs.statSync(filePath);
    if (stats.size > MAX_LOG_SIZE) {
      const newPath = `${filePath}.${Date.now()}`;
      fs.renameSync(filePath, newPath);
      compressLog(newPath);
    }
  } catch (e) {
    // 文件不存在时忽略错误
  }
};

log4js.configure({
  appenders: {
    bproxyError: {
      type: 'file',
      encoding: 'utf-8',
      filename: appErrorLogFilePath,
      layout: { type: 'basic' },
      mode: 0o644,
    },
    bproxyInfo: {
      type: 'file',
      encoding: 'utf-8',
      filename: appInfoLogFilePath,
      layout: { type: 'basic' },
      mode: 0o644,
    },
  },
  categories: { default: { appenders: ['bproxyInfo'], level: 'info' } },
});

// 启动时检查日志文件大小
checkAndRotateLog(appErrorLogFilePath);
checkAndRotateLog(appInfoLogFilePath);

const loggerError = log4js.getLogger('bproxyError');
const logger = log4js.getLogger('bproxyInfo');

export default {
  info: (...args: any) => {
    logger.info(...(args as [any[]]));
    if (dataset?.config?.debug) {
      console.info(...(args as [any[]]));
    }
  },
  warn: (...args: any) => {
    logger.warn(...(args as [any[]]));
    if (dataset?.config?.debug) {
      console.warn(...(args as [any[]]));
    }
  },
  error: (...args: any) => {
    loggerError.error(...(args as [any[]]));
    if (dataset?.config?.debug) {
      console.error(...(args as [any[]]));
    }
  },
};

