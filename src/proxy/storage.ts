import storage from 'node-persist';
import path from 'path';
import { appDataPath } from './config';

let cb = () => {};

export function storageReady() {
  return new Promise((resolve) => {
    cb = () => {
      resolve(true);
    };
  });
}

(async () => {
  await storage.init({
    dir: path.resolve(appDataPath, 'storage'),
    stringify: JSON.stringify,
    parse: JSON.parse,
    encoding: 'utf8',
  });
  setTimeout(() => {
    cb();
  }, 0);
})();

export const STORAGE_KEYS = {
  SYSTEM_PROXY: 'system-proxy',
};

export default storage;
