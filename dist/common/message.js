var Events = require('events');

var evt = new Events(); // 晚绑定事件 缓存池

evt.__cache__async = {}; // 钩子的用法

evt.__on = evt.on;
evt.__emit = evt.emit; // 重写emit 支持事件晚绑定

evt.emit = function () {
  var params = getDataArguments(arguments);

  if (arguments && arguments[0] && !this._events[arguments[0]] && !this.__cache__async[arguments[0]]) {
    this.__cache__async[arguments[0]] = params;
  } else {
    this.__emit.apply(this, arguments);
  }
}; // 重写on 支持事件晚绑定


evt.on = function () {
  if (arguments && arguments[0] && arguments[1] && this.__cache__async[arguments[0]]) {
    arguments[1].apply(this, this.__cache__async[arguments[0]]);
    this.__cache__async[arguments[0]] = null;
  }

  this.__on.call(this, arguments[0], arguments[1]);
};

function getDataArguments(arr) {
  var list = [];

  for (var i = 1, len = arr.length; i < len; i++) {
    list.push(arr[i]);
  }

  return list;
}

module.exports = evt;