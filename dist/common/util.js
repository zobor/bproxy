const chalk = require('chalk');

const log = console.log;

class Util {
  newGuid(len) {
    len = len || 32;
    var guid = "";

    for (var i = 1; i <= len; i++) {
      var n = Math.floor(Math.random() * 16.0).toString(16);
      guid += n;
    }

    return guid;
  }

  getUrlParam(p, u) {
    var reg = new RegExp("(^|&|\\\\?)" + p + "=([^&]*)(&|$|#)"),
        r = null;
    r = u.match(reg);

    if (r) {
      return r[2];
    }

    return "";
  }

  log(obj) {
    log(obj);
  }

  info(obj) {
    const info = chalk.green('[INFO]');
    log(`${info} ${obj}`);
  }

  debug(obj) {
    const info = chalk.gray('[DEBUG]');
    obj = chalk.gray(obj);
    log(`${info} ${obj}`);
  }

  error(obj) {
    const info = chalk.red('[ERROR]');
    obj = chalk.red(obj);
    log(`${info} ${obj}`);
  }

}

Util.prototype.color = chalk;
module.exports = new Util();