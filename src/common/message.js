/* eslint no-underscore-dangle: 0, prefer-rest-params: 0,prefer-spread: 0 */
const Events = require('events');

const evt = new Events();

// 晚绑定事件 缓存池
evt.__cache__async = {};
// 钩子的用法
evt.__on = evt.on;
evt.__emit = evt.emit;

function getDataArguments(arr) {
  const list = [];
  for (let i = 1, len = arr.length; i < len;) {
    list.push(arr[i]);
    i += 1;
  }
  return list;
}

// 重写emit 支持事件晚绑定
evt.emit = function emit() {
  const params = getDataArguments(arguments);
  if (arguments
    && arguments[0]
    && !this._events[arguments[0]]
    && !this.__cache__async[arguments[0]]
  ) {
    this.__cache__async[arguments[0]] = params;
  } else {
    this.__emit.apply(this, arguments);
  }
};

// 重写on 支持事件晚绑定
evt.on = function on() {
  if (arguments
    && arguments[0]
    && arguments[1]
    && this.__cache__async[arguments[0]]
  ) {
    arguments[1].apply(this, this.__cache__async[arguments[0]]);
    this.__cache__async[arguments[0]] = null;
  }
  this.__on.call(this, arguments[0], arguments[1]);
};

module.exports = evt;
