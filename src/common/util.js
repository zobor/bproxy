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
}

module.exports = new Util()