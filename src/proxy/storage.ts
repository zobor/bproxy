// import storage from 'node-persist';
// import path from 'path';
// import { appDataPath } from './config';
// import logger from './logger';

let cb = () => {};

export function storageReady() {
  return new Promise((resolve) => {
    cb = () => {
      resolve(true);
    };
  });
}

(async () => {
  // try {
  //   await storage.init({
  //     dir: path.resolve(appDataPath, 'storage'),
  //     stringify: JSON.stringify,
  //     parse: JSON.parse,
  //     encoding: 'utf8',
  //   });
  // } catch(err) {
  //   logger.info(1111, err);
  // }
  setTimeout(() => {
    cb();
  }, 0);
})();

export const STORAGE_KEYS = {
  SYSTEM_PROXY: 'system-proxy',
};

const exp: any = {};
export default exp;

// export default storage;
