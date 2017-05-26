const colors = require('colors');

module.exports = {
  log: function (msg) {
    console.log.apply(null, arguments);
  },
  error: function (msg) {
    let log = colors.red(`[${new Date()}] ${msg}`);
    console.log(log);
  }
};