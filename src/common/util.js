/* eslint class-methods-use-this: 0 */
const chalk = require('chalk');

const { log } = console;

class Util {
  newGuid(strLen) {
    const len = strLen || 32;
    let guid = '';
    for (let i = 1; i <= len;) {
      const n = Math.floor(Math.random() * 16.0).toString(16);
      guid += n;
      i += 1;
    }
    return guid;
  }

  getUrlParam(p, u) {
    const reg = new RegExp(`(^|&|\\\\?)${p}=([^&]*)(&|$|#)`);
    let r = null;
    r = u.match(reg);
    if (r) {
      return r[2];
    }
    return '';
  }

  log(obj) {
    log(obj);
  }

  info(obj) {
    const info = chalk.green('[INFO]');
    log(`${info} ${obj}`);
  }

  debug(ob) {
    const info = chalk.gray('[DEBUG]');
    const obj = chalk.gray(ob);
    log(`${info} ${obj}`);
  }

  error(ob) {
    const info = chalk.red('[ERROR]');
    const obj = chalk.red(ob);
    log(`${info} ${obj}`);
  }
}

Util.prototype.color = chalk;

module.exports = new Util();
