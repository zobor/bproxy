var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __commonJS = (callback, module2) => () => {
  if (!module2) {
    module2 = {exports: {}};
    callback(module2.exports, module2);
  }
  return module2.exports;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __exportStar = (target, module2, desc) => {
  __markAsModule(target);
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  if (module2 && module2.__esModule)
    return module2;
  return __exportStar(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", {value: module2, enumerable: true}), module2);
};
var __decorate = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};

// node_modules/node-forge/lib/forge.js
var require_forge = __commonJS((exports2, module2) => {
  module2.exports = {
    options: {
      usePureJavaScript: false
    }
  };
});

// node_modules/node-forge/lib/baseN.js
var require_baseN = __commonJS((exports2, module2) => {
  var api = {};
  module2.exports = api;
  var _reverseAlphabets = {};
  api.encode = function(input, alphabet, maxline) {
    if (typeof alphabet !== "string") {
      throw new TypeError('"alphabet" must be a string.');
    }
    if (maxline !== void 0 && typeof maxline !== "number") {
      throw new TypeError('"maxline" must be a number.');
    }
    var output = "";
    if (!(input instanceof Uint8Array)) {
      output = _encodeWithByteBuffer(input, alphabet);
    } else {
      var i = 0;
      var base = alphabet.length;
      var first = alphabet.charAt(0);
      var digits = [0];
      for (i = 0; i < input.length; ++i) {
        for (var j = 0, carry = input[i]; j < digits.length; ++j) {
          carry += digits[j] << 8;
          digits[j] = carry % base;
          carry = carry / base | 0;
        }
        while (carry > 0) {
          digits.push(carry % base);
          carry = carry / base | 0;
        }
      }
      for (i = 0; input[i] === 0 && i < input.length - 1; ++i) {
        output += first;
      }
      for (i = digits.length - 1; i >= 0; --i) {
        output += alphabet[digits[i]];
      }
    }
    if (maxline) {
      var regex = new RegExp(".{1," + maxline + "}", "g");
      output = output.match(regex).join("\r\n");
    }
    return output;
  };
  api.decode = function(input, alphabet) {
    if (typeof input !== "string") {
      throw new TypeError('"input" must be a string.');
    }
    if (typeof alphabet !== "string") {
      throw new TypeError('"alphabet" must be a string.');
    }
    var table = _reverseAlphabets[alphabet];
    if (!table) {
      table = _reverseAlphabets[alphabet] = [];
      for (var i = 0; i < alphabet.length; ++i) {
        table[alphabet.charCodeAt(i)] = i;
      }
    }
    input = input.replace(/\s/g, "");
    var base = alphabet.length;
    var first = alphabet.charAt(0);
    var bytes = [0];
    for (var i = 0; i < input.length; i++) {
      var value = table[input.charCodeAt(i)];
      if (value === void 0) {
        return;
      }
      for (var j = 0, carry = value; j < bytes.length; ++j) {
        carry += bytes[j] * base;
        bytes[j] = carry & 255;
        carry >>= 8;
      }
      while (carry > 0) {
        bytes.push(carry & 255);
        carry >>= 8;
      }
    }
    for (var k = 0; input[k] === first && k < input.length - 1; ++k) {
      bytes.push(0);
    }
    if (typeof Buffer !== "undefined") {
      return Buffer.from(bytes.reverse());
    }
    return new Uint8Array(bytes.reverse());
  };
  function _encodeWithByteBuffer(input, alphabet) {
    var i = 0;
    var base = alphabet.length;
    var first = alphabet.charAt(0);
    var digits = [0];
    for (i = 0; i < input.length(); ++i) {
      for (var j = 0, carry = input.at(i); j < digits.length; ++j) {
        carry += digits[j] << 8;
        digits[j] = carry % base;
        carry = carry / base | 0;
      }
      while (carry > 0) {
        digits.push(carry % base);
        carry = carry / base | 0;
      }
    }
    var output = "";
    for (i = 0; input.at(i) === 0 && i < input.length() - 1; ++i) {
      output += first;
    }
    for (i = digits.length - 1; i >= 0; --i) {
      output += alphabet[digits[i]];
    }
    return output;
  }
});

// node_modules/node-forge/lib/util.js
var require_util = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  var baseN = require_baseN();
  var util = module2.exports = forge2.util = forge2.util || {};
  (function() {
    if (typeof process !== "undefined" && process.nextTick && !process.browser) {
      util.nextTick = process.nextTick;
      if (typeof setImmediate === "function") {
        util.setImmediate = setImmediate;
      } else {
        util.setImmediate = util.nextTick;
      }
      return;
    }
    if (typeof setImmediate === "function") {
      util.setImmediate = function() {
        return setImmediate.apply(void 0, arguments);
      };
      util.nextTick = function(callback) {
        return setImmediate(callback);
      };
      return;
    }
    util.setImmediate = function(callback) {
      setTimeout(callback, 0);
    };
    if (typeof window !== "undefined" && typeof window.postMessage === "function") {
      var msg = "forge.setImmediate";
      var callbacks = [];
      util.setImmediate = function(callback) {
        callbacks.push(callback);
        if (callbacks.length === 1) {
          window.postMessage(msg, "*");
        }
      };
      function handler(event) {
        if (event.source === window && event.data === msg) {
          event.stopPropagation();
          var copy = callbacks.slice();
          callbacks.length = 0;
          copy.forEach(function(callback) {
            callback();
          });
        }
      }
      window.addEventListener("message", handler, true);
    }
    if (typeof MutationObserver !== "undefined") {
      var now = Date.now();
      var attr = true;
      var div = document.createElement("div");
      var callbacks = [];
      new MutationObserver(function() {
        var copy = callbacks.slice();
        callbacks.length = 0;
        copy.forEach(function(callback) {
          callback();
        });
      }).observe(div, {attributes: true});
      var oldSetImmediate = util.setImmediate;
      util.setImmediate = function(callback) {
        if (Date.now() - now > 15) {
          now = Date.now();
          oldSetImmediate(callback);
        } else {
          callbacks.push(callback);
          if (callbacks.length === 1) {
            div.setAttribute("a", attr = !attr);
          }
        }
      };
    }
    util.nextTick = util.setImmediate;
  })();
  util.isNodejs = typeof process !== "undefined" && process.versions && process.versions.node;
  util.globalScope = function() {
    if (util.isNodejs) {
      return global;
    }
    return typeof self === "undefined" ? window : self;
  }();
  util.isArray = Array.isArray || function(x) {
    return Object.prototype.toString.call(x) === "[object Array]";
  };
  util.isArrayBuffer = function(x) {
    return typeof ArrayBuffer !== "undefined" && x instanceof ArrayBuffer;
  };
  util.isArrayBufferView = function(x) {
    return x && util.isArrayBuffer(x.buffer) && x.byteLength !== void 0;
  };
  function _checkBitsParam(n) {
    if (!(n === 8 || n === 16 || n === 24 || n === 32)) {
      throw new Error("Only 8, 16, 24, or 32 bits supported: " + n);
    }
  }
  util.ByteBuffer = ByteStringBuffer;
  function ByteStringBuffer(b) {
    this.data = "";
    this.read = 0;
    if (typeof b === "string") {
      this.data = b;
    } else if (util.isArrayBuffer(b) || util.isArrayBufferView(b)) {
      if (typeof Buffer !== "undefined" && b instanceof Buffer) {
        this.data = b.toString("binary");
      } else {
        var arr = new Uint8Array(b);
        try {
          this.data = String.fromCharCode.apply(null, arr);
        } catch (e) {
          for (var i = 0; i < arr.length; ++i) {
            this.putByte(arr[i]);
          }
        }
      }
    } else if (b instanceof ByteStringBuffer || typeof b === "object" && typeof b.data === "string" && typeof b.read === "number") {
      this.data = b.data;
      this.read = b.read;
    }
    this._constructedStringLength = 0;
  }
  util.ByteStringBuffer = ByteStringBuffer;
  var _MAX_CONSTRUCTED_STRING_LENGTH = 4096;
  util.ByteStringBuffer.prototype._optimizeConstructedString = function(x) {
    this._constructedStringLength += x;
    if (this._constructedStringLength > _MAX_CONSTRUCTED_STRING_LENGTH) {
      this.data.substr(0, 1);
      this._constructedStringLength = 0;
    }
  };
  util.ByteStringBuffer.prototype.length = function() {
    return this.data.length - this.read;
  };
  util.ByteStringBuffer.prototype.isEmpty = function() {
    return this.length() <= 0;
  };
  util.ByteStringBuffer.prototype.putByte = function(b) {
    return this.putBytes(String.fromCharCode(b));
  };
  util.ByteStringBuffer.prototype.fillWithByte = function(b, n) {
    b = String.fromCharCode(b);
    var d = this.data;
    while (n > 0) {
      if (n & 1) {
        d += b;
      }
      n >>>= 1;
      if (n > 0) {
        b += b;
      }
    }
    this.data = d;
    this._optimizeConstructedString(n);
    return this;
  };
  util.ByteStringBuffer.prototype.putBytes = function(bytes) {
    this.data += bytes;
    this._optimizeConstructedString(bytes.length);
    return this;
  };
  util.ByteStringBuffer.prototype.putString = function(str) {
    return this.putBytes(util.encodeUtf8(str));
  };
  util.ByteStringBuffer.prototype.putInt16 = function(i) {
    return this.putBytes(String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i & 255));
  };
  util.ByteStringBuffer.prototype.putInt24 = function(i) {
    return this.putBytes(String.fromCharCode(i >> 16 & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i & 255));
  };
  util.ByteStringBuffer.prototype.putInt32 = function(i) {
    return this.putBytes(String.fromCharCode(i >> 24 & 255) + String.fromCharCode(i >> 16 & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i & 255));
  };
  util.ByteStringBuffer.prototype.putInt16Le = function(i) {
    return this.putBytes(String.fromCharCode(i & 255) + String.fromCharCode(i >> 8 & 255));
  };
  util.ByteStringBuffer.prototype.putInt24Le = function(i) {
    return this.putBytes(String.fromCharCode(i & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i >> 16 & 255));
  };
  util.ByteStringBuffer.prototype.putInt32Le = function(i) {
    return this.putBytes(String.fromCharCode(i & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i >> 16 & 255) + String.fromCharCode(i >> 24 & 255));
  };
  util.ByteStringBuffer.prototype.putInt = function(i, n) {
    _checkBitsParam(n);
    var bytes = "";
    do {
      n -= 8;
      bytes += String.fromCharCode(i >> n & 255);
    } while (n > 0);
    return this.putBytes(bytes);
  };
  util.ByteStringBuffer.prototype.putSignedInt = function(i, n) {
    if (i < 0) {
      i += 2 << n - 1;
    }
    return this.putInt(i, n);
  };
  util.ByteStringBuffer.prototype.putBuffer = function(buffer) {
    return this.putBytes(buffer.getBytes());
  };
  util.ByteStringBuffer.prototype.getByte = function() {
    return this.data.charCodeAt(this.read++);
  };
  util.ByteStringBuffer.prototype.getInt16 = function() {
    var rval = this.data.charCodeAt(this.read) << 8 ^ this.data.charCodeAt(this.read + 1);
    this.read += 2;
    return rval;
  };
  util.ByteStringBuffer.prototype.getInt24 = function() {
    var rval = this.data.charCodeAt(this.read) << 16 ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2);
    this.read += 3;
    return rval;
  };
  util.ByteStringBuffer.prototype.getInt32 = function() {
    var rval = this.data.charCodeAt(this.read) << 24 ^ this.data.charCodeAt(this.read + 1) << 16 ^ this.data.charCodeAt(this.read + 2) << 8 ^ this.data.charCodeAt(this.read + 3);
    this.read += 4;
    return rval;
  };
  util.ByteStringBuffer.prototype.getInt16Le = function() {
    var rval = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8;
    this.read += 2;
    return rval;
  };
  util.ByteStringBuffer.prototype.getInt24Le = function() {
    var rval = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2) << 16;
    this.read += 3;
    return rval;
  };
  util.ByteStringBuffer.prototype.getInt32Le = function() {
    var rval = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2) << 16 ^ this.data.charCodeAt(this.read + 3) << 24;
    this.read += 4;
    return rval;
  };
  util.ByteStringBuffer.prototype.getInt = function(n) {
    _checkBitsParam(n);
    var rval = 0;
    do {
      rval = (rval << 8) + this.data.charCodeAt(this.read++);
      n -= 8;
    } while (n > 0);
    return rval;
  };
  util.ByteStringBuffer.prototype.getSignedInt = function(n) {
    var x = this.getInt(n);
    var max = 2 << n - 2;
    if (x >= max) {
      x -= max << 1;
    }
    return x;
  };
  util.ByteStringBuffer.prototype.getBytes = function(count) {
    var rval;
    if (count) {
      count = Math.min(this.length(), count);
      rval = this.data.slice(this.read, this.read + count);
      this.read += count;
    } else if (count === 0) {
      rval = "";
    } else {
      rval = this.read === 0 ? this.data : this.data.slice(this.read);
      this.clear();
    }
    return rval;
  };
  util.ByteStringBuffer.prototype.bytes = function(count) {
    return typeof count === "undefined" ? this.data.slice(this.read) : this.data.slice(this.read, this.read + count);
  };
  util.ByteStringBuffer.prototype.at = function(i) {
    return this.data.charCodeAt(this.read + i);
  };
  util.ByteStringBuffer.prototype.setAt = function(i, b) {
    this.data = this.data.substr(0, this.read + i) + String.fromCharCode(b) + this.data.substr(this.read + i + 1);
    return this;
  };
  util.ByteStringBuffer.prototype.last = function() {
    return this.data.charCodeAt(this.data.length - 1);
  };
  util.ByteStringBuffer.prototype.copy = function() {
    var c = util.createBuffer(this.data);
    c.read = this.read;
    return c;
  };
  util.ByteStringBuffer.prototype.compact = function() {
    if (this.read > 0) {
      this.data = this.data.slice(this.read);
      this.read = 0;
    }
    return this;
  };
  util.ByteStringBuffer.prototype.clear = function() {
    this.data = "";
    this.read = 0;
    return this;
  };
  util.ByteStringBuffer.prototype.truncate = function(count) {
    var len = Math.max(0, this.length() - count);
    this.data = this.data.substr(this.read, len);
    this.read = 0;
    return this;
  };
  util.ByteStringBuffer.prototype.toHex = function() {
    var rval = "";
    for (var i = this.read; i < this.data.length; ++i) {
      var b = this.data.charCodeAt(i);
      if (b < 16) {
        rval += "0";
      }
      rval += b.toString(16);
    }
    return rval;
  };
  util.ByteStringBuffer.prototype.toString = function() {
    return util.decodeUtf8(this.bytes());
  };
  function DataBuffer(b, options) {
    options = options || {};
    this.read = options.readOffset || 0;
    this.growSize = options.growSize || 1024;
    var isArrayBuffer = util.isArrayBuffer(b);
    var isArrayBufferView = util.isArrayBufferView(b);
    if (isArrayBuffer || isArrayBufferView) {
      if (isArrayBuffer) {
        this.data = new DataView(b);
      } else {
        this.data = new DataView(b.buffer, b.byteOffset, b.byteLength);
      }
      this.write = "writeOffset" in options ? options.writeOffset : this.data.byteLength;
      return;
    }
    this.data = new DataView(new ArrayBuffer(0));
    this.write = 0;
    if (b !== null && b !== void 0) {
      this.putBytes(b);
    }
    if ("writeOffset" in options) {
      this.write = options.writeOffset;
    }
  }
  util.DataBuffer = DataBuffer;
  util.DataBuffer.prototype.length = function() {
    return this.write - this.read;
  };
  util.DataBuffer.prototype.isEmpty = function() {
    return this.length() <= 0;
  };
  util.DataBuffer.prototype.accommodate = function(amount, growSize) {
    if (this.length() >= amount) {
      return this;
    }
    growSize = Math.max(growSize || this.growSize, amount);
    var src = new Uint8Array(this.data.buffer, this.data.byteOffset, this.data.byteLength);
    var dst = new Uint8Array(this.length() + growSize);
    dst.set(src);
    this.data = new DataView(dst.buffer);
    return this;
  };
  util.DataBuffer.prototype.putByte = function(b) {
    this.accommodate(1);
    this.data.setUint8(this.write++, b);
    return this;
  };
  util.DataBuffer.prototype.fillWithByte = function(b, n) {
    this.accommodate(n);
    for (var i = 0; i < n; ++i) {
      this.data.setUint8(b);
    }
    return this;
  };
  util.DataBuffer.prototype.putBytes = function(bytes, encoding) {
    if (util.isArrayBufferView(bytes)) {
      var src = new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      var len = src.byteLength - src.byteOffset;
      this.accommodate(len);
      var dst = new Uint8Array(this.data.buffer, this.write);
      dst.set(src);
      this.write += len;
      return this;
    }
    if (util.isArrayBuffer(bytes)) {
      var src = new Uint8Array(bytes);
      this.accommodate(src.byteLength);
      var dst = new Uint8Array(this.data.buffer);
      dst.set(src, this.write);
      this.write += src.byteLength;
      return this;
    }
    if (bytes instanceof util.DataBuffer || typeof bytes === "object" && typeof bytes.read === "number" && typeof bytes.write === "number" && util.isArrayBufferView(bytes.data)) {
      var src = new Uint8Array(bytes.data.byteLength, bytes.read, bytes.length());
      this.accommodate(src.byteLength);
      var dst = new Uint8Array(bytes.data.byteLength, this.write);
      dst.set(src);
      this.write += src.byteLength;
      return this;
    }
    if (bytes instanceof util.ByteStringBuffer) {
      bytes = bytes.data;
      encoding = "binary";
    }
    encoding = encoding || "binary";
    if (typeof bytes === "string") {
      var view;
      if (encoding === "hex") {
        this.accommodate(Math.ceil(bytes.length / 2));
        view = new Uint8Array(this.data.buffer, this.write);
        this.write += util.binary.hex.decode(bytes, view, this.write);
        return this;
      }
      if (encoding === "base64") {
        this.accommodate(Math.ceil(bytes.length / 4) * 3);
        view = new Uint8Array(this.data.buffer, this.write);
        this.write += util.binary.base64.decode(bytes, view, this.write);
        return this;
      }
      if (encoding === "utf8") {
        bytes = util.encodeUtf8(bytes);
        encoding = "binary";
      }
      if (encoding === "binary" || encoding === "raw") {
        this.accommodate(bytes.length);
        view = new Uint8Array(this.data.buffer, this.write);
        this.write += util.binary.raw.decode(view);
        return this;
      }
      if (encoding === "utf16") {
        this.accommodate(bytes.length * 2);
        view = new Uint16Array(this.data.buffer, this.write);
        this.write += util.text.utf16.encode(view);
        return this;
      }
      throw new Error("Invalid encoding: " + encoding);
    }
    throw Error("Invalid parameter: " + bytes);
  };
  util.DataBuffer.prototype.putBuffer = function(buffer) {
    this.putBytes(buffer);
    buffer.clear();
    return this;
  };
  util.DataBuffer.prototype.putString = function(str) {
    return this.putBytes(str, "utf16");
  };
  util.DataBuffer.prototype.putInt16 = function(i) {
    this.accommodate(2);
    this.data.setInt16(this.write, i);
    this.write += 2;
    return this;
  };
  util.DataBuffer.prototype.putInt24 = function(i) {
    this.accommodate(3);
    this.data.setInt16(this.write, i >> 8 & 65535);
    this.data.setInt8(this.write, i >> 16 & 255);
    this.write += 3;
    return this;
  };
  util.DataBuffer.prototype.putInt32 = function(i) {
    this.accommodate(4);
    this.data.setInt32(this.write, i);
    this.write += 4;
    return this;
  };
  util.DataBuffer.prototype.putInt16Le = function(i) {
    this.accommodate(2);
    this.data.setInt16(this.write, i, true);
    this.write += 2;
    return this;
  };
  util.DataBuffer.prototype.putInt24Le = function(i) {
    this.accommodate(3);
    this.data.setInt8(this.write, i >> 16 & 255);
    this.data.setInt16(this.write, i >> 8 & 65535, true);
    this.write += 3;
    return this;
  };
  util.DataBuffer.prototype.putInt32Le = function(i) {
    this.accommodate(4);
    this.data.setInt32(this.write, i, true);
    this.write += 4;
    return this;
  };
  util.DataBuffer.prototype.putInt = function(i, n) {
    _checkBitsParam(n);
    this.accommodate(n / 8);
    do {
      n -= 8;
      this.data.setInt8(this.write++, i >> n & 255);
    } while (n > 0);
    return this;
  };
  util.DataBuffer.prototype.putSignedInt = function(i, n) {
    _checkBitsParam(n);
    this.accommodate(n / 8);
    if (i < 0) {
      i += 2 << n - 1;
    }
    return this.putInt(i, n);
  };
  util.DataBuffer.prototype.getByte = function() {
    return this.data.getInt8(this.read++);
  };
  util.DataBuffer.prototype.getInt16 = function() {
    var rval = this.data.getInt16(this.read);
    this.read += 2;
    return rval;
  };
  util.DataBuffer.prototype.getInt24 = function() {
    var rval = this.data.getInt16(this.read) << 8 ^ this.data.getInt8(this.read + 2);
    this.read += 3;
    return rval;
  };
  util.DataBuffer.prototype.getInt32 = function() {
    var rval = this.data.getInt32(this.read);
    this.read += 4;
    return rval;
  };
  util.DataBuffer.prototype.getInt16Le = function() {
    var rval = this.data.getInt16(this.read, true);
    this.read += 2;
    return rval;
  };
  util.DataBuffer.prototype.getInt24Le = function() {
    var rval = this.data.getInt8(this.read) ^ this.data.getInt16(this.read + 1, true) << 8;
    this.read += 3;
    return rval;
  };
  util.DataBuffer.prototype.getInt32Le = function() {
    var rval = this.data.getInt32(this.read, true);
    this.read += 4;
    return rval;
  };
  util.DataBuffer.prototype.getInt = function(n) {
    _checkBitsParam(n);
    var rval = 0;
    do {
      rval = (rval << 8) + this.data.getInt8(this.read++);
      n -= 8;
    } while (n > 0);
    return rval;
  };
  util.DataBuffer.prototype.getSignedInt = function(n) {
    var x = this.getInt(n);
    var max = 2 << n - 2;
    if (x >= max) {
      x -= max << 1;
    }
    return x;
  };
  util.DataBuffer.prototype.getBytes = function(count) {
    var rval;
    if (count) {
      count = Math.min(this.length(), count);
      rval = this.data.slice(this.read, this.read + count);
      this.read += count;
    } else if (count === 0) {
      rval = "";
    } else {
      rval = this.read === 0 ? this.data : this.data.slice(this.read);
      this.clear();
    }
    return rval;
  };
  util.DataBuffer.prototype.bytes = function(count) {
    return typeof count === "undefined" ? this.data.slice(this.read) : this.data.slice(this.read, this.read + count);
  };
  util.DataBuffer.prototype.at = function(i) {
    return this.data.getUint8(this.read + i);
  };
  util.DataBuffer.prototype.setAt = function(i, b) {
    this.data.setUint8(i, b);
    return this;
  };
  util.DataBuffer.prototype.last = function() {
    return this.data.getUint8(this.write - 1);
  };
  util.DataBuffer.prototype.copy = function() {
    return new util.DataBuffer(this);
  };
  util.DataBuffer.prototype.compact = function() {
    if (this.read > 0) {
      var src = new Uint8Array(this.data.buffer, this.read);
      var dst = new Uint8Array(src.byteLength);
      dst.set(src);
      this.data = new DataView(dst);
      this.write -= this.read;
      this.read = 0;
    }
    return this;
  };
  util.DataBuffer.prototype.clear = function() {
    this.data = new DataView(new ArrayBuffer(0));
    this.read = this.write = 0;
    return this;
  };
  util.DataBuffer.prototype.truncate = function(count) {
    this.write = Math.max(0, this.length() - count);
    this.read = Math.min(this.read, this.write);
    return this;
  };
  util.DataBuffer.prototype.toHex = function() {
    var rval = "";
    for (var i = this.read; i < this.data.byteLength; ++i) {
      var b = this.data.getUint8(i);
      if (b < 16) {
        rval += "0";
      }
      rval += b.toString(16);
    }
    return rval;
  };
  util.DataBuffer.prototype.toString = function(encoding) {
    var view = new Uint8Array(this.data, this.read, this.length());
    encoding = encoding || "utf8";
    if (encoding === "binary" || encoding === "raw") {
      return util.binary.raw.encode(view);
    }
    if (encoding === "hex") {
      return util.binary.hex.encode(view);
    }
    if (encoding === "base64") {
      return util.binary.base64.encode(view);
    }
    if (encoding === "utf8") {
      return util.text.utf8.decode(view);
    }
    if (encoding === "utf16") {
      return util.text.utf16.decode(view);
    }
    throw new Error("Invalid encoding: " + encoding);
  };
  util.createBuffer = function(input, encoding) {
    encoding = encoding || "raw";
    if (input !== void 0 && encoding === "utf8") {
      input = util.encodeUtf8(input);
    }
    return new util.ByteBuffer(input);
  };
  util.fillString = function(c, n) {
    var s = "";
    while (n > 0) {
      if (n & 1) {
        s += c;
      }
      n >>>= 1;
      if (n > 0) {
        c += c;
      }
    }
    return s;
  };
  util.xorBytes = function(s1, s2, n) {
    var s3 = "";
    var b = "";
    var t = "";
    var i = 0;
    var c = 0;
    for (; n > 0; --n, ++i) {
      b = s1.charCodeAt(i) ^ s2.charCodeAt(i);
      if (c >= 10) {
        s3 += t;
        t = "";
        c = 0;
      }
      t += String.fromCharCode(b);
      ++c;
    }
    s3 += t;
    return s3;
  };
  util.hexToBytes = function(hex) {
    var rval = "";
    var i = 0;
    if (hex.length & true) {
      i = 1;
      rval += String.fromCharCode(parseInt(hex[0], 16));
    }
    for (; i < hex.length; i += 2) {
      rval += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return rval;
  };
  util.bytesToHex = function(bytes) {
    return util.createBuffer(bytes).toHex();
  };
  util.int32ToBytes = function(i) {
    return String.fromCharCode(i >> 24 & 255) + String.fromCharCode(i >> 16 & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i & 255);
  };
  var _base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var _base64Idx = [
    62,
    -1,
    -1,
    -1,
    63,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    -1,
    -1,
    -1,
    64,
    -1,
    -1,
    -1,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51
  ];
  var _base58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  util.encode64 = function(input, maxline) {
    var line = "";
    var output = "";
    var chr1, chr2, chr3;
    var i = 0;
    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      line += _base64.charAt(chr1 >> 2);
      line += _base64.charAt((chr1 & 3) << 4 | chr2 >> 4);
      if (isNaN(chr2)) {
        line += "==";
      } else {
        line += _base64.charAt((chr2 & 15) << 2 | chr3 >> 6);
        line += isNaN(chr3) ? "=" : _base64.charAt(chr3 & 63);
      }
      if (maxline && line.length > maxline) {
        output += line.substr(0, maxline) + "\r\n";
        line = line.substr(maxline);
      }
    }
    output += line;
    return output;
  };
  util.decode64 = function(input) {
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    var output = "";
    var enc1, enc2, enc3, enc4;
    var i = 0;
    while (i < input.length) {
      enc1 = _base64Idx[input.charCodeAt(i++) - 43];
      enc2 = _base64Idx[input.charCodeAt(i++) - 43];
      enc3 = _base64Idx[input.charCodeAt(i++) - 43];
      enc4 = _base64Idx[input.charCodeAt(i++) - 43];
      output += String.fromCharCode(enc1 << 2 | enc2 >> 4);
      if (enc3 !== 64) {
        output += String.fromCharCode((enc2 & 15) << 4 | enc3 >> 2);
        if (enc4 !== 64) {
          output += String.fromCharCode((enc3 & 3) << 6 | enc4);
        }
      }
    }
    return output;
  };
  util.encodeUtf8 = function(str) {
    return unescape(encodeURIComponent(str));
  };
  util.decodeUtf8 = function(str) {
    return decodeURIComponent(escape(str));
  };
  util.binary = {
    raw: {},
    hex: {},
    base64: {},
    base58: {},
    baseN: {
      encode: baseN.encode,
      decode: baseN.decode
    }
  };
  util.binary.raw.encode = function(bytes) {
    return String.fromCharCode.apply(null, bytes);
  };
  util.binary.raw.decode = function(str, output, offset) {
    var out = output;
    if (!out) {
      out = new Uint8Array(str.length);
    }
    offset = offset || 0;
    var j = offset;
    for (var i = 0; i < str.length; ++i) {
      out[j++] = str.charCodeAt(i);
    }
    return output ? j - offset : out;
  };
  util.binary.hex.encode = util.bytesToHex;
  util.binary.hex.decode = function(hex, output, offset) {
    var out = output;
    if (!out) {
      out = new Uint8Array(Math.ceil(hex.length / 2));
    }
    offset = offset || 0;
    var i = 0, j = offset;
    if (hex.length & 1) {
      i = 1;
      out[j++] = parseInt(hex[0], 16);
    }
    for (; i < hex.length; i += 2) {
      out[j++] = parseInt(hex.substr(i, 2), 16);
    }
    return output ? j - offset : out;
  };
  util.binary.base64.encode = function(input, maxline) {
    var line = "";
    var output = "";
    var chr1, chr2, chr3;
    var i = 0;
    while (i < input.byteLength) {
      chr1 = input[i++];
      chr2 = input[i++];
      chr3 = input[i++];
      line += _base64.charAt(chr1 >> 2);
      line += _base64.charAt((chr1 & 3) << 4 | chr2 >> 4);
      if (isNaN(chr2)) {
        line += "==";
      } else {
        line += _base64.charAt((chr2 & 15) << 2 | chr3 >> 6);
        line += isNaN(chr3) ? "=" : _base64.charAt(chr3 & 63);
      }
      if (maxline && line.length > maxline) {
        output += line.substr(0, maxline) + "\r\n";
        line = line.substr(maxline);
      }
    }
    output += line;
    return output;
  };
  util.binary.base64.decode = function(input, output, offset) {
    var out = output;
    if (!out) {
      out = new Uint8Array(Math.ceil(input.length / 4) * 3);
    }
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    offset = offset || 0;
    var enc1, enc2, enc3, enc4;
    var i = 0, j = offset;
    while (i < input.length) {
      enc1 = _base64Idx[input.charCodeAt(i++) - 43];
      enc2 = _base64Idx[input.charCodeAt(i++) - 43];
      enc3 = _base64Idx[input.charCodeAt(i++) - 43];
      enc4 = _base64Idx[input.charCodeAt(i++) - 43];
      out[j++] = enc1 << 2 | enc2 >> 4;
      if (enc3 !== 64) {
        out[j++] = (enc2 & 15) << 4 | enc3 >> 2;
        if (enc4 !== 64) {
          out[j++] = (enc3 & 3) << 6 | enc4;
        }
      }
    }
    return output ? j - offset : out.subarray(0, j);
  };
  util.binary.base58.encode = function(input, maxline) {
    return util.binary.baseN.encode(input, _base58, maxline);
  };
  util.binary.base58.decode = function(input, maxline) {
    return util.binary.baseN.decode(input, _base58, maxline);
  };
  util.text = {
    utf8: {},
    utf16: {}
  };
  util.text.utf8.encode = function(str, output, offset) {
    str = util.encodeUtf8(str);
    var out = output;
    if (!out) {
      out = new Uint8Array(str.length);
    }
    offset = offset || 0;
    var j = offset;
    for (var i = 0; i < str.length; ++i) {
      out[j++] = str.charCodeAt(i);
    }
    return output ? j - offset : out;
  };
  util.text.utf8.decode = function(bytes) {
    return util.decodeUtf8(String.fromCharCode.apply(null, bytes));
  };
  util.text.utf16.encode = function(str, output, offset) {
    var out = output;
    if (!out) {
      out = new Uint8Array(str.length * 2);
    }
    var view = new Uint16Array(out.buffer);
    offset = offset || 0;
    var j = offset;
    var k = offset;
    for (var i = 0; i < str.length; ++i) {
      view[k++] = str.charCodeAt(i);
      j += 2;
    }
    return output ? j - offset : out;
  };
  util.text.utf16.decode = function(bytes) {
    return String.fromCharCode.apply(null, new Uint16Array(bytes.buffer));
  };
  util.deflate = function(api, bytes, raw) {
    bytes = util.decode64(api.deflate(util.encode64(bytes)).rval);
    if (raw) {
      var start = 2;
      var flg = bytes.charCodeAt(1);
      if (flg & 32) {
        start = 6;
      }
      bytes = bytes.substring(start, bytes.length - 4);
    }
    return bytes;
  };
  util.inflate = function(api, bytes, raw) {
    var rval = api.inflate(util.encode64(bytes)).rval;
    return rval === null ? null : util.decode64(rval);
  };
  var _setStorageObject = function(api, id, obj) {
    if (!api) {
      throw new Error("WebStorage not available.");
    }
    var rval;
    if (obj === null) {
      rval = api.removeItem(id);
    } else {
      obj = util.encode64(JSON.stringify(obj));
      rval = api.setItem(id, obj);
    }
    if (typeof rval !== "undefined" && rval.rval !== true) {
      var error = new Error(rval.error.message);
      error.id = rval.error.id;
      error.name = rval.error.name;
      throw error;
    }
  };
  var _getStorageObject = function(api, id) {
    if (!api) {
      throw new Error("WebStorage not available.");
    }
    var rval = api.getItem(id);
    if (api.init) {
      if (rval.rval === null) {
        if (rval.error) {
          var error = new Error(rval.error.message);
          error.id = rval.error.id;
          error.name = rval.error.name;
          throw error;
        }
        rval = null;
      } else {
        rval = rval.rval;
      }
    }
    if (rval !== null) {
      rval = JSON.parse(util.decode64(rval));
    }
    return rval;
  };
  var _setItem = function(api, id, key, data) {
    var obj = _getStorageObject(api, id);
    if (obj === null) {
      obj = {};
    }
    obj[key] = data;
    _setStorageObject(api, id, obj);
  };
  var _getItem = function(api, id, key) {
    var rval = _getStorageObject(api, id);
    if (rval !== null) {
      rval = key in rval ? rval[key] : null;
    }
    return rval;
  };
  var _removeItem = function(api, id, key) {
    var obj = _getStorageObject(api, id);
    if (obj !== null && key in obj) {
      delete obj[key];
      var empty = true;
      for (var prop in obj) {
        empty = false;
        break;
      }
      if (empty) {
        obj = null;
      }
      _setStorageObject(api, id, obj);
    }
  };
  var _clearItems = function(api, id) {
    _setStorageObject(api, id, null);
  };
  var _callStorageFunction = function(func, args, location) {
    var rval = null;
    if (typeof location === "undefined") {
      location = ["web", "flash"];
    }
    var type;
    var done = false;
    var exception = null;
    for (var idx in location) {
      type = location[idx];
      try {
        if (type === "flash" || type === "both") {
          if (args[0] === null) {
            throw new Error("Flash local storage not available.");
          }
          rval = func.apply(this, args);
          done = type === "flash";
        }
        if (type === "web" || type === "both") {
          args[0] = localStorage;
          rval = func.apply(this, args);
          done = true;
        }
      } catch (ex) {
        exception = ex;
      }
      if (done) {
        break;
      }
    }
    if (!done) {
      throw exception;
    }
    return rval;
  };
  util.setItem = function(api, id, key, data, location) {
    _callStorageFunction(_setItem, arguments, location);
  };
  util.getItem = function(api, id, key, location) {
    return _callStorageFunction(_getItem, arguments, location);
  };
  util.removeItem = function(api, id, key, location) {
    _callStorageFunction(_removeItem, arguments, location);
  };
  util.clearItems = function(api, id, location) {
    _callStorageFunction(_clearItems, arguments, location);
  };
  util.parseUrl = function(str) {
    var regex = /^(https?):\/\/([^:&^\/]*):?(\d*)(.*)$/g;
    regex.lastIndex = 0;
    var m = regex.exec(str);
    var url = m === null ? null : {
      full: str,
      scheme: m[1],
      host: m[2],
      port: m[3],
      path: m[4]
    };
    if (url) {
      url.fullHost = url.host;
      if (url.port) {
        if (url.port !== 80 && url.scheme === "http") {
          url.fullHost += ":" + url.port;
        } else if (url.port !== 443 && url.scheme === "https") {
          url.fullHost += ":" + url.port;
        }
      } else if (url.scheme === "http") {
        url.port = 80;
      } else if (url.scheme === "https") {
        url.port = 443;
      }
      url.full = url.scheme + "://" + url.fullHost;
    }
    return url;
  };
  var _queryVariables = null;
  util.getQueryVariables = function(query) {
    var parse = function(q) {
      var rval2 = {};
      var kvpairs = q.split("&");
      for (var i = 0; i < kvpairs.length; i++) {
        var pos = kvpairs[i].indexOf("=");
        var key;
        var val;
        if (pos > 0) {
          key = kvpairs[i].substring(0, pos);
          val = kvpairs[i].substring(pos + 1);
        } else {
          key = kvpairs[i];
          val = null;
        }
        if (!(key in rval2)) {
          rval2[key] = [];
        }
        if (!(key in Object.prototype) && val !== null) {
          rval2[key].push(unescape(val));
        }
      }
      return rval2;
    };
    var rval;
    if (typeof query === "undefined") {
      if (_queryVariables === null) {
        if (typeof window !== "undefined" && window.location && window.location.search) {
          _queryVariables = parse(window.location.search.substring(1));
        } else {
          _queryVariables = {};
        }
      }
      rval = _queryVariables;
    } else {
      rval = parse(query);
    }
    return rval;
  };
  util.parseFragment = function(fragment) {
    var fp = fragment;
    var fq = "";
    var pos = fragment.indexOf("?");
    if (pos > 0) {
      fp = fragment.substring(0, pos);
      fq = fragment.substring(pos + 1);
    }
    var path3 = fp.split("/");
    if (path3.length > 0 && path3[0] === "") {
      path3.shift();
    }
    var query = fq === "" ? {} : util.getQueryVariables(fq);
    return {
      pathString: fp,
      queryString: fq,
      path: path3,
      query
    };
  };
  util.makeRequest = function(reqString) {
    var frag = util.parseFragment(reqString);
    var req = {
      path: frag.pathString,
      query: frag.queryString,
      getPath: function(i) {
        return typeof i === "undefined" ? frag.path : frag.path[i];
      },
      getQuery: function(k, i) {
        var rval;
        if (typeof k === "undefined") {
          rval = frag.query;
        } else {
          rval = frag.query[k];
          if (rval && typeof i !== "undefined") {
            rval = rval[i];
          }
        }
        return rval;
      },
      getQueryLast: function(k, _default) {
        var rval;
        var vals = req.getQuery(k);
        if (vals) {
          rval = vals[vals.length - 1];
        } else {
          rval = _default;
        }
        return rval;
      }
    };
    return req;
  };
  util.makeLink = function(path3, query, fragment) {
    path3 = jQuery.isArray(path3) ? path3.join("/") : path3;
    var qstr = jQuery.param(query || {});
    fragment = fragment || "";
    return path3 + (qstr.length > 0 ? "?" + qstr : "") + (fragment.length > 0 ? "#" + fragment : "");
  };
  util.isEmpty = function(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  };
  util.format = function(format) {
    var re = /%./g;
    var match;
    var part;
    var argi = 0;
    var parts = [];
    var last = 0;
    while (match = re.exec(format)) {
      part = format.substring(last, re.lastIndex - 2);
      if (part.length > 0) {
        parts.push(part);
      }
      last = re.lastIndex;
      var code = match[0][1];
      switch (code) {
        case "s":
        case "o":
          if (argi < arguments.length) {
            parts.push(arguments[argi++ + 1]);
          } else {
            parts.push("<?>");
          }
          break;
        case "%":
          parts.push("%");
          break;
        default:
          parts.push("<%" + code + "?>");
      }
    }
    parts.push(format.substring(last));
    return parts.join("");
  };
  util.formatNumber = function(number, decimals, dec_point, thousands_sep) {
    var n = number, c = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals;
    var d = dec_point === void 0 ? "," : dec_point;
    var t = thousands_sep === void 0 ? "." : thousands_sep, s = n < 0 ? "-" : "";
    var i = parseInt(n = Math.abs(+n || 0).toFixed(c), 10) + "";
    var j = i.length > 3 ? i.length % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
  };
  util.formatSize = function(size) {
    if (size >= 1073741824) {
      size = util.formatNumber(size / 1073741824, 2, ".", "") + " GiB";
    } else if (size >= 1048576) {
      size = util.formatNumber(size / 1048576, 2, ".", "") + " MiB";
    } else if (size >= 1024) {
      size = util.formatNumber(size / 1024, 0) + " KiB";
    } else {
      size = util.formatNumber(size, 0) + " bytes";
    }
    return size;
  };
  util.bytesFromIP = function(ip) {
    if (ip.indexOf(".") !== -1) {
      return util.bytesFromIPv4(ip);
    }
    if (ip.indexOf(":") !== -1) {
      return util.bytesFromIPv6(ip);
    }
    return null;
  };
  util.bytesFromIPv4 = function(ip) {
    ip = ip.split(".");
    if (ip.length !== 4) {
      return null;
    }
    var b = util.createBuffer();
    for (var i = 0; i < ip.length; ++i) {
      var num = parseInt(ip[i], 10);
      if (isNaN(num)) {
        return null;
      }
      b.putByte(num);
    }
    return b.getBytes();
  };
  util.bytesFromIPv6 = function(ip) {
    var blanks = 0;
    ip = ip.split(":").filter(function(e) {
      if (e.length === 0)
        ++blanks;
      return true;
    });
    var zeros = (8 - ip.length + blanks) * 2;
    var b = util.createBuffer();
    for (var i = 0; i < 8; ++i) {
      if (!ip[i] || ip[i].length === 0) {
        b.fillWithByte(0, zeros);
        zeros = 0;
        continue;
      }
      var bytes = util.hexToBytes(ip[i]);
      if (bytes.length < 2) {
        b.putByte(0);
      }
      b.putBytes(bytes);
    }
    return b.getBytes();
  };
  util.bytesToIP = function(bytes) {
    if (bytes.length === 4) {
      return util.bytesToIPv4(bytes);
    }
    if (bytes.length === 16) {
      return util.bytesToIPv6(bytes);
    }
    return null;
  };
  util.bytesToIPv4 = function(bytes) {
    if (bytes.length !== 4) {
      return null;
    }
    var ip = [];
    for (var i = 0; i < bytes.length; ++i) {
      ip.push(bytes.charCodeAt(i));
    }
    return ip.join(".");
  };
  util.bytesToIPv6 = function(bytes) {
    if (bytes.length !== 16) {
      return null;
    }
    var ip = [];
    var zeroGroups = [];
    var zeroMaxGroup = 0;
    for (var i = 0; i < bytes.length; i += 2) {
      var hex = util.bytesToHex(bytes[i] + bytes[i + 1]);
      while (hex[0] === "0" && hex !== "0") {
        hex = hex.substr(1);
      }
      if (hex === "0") {
        var last = zeroGroups[zeroGroups.length - 1];
        var idx = ip.length;
        if (!last || idx !== last.end + 1) {
          zeroGroups.push({start: idx, end: idx});
        } else {
          last.end = idx;
          if (last.end - last.start > zeroGroups[zeroMaxGroup].end - zeroGroups[zeroMaxGroup].start) {
            zeroMaxGroup = zeroGroups.length - 1;
          }
        }
      }
      ip.push(hex);
    }
    if (zeroGroups.length > 0) {
      var group = zeroGroups[zeroMaxGroup];
      if (group.end - group.start > 0) {
        ip.splice(group.start, group.end - group.start + 1, "");
        if (group.start === 0) {
          ip.unshift("");
        }
        if (group.end === 7) {
          ip.push("");
        }
      }
    }
    return ip.join(":");
  };
  util.estimateCores = function(options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    options = options || {};
    if ("cores" in util && !options.update) {
      return callback(null, util.cores);
    }
    if (typeof navigator !== "undefined" && "hardwareConcurrency" in navigator && navigator.hardwareConcurrency > 0) {
      util.cores = navigator.hardwareConcurrency;
      return callback(null, util.cores);
    }
    if (typeof Worker === "undefined") {
      util.cores = 1;
      return callback(null, util.cores);
    }
    if (typeof Blob === "undefined") {
      util.cores = 2;
      return callback(null, util.cores);
    }
    var blobUrl = URL.createObjectURL(new Blob([
      "(",
      function() {
        self.addEventListener("message", function(e) {
          var st = Date.now();
          var et = st + 4;
          while (Date.now() < et)
            ;
          self.postMessage({st, et});
        });
      }.toString(),
      ")()"
    ], {type: "application/javascript"}));
    sample([], 5, 16);
    function sample(max, samples, numWorkers) {
      if (samples === 0) {
        var avg = Math.floor(max.reduce(function(avg2, x) {
          return avg2 + x;
        }, 0) / max.length);
        util.cores = Math.max(1, avg);
        URL.revokeObjectURL(blobUrl);
        return callback(null, util.cores);
      }
      map(numWorkers, function(err, results) {
        max.push(reduce(numWorkers, results));
        sample(max, samples - 1, numWorkers);
      });
    }
    function map(numWorkers, callback2) {
      var workers = [];
      var results = [];
      for (var i = 0; i < numWorkers; ++i) {
        var worker = new Worker(blobUrl);
        worker.addEventListener("message", function(e) {
          results.push(e.data);
          if (results.length === numWorkers) {
            for (var i2 = 0; i2 < numWorkers; ++i2) {
              workers[i2].terminate();
            }
            callback2(null, results);
          }
        });
        workers.push(worker);
      }
      for (var i = 0; i < numWorkers; ++i) {
        workers[i].postMessage(i);
      }
    }
    function reduce(numWorkers, results) {
      var overlaps = [];
      for (var n = 0; n < numWorkers; ++n) {
        var r1 = results[n];
        var overlap = overlaps[n] = [];
        for (var i = 0; i < numWorkers; ++i) {
          if (n === i) {
            continue;
          }
          var r2 = results[i];
          if (r1.st > r2.st && r1.st < r2.et || r2.st > r1.st && r2.st < r1.et) {
            overlap.push(i);
          }
        }
      }
      return overlaps.reduce(function(max, overlap2) {
        return Math.max(max, overlap2.length);
      }, 0);
    }
  };
});

// node_modules/node-forge/lib/cipher.js
var require_cipher = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_util();
  module2.exports = forge2.cipher = forge2.cipher || {};
  forge2.cipher.algorithms = forge2.cipher.algorithms || {};
  forge2.cipher.createCipher = function(algorithm, key) {
    var api = algorithm;
    if (typeof api === "string") {
      api = forge2.cipher.getAlgorithm(api);
      if (api) {
        api = api();
      }
    }
    if (!api) {
      throw new Error("Unsupported algorithm: " + algorithm);
    }
    return new forge2.cipher.BlockCipher({
      algorithm: api,
      key,
      decrypt: false
    });
  };
  forge2.cipher.createDecipher = function(algorithm, key) {
    var api = algorithm;
    if (typeof api === "string") {
      api = forge2.cipher.getAlgorithm(api);
      if (api) {
        api = api();
      }
    }
    if (!api) {
      throw new Error("Unsupported algorithm: " + algorithm);
    }
    return new forge2.cipher.BlockCipher({
      algorithm: api,
      key,
      decrypt: true
    });
  };
  forge2.cipher.registerAlgorithm = function(name, algorithm) {
    name = name.toUpperCase();
    forge2.cipher.algorithms[name] = algorithm;
  };
  forge2.cipher.getAlgorithm = function(name) {
    name = name.toUpperCase();
    if (name in forge2.cipher.algorithms) {
      return forge2.cipher.algorithms[name];
    }
    return null;
  };
  var BlockCipher = forge2.cipher.BlockCipher = function(options) {
    this.algorithm = options.algorithm;
    this.mode = this.algorithm.mode;
    this.blockSize = this.mode.blockSize;
    this._finish = false;
    this._input = null;
    this.output = null;
    this._op = options.decrypt ? this.mode.decrypt : this.mode.encrypt;
    this._decrypt = options.decrypt;
    this.algorithm.initialize(options);
  };
  BlockCipher.prototype.start = function(options) {
    options = options || {};
    var opts = {};
    for (var key in options) {
      opts[key] = options[key];
    }
    opts.decrypt = this._decrypt;
    this._finish = false;
    this._input = forge2.util.createBuffer();
    this.output = options.output || forge2.util.createBuffer();
    this.mode.start(opts);
  };
  BlockCipher.prototype.update = function(input) {
    if (input) {
      this._input.putBuffer(input);
    }
    while (!this._op.call(this.mode, this._input, this.output, this._finish) && !this._finish) {
    }
    this._input.compact();
  };
  BlockCipher.prototype.finish = function(pad) {
    if (pad && (this.mode.name === "ECB" || this.mode.name === "CBC")) {
      this.mode.pad = function(input) {
        return pad(this.blockSize, input, false);
      };
      this.mode.unpad = function(output) {
        return pad(this.blockSize, output, true);
      };
    }
    var options = {};
    options.decrypt = this._decrypt;
    options.overflow = this._input.length() % this.blockSize;
    if (!this._decrypt && this.mode.pad) {
      if (!this.mode.pad(this._input, options)) {
        return false;
      }
    }
    this._finish = true;
    this.update();
    if (this._decrypt && this.mode.unpad) {
      if (!this.mode.unpad(this.output, options)) {
        return false;
      }
    }
    if (this.mode.afterFinish) {
      if (!this.mode.afterFinish(this.output, options)) {
        return false;
      }
    }
    return true;
  };
});

// node_modules/node-forge/lib/cipherModes.js
var require_cipherModes = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_util();
  forge2.cipher = forge2.cipher || {};
  var modes = module2.exports = forge2.cipher.modes = forge2.cipher.modes || {};
  modes.ecb = function(options) {
    options = options || {};
    this.name = "ECB";
    this.cipher = options.cipher;
    this.blockSize = options.blockSize || 16;
    this._ints = this.blockSize / 4;
    this._inBlock = new Array(this._ints);
    this._outBlock = new Array(this._ints);
  };
  modes.ecb.prototype.start = function(options) {
  };
  modes.ecb.prototype.encrypt = function(input, output, finish) {
    if (input.length() < this.blockSize && !(finish && input.length() > 0)) {
      return true;
    }
    for (var i = 0; i < this._ints; ++i) {
      this._inBlock[i] = input.getInt32();
    }
    this.cipher.encrypt(this._inBlock, this._outBlock);
    for (var i = 0; i < this._ints; ++i) {
      output.putInt32(this._outBlock[i]);
    }
  };
  modes.ecb.prototype.decrypt = function(input, output, finish) {
    if (input.length() < this.blockSize && !(finish && input.length() > 0)) {
      return true;
    }
    for (var i = 0; i < this._ints; ++i) {
      this._inBlock[i] = input.getInt32();
    }
    this.cipher.decrypt(this._inBlock, this._outBlock);
    for (var i = 0; i < this._ints; ++i) {
      output.putInt32(this._outBlock[i]);
    }
  };
  modes.ecb.prototype.pad = function(input, options) {
    var padding = input.length() === this.blockSize ? this.blockSize : this.blockSize - input.length();
    input.fillWithByte(padding, padding);
    return true;
  };
  modes.ecb.prototype.unpad = function(output, options) {
    if (options.overflow > 0) {
      return false;
    }
    var len = output.length();
    var count = output.at(len - 1);
    if (count > this.blockSize << 2) {
      return false;
    }
    output.truncate(count);
    return true;
  };
  modes.cbc = function(options) {
    options = options || {};
    this.name = "CBC";
    this.cipher = options.cipher;
    this.blockSize = options.blockSize || 16;
    this._ints = this.blockSize / 4;
    this._inBlock = new Array(this._ints);
    this._outBlock = new Array(this._ints);
  };
  modes.cbc.prototype.start = function(options) {
    if (options.iv === null) {
      if (!this._prev) {
        throw new Error("Invalid IV parameter.");
      }
      this._iv = this._prev.slice(0);
    } else if (!("iv" in options)) {
      throw new Error("Invalid IV parameter.");
    } else {
      this._iv = transformIV(options.iv, this.blockSize);
      this._prev = this._iv.slice(0);
    }
  };
  modes.cbc.prototype.encrypt = function(input, output, finish) {
    if (input.length() < this.blockSize && !(finish && input.length() > 0)) {
      return true;
    }
    for (var i = 0; i < this._ints; ++i) {
      this._inBlock[i] = this._prev[i] ^ input.getInt32();
    }
    this.cipher.encrypt(this._inBlock, this._outBlock);
    for (var i = 0; i < this._ints; ++i) {
      output.putInt32(this._outBlock[i]);
    }
    this._prev = this._outBlock;
  };
  modes.cbc.prototype.decrypt = function(input, output, finish) {
    if (input.length() < this.blockSize && !(finish && input.length() > 0)) {
      return true;
    }
    for (var i = 0; i < this._ints; ++i) {
      this._inBlock[i] = input.getInt32();
    }
    this.cipher.decrypt(this._inBlock, this._outBlock);
    for (var i = 0; i < this._ints; ++i) {
      output.putInt32(this._prev[i] ^ this._outBlock[i]);
    }
    this._prev = this._inBlock.slice(0);
  };
  modes.cbc.prototype.pad = function(input, options) {
    var padding = input.length() === this.blockSize ? this.blockSize : this.blockSize - input.length();
    input.fillWithByte(padding, padding);
    return true;
  };
  modes.cbc.prototype.unpad = function(output, options) {
    if (options.overflow > 0) {
      return false;
    }
    var len = output.length();
    var count = output.at(len - 1);
    if (count > this.blockSize << 2) {
      return false;
    }
    output.truncate(count);
    return true;
  };
  modes.cfb = function(options) {
    options = options || {};
    this.name = "CFB";
    this.cipher = options.cipher;
    this.blockSize = options.blockSize || 16;
    this._ints = this.blockSize / 4;
    this._inBlock = null;
    this._outBlock = new Array(this._ints);
    this._partialBlock = new Array(this._ints);
    this._partialOutput = forge2.util.createBuffer();
    this._partialBytes = 0;
  };
  modes.cfb.prototype.start = function(options) {
    if (!("iv" in options)) {
      throw new Error("Invalid IV parameter.");
    }
    this._iv = transformIV(options.iv, this.blockSize);
    this._inBlock = this._iv.slice(0);
    this._partialBytes = 0;
  };
  modes.cfb.prototype.encrypt = function(input, output, finish) {
    var inputLength = input.length();
    if (inputLength === 0) {
      return true;
    }
    this.cipher.encrypt(this._inBlock, this._outBlock);
    if (this._partialBytes === 0 && inputLength >= this.blockSize) {
      for (var i = 0; i < this._ints; ++i) {
        this._inBlock[i] = input.getInt32() ^ this._outBlock[i];
        output.putInt32(this._inBlock[i]);
      }
      return;
    }
    var partialBytes = (this.blockSize - inputLength) % this.blockSize;
    if (partialBytes > 0) {
      partialBytes = this.blockSize - partialBytes;
    }
    this._partialOutput.clear();
    for (var i = 0; i < this._ints; ++i) {
      this._partialBlock[i] = input.getInt32() ^ this._outBlock[i];
      this._partialOutput.putInt32(this._partialBlock[i]);
    }
    if (partialBytes > 0) {
      input.read -= this.blockSize;
    } else {
      for (var i = 0; i < this._ints; ++i) {
        this._inBlock[i] = this._partialBlock[i];
      }
    }
    if (this._partialBytes > 0) {
      this._partialOutput.getBytes(this._partialBytes);
    }
    if (partialBytes > 0 && !finish) {
      output.putBytes(this._partialOutput.getBytes(partialBytes - this._partialBytes));
      this._partialBytes = partialBytes;
      return true;
    }
    output.putBytes(this._partialOutput.getBytes(inputLength - this._partialBytes));
    this._partialBytes = 0;
  };
  modes.cfb.prototype.decrypt = function(input, output, finish) {
    var inputLength = input.length();
    if (inputLength === 0) {
      return true;
    }
    this.cipher.encrypt(this._inBlock, this._outBlock);
    if (this._partialBytes === 0 && inputLength >= this.blockSize) {
      for (var i = 0; i < this._ints; ++i) {
        this._inBlock[i] = input.getInt32();
        output.putInt32(this._inBlock[i] ^ this._outBlock[i]);
      }
      return;
    }
    var partialBytes = (this.blockSize - inputLength) % this.blockSize;
    if (partialBytes > 0) {
      partialBytes = this.blockSize - partialBytes;
    }
    this._partialOutput.clear();
    for (var i = 0; i < this._ints; ++i) {
      this._partialBlock[i] = input.getInt32();
      this._partialOutput.putInt32(this._partialBlock[i] ^ this._outBlock[i]);
    }
    if (partialBytes > 0) {
      input.read -= this.blockSize;
    } else {
      for (var i = 0; i < this._ints; ++i) {
        this._inBlock[i] = this._partialBlock[i];
      }
    }
    if (this._partialBytes > 0) {
      this._partialOutput.getBytes(this._partialBytes);
    }
    if (partialBytes > 0 && !finish) {
      output.putBytes(this._partialOutput.getBytes(partialBytes - this._partialBytes));
      this._partialBytes = partialBytes;
      return true;
    }
    output.putBytes(this._partialOutput.getBytes(inputLength - this._partialBytes));
    this._partialBytes = 0;
  };
  modes.ofb = function(options) {
    options = options || {};
    this.name = "OFB";
    this.cipher = options.cipher;
    this.blockSize = options.blockSize || 16;
    this._ints = this.blockSize / 4;
    this._inBlock = null;
    this._outBlock = new Array(this._ints);
    this._partialOutput = forge2.util.createBuffer();
    this._partialBytes = 0;
  };
  modes.ofb.prototype.start = function(options) {
    if (!("iv" in options)) {
      throw new Error("Invalid IV parameter.");
    }
    this._iv = transformIV(options.iv, this.blockSize);
    this._inBlock = this._iv.slice(0);
    this._partialBytes = 0;
  };
  modes.ofb.prototype.encrypt = function(input, output, finish) {
    var inputLength = input.length();
    if (input.length() === 0) {
      return true;
    }
    this.cipher.encrypt(this._inBlock, this._outBlock);
    if (this._partialBytes === 0 && inputLength >= this.blockSize) {
      for (var i = 0; i < this._ints; ++i) {
        output.putInt32(input.getInt32() ^ this._outBlock[i]);
        this._inBlock[i] = this._outBlock[i];
      }
      return;
    }
    var partialBytes = (this.blockSize - inputLength) % this.blockSize;
    if (partialBytes > 0) {
      partialBytes = this.blockSize - partialBytes;
    }
    this._partialOutput.clear();
    for (var i = 0; i < this._ints; ++i) {
      this._partialOutput.putInt32(input.getInt32() ^ this._outBlock[i]);
    }
    if (partialBytes > 0) {
      input.read -= this.blockSize;
    } else {
      for (var i = 0; i < this._ints; ++i) {
        this._inBlock[i] = this._outBlock[i];
      }
    }
    if (this._partialBytes > 0) {
      this._partialOutput.getBytes(this._partialBytes);
    }
    if (partialBytes > 0 && !finish) {
      output.putBytes(this._partialOutput.getBytes(partialBytes - this._partialBytes));
      this._partialBytes = partialBytes;
      return true;
    }
    output.putBytes(this._partialOutput.getBytes(inputLength - this._partialBytes));
    this._partialBytes = 0;
  };
  modes.ofb.prototype.decrypt = modes.ofb.prototype.encrypt;
  modes.ctr = function(options) {
    options = options || {};
    this.name = "CTR";
    this.cipher = options.cipher;
    this.blockSize = options.blockSize || 16;
    this._ints = this.blockSize / 4;
    this._inBlock = null;
    this._outBlock = new Array(this._ints);
    this._partialOutput = forge2.util.createBuffer();
    this._partialBytes = 0;
  };
  modes.ctr.prototype.start = function(options) {
    if (!("iv" in options)) {
      throw new Error("Invalid IV parameter.");
    }
    this._iv = transformIV(options.iv, this.blockSize);
    this._inBlock = this._iv.slice(0);
    this._partialBytes = 0;
  };
  modes.ctr.prototype.encrypt = function(input, output, finish) {
    var inputLength = input.length();
    if (inputLength === 0) {
      return true;
    }
    this.cipher.encrypt(this._inBlock, this._outBlock);
    if (this._partialBytes === 0 && inputLength >= this.blockSize) {
      for (var i = 0; i < this._ints; ++i) {
        output.putInt32(input.getInt32() ^ this._outBlock[i]);
      }
    } else {
      var partialBytes = (this.blockSize - inputLength) % this.blockSize;
      if (partialBytes > 0) {
        partialBytes = this.blockSize - partialBytes;
      }
      this._partialOutput.clear();
      for (var i = 0; i < this._ints; ++i) {
        this._partialOutput.putInt32(input.getInt32() ^ this._outBlock[i]);
      }
      if (partialBytes > 0) {
        input.read -= this.blockSize;
      }
      if (this._partialBytes > 0) {
        this._partialOutput.getBytes(this._partialBytes);
      }
      if (partialBytes > 0 && !finish) {
        output.putBytes(this._partialOutput.getBytes(partialBytes - this._partialBytes));
        this._partialBytes = partialBytes;
        return true;
      }
      output.putBytes(this._partialOutput.getBytes(inputLength - this._partialBytes));
      this._partialBytes = 0;
    }
    inc32(this._inBlock);
  };
  modes.ctr.prototype.decrypt = modes.ctr.prototype.encrypt;
  modes.gcm = function(options) {
    options = options || {};
    this.name = "GCM";
    this.cipher = options.cipher;
    this.blockSize = options.blockSize || 16;
    this._ints = this.blockSize / 4;
    this._inBlock = new Array(this._ints);
    this._outBlock = new Array(this._ints);
    this._partialOutput = forge2.util.createBuffer();
    this._partialBytes = 0;
    this._R = 3774873600;
  };
  modes.gcm.prototype.start = function(options) {
    if (!("iv" in options)) {
      throw new Error("Invalid IV parameter.");
    }
    var iv = forge2.util.createBuffer(options.iv);
    this._cipherLength = 0;
    var additionalData;
    if ("additionalData" in options) {
      additionalData = forge2.util.createBuffer(options.additionalData);
    } else {
      additionalData = forge2.util.createBuffer();
    }
    if ("tagLength" in options) {
      this._tagLength = options.tagLength;
    } else {
      this._tagLength = 128;
    }
    this._tag = null;
    if (options.decrypt) {
      this._tag = forge2.util.createBuffer(options.tag).getBytes();
      if (this._tag.length !== this._tagLength / 8) {
        throw new Error("Authentication tag does not match tag length.");
      }
    }
    this._hashBlock = new Array(this._ints);
    this.tag = null;
    this._hashSubkey = new Array(this._ints);
    this.cipher.encrypt([0, 0, 0, 0], this._hashSubkey);
    this.componentBits = 4;
    this._m = this.generateHashTable(this._hashSubkey, this.componentBits);
    var ivLength = iv.length();
    if (ivLength === 12) {
      this._j0 = [iv.getInt32(), iv.getInt32(), iv.getInt32(), 1];
    } else {
      this._j0 = [0, 0, 0, 0];
      while (iv.length() > 0) {
        this._j0 = this.ghash(this._hashSubkey, this._j0, [iv.getInt32(), iv.getInt32(), iv.getInt32(), iv.getInt32()]);
      }
      this._j0 = this.ghash(this._hashSubkey, this._j0, [0, 0].concat(from64To32(ivLength * 8)));
    }
    this._inBlock = this._j0.slice(0);
    inc32(this._inBlock);
    this._partialBytes = 0;
    additionalData = forge2.util.createBuffer(additionalData);
    this._aDataLength = from64To32(additionalData.length() * 8);
    var overflow = additionalData.length() % this.blockSize;
    if (overflow) {
      additionalData.fillWithByte(0, this.blockSize - overflow);
    }
    this._s = [0, 0, 0, 0];
    while (additionalData.length() > 0) {
      this._s = this.ghash(this._hashSubkey, this._s, [
        additionalData.getInt32(),
        additionalData.getInt32(),
        additionalData.getInt32(),
        additionalData.getInt32()
      ]);
    }
  };
  modes.gcm.prototype.encrypt = function(input, output, finish) {
    var inputLength = input.length();
    if (inputLength === 0) {
      return true;
    }
    this.cipher.encrypt(this._inBlock, this._outBlock);
    if (this._partialBytes === 0 && inputLength >= this.blockSize) {
      for (var i = 0; i < this._ints; ++i) {
        output.putInt32(this._outBlock[i] ^= input.getInt32());
      }
      this._cipherLength += this.blockSize;
    } else {
      var partialBytes = (this.blockSize - inputLength) % this.blockSize;
      if (partialBytes > 0) {
        partialBytes = this.blockSize - partialBytes;
      }
      this._partialOutput.clear();
      for (var i = 0; i < this._ints; ++i) {
        this._partialOutput.putInt32(input.getInt32() ^ this._outBlock[i]);
      }
      if (partialBytes <= 0 || finish) {
        if (finish) {
          var overflow = inputLength % this.blockSize;
          this._cipherLength += overflow;
          this._partialOutput.truncate(this.blockSize - overflow);
        } else {
          this._cipherLength += this.blockSize;
        }
        for (var i = 0; i < this._ints; ++i) {
          this._outBlock[i] = this._partialOutput.getInt32();
        }
        this._partialOutput.read -= this.blockSize;
      }
      if (this._partialBytes > 0) {
        this._partialOutput.getBytes(this._partialBytes);
      }
      if (partialBytes > 0 && !finish) {
        input.read -= this.blockSize;
        output.putBytes(this._partialOutput.getBytes(partialBytes - this._partialBytes));
        this._partialBytes = partialBytes;
        return true;
      }
      output.putBytes(this._partialOutput.getBytes(inputLength - this._partialBytes));
      this._partialBytes = 0;
    }
    this._s = this.ghash(this._hashSubkey, this._s, this._outBlock);
    inc32(this._inBlock);
  };
  modes.gcm.prototype.decrypt = function(input, output, finish) {
    var inputLength = input.length();
    if (inputLength < this.blockSize && !(finish && inputLength > 0)) {
      return true;
    }
    this.cipher.encrypt(this._inBlock, this._outBlock);
    inc32(this._inBlock);
    this._hashBlock[0] = input.getInt32();
    this._hashBlock[1] = input.getInt32();
    this._hashBlock[2] = input.getInt32();
    this._hashBlock[3] = input.getInt32();
    this._s = this.ghash(this._hashSubkey, this._s, this._hashBlock);
    for (var i = 0; i < this._ints; ++i) {
      output.putInt32(this._outBlock[i] ^ this._hashBlock[i]);
    }
    if (inputLength < this.blockSize) {
      this._cipherLength += inputLength % this.blockSize;
    } else {
      this._cipherLength += this.blockSize;
    }
  };
  modes.gcm.prototype.afterFinish = function(output, options) {
    var rval = true;
    if (options.decrypt && options.overflow) {
      output.truncate(this.blockSize - options.overflow);
    }
    this.tag = forge2.util.createBuffer();
    var lengths = this._aDataLength.concat(from64To32(this._cipherLength * 8));
    this._s = this.ghash(this._hashSubkey, this._s, lengths);
    var tag = [];
    this.cipher.encrypt(this._j0, tag);
    for (var i = 0; i < this._ints; ++i) {
      this.tag.putInt32(this._s[i] ^ tag[i]);
    }
    this.tag.truncate(this.tag.length() % (this._tagLength / 8));
    if (options.decrypt && this.tag.bytes() !== this._tag) {
      rval = false;
    }
    return rval;
  };
  modes.gcm.prototype.multiply = function(x, y) {
    var z_i = [0, 0, 0, 0];
    var v_i = y.slice(0);
    for (var i = 0; i < 128; ++i) {
      var x_i = x[i / 32 | 0] & 1 << 31 - i % 32;
      if (x_i) {
        z_i[0] ^= v_i[0];
        z_i[1] ^= v_i[1];
        z_i[2] ^= v_i[2];
        z_i[3] ^= v_i[3];
      }
      this.pow(v_i, v_i);
    }
    return z_i;
  };
  modes.gcm.prototype.pow = function(x, out) {
    var lsb = x[3] & 1;
    for (var i = 3; i > 0; --i) {
      out[i] = x[i] >>> 1 | (x[i - 1] & 1) << 31;
    }
    out[0] = x[0] >>> 1;
    if (lsb) {
      out[0] ^= this._R;
    }
  };
  modes.gcm.prototype.tableMultiply = function(x) {
    var z = [0, 0, 0, 0];
    for (var i = 0; i < 32; ++i) {
      var idx = i / 8 | 0;
      var x_i = x[idx] >>> (7 - i % 8) * 4 & 15;
      var ah = this._m[i][x_i];
      z[0] ^= ah[0];
      z[1] ^= ah[1];
      z[2] ^= ah[2];
      z[3] ^= ah[3];
    }
    return z;
  };
  modes.gcm.prototype.ghash = function(h, y, x) {
    y[0] ^= x[0];
    y[1] ^= x[1];
    y[2] ^= x[2];
    y[3] ^= x[3];
    return this.tableMultiply(y);
  };
  modes.gcm.prototype.generateHashTable = function(h, bits) {
    var multiplier = 8 / bits;
    var perInt = 4 * multiplier;
    var size = 16 * multiplier;
    var m = new Array(size);
    for (var i = 0; i < size; ++i) {
      var tmp = [0, 0, 0, 0];
      var idx = i / perInt | 0;
      var shft = (perInt - 1 - i % perInt) * bits;
      tmp[idx] = 1 << bits - 1 << shft;
      m[i] = this.generateSubHashTable(this.multiply(tmp, h), bits);
    }
    return m;
  };
  modes.gcm.prototype.generateSubHashTable = function(mid, bits) {
    var size = 1 << bits;
    var half = size >>> 1;
    var m = new Array(size);
    m[half] = mid.slice(0);
    var i = half >>> 1;
    while (i > 0) {
      this.pow(m[2 * i], m[i] = []);
      i >>= 1;
    }
    i = 2;
    while (i < half) {
      for (var j = 1; j < i; ++j) {
        var m_i = m[i];
        var m_j = m[j];
        m[i + j] = [
          m_i[0] ^ m_j[0],
          m_i[1] ^ m_j[1],
          m_i[2] ^ m_j[2],
          m_i[3] ^ m_j[3]
        ];
      }
      i *= 2;
    }
    m[0] = [0, 0, 0, 0];
    for (i = half + 1; i < size; ++i) {
      var c = m[i ^ half];
      m[i] = [mid[0] ^ c[0], mid[1] ^ c[1], mid[2] ^ c[2], mid[3] ^ c[3]];
    }
    return m;
  };
  function transformIV(iv, blockSize) {
    if (typeof iv === "string") {
      iv = forge2.util.createBuffer(iv);
    }
    if (forge2.util.isArray(iv) && iv.length > 4) {
      var tmp = iv;
      iv = forge2.util.createBuffer();
      for (var i = 0; i < tmp.length; ++i) {
        iv.putByte(tmp[i]);
      }
    }
    if (iv.length() < blockSize) {
      throw new Error("Invalid IV length; got " + iv.length() + " bytes and expected " + blockSize + " bytes.");
    }
    if (!forge2.util.isArray(iv)) {
      var ints = [];
      var blocks = blockSize / 4;
      for (var i = 0; i < blocks; ++i) {
        ints.push(iv.getInt32());
      }
      iv = ints;
    }
    return iv;
  }
  function inc32(block) {
    block[block.length - 1] = block[block.length - 1] + 1 & 4294967295;
  }
  function from64To32(num) {
    return [num / 4294967296 | 0, num & 4294967295];
  }
});

// node_modules/node-forge/lib/aes.js
var require_aes = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_cipher();
  require_cipherModes();
  require_util();
  module2.exports = forge2.aes = forge2.aes || {};
  forge2.aes.startEncrypting = function(key, iv, output, mode) {
    var cipher = _createCipher({
      key,
      output,
      decrypt: false,
      mode
    });
    cipher.start(iv);
    return cipher;
  };
  forge2.aes.createEncryptionCipher = function(key, mode) {
    return _createCipher({
      key,
      output: null,
      decrypt: false,
      mode
    });
  };
  forge2.aes.startDecrypting = function(key, iv, output, mode) {
    var cipher = _createCipher({
      key,
      output,
      decrypt: true,
      mode
    });
    cipher.start(iv);
    return cipher;
  };
  forge2.aes.createDecryptionCipher = function(key, mode) {
    return _createCipher({
      key,
      output: null,
      decrypt: true,
      mode
    });
  };
  forge2.aes.Algorithm = function(name, mode) {
    if (!init) {
      initialize();
    }
    var self2 = this;
    self2.name = name;
    self2.mode = new mode({
      blockSize: 16,
      cipher: {
        encrypt: function(inBlock, outBlock) {
          return _updateBlock(self2._w, inBlock, outBlock, false);
        },
        decrypt: function(inBlock, outBlock) {
          return _updateBlock(self2._w, inBlock, outBlock, true);
        }
      }
    });
    self2._init = false;
  };
  forge2.aes.Algorithm.prototype.initialize = function(options) {
    if (this._init) {
      return;
    }
    var key = options.key;
    var tmp;
    if (typeof key === "string" && (key.length === 16 || key.length === 24 || key.length === 32)) {
      key = forge2.util.createBuffer(key);
    } else if (forge2.util.isArray(key) && (key.length === 16 || key.length === 24 || key.length === 32)) {
      tmp = key;
      key = forge2.util.createBuffer();
      for (var i = 0; i < tmp.length; ++i) {
        key.putByte(tmp[i]);
      }
    }
    if (!forge2.util.isArray(key)) {
      tmp = key;
      key = [];
      var len = tmp.length();
      if (len === 16 || len === 24 || len === 32) {
        len = len >>> 2;
        for (var i = 0; i < len; ++i) {
          key.push(tmp.getInt32());
        }
      }
    }
    if (!forge2.util.isArray(key) || !(key.length === 4 || key.length === 6 || key.length === 8)) {
      throw new Error("Invalid key parameter.");
    }
    var mode = this.mode.name;
    var encryptOp = ["CFB", "OFB", "CTR", "GCM"].indexOf(mode) !== -1;
    this._w = _expandKey(key, options.decrypt && !encryptOp);
    this._init = true;
  };
  forge2.aes._expandKey = function(key, decrypt) {
    if (!init) {
      initialize();
    }
    return _expandKey(key, decrypt);
  };
  forge2.aes._updateBlock = _updateBlock;
  registerAlgorithm("AES-ECB", forge2.cipher.modes.ecb);
  registerAlgorithm("AES-CBC", forge2.cipher.modes.cbc);
  registerAlgorithm("AES-CFB", forge2.cipher.modes.cfb);
  registerAlgorithm("AES-OFB", forge2.cipher.modes.ofb);
  registerAlgorithm("AES-CTR", forge2.cipher.modes.ctr);
  registerAlgorithm("AES-GCM", forge2.cipher.modes.gcm);
  function registerAlgorithm(name, mode) {
    var factory = function() {
      return new forge2.aes.Algorithm(name, mode);
    };
    forge2.cipher.registerAlgorithm(name, factory);
  }
  var init = false;
  var Nb = 4;
  var sbox;
  var isbox;
  var rcon;
  var mix;
  var imix;
  function initialize() {
    init = true;
    rcon = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
    var xtime = new Array(256);
    for (var i = 0; i < 128; ++i) {
      xtime[i] = i << 1;
      xtime[i + 128] = i + 128 << 1 ^ 283;
    }
    sbox = new Array(256);
    isbox = new Array(256);
    mix = new Array(4);
    imix = new Array(4);
    for (var i = 0; i < 4; ++i) {
      mix[i] = new Array(256);
      imix[i] = new Array(256);
    }
    var e = 0, ei = 0, e2, e4, e8, sx, sx2, me, ime;
    for (var i = 0; i < 256; ++i) {
      sx = ei ^ ei << 1 ^ ei << 2 ^ ei << 3 ^ ei << 4;
      sx = sx >> 8 ^ sx & 255 ^ 99;
      sbox[e] = sx;
      isbox[sx] = e;
      sx2 = xtime[sx];
      e2 = xtime[e];
      e4 = xtime[e2];
      e8 = xtime[e4];
      me = sx2 << 24 ^ sx << 16 ^ sx << 8 ^ (sx ^ sx2);
      ime = (e2 ^ e4 ^ e8) << 24 ^ (e ^ e8) << 16 ^ (e ^ e4 ^ e8) << 8 ^ (e ^ e2 ^ e8);
      for (var n = 0; n < 4; ++n) {
        mix[n][e] = me;
        imix[n][sx] = ime;
        me = me << 24 | me >>> 8;
        ime = ime << 24 | ime >>> 8;
      }
      if (e === 0) {
        e = ei = 1;
      } else {
        e = e2 ^ xtime[xtime[xtime[e2 ^ e8]]];
        ei ^= xtime[xtime[ei]];
      }
    }
  }
  function _expandKey(key, decrypt) {
    var w = key.slice(0);
    var temp, iNk = 1;
    var Nk = w.length;
    var Nr1 = Nk + 6 + 1;
    var end = Nb * Nr1;
    for (var i = Nk; i < end; ++i) {
      temp = w[i - 1];
      if (i % Nk === 0) {
        temp = sbox[temp >>> 16 & 255] << 24 ^ sbox[temp >>> 8 & 255] << 16 ^ sbox[temp & 255] << 8 ^ sbox[temp >>> 24] ^ rcon[iNk] << 24;
        iNk++;
      } else if (Nk > 6 && i % Nk === 4) {
        temp = sbox[temp >>> 24] << 24 ^ sbox[temp >>> 16 & 255] << 16 ^ sbox[temp >>> 8 & 255] << 8 ^ sbox[temp & 255];
      }
      w[i] = w[i - Nk] ^ temp;
    }
    if (decrypt) {
      var tmp;
      var m0 = imix[0];
      var m1 = imix[1];
      var m2 = imix[2];
      var m3 = imix[3];
      var wnew = w.slice(0);
      end = w.length;
      for (var i = 0, wi = end - Nb; i < end; i += Nb, wi -= Nb) {
        if (i === 0 || i === end - Nb) {
          wnew[i] = w[wi];
          wnew[i + 1] = w[wi + 3];
          wnew[i + 2] = w[wi + 2];
          wnew[i + 3] = w[wi + 1];
        } else {
          for (var n = 0; n < Nb; ++n) {
            tmp = w[wi + n];
            wnew[i + (3 & -n)] = m0[sbox[tmp >>> 24]] ^ m1[sbox[tmp >>> 16 & 255]] ^ m2[sbox[tmp >>> 8 & 255]] ^ m3[sbox[tmp & 255]];
          }
        }
      }
      w = wnew;
    }
    return w;
  }
  function _updateBlock(w, input, output, decrypt) {
    var Nr = w.length / 4 - 1;
    var m0, m1, m2, m3, sub;
    if (decrypt) {
      m0 = imix[0];
      m1 = imix[1];
      m2 = imix[2];
      m3 = imix[3];
      sub = isbox;
    } else {
      m0 = mix[0];
      m1 = mix[1];
      m2 = mix[2];
      m3 = mix[3];
      sub = sbox;
    }
    var a, b, c, d, a2, b2, c2;
    a = input[0] ^ w[0];
    b = input[decrypt ? 3 : 1] ^ w[1];
    c = input[2] ^ w[2];
    d = input[decrypt ? 1 : 3] ^ w[3];
    var i = 3;
    for (var round = 1; round < Nr; ++round) {
      a2 = m0[a >>> 24] ^ m1[b >>> 16 & 255] ^ m2[c >>> 8 & 255] ^ m3[d & 255] ^ w[++i];
      b2 = m0[b >>> 24] ^ m1[c >>> 16 & 255] ^ m2[d >>> 8 & 255] ^ m3[a & 255] ^ w[++i];
      c2 = m0[c >>> 24] ^ m1[d >>> 16 & 255] ^ m2[a >>> 8 & 255] ^ m3[b & 255] ^ w[++i];
      d = m0[d >>> 24] ^ m1[a >>> 16 & 255] ^ m2[b >>> 8 & 255] ^ m3[c & 255] ^ w[++i];
      a = a2;
      b = b2;
      c = c2;
    }
    output[0] = sub[a >>> 24] << 24 ^ sub[b >>> 16 & 255] << 16 ^ sub[c >>> 8 & 255] << 8 ^ sub[d & 255] ^ w[++i];
    output[decrypt ? 3 : 1] = sub[b >>> 24] << 24 ^ sub[c >>> 16 & 255] << 16 ^ sub[d >>> 8 & 255] << 8 ^ sub[a & 255] ^ w[++i];
    output[2] = sub[c >>> 24] << 24 ^ sub[d >>> 16 & 255] << 16 ^ sub[a >>> 8 & 255] << 8 ^ sub[b & 255] ^ w[++i];
    output[decrypt ? 1 : 3] = sub[d >>> 24] << 24 ^ sub[a >>> 16 & 255] << 16 ^ sub[b >>> 8 & 255] << 8 ^ sub[c & 255] ^ w[++i];
  }
  function _createCipher(options) {
    options = options || {};
    var mode = (options.mode || "CBC").toUpperCase();
    var algorithm = "AES-" + mode;
    var cipher;
    if (options.decrypt) {
      cipher = forge2.cipher.createDecipher(algorithm, options.key);
    } else {
      cipher = forge2.cipher.createCipher(algorithm, options.key);
    }
    var start = cipher.start;
    cipher.start = function(iv, options2) {
      var output = null;
      if (options2 instanceof forge2.util.ByteBuffer) {
        output = options2;
        options2 = {};
      }
      options2 = options2 || {};
      options2.output = output;
      options2.iv = iv;
      start.call(cipher, options2);
    };
    return cipher;
  }
});

// node_modules/node-forge/lib/oids.js
var require_oids = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  forge2.pki = forge2.pki || {};
  var oids = module2.exports = forge2.pki.oids = forge2.oids = forge2.oids || {};
  function _IN(id, name) {
    oids[id] = name;
    oids[name] = id;
  }
  function _I_(id, name) {
    oids[id] = name;
  }
  _IN("1.2.840.113549.1.1.1", "rsaEncryption");
  _IN("1.2.840.113549.1.1.4", "md5WithRSAEncryption");
  _IN("1.2.840.113549.1.1.5", "sha1WithRSAEncryption");
  _IN("1.2.840.113549.1.1.7", "RSAES-OAEP");
  _IN("1.2.840.113549.1.1.8", "mgf1");
  _IN("1.2.840.113549.1.1.9", "pSpecified");
  _IN("1.2.840.113549.1.1.10", "RSASSA-PSS");
  _IN("1.2.840.113549.1.1.11", "sha256WithRSAEncryption");
  _IN("1.2.840.113549.1.1.12", "sha384WithRSAEncryption");
  _IN("1.2.840.113549.1.1.13", "sha512WithRSAEncryption");
  _IN("1.3.101.112", "EdDSA25519");
  _IN("1.2.840.10040.4.3", "dsa-with-sha1");
  _IN("1.3.14.3.2.7", "desCBC");
  _IN("1.3.14.3.2.26", "sha1");
  _IN("2.16.840.1.101.3.4.2.1", "sha256");
  _IN("2.16.840.1.101.3.4.2.2", "sha384");
  _IN("2.16.840.1.101.3.4.2.3", "sha512");
  _IN("1.2.840.113549.2.5", "md5");
  _IN("1.2.840.113549.1.7.1", "data");
  _IN("1.2.840.113549.1.7.2", "signedData");
  _IN("1.2.840.113549.1.7.3", "envelopedData");
  _IN("1.2.840.113549.1.7.4", "signedAndEnvelopedData");
  _IN("1.2.840.113549.1.7.5", "digestedData");
  _IN("1.2.840.113549.1.7.6", "encryptedData");
  _IN("1.2.840.113549.1.9.1", "emailAddress");
  _IN("1.2.840.113549.1.9.2", "unstructuredName");
  _IN("1.2.840.113549.1.9.3", "contentType");
  _IN("1.2.840.113549.1.9.4", "messageDigest");
  _IN("1.2.840.113549.1.9.5", "signingTime");
  _IN("1.2.840.113549.1.9.6", "counterSignature");
  _IN("1.2.840.113549.1.9.7", "challengePassword");
  _IN("1.2.840.113549.1.9.8", "unstructuredAddress");
  _IN("1.2.840.113549.1.9.14", "extensionRequest");
  _IN("1.2.840.113549.1.9.20", "friendlyName");
  _IN("1.2.840.113549.1.9.21", "localKeyId");
  _IN("1.2.840.113549.1.9.22.1", "x509Certificate");
  _IN("1.2.840.113549.1.12.10.1.1", "keyBag");
  _IN("1.2.840.113549.1.12.10.1.2", "pkcs8ShroudedKeyBag");
  _IN("1.2.840.113549.1.12.10.1.3", "certBag");
  _IN("1.2.840.113549.1.12.10.1.4", "crlBag");
  _IN("1.2.840.113549.1.12.10.1.5", "secretBag");
  _IN("1.2.840.113549.1.12.10.1.6", "safeContentsBag");
  _IN("1.2.840.113549.1.5.13", "pkcs5PBES2");
  _IN("1.2.840.113549.1.5.12", "pkcs5PBKDF2");
  _IN("1.2.840.113549.1.12.1.1", "pbeWithSHAAnd128BitRC4");
  _IN("1.2.840.113549.1.12.1.2", "pbeWithSHAAnd40BitRC4");
  _IN("1.2.840.113549.1.12.1.3", "pbeWithSHAAnd3-KeyTripleDES-CBC");
  _IN("1.2.840.113549.1.12.1.4", "pbeWithSHAAnd2-KeyTripleDES-CBC");
  _IN("1.2.840.113549.1.12.1.5", "pbeWithSHAAnd128BitRC2-CBC");
  _IN("1.2.840.113549.1.12.1.6", "pbewithSHAAnd40BitRC2-CBC");
  _IN("1.2.840.113549.2.7", "hmacWithSHA1");
  _IN("1.2.840.113549.2.8", "hmacWithSHA224");
  _IN("1.2.840.113549.2.9", "hmacWithSHA256");
  _IN("1.2.840.113549.2.10", "hmacWithSHA384");
  _IN("1.2.840.113549.2.11", "hmacWithSHA512");
  _IN("1.2.840.113549.3.7", "des-EDE3-CBC");
  _IN("2.16.840.1.101.3.4.1.2", "aes128-CBC");
  _IN("2.16.840.1.101.3.4.1.22", "aes192-CBC");
  _IN("2.16.840.1.101.3.4.1.42", "aes256-CBC");
  _IN("2.5.4.3", "commonName");
  _IN("2.5.4.5", "serialName");
  _IN("2.5.4.6", "countryName");
  _IN("2.5.4.7", "localityName");
  _IN("2.5.4.8", "stateOrProvinceName");
  _IN("2.5.4.9", "streetAddress");
  _IN("2.5.4.10", "organizationName");
  _IN("2.5.4.11", "organizationalUnitName");
  _IN("2.5.4.13", "description");
  _IN("2.5.4.15", "businessCategory");
  _IN("2.5.4.17", "postalCode");
  _IN("1.3.6.1.4.1.311.60.2.1.2", "jurisdictionOfIncorporationStateOrProvinceName");
  _IN("1.3.6.1.4.1.311.60.2.1.3", "jurisdictionOfIncorporationCountryName");
  _IN("2.16.840.1.113730.1.1", "nsCertType");
  _IN("2.16.840.1.113730.1.13", "nsComment");
  _I_("2.5.29.1", "authorityKeyIdentifier");
  _I_("2.5.29.2", "keyAttributes");
  _I_("2.5.29.3", "certificatePolicies");
  _I_("2.5.29.4", "keyUsageRestriction");
  _I_("2.5.29.5", "policyMapping");
  _I_("2.5.29.6", "subtreesConstraint");
  _I_("2.5.29.7", "subjectAltName");
  _I_("2.5.29.8", "issuerAltName");
  _I_("2.5.29.9", "subjectDirectoryAttributes");
  _I_("2.5.29.10", "basicConstraints");
  _I_("2.5.29.11", "nameConstraints");
  _I_("2.5.29.12", "policyConstraints");
  _I_("2.5.29.13", "basicConstraints");
  _IN("2.5.29.14", "subjectKeyIdentifier");
  _IN("2.5.29.15", "keyUsage");
  _I_("2.5.29.16", "privateKeyUsagePeriod");
  _IN("2.5.29.17", "subjectAltName");
  _IN("2.5.29.18", "issuerAltName");
  _IN("2.5.29.19", "basicConstraints");
  _I_("2.5.29.20", "cRLNumber");
  _I_("2.5.29.21", "cRLReason");
  _I_("2.5.29.22", "expirationDate");
  _I_("2.5.29.23", "instructionCode");
  _I_("2.5.29.24", "invalidityDate");
  _I_("2.5.29.25", "cRLDistributionPoints");
  _I_("2.5.29.26", "issuingDistributionPoint");
  _I_("2.5.29.27", "deltaCRLIndicator");
  _I_("2.5.29.28", "issuingDistributionPoint");
  _I_("2.5.29.29", "certificateIssuer");
  _I_("2.5.29.30", "nameConstraints");
  _IN("2.5.29.31", "cRLDistributionPoints");
  _IN("2.5.29.32", "certificatePolicies");
  _I_("2.5.29.33", "policyMappings");
  _I_("2.5.29.34", "policyConstraints");
  _IN("2.5.29.35", "authorityKeyIdentifier");
  _I_("2.5.29.36", "policyConstraints");
  _IN("2.5.29.37", "extKeyUsage");
  _I_("2.5.29.46", "freshestCRL");
  _I_("2.5.29.54", "inhibitAnyPolicy");
  _IN("1.3.6.1.4.1.11129.2.4.2", "timestampList");
  _IN("1.3.6.1.5.5.7.1.1", "authorityInfoAccess");
  _IN("1.3.6.1.5.5.7.3.1", "serverAuth");
  _IN("1.3.6.1.5.5.7.3.2", "clientAuth");
  _IN("1.3.6.1.5.5.7.3.3", "codeSigning");
  _IN("1.3.6.1.5.5.7.3.4", "emailProtection");
  _IN("1.3.6.1.5.5.7.3.8", "timeStamping");
});

// node_modules/node-forge/lib/asn1.js
var require_asn1 = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_util();
  require_oids();
  var asn1 = module2.exports = forge2.asn1 = forge2.asn1 || {};
  asn1.Class = {
    UNIVERSAL: 0,
    APPLICATION: 64,
    CONTEXT_SPECIFIC: 128,
    PRIVATE: 192
  };
  asn1.Type = {
    NONE: 0,
    BOOLEAN: 1,
    INTEGER: 2,
    BITSTRING: 3,
    OCTETSTRING: 4,
    NULL: 5,
    OID: 6,
    ODESC: 7,
    EXTERNAL: 8,
    REAL: 9,
    ENUMERATED: 10,
    EMBEDDED: 11,
    UTF8: 12,
    ROID: 13,
    SEQUENCE: 16,
    SET: 17,
    PRINTABLESTRING: 19,
    IA5STRING: 22,
    UTCTIME: 23,
    GENERALIZEDTIME: 24,
    BMPSTRING: 30
  };
  asn1.create = function(tagClass, type, constructed, value, options) {
    if (forge2.util.isArray(value)) {
      var tmp = [];
      for (var i = 0; i < value.length; ++i) {
        if (value[i] !== void 0) {
          tmp.push(value[i]);
        }
      }
      value = tmp;
    }
    var obj = {
      tagClass,
      type,
      constructed,
      composed: constructed || forge2.util.isArray(value),
      value
    };
    if (options && "bitStringContents" in options) {
      obj.bitStringContents = options.bitStringContents;
      obj.original = asn1.copy(obj);
    }
    return obj;
  };
  asn1.copy = function(obj, options) {
    var copy;
    if (forge2.util.isArray(obj)) {
      copy = [];
      for (var i = 0; i < obj.length; ++i) {
        copy.push(asn1.copy(obj[i], options));
      }
      return copy;
    }
    if (typeof obj === "string") {
      return obj;
    }
    copy = {
      tagClass: obj.tagClass,
      type: obj.type,
      constructed: obj.constructed,
      composed: obj.composed,
      value: asn1.copy(obj.value, options)
    };
    if (options && !options.excludeBitStringContents) {
      copy.bitStringContents = obj.bitStringContents;
    }
    return copy;
  };
  asn1.equals = function(obj1, obj2, options) {
    if (forge2.util.isArray(obj1)) {
      if (!forge2.util.isArray(obj2)) {
        return false;
      }
      if (obj1.length !== obj2.length) {
        return false;
      }
      for (var i = 0; i < obj1.length; ++i) {
        if (!asn1.equals(obj1[i], obj2[i])) {
          return false;
        }
      }
      return true;
    }
    if (typeof obj1 !== typeof obj2) {
      return false;
    }
    if (typeof obj1 === "string") {
      return obj1 === obj2;
    }
    var equal = obj1.tagClass === obj2.tagClass && obj1.type === obj2.type && obj1.constructed === obj2.constructed && obj1.composed === obj2.composed && asn1.equals(obj1.value, obj2.value);
    if (options && options.includeBitStringContents) {
      equal = equal && obj1.bitStringContents === obj2.bitStringContents;
    }
    return equal;
  };
  asn1.getBerValueLength = function(b) {
    var b2 = b.getByte();
    if (b2 === 128) {
      return void 0;
    }
    var length;
    var longForm = b2 & 128;
    if (!longForm) {
      length = b2;
    } else {
      length = b.getInt((b2 & 127) << 3);
    }
    return length;
  };
  function _checkBufferLength(bytes, remaining, n) {
    if (n > remaining) {
      var error = new Error("Too few bytes to parse DER.");
      error.available = bytes.length();
      error.remaining = remaining;
      error.requested = n;
      throw error;
    }
  }
  var _getValueLength = function(bytes, remaining) {
    var b2 = bytes.getByte();
    remaining--;
    if (b2 === 128) {
      return void 0;
    }
    var length;
    var longForm = b2 & 128;
    if (!longForm) {
      length = b2;
    } else {
      var longFormBytes = b2 & 127;
      _checkBufferLength(bytes, remaining, longFormBytes);
      length = bytes.getInt(longFormBytes << 3);
    }
    if (length < 0) {
      throw new Error("Negative length: " + length);
    }
    return length;
  };
  asn1.fromDer = function(bytes, options) {
    if (options === void 0) {
      options = {
        strict: true,
        decodeBitStrings: true
      };
    }
    if (typeof options === "boolean") {
      options = {
        strict: options,
        decodeBitStrings: true
      };
    }
    if (!("strict" in options)) {
      options.strict = true;
    }
    if (!("decodeBitStrings" in options)) {
      options.decodeBitStrings = true;
    }
    if (typeof bytes === "string") {
      bytes = forge2.util.createBuffer(bytes);
    }
    return _fromDer(bytes, bytes.length(), 0, options);
  };
  function _fromDer(bytes, remaining, depth, options) {
    var start;
    _checkBufferLength(bytes, remaining, 2);
    var b1 = bytes.getByte();
    remaining--;
    var tagClass = b1 & 192;
    var type = b1 & 31;
    start = bytes.length();
    var length = _getValueLength(bytes, remaining);
    remaining -= start - bytes.length();
    if (length !== void 0 && length > remaining) {
      if (options.strict) {
        var error = new Error("Too few bytes to read ASN.1 value.");
        error.available = bytes.length();
        error.remaining = remaining;
        error.requested = length;
        throw error;
      }
      length = remaining;
    }
    var value;
    var bitStringContents;
    var constructed = (b1 & 32) === 32;
    if (constructed) {
      value = [];
      if (length === void 0) {
        for (; ; ) {
          _checkBufferLength(bytes, remaining, 2);
          if (bytes.bytes(2) === String.fromCharCode(0, 0)) {
            bytes.getBytes(2);
            remaining -= 2;
            break;
          }
          start = bytes.length();
          value.push(_fromDer(bytes, remaining, depth + 1, options));
          remaining -= start - bytes.length();
        }
      } else {
        while (length > 0) {
          start = bytes.length();
          value.push(_fromDer(bytes, length, depth + 1, options));
          remaining -= start - bytes.length();
          length -= start - bytes.length();
        }
      }
    }
    if (value === void 0 && tagClass === asn1.Class.UNIVERSAL && type === asn1.Type.BITSTRING) {
      bitStringContents = bytes.bytes(length);
    }
    if (value === void 0 && options.decodeBitStrings && tagClass === asn1.Class.UNIVERSAL && type === asn1.Type.BITSTRING && length > 1) {
      var savedRead = bytes.read;
      var savedRemaining = remaining;
      var unused = 0;
      if (type === asn1.Type.BITSTRING) {
        _checkBufferLength(bytes, remaining, 1);
        unused = bytes.getByte();
        remaining--;
      }
      if (unused === 0) {
        try {
          start = bytes.length();
          var subOptions = {
            verbose: options.verbose,
            strict: true,
            decodeBitStrings: true
          };
          var composed = _fromDer(bytes, remaining, depth + 1, subOptions);
          var used = start - bytes.length();
          remaining -= used;
          if (type == asn1.Type.BITSTRING) {
            used++;
          }
          var tc = composed.tagClass;
          if (used === length && (tc === asn1.Class.UNIVERSAL || tc === asn1.Class.CONTEXT_SPECIFIC)) {
            value = [composed];
          }
        } catch (ex) {
        }
      }
      if (value === void 0) {
        bytes.read = savedRead;
        remaining = savedRemaining;
      }
    }
    if (value === void 0) {
      if (length === void 0) {
        if (options.strict) {
          throw new Error("Non-constructed ASN.1 object of indefinite length.");
        }
        length = remaining;
      }
      if (type === asn1.Type.BMPSTRING) {
        value = "";
        for (; length > 0; length -= 2) {
          _checkBufferLength(bytes, remaining, 2);
          value += String.fromCharCode(bytes.getInt16());
          remaining -= 2;
        }
      } else {
        value = bytes.getBytes(length);
      }
    }
    var asn1Options = bitStringContents === void 0 ? null : {
      bitStringContents
    };
    return asn1.create(tagClass, type, constructed, value, asn1Options);
  }
  asn1.toDer = function(obj) {
    var bytes = forge2.util.createBuffer();
    var b1 = obj.tagClass | obj.type;
    var value = forge2.util.createBuffer();
    var useBitStringContents = false;
    if ("bitStringContents" in obj) {
      useBitStringContents = true;
      if (obj.original) {
        useBitStringContents = asn1.equals(obj, obj.original);
      }
    }
    if (useBitStringContents) {
      value.putBytes(obj.bitStringContents);
    } else if (obj.composed) {
      if (obj.constructed) {
        b1 |= 32;
      } else {
        value.putByte(0);
      }
      for (var i = 0; i < obj.value.length; ++i) {
        if (obj.value[i] !== void 0) {
          value.putBuffer(asn1.toDer(obj.value[i]));
        }
      }
    } else {
      if (obj.type === asn1.Type.BMPSTRING) {
        for (var i = 0; i < obj.value.length; ++i) {
          value.putInt16(obj.value.charCodeAt(i));
        }
      } else {
        if (obj.type === asn1.Type.INTEGER && obj.value.length > 1 && (obj.value.charCodeAt(0) === 0 && (obj.value.charCodeAt(1) & 128) === 0 || obj.value.charCodeAt(0) === 255 && (obj.value.charCodeAt(1) & 128) === 128)) {
          value.putBytes(obj.value.substr(1));
        } else {
          value.putBytes(obj.value);
        }
      }
    }
    bytes.putByte(b1);
    if (value.length() <= 127) {
      bytes.putByte(value.length() & 127);
    } else {
      var len = value.length();
      var lenBytes = "";
      do {
        lenBytes += String.fromCharCode(len & 255);
        len = len >>> 8;
      } while (len > 0);
      bytes.putByte(lenBytes.length | 128);
      for (var i = lenBytes.length - 1; i >= 0; --i) {
        bytes.putByte(lenBytes.charCodeAt(i));
      }
    }
    bytes.putBuffer(value);
    return bytes;
  };
  asn1.oidToDer = function(oid) {
    var values = oid.split(".");
    var bytes = forge2.util.createBuffer();
    bytes.putByte(40 * parseInt(values[0], 10) + parseInt(values[1], 10));
    var last, valueBytes, value, b;
    for (var i = 2; i < values.length; ++i) {
      last = true;
      valueBytes = [];
      value = parseInt(values[i], 10);
      do {
        b = value & 127;
        value = value >>> 7;
        if (!last) {
          b |= 128;
        }
        valueBytes.push(b);
        last = false;
      } while (value > 0);
      for (var n = valueBytes.length - 1; n >= 0; --n) {
        bytes.putByte(valueBytes[n]);
      }
    }
    return bytes;
  };
  asn1.derToOid = function(bytes) {
    var oid;
    if (typeof bytes === "string") {
      bytes = forge2.util.createBuffer(bytes);
    }
    var b = bytes.getByte();
    oid = Math.floor(b / 40) + "." + b % 40;
    var value = 0;
    while (bytes.length() > 0) {
      b = bytes.getByte();
      value = value << 7;
      if (b & 128) {
        value += b & 127;
      } else {
        oid += "." + (value + b);
        value = 0;
      }
    }
    return oid;
  };
  asn1.utcTimeToDate = function(utc) {
    var date = new Date();
    var year = parseInt(utc.substr(0, 2), 10);
    year = year >= 50 ? 1900 + year : 2e3 + year;
    var MM = parseInt(utc.substr(2, 2), 10) - 1;
    var DD = parseInt(utc.substr(4, 2), 10);
    var hh = parseInt(utc.substr(6, 2), 10);
    var mm = parseInt(utc.substr(8, 2), 10);
    var ss = 0;
    if (utc.length > 11) {
      var c = utc.charAt(10);
      var end = 10;
      if (c !== "+" && c !== "-") {
        ss = parseInt(utc.substr(10, 2), 10);
        end += 2;
      }
    }
    date.setUTCFullYear(year, MM, DD);
    date.setUTCHours(hh, mm, ss, 0);
    if (end) {
      c = utc.charAt(end);
      if (c === "+" || c === "-") {
        var hhoffset = parseInt(utc.substr(end + 1, 2), 10);
        var mmoffset = parseInt(utc.substr(end + 4, 2), 10);
        var offset = hhoffset * 60 + mmoffset;
        offset *= 6e4;
        if (c === "+") {
          date.setTime(+date - offset);
        } else {
          date.setTime(+date + offset);
        }
      }
    }
    return date;
  };
  asn1.generalizedTimeToDate = function(gentime) {
    var date = new Date();
    var YYYY = parseInt(gentime.substr(0, 4), 10);
    var MM = parseInt(gentime.substr(4, 2), 10) - 1;
    var DD = parseInt(gentime.substr(6, 2), 10);
    var hh = parseInt(gentime.substr(8, 2), 10);
    var mm = parseInt(gentime.substr(10, 2), 10);
    var ss = parseInt(gentime.substr(12, 2), 10);
    var fff = 0;
    var offset = 0;
    var isUTC = false;
    if (gentime.charAt(gentime.length - 1) === "Z") {
      isUTC = true;
    }
    var end = gentime.length - 5, c = gentime.charAt(end);
    if (c === "+" || c === "-") {
      var hhoffset = parseInt(gentime.substr(end + 1, 2), 10);
      var mmoffset = parseInt(gentime.substr(end + 4, 2), 10);
      offset = hhoffset * 60 + mmoffset;
      offset *= 6e4;
      if (c === "+") {
        offset *= -1;
      }
      isUTC = true;
    }
    if (gentime.charAt(14) === ".") {
      fff = parseFloat(gentime.substr(14), 10) * 1e3;
    }
    if (isUTC) {
      date.setUTCFullYear(YYYY, MM, DD);
      date.setUTCHours(hh, mm, ss, fff);
      date.setTime(+date + offset);
    } else {
      date.setFullYear(YYYY, MM, DD);
      date.setHours(hh, mm, ss, fff);
    }
    return date;
  };
  asn1.dateToUtcTime = function(date) {
    if (typeof date === "string") {
      return date;
    }
    var rval = "";
    var format = [];
    format.push(("" + date.getUTCFullYear()).substr(2));
    format.push("" + (date.getUTCMonth() + 1));
    format.push("" + date.getUTCDate());
    format.push("" + date.getUTCHours());
    format.push("" + date.getUTCMinutes());
    format.push("" + date.getUTCSeconds());
    for (var i = 0; i < format.length; ++i) {
      if (format[i].length < 2) {
        rval += "0";
      }
      rval += format[i];
    }
    rval += "Z";
    return rval;
  };
  asn1.dateToGeneralizedTime = function(date) {
    if (typeof date === "string") {
      return date;
    }
    var rval = "";
    var format = [];
    format.push("" + date.getUTCFullYear());
    format.push("" + (date.getUTCMonth() + 1));
    format.push("" + date.getUTCDate());
    format.push("" + date.getUTCHours());
    format.push("" + date.getUTCMinutes());
    format.push("" + date.getUTCSeconds());
    for (var i = 0; i < format.length; ++i) {
      if (format[i].length < 2) {
        rval += "0";
      }
      rval += format[i];
    }
    rval += "Z";
    return rval;
  };
  asn1.integerToDer = function(x) {
    var rval = forge2.util.createBuffer();
    if (x >= -128 && x < 128) {
      return rval.putSignedInt(x, 8);
    }
    if (x >= -32768 && x < 32768) {
      return rval.putSignedInt(x, 16);
    }
    if (x >= -8388608 && x < 8388608) {
      return rval.putSignedInt(x, 24);
    }
    if (x >= -2147483648 && x < 2147483648) {
      return rval.putSignedInt(x, 32);
    }
    var error = new Error("Integer too large; max is 32-bits.");
    error.integer = x;
    throw error;
  };
  asn1.derToInteger = function(bytes) {
    if (typeof bytes === "string") {
      bytes = forge2.util.createBuffer(bytes);
    }
    var n = bytes.length() * 8;
    if (n > 32) {
      throw new Error("Integer too large; max is 32-bits.");
    }
    return bytes.getSignedInt(n);
  };
  asn1.validate = function(obj, v, capture, errors) {
    var rval = false;
    if ((obj.tagClass === v.tagClass || typeof v.tagClass === "undefined") && (obj.type === v.type || typeof v.type === "undefined")) {
      if (obj.constructed === v.constructed || typeof v.constructed === "undefined") {
        rval = true;
        if (v.value && forge2.util.isArray(v.value)) {
          var j = 0;
          for (var i = 0; rval && i < v.value.length; ++i) {
            rval = v.value[i].optional || false;
            if (obj.value[j]) {
              rval = asn1.validate(obj.value[j], v.value[i], capture, errors);
              if (rval) {
                ++j;
              } else if (v.value[i].optional) {
                rval = true;
              }
            }
            if (!rval && errors) {
              errors.push("[" + v.name + '] Tag class "' + v.tagClass + '", type "' + v.type + '" expected value length "' + v.value.length + '", got "' + obj.value.length + '"');
            }
          }
        }
        if (rval && capture) {
          if (v.capture) {
            capture[v.capture] = obj.value;
          }
          if (v.captureAsn1) {
            capture[v.captureAsn1] = obj;
          }
          if (v.captureBitStringContents && "bitStringContents" in obj) {
            capture[v.captureBitStringContents] = obj.bitStringContents;
          }
          if (v.captureBitStringValue && "bitStringContents" in obj) {
            var value;
            if (obj.bitStringContents.length < 2) {
              capture[v.captureBitStringValue] = "";
            } else {
              var unused = obj.bitStringContents.charCodeAt(0);
              if (unused !== 0) {
                throw new Error("captureBitStringValue only supported for zero unused bits");
              }
              capture[v.captureBitStringValue] = obj.bitStringContents.slice(1);
            }
          }
        }
      } else if (errors) {
        errors.push("[" + v.name + '] Expected constructed "' + v.constructed + '", got "' + obj.constructed + '"');
      }
    } else if (errors) {
      if (obj.tagClass !== v.tagClass) {
        errors.push("[" + v.name + '] Expected tag class "' + v.tagClass + '", got "' + obj.tagClass + '"');
      }
      if (obj.type !== v.type) {
        errors.push("[" + v.name + '] Expected type "' + v.type + '", got "' + obj.type + '"');
      }
    }
    return rval;
  };
  var _nonLatinRegex = /[^\\u0000-\\u00ff]/;
  asn1.prettyPrint = function(obj, level, indentation) {
    var rval = "";
    level = level || 0;
    indentation = indentation || 2;
    if (level > 0) {
      rval += "\n";
    }
    var indent = "";
    for (var i = 0; i < level * indentation; ++i) {
      indent += " ";
    }
    rval += indent + "Tag: ";
    switch (obj.tagClass) {
      case asn1.Class.UNIVERSAL:
        rval += "Universal:";
        break;
      case asn1.Class.APPLICATION:
        rval += "Application:";
        break;
      case asn1.Class.CONTEXT_SPECIFIC:
        rval += "Context-Specific:";
        break;
      case asn1.Class.PRIVATE:
        rval += "Private:";
        break;
    }
    if (obj.tagClass === asn1.Class.UNIVERSAL) {
      rval += obj.type;
      switch (obj.type) {
        case asn1.Type.NONE:
          rval += " (None)";
          break;
        case asn1.Type.BOOLEAN:
          rval += " (Boolean)";
          break;
        case asn1.Type.INTEGER:
          rval += " (Integer)";
          break;
        case asn1.Type.BITSTRING:
          rval += " (Bit string)";
          break;
        case asn1.Type.OCTETSTRING:
          rval += " (Octet string)";
          break;
        case asn1.Type.NULL:
          rval += " (Null)";
          break;
        case asn1.Type.OID:
          rval += " (Object Identifier)";
          break;
        case asn1.Type.ODESC:
          rval += " (Object Descriptor)";
          break;
        case asn1.Type.EXTERNAL:
          rval += " (External or Instance of)";
          break;
        case asn1.Type.REAL:
          rval += " (Real)";
          break;
        case asn1.Type.ENUMERATED:
          rval += " (Enumerated)";
          break;
        case asn1.Type.EMBEDDED:
          rval += " (Embedded PDV)";
          break;
        case asn1.Type.UTF8:
          rval += " (UTF8)";
          break;
        case asn1.Type.ROID:
          rval += " (Relative Object Identifier)";
          break;
        case asn1.Type.SEQUENCE:
          rval += " (Sequence)";
          break;
        case asn1.Type.SET:
          rval += " (Set)";
          break;
        case asn1.Type.PRINTABLESTRING:
          rval += " (Printable String)";
          break;
        case asn1.Type.IA5String:
          rval += " (IA5String (ASCII))";
          break;
        case asn1.Type.UTCTIME:
          rval += " (UTC time)";
          break;
        case asn1.Type.GENERALIZEDTIME:
          rval += " (Generalized time)";
          break;
        case asn1.Type.BMPSTRING:
          rval += " (BMP String)";
          break;
      }
    } else {
      rval += obj.type;
    }
    rval += "\n";
    rval += indent + "Constructed: " + obj.constructed + "\n";
    if (obj.composed) {
      var subvalues = 0;
      var sub = "";
      for (var i = 0; i < obj.value.length; ++i) {
        if (obj.value[i] !== void 0) {
          subvalues += 1;
          sub += asn1.prettyPrint(obj.value[i], level + 1, indentation);
          if (i + 1 < obj.value.length) {
            sub += ",";
          }
        }
      }
      rval += indent + "Sub values: " + subvalues + sub;
    } else {
      rval += indent + "Value: ";
      if (obj.type === asn1.Type.OID) {
        var oid = asn1.derToOid(obj.value);
        rval += oid;
        if (forge2.pki && forge2.pki.oids) {
          if (oid in forge2.pki.oids) {
            rval += " (" + forge2.pki.oids[oid] + ") ";
          }
        }
      }
      if (obj.type === asn1.Type.INTEGER) {
        try {
          rval += asn1.derToInteger(obj.value);
        } catch (ex) {
          rval += "0x" + forge2.util.bytesToHex(obj.value);
        }
      } else if (obj.type === asn1.Type.BITSTRING) {
        if (obj.value.length > 1) {
          rval += "0x" + forge2.util.bytesToHex(obj.value.slice(1));
        } else {
          rval += "(none)";
        }
        if (obj.value.length > 0) {
          var unused = obj.value.charCodeAt(0);
          if (unused == 1) {
            rval += " (1 unused bit shown)";
          } else if (unused > 1) {
            rval += " (" + unused + " unused bits shown)";
          }
        }
      } else if (obj.type === asn1.Type.OCTETSTRING) {
        if (!_nonLatinRegex.test(obj.value)) {
          rval += "(" + obj.value + ") ";
        }
        rval += "0x" + forge2.util.bytesToHex(obj.value);
      } else if (obj.type === asn1.Type.UTF8) {
        rval += forge2.util.decodeUtf8(obj.value);
      } else if (obj.type === asn1.Type.PRINTABLESTRING || obj.type === asn1.Type.IA5String) {
        rval += obj.value;
      } else if (_nonLatinRegex.test(obj.value)) {
        rval += "0x" + forge2.util.bytesToHex(obj.value);
      } else if (obj.value.length === 0) {
        rval += "[null]";
      } else {
        rval += obj.value;
      }
    }
    return rval;
  };
});

// node_modules/node-forge/lib/md.js
var require_md = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  module2.exports = forge2.md = forge2.md || {};
  forge2.md.algorithms = forge2.md.algorithms || {};
});

// node_modules/node-forge/lib/hmac.js
var require_hmac = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_md();
  require_util();
  var hmac = module2.exports = forge2.hmac = forge2.hmac || {};
  hmac.create = function() {
    var _key = null;
    var _md = null;
    var _ipadding = null;
    var _opadding = null;
    var ctx = {};
    ctx.start = function(md, key) {
      if (md !== null) {
        if (typeof md === "string") {
          md = md.toLowerCase();
          if (md in forge2.md.algorithms) {
            _md = forge2.md.algorithms[md].create();
          } else {
            throw new Error('Unknown hash algorithm "' + md + '"');
          }
        } else {
          _md = md;
        }
      }
      if (key === null) {
        key = _key;
      } else {
        if (typeof key === "string") {
          key = forge2.util.createBuffer(key);
        } else if (forge2.util.isArray(key)) {
          var tmp = key;
          key = forge2.util.createBuffer();
          for (var i = 0; i < tmp.length; ++i) {
            key.putByte(tmp[i]);
          }
        }
        var keylen = key.length();
        if (keylen > _md.blockLength) {
          _md.start();
          _md.update(key.bytes());
          key = _md.digest();
        }
        _ipadding = forge2.util.createBuffer();
        _opadding = forge2.util.createBuffer();
        keylen = key.length();
        for (var i = 0; i < keylen; ++i) {
          var tmp = key.at(i);
          _ipadding.putByte(54 ^ tmp);
          _opadding.putByte(92 ^ tmp);
        }
        if (keylen < _md.blockLength) {
          var tmp = _md.blockLength - keylen;
          for (var i = 0; i < tmp; ++i) {
            _ipadding.putByte(54);
            _opadding.putByte(92);
          }
        }
        _key = key;
        _ipadding = _ipadding.bytes();
        _opadding = _opadding.bytes();
      }
      _md.start();
      _md.update(_ipadding);
    };
    ctx.update = function(bytes) {
      _md.update(bytes);
    };
    ctx.getMac = function() {
      var inner = _md.digest().bytes();
      _md.start();
      _md.update(_opadding);
      _md.update(inner);
      return _md.digest();
    };
    ctx.digest = ctx.getMac;
    return ctx;
  };
});

// node_modules/node-forge/lib/md5.js
var require_md5 = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_md();
  require_util();
  var md5 = module2.exports = forge2.md5 = forge2.md5 || {};
  forge2.md.md5 = forge2.md.algorithms.md5 = md5;
  md5.create = function() {
    if (!_initialized) {
      _init();
    }
    var _state = null;
    var _input = forge2.util.createBuffer();
    var _w = new Array(16);
    var md = {
      algorithm: "md5",
      blockLength: 64,
      digestLength: 16,
      messageLength: 0,
      fullMessageLength: null,
      messageLengthSize: 8
    };
    md.start = function() {
      md.messageLength = 0;
      md.fullMessageLength = md.messageLength64 = [];
      var int32s = md.messageLengthSize / 4;
      for (var i = 0; i < int32s; ++i) {
        md.fullMessageLength.push(0);
      }
      _input = forge2.util.createBuffer();
      _state = {
        h0: 1732584193,
        h1: 4023233417,
        h2: 2562383102,
        h3: 271733878
      };
      return md;
    };
    md.start();
    md.update = function(msg, encoding) {
      if (encoding === "utf8") {
        msg = forge2.util.encodeUtf8(msg);
      }
      var len = msg.length;
      md.messageLength += len;
      len = [len / 4294967296 >>> 0, len >>> 0];
      for (var i = md.fullMessageLength.length - 1; i >= 0; --i) {
        md.fullMessageLength[i] += len[1];
        len[1] = len[0] + (md.fullMessageLength[i] / 4294967296 >>> 0);
        md.fullMessageLength[i] = md.fullMessageLength[i] >>> 0;
        len[0] = len[1] / 4294967296 >>> 0;
      }
      _input.putBytes(msg);
      _update(_state, _w, _input);
      if (_input.read > 2048 || _input.length() === 0) {
        _input.compact();
      }
      return md;
    };
    md.digest = function() {
      var finalBlock = forge2.util.createBuffer();
      finalBlock.putBytes(_input.bytes());
      var remaining = md.fullMessageLength[md.fullMessageLength.length - 1] + md.messageLengthSize;
      var overflow = remaining & md.blockLength - 1;
      finalBlock.putBytes(_padding.substr(0, md.blockLength - overflow));
      var bits, carry = 0;
      for (var i = md.fullMessageLength.length - 1; i >= 0; --i) {
        bits = md.fullMessageLength[i] * 8 + carry;
        carry = bits / 4294967296 >>> 0;
        finalBlock.putInt32Le(bits >>> 0);
      }
      var s2 = {
        h0: _state.h0,
        h1: _state.h1,
        h2: _state.h2,
        h3: _state.h3
      };
      _update(s2, _w, finalBlock);
      var rval = forge2.util.createBuffer();
      rval.putInt32Le(s2.h0);
      rval.putInt32Le(s2.h1);
      rval.putInt32Le(s2.h2);
      rval.putInt32Le(s2.h3);
      return rval;
    };
    return md;
  };
  var _padding = null;
  var _g = null;
  var _r = null;
  var _k = null;
  var _initialized = false;
  function _init() {
    _padding = String.fromCharCode(128);
    _padding += forge2.util.fillString(String.fromCharCode(0), 64);
    _g = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      1,
      6,
      11,
      0,
      5,
      10,
      15,
      4,
      9,
      14,
      3,
      8,
      13,
      2,
      7,
      12,
      5,
      8,
      11,
      14,
      1,
      4,
      7,
      10,
      13,
      0,
      3,
      6,
      9,
      12,
      15,
      2,
      0,
      7,
      14,
      5,
      12,
      3,
      10,
      1,
      8,
      15,
      6,
      13,
      4,
      11,
      2,
      9
    ];
    _r = [
      7,
      12,
      17,
      22,
      7,
      12,
      17,
      22,
      7,
      12,
      17,
      22,
      7,
      12,
      17,
      22,
      5,
      9,
      14,
      20,
      5,
      9,
      14,
      20,
      5,
      9,
      14,
      20,
      5,
      9,
      14,
      20,
      4,
      11,
      16,
      23,
      4,
      11,
      16,
      23,
      4,
      11,
      16,
      23,
      4,
      11,
      16,
      23,
      6,
      10,
      15,
      21,
      6,
      10,
      15,
      21,
      6,
      10,
      15,
      21,
      6,
      10,
      15,
      21
    ];
    _k = new Array(64);
    for (var i = 0; i < 64; ++i) {
      _k[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296);
    }
    _initialized = true;
  }
  function _update(s, w, bytes) {
    var t, a, b, c, d, f, r, i;
    var len = bytes.length();
    while (len >= 64) {
      a = s.h0;
      b = s.h1;
      c = s.h2;
      d = s.h3;
      for (i = 0; i < 16; ++i) {
        w[i] = bytes.getInt32Le();
        f = d ^ b & (c ^ d);
        t = a + f + _k[i] + w[i];
        r = _r[i];
        a = d;
        d = c;
        c = b;
        b += t << r | t >>> 32 - r;
      }
      for (; i < 32; ++i) {
        f = c ^ d & (b ^ c);
        t = a + f + _k[i] + w[_g[i]];
        r = _r[i];
        a = d;
        d = c;
        c = b;
        b += t << r | t >>> 32 - r;
      }
      for (; i < 48; ++i) {
        f = b ^ c ^ d;
        t = a + f + _k[i] + w[_g[i]];
        r = _r[i];
        a = d;
        d = c;
        c = b;
        b += t << r | t >>> 32 - r;
      }
      for (; i < 64; ++i) {
        f = c ^ (b | ~d);
        t = a + f + _k[i] + w[_g[i]];
        r = _r[i];
        a = d;
        d = c;
        c = b;
        b += t << r | t >>> 32 - r;
      }
      s.h0 = s.h0 + a | 0;
      s.h1 = s.h1 + b | 0;
      s.h2 = s.h2 + c | 0;
      s.h3 = s.h3 + d | 0;
      len -= 64;
    }
  }
});

// node_modules/node-forge/lib/pem.js
var require_pem = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_util();
  var pem = module2.exports = forge2.pem = forge2.pem || {};
  pem.encode = function(msg, options) {
    options = options || {};
    var rval = "-----BEGIN " + msg.type + "-----\r\n";
    var header;
    if (msg.procType) {
      header = {
        name: "Proc-Type",
        values: [String(msg.procType.version), msg.procType.type]
      };
      rval += foldHeader(header);
    }
    if (msg.contentDomain) {
      header = {name: "Content-Domain", values: [msg.contentDomain]};
      rval += foldHeader(header);
    }
    if (msg.dekInfo) {
      header = {name: "DEK-Info", values: [msg.dekInfo.algorithm]};
      if (msg.dekInfo.parameters) {
        header.values.push(msg.dekInfo.parameters);
      }
      rval += foldHeader(header);
    }
    if (msg.headers) {
      for (var i = 0; i < msg.headers.length; ++i) {
        rval += foldHeader(msg.headers[i]);
      }
    }
    if (msg.procType) {
      rval += "\r\n";
    }
    rval += forge2.util.encode64(msg.body, options.maxline || 64) + "\r\n";
    rval += "-----END " + msg.type + "-----\r\n";
    return rval;
  };
  pem.decode = function(str) {
    var rval = [];
    var rMessage = /\s*-----BEGIN ([A-Z0-9- ]+)-----\r?\n?([\x21-\x7e\s]+?(?:\r?\n\r?\n))?([:A-Za-z0-9+\/=\s]+?)-----END \1-----/g;
    var rHeader = /([\x21-\x7e]+):\s*([\x21-\x7e\s^:]+)/;
    var rCRLF = /\r?\n/;
    var match;
    while (true) {
      match = rMessage.exec(str);
      if (!match) {
        break;
      }
      var msg = {
        type: match[1],
        procType: null,
        contentDomain: null,
        dekInfo: null,
        headers: [],
        body: forge2.util.decode64(match[3])
      };
      rval.push(msg);
      if (!match[2]) {
        continue;
      }
      var lines = match[2].split(rCRLF);
      var li = 0;
      while (match && li < lines.length) {
        var line = lines[li].replace(/\s+$/, "");
        for (var nl = li + 1; nl < lines.length; ++nl) {
          var next = lines[nl];
          if (!/\s/.test(next[0])) {
            break;
          }
          line += next;
          li = nl;
        }
        match = line.match(rHeader);
        if (match) {
          var header = {name: match[1], values: []};
          var values = match[2].split(",");
          for (var vi = 0; vi < values.length; ++vi) {
            header.values.push(ltrim(values[vi]));
          }
          if (!msg.procType) {
            if (header.name !== "Proc-Type") {
              throw new Error('Invalid PEM formatted message. The first encapsulated header must be "Proc-Type".');
            } else if (header.values.length !== 2) {
              throw new Error('Invalid PEM formatted message. The "Proc-Type" header must have two subfields.');
            }
            msg.procType = {version: values[0], type: values[1]};
          } else if (!msg.contentDomain && header.name === "Content-Domain") {
            msg.contentDomain = values[0] || "";
          } else if (!msg.dekInfo && header.name === "DEK-Info") {
            if (header.values.length === 0) {
              throw new Error('Invalid PEM formatted message. The "DEK-Info" header must have at least one subfield.');
            }
            msg.dekInfo = {algorithm: values[0], parameters: values[1] || null};
          } else {
            msg.headers.push(header);
          }
        }
        ++li;
      }
      if (msg.procType === "ENCRYPTED" && !msg.dekInfo) {
        throw new Error('Invalid PEM formatted message. The "DEK-Info" header must be present if "Proc-Type" is "ENCRYPTED".');
      }
    }
    if (rval.length === 0) {
      throw new Error("Invalid PEM formatted message.");
    }
    return rval;
  };
  function foldHeader(header) {
    var rval = header.name + ": ";
    var values = [];
    var insertSpace = function(match, $1) {
      return " " + $1;
    };
    for (var i = 0; i < header.values.length; ++i) {
      values.push(header.values[i].replace(/^(\S+\r\n)/, insertSpace));
    }
    rval += values.join(",") + "\r\n";
    var length = 0;
    var candidate = -1;
    for (var i = 0; i < rval.length; ++i, ++length) {
      if (length > 65 && candidate !== -1) {
        var insert = rval[candidate];
        if (insert === ",") {
          ++candidate;
          rval = rval.substr(0, candidate) + "\r\n " + rval.substr(candidate);
        } else {
          rval = rval.substr(0, candidate) + "\r\n" + insert + rval.substr(candidate + 1);
        }
        length = i - candidate - 1;
        candidate = -1;
        ++i;
      } else if (rval[i] === " " || rval[i] === "	" || rval[i] === ",") {
        candidate = i;
      }
    }
    return rval;
  }
  function ltrim(str) {
    return str.replace(/^\s+/, "");
  }
});

// node_modules/node-forge/lib/des.js
var require_des = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_cipher();
  require_cipherModes();
  require_util();
  module2.exports = forge2.des = forge2.des || {};
  forge2.des.startEncrypting = function(key, iv, output, mode) {
    var cipher = _createCipher({
      key,
      output,
      decrypt: false,
      mode: mode || (iv === null ? "ECB" : "CBC")
    });
    cipher.start(iv);
    return cipher;
  };
  forge2.des.createEncryptionCipher = function(key, mode) {
    return _createCipher({
      key,
      output: null,
      decrypt: false,
      mode
    });
  };
  forge2.des.startDecrypting = function(key, iv, output, mode) {
    var cipher = _createCipher({
      key,
      output,
      decrypt: true,
      mode: mode || (iv === null ? "ECB" : "CBC")
    });
    cipher.start(iv);
    return cipher;
  };
  forge2.des.createDecryptionCipher = function(key, mode) {
    return _createCipher({
      key,
      output: null,
      decrypt: true,
      mode
    });
  };
  forge2.des.Algorithm = function(name, mode) {
    var self2 = this;
    self2.name = name;
    self2.mode = new mode({
      blockSize: 8,
      cipher: {
        encrypt: function(inBlock, outBlock) {
          return _updateBlock(self2._keys, inBlock, outBlock, false);
        },
        decrypt: function(inBlock, outBlock) {
          return _updateBlock(self2._keys, inBlock, outBlock, true);
        }
      }
    });
    self2._init = false;
  };
  forge2.des.Algorithm.prototype.initialize = function(options) {
    if (this._init) {
      return;
    }
    var key = forge2.util.createBuffer(options.key);
    if (this.name.indexOf("3DES") === 0) {
      if (key.length() !== 24) {
        throw new Error("Invalid Triple-DES key size: " + key.length() * 8);
      }
    }
    this._keys = _createKeys(key);
    this._init = true;
  };
  registerAlgorithm("DES-ECB", forge2.cipher.modes.ecb);
  registerAlgorithm("DES-CBC", forge2.cipher.modes.cbc);
  registerAlgorithm("DES-CFB", forge2.cipher.modes.cfb);
  registerAlgorithm("DES-OFB", forge2.cipher.modes.ofb);
  registerAlgorithm("DES-CTR", forge2.cipher.modes.ctr);
  registerAlgorithm("3DES-ECB", forge2.cipher.modes.ecb);
  registerAlgorithm("3DES-CBC", forge2.cipher.modes.cbc);
  registerAlgorithm("3DES-CFB", forge2.cipher.modes.cfb);
  registerAlgorithm("3DES-OFB", forge2.cipher.modes.ofb);
  registerAlgorithm("3DES-CTR", forge2.cipher.modes.ctr);
  function registerAlgorithm(name, mode) {
    var factory = function() {
      return new forge2.des.Algorithm(name, mode);
    };
    forge2.cipher.registerAlgorithm(name, factory);
  }
  var spfunction1 = [16843776, 0, 65536, 16843780, 16842756, 66564, 4, 65536, 1024, 16843776, 16843780, 1024, 16778244, 16842756, 16777216, 4, 1028, 16778240, 16778240, 66560, 66560, 16842752, 16842752, 16778244, 65540, 16777220, 16777220, 65540, 0, 1028, 66564, 16777216, 65536, 16843780, 4, 16842752, 16843776, 16777216, 16777216, 1024, 16842756, 65536, 66560, 16777220, 1024, 4, 16778244, 66564, 16843780, 65540, 16842752, 16778244, 16777220, 1028, 66564, 16843776, 1028, 16778240, 16778240, 0, 65540, 66560, 0, 16842756];
  var spfunction2 = [-2146402272, -2147450880, 32768, 1081376, 1048576, 32, -2146435040, -2147450848, -2147483616, -2146402272, -2146402304, -2147483648, -2147450880, 1048576, 32, -2146435040, 1081344, 1048608, -2147450848, 0, -2147483648, 32768, 1081376, -2146435072, 1048608, -2147483616, 0, 1081344, 32800, -2146402304, -2146435072, 32800, 0, 1081376, -2146435040, 1048576, -2147450848, -2146435072, -2146402304, 32768, -2146435072, -2147450880, 32, -2146402272, 1081376, 32, 32768, -2147483648, 32800, -2146402304, 1048576, -2147483616, 1048608, -2147450848, -2147483616, 1048608, 1081344, 0, -2147450880, 32800, -2147483648, -2146435040, -2146402272, 1081344];
  var spfunction3 = [520, 134349312, 0, 134348808, 134218240, 0, 131592, 134218240, 131080, 134217736, 134217736, 131072, 134349320, 131080, 134348800, 520, 134217728, 8, 134349312, 512, 131584, 134348800, 134348808, 131592, 134218248, 131584, 131072, 134218248, 8, 134349320, 512, 134217728, 134349312, 134217728, 131080, 520, 131072, 134349312, 134218240, 0, 512, 131080, 134349320, 134218240, 134217736, 512, 0, 134348808, 134218248, 131072, 134217728, 134349320, 8, 131592, 131584, 134217736, 134348800, 134218248, 520, 134348800, 131592, 8, 134348808, 131584];
  var spfunction4 = [8396801, 8321, 8321, 128, 8396928, 8388737, 8388609, 8193, 0, 8396800, 8396800, 8396929, 129, 0, 8388736, 8388609, 1, 8192, 8388608, 8396801, 128, 8388608, 8193, 8320, 8388737, 1, 8320, 8388736, 8192, 8396928, 8396929, 129, 8388736, 8388609, 8396800, 8396929, 129, 0, 0, 8396800, 8320, 8388736, 8388737, 1, 8396801, 8321, 8321, 128, 8396929, 129, 1, 8192, 8388609, 8193, 8396928, 8388737, 8193, 8320, 8388608, 8396801, 128, 8388608, 8192, 8396928];
  var spfunction5 = [256, 34078976, 34078720, 1107296512, 524288, 256, 1073741824, 34078720, 1074266368, 524288, 33554688, 1074266368, 1107296512, 1107820544, 524544, 1073741824, 33554432, 1074266112, 1074266112, 0, 1073742080, 1107820800, 1107820800, 33554688, 1107820544, 1073742080, 0, 1107296256, 34078976, 33554432, 1107296256, 524544, 524288, 1107296512, 256, 33554432, 1073741824, 34078720, 1107296512, 1074266368, 33554688, 1073741824, 1107820544, 34078976, 1074266368, 256, 33554432, 1107820544, 1107820800, 524544, 1107296256, 1107820800, 34078720, 0, 1074266112, 1107296256, 524544, 33554688, 1073742080, 524288, 0, 1074266112, 34078976, 1073742080];
  var spfunction6 = [536870928, 541065216, 16384, 541081616, 541065216, 16, 541081616, 4194304, 536887296, 4210704, 4194304, 536870928, 4194320, 536887296, 536870912, 16400, 0, 4194320, 536887312, 16384, 4210688, 536887312, 16, 541065232, 541065232, 0, 4210704, 541081600, 16400, 4210688, 541081600, 536870912, 536887296, 16, 541065232, 4210688, 541081616, 4194304, 16400, 536870928, 4194304, 536887296, 536870912, 16400, 536870928, 541081616, 4210688, 541065216, 4210704, 541081600, 0, 541065232, 16, 16384, 541065216, 4210704, 16384, 4194320, 536887312, 0, 541081600, 536870912, 4194320, 536887312];
  var spfunction7 = [2097152, 69206018, 67110914, 0, 2048, 67110914, 2099202, 69208064, 69208066, 2097152, 0, 67108866, 2, 67108864, 69206018, 2050, 67110912, 2099202, 2097154, 67110912, 67108866, 69206016, 69208064, 2097154, 69206016, 2048, 2050, 69208066, 2099200, 2, 67108864, 2099200, 67108864, 2099200, 2097152, 67110914, 67110914, 69206018, 69206018, 2, 2097154, 67108864, 67110912, 2097152, 69208064, 2050, 2099202, 69208064, 2050, 67108866, 69208066, 69206016, 2099200, 0, 2, 69208066, 0, 2099202, 69206016, 2048, 67108866, 67110912, 2048, 2097154];
  var spfunction8 = [268439616, 4096, 262144, 268701760, 268435456, 268439616, 64, 268435456, 262208, 268697600, 268701760, 266240, 268701696, 266304, 4096, 64, 268697600, 268435520, 268439552, 4160, 266240, 262208, 268697664, 268701696, 4160, 0, 0, 268697664, 268435520, 268439552, 266304, 262144, 266304, 262144, 268701696, 4096, 64, 268697664, 4096, 266304, 268439552, 64, 268435520, 268697600, 268697664, 268435456, 262144, 268439616, 0, 268701760, 262208, 268435520, 268697600, 268439552, 268439616, 0, 268701760, 266240, 266240, 4160, 4160, 262208, 268435456, 268701696];
  function _createKeys(key) {
    var pc2bytes0 = [0, 4, 536870912, 536870916, 65536, 65540, 536936448, 536936452, 512, 516, 536871424, 536871428, 66048, 66052, 536936960, 536936964], pc2bytes1 = [0, 1, 1048576, 1048577, 67108864, 67108865, 68157440, 68157441, 256, 257, 1048832, 1048833, 67109120, 67109121, 68157696, 68157697], pc2bytes2 = [0, 8, 2048, 2056, 16777216, 16777224, 16779264, 16779272, 0, 8, 2048, 2056, 16777216, 16777224, 16779264, 16779272], pc2bytes3 = [0, 2097152, 134217728, 136314880, 8192, 2105344, 134225920, 136323072, 131072, 2228224, 134348800, 136445952, 139264, 2236416, 134356992, 136454144], pc2bytes4 = [0, 262144, 16, 262160, 0, 262144, 16, 262160, 4096, 266240, 4112, 266256, 4096, 266240, 4112, 266256], pc2bytes5 = [0, 1024, 32, 1056, 0, 1024, 32, 1056, 33554432, 33555456, 33554464, 33555488, 33554432, 33555456, 33554464, 33555488], pc2bytes6 = [0, 268435456, 524288, 268959744, 2, 268435458, 524290, 268959746, 0, 268435456, 524288, 268959744, 2, 268435458, 524290, 268959746], pc2bytes7 = [0, 65536, 2048, 67584, 536870912, 536936448, 536872960, 536938496, 131072, 196608, 133120, 198656, 537001984, 537067520, 537004032, 537069568], pc2bytes8 = [0, 262144, 0, 262144, 2, 262146, 2, 262146, 33554432, 33816576, 33554432, 33816576, 33554434, 33816578, 33554434, 33816578], pc2bytes9 = [0, 268435456, 8, 268435464, 0, 268435456, 8, 268435464, 1024, 268436480, 1032, 268436488, 1024, 268436480, 1032, 268436488], pc2bytes10 = [0, 32, 0, 32, 1048576, 1048608, 1048576, 1048608, 8192, 8224, 8192, 8224, 1056768, 1056800, 1056768, 1056800], pc2bytes11 = [0, 16777216, 512, 16777728, 2097152, 18874368, 2097664, 18874880, 67108864, 83886080, 67109376, 83886592, 69206016, 85983232, 69206528, 85983744], pc2bytes12 = [0, 4096, 134217728, 134221824, 524288, 528384, 134742016, 134746112, 16, 4112, 134217744, 134221840, 524304, 528400, 134742032, 134746128], pc2bytes13 = [0, 4, 256, 260, 0, 4, 256, 260, 1, 5, 257, 261, 1, 5, 257, 261];
    var iterations = key.length() > 8 ? 3 : 1;
    var keys2 = [];
    var shifts = [0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0];
    var n = 0, tmp;
    for (var j = 0; j < iterations; j++) {
      var left = key.getInt32();
      var right = key.getInt32();
      tmp = (left >>> 4 ^ right) & 252645135;
      right ^= tmp;
      left ^= tmp << 4;
      tmp = (right >>> -16 ^ left) & 65535;
      left ^= tmp;
      right ^= tmp << -16;
      tmp = (left >>> 2 ^ right) & 858993459;
      right ^= tmp;
      left ^= tmp << 2;
      tmp = (right >>> -16 ^ left) & 65535;
      left ^= tmp;
      right ^= tmp << -16;
      tmp = (left >>> 1 ^ right) & 1431655765;
      right ^= tmp;
      left ^= tmp << 1;
      tmp = (right >>> 8 ^ left) & 16711935;
      left ^= tmp;
      right ^= tmp << 8;
      tmp = (left >>> 1 ^ right) & 1431655765;
      right ^= tmp;
      left ^= tmp << 1;
      tmp = left << 8 | right >>> 20 & 240;
      left = right << 24 | right << 8 & 16711680 | right >>> 8 & 65280 | right >>> 24 & 240;
      right = tmp;
      for (var i = 0; i < shifts.length; ++i) {
        if (shifts[i]) {
          left = left << 2 | left >>> 26;
          right = right << 2 | right >>> 26;
        } else {
          left = left << 1 | left >>> 27;
          right = right << 1 | right >>> 27;
        }
        left &= -15;
        right &= -15;
        var lefttmp = pc2bytes0[left >>> 28] | pc2bytes1[left >>> 24 & 15] | pc2bytes2[left >>> 20 & 15] | pc2bytes3[left >>> 16 & 15] | pc2bytes4[left >>> 12 & 15] | pc2bytes5[left >>> 8 & 15] | pc2bytes6[left >>> 4 & 15];
        var righttmp = pc2bytes7[right >>> 28] | pc2bytes8[right >>> 24 & 15] | pc2bytes9[right >>> 20 & 15] | pc2bytes10[right >>> 16 & 15] | pc2bytes11[right >>> 12 & 15] | pc2bytes12[right >>> 8 & 15] | pc2bytes13[right >>> 4 & 15];
        tmp = (righttmp >>> 16 ^ lefttmp) & 65535;
        keys2[n++] = lefttmp ^ tmp;
        keys2[n++] = righttmp ^ tmp << 16;
      }
    }
    return keys2;
  }
  function _updateBlock(keys2, input, output, decrypt) {
    var iterations = keys2.length === 32 ? 3 : 9;
    var looping;
    if (iterations === 3) {
      looping = decrypt ? [30, -2, -2] : [0, 32, 2];
    } else {
      looping = decrypt ? [94, 62, -2, 32, 64, 2, 30, -2, -2] : [0, 32, 2, 62, 30, -2, 64, 96, 2];
    }
    var tmp;
    var left = input[0];
    var right = input[1];
    tmp = (left >>> 4 ^ right) & 252645135;
    right ^= tmp;
    left ^= tmp << 4;
    tmp = (left >>> 16 ^ right) & 65535;
    right ^= tmp;
    left ^= tmp << 16;
    tmp = (right >>> 2 ^ left) & 858993459;
    left ^= tmp;
    right ^= tmp << 2;
    tmp = (right >>> 8 ^ left) & 16711935;
    left ^= tmp;
    right ^= tmp << 8;
    tmp = (left >>> 1 ^ right) & 1431655765;
    right ^= tmp;
    left ^= tmp << 1;
    left = left << 1 | left >>> 31;
    right = right << 1 | right >>> 31;
    for (var j = 0; j < iterations; j += 3) {
      var endloop = looping[j + 1];
      var loopinc = looping[j + 2];
      for (var i = looping[j]; i != endloop; i += loopinc) {
        var right1 = right ^ keys2[i];
        var right2 = (right >>> 4 | right << 28) ^ keys2[i + 1];
        tmp = left;
        left = right;
        right = tmp ^ (spfunction2[right1 >>> 24 & 63] | spfunction4[right1 >>> 16 & 63] | spfunction6[right1 >>> 8 & 63] | spfunction8[right1 & 63] | spfunction1[right2 >>> 24 & 63] | spfunction3[right2 >>> 16 & 63] | spfunction5[right2 >>> 8 & 63] | spfunction7[right2 & 63]);
      }
      tmp = left;
      left = right;
      right = tmp;
    }
    left = left >>> 1 | left << 31;
    right = right >>> 1 | right << 31;
    tmp = (left >>> 1 ^ right) & 1431655765;
    right ^= tmp;
    left ^= tmp << 1;
    tmp = (right >>> 8 ^ left) & 16711935;
    left ^= tmp;
    right ^= tmp << 8;
    tmp = (right >>> 2 ^ left) & 858993459;
    left ^= tmp;
    right ^= tmp << 2;
    tmp = (left >>> 16 ^ right) & 65535;
    right ^= tmp;
    left ^= tmp << 16;
    tmp = (left >>> 4 ^ right) & 252645135;
    right ^= tmp;
    left ^= tmp << 4;
    output[0] = left;
    output[1] = right;
  }
  function _createCipher(options) {
    options = options || {};
    var mode = (options.mode || "CBC").toUpperCase();
    var algorithm = "DES-" + mode;
    var cipher;
    if (options.decrypt) {
      cipher = forge2.cipher.createDecipher(algorithm, options.key);
    } else {
      cipher = forge2.cipher.createCipher(algorithm, options.key);
    }
    var start = cipher.start;
    cipher.start = function(iv, options2) {
      var output = null;
      if (options2 instanceof forge2.util.ByteBuffer) {
        output = options2;
        options2 = {};
      }
      options2 = options2 || {};
      options2.output = output;
      options2.iv = iv;
      start.call(cipher, options2);
    };
    return cipher;
  }
});

// node_modules/node-forge/lib/pbkdf2.js
var require_pbkdf2 = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_hmac();
  require_md();
  require_util();
  var pkcs5 = forge2.pkcs5 = forge2.pkcs5 || {};
  var crypto;
  if (forge2.util.isNodejs && !forge2.options.usePureJavaScript) {
    crypto = require("crypto");
  }
  module2.exports = forge2.pbkdf2 = pkcs5.pbkdf2 = function(p, s, c, dkLen, md, callback) {
    if (typeof md === "function") {
      callback = md;
      md = null;
    }
    if (forge2.util.isNodejs && !forge2.options.usePureJavaScript && crypto.pbkdf2 && (md === null || typeof md !== "object") && (crypto.pbkdf2Sync.length > 4 || (!md || md === "sha1"))) {
      if (typeof md !== "string") {
        md = "sha1";
      }
      p = Buffer.from(p, "binary");
      s = Buffer.from(s, "binary");
      if (!callback) {
        if (crypto.pbkdf2Sync.length === 4) {
          return crypto.pbkdf2Sync(p, s, c, dkLen).toString("binary");
        }
        return crypto.pbkdf2Sync(p, s, c, dkLen, md).toString("binary");
      }
      if (crypto.pbkdf2Sync.length === 4) {
        return crypto.pbkdf2(p, s, c, dkLen, function(err2, key) {
          if (err2) {
            return callback(err2);
          }
          callback(null, key.toString("binary"));
        });
      }
      return crypto.pbkdf2(p, s, c, dkLen, md, function(err2, key) {
        if (err2) {
          return callback(err2);
        }
        callback(null, key.toString("binary"));
      });
    }
    if (typeof md === "undefined" || md === null) {
      md = "sha1";
    }
    if (typeof md === "string") {
      if (!(md in forge2.md.algorithms)) {
        throw new Error("Unknown hash algorithm: " + md);
      }
      md = forge2.md[md].create();
    }
    var hLen = md.digestLength;
    if (dkLen > 4294967295 * hLen) {
      var err = new Error("Derived key is too long.");
      if (callback) {
        return callback(err);
      }
      throw err;
    }
    var len = Math.ceil(dkLen / hLen);
    var r = dkLen - (len - 1) * hLen;
    var prf = forge2.hmac.create();
    prf.start(md, p);
    var dk = "";
    var xor, u_c, u_c1;
    if (!callback) {
      for (var i = 1; i <= len; ++i) {
        prf.start(null, null);
        prf.update(s);
        prf.update(forge2.util.int32ToBytes(i));
        xor = u_c1 = prf.digest().getBytes();
        for (var j = 2; j <= c; ++j) {
          prf.start(null, null);
          prf.update(u_c1);
          u_c = prf.digest().getBytes();
          xor = forge2.util.xorBytes(xor, u_c, hLen);
          u_c1 = u_c;
        }
        dk += i < len ? xor : xor.substr(0, r);
      }
      return dk;
    }
    var i = 1, j;
    function outer() {
      if (i > len) {
        return callback(null, dk);
      }
      prf.start(null, null);
      prf.update(s);
      prf.update(forge2.util.int32ToBytes(i));
      xor = u_c1 = prf.digest().getBytes();
      j = 2;
      inner();
    }
    function inner() {
      if (j <= c) {
        prf.start(null, null);
        prf.update(u_c1);
        u_c = prf.digest().getBytes();
        xor = forge2.util.xorBytes(xor, u_c, hLen);
        u_c1 = u_c;
        ++j;
        return forge2.util.setImmediate(inner);
      }
      dk += i < len ? xor : xor.substr(0, r);
      ++i;
      outer();
    }
    outer();
  };
});

// node_modules/node-forge/lib/sha256.js
var require_sha256 = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_md();
  require_util();
  var sha256 = module2.exports = forge2.sha256 = forge2.sha256 || {};
  forge2.md.sha256 = forge2.md.algorithms.sha256 = sha256;
  sha256.create = function() {
    if (!_initialized) {
      _init();
    }
    var _state = null;
    var _input = forge2.util.createBuffer();
    var _w = new Array(64);
    var md = {
      algorithm: "sha256",
      blockLength: 64,
      digestLength: 32,
      messageLength: 0,
      fullMessageLength: null,
      messageLengthSize: 8
    };
    md.start = function() {
      md.messageLength = 0;
      md.fullMessageLength = md.messageLength64 = [];
      var int32s = md.messageLengthSize / 4;
      for (var i = 0; i < int32s; ++i) {
        md.fullMessageLength.push(0);
      }
      _input = forge2.util.createBuffer();
      _state = {
        h0: 1779033703,
        h1: 3144134277,
        h2: 1013904242,
        h3: 2773480762,
        h4: 1359893119,
        h5: 2600822924,
        h6: 528734635,
        h7: 1541459225
      };
      return md;
    };
    md.start();
    md.update = function(msg, encoding) {
      if (encoding === "utf8") {
        msg = forge2.util.encodeUtf8(msg);
      }
      var len = msg.length;
      md.messageLength += len;
      len = [len / 4294967296 >>> 0, len >>> 0];
      for (var i = md.fullMessageLength.length - 1; i >= 0; --i) {
        md.fullMessageLength[i] += len[1];
        len[1] = len[0] + (md.fullMessageLength[i] / 4294967296 >>> 0);
        md.fullMessageLength[i] = md.fullMessageLength[i] >>> 0;
        len[0] = len[1] / 4294967296 >>> 0;
      }
      _input.putBytes(msg);
      _update(_state, _w, _input);
      if (_input.read > 2048 || _input.length() === 0) {
        _input.compact();
      }
      return md;
    };
    md.digest = function() {
      var finalBlock = forge2.util.createBuffer();
      finalBlock.putBytes(_input.bytes());
      var remaining = md.fullMessageLength[md.fullMessageLength.length - 1] + md.messageLengthSize;
      var overflow = remaining & md.blockLength - 1;
      finalBlock.putBytes(_padding.substr(0, md.blockLength - overflow));
      var next, carry;
      var bits = md.fullMessageLength[0] * 8;
      for (var i = 0; i < md.fullMessageLength.length - 1; ++i) {
        next = md.fullMessageLength[i + 1] * 8;
        carry = next / 4294967296 >>> 0;
        bits += carry;
        finalBlock.putInt32(bits >>> 0);
        bits = next >>> 0;
      }
      finalBlock.putInt32(bits);
      var s2 = {
        h0: _state.h0,
        h1: _state.h1,
        h2: _state.h2,
        h3: _state.h3,
        h4: _state.h4,
        h5: _state.h5,
        h6: _state.h6,
        h7: _state.h7
      };
      _update(s2, _w, finalBlock);
      var rval = forge2.util.createBuffer();
      rval.putInt32(s2.h0);
      rval.putInt32(s2.h1);
      rval.putInt32(s2.h2);
      rval.putInt32(s2.h3);
      rval.putInt32(s2.h4);
      rval.putInt32(s2.h5);
      rval.putInt32(s2.h6);
      rval.putInt32(s2.h7);
      return rval;
    };
    return md;
  };
  var _padding = null;
  var _initialized = false;
  var _k = null;
  function _init() {
    _padding = String.fromCharCode(128);
    _padding += forge2.util.fillString(String.fromCharCode(0), 64);
    _k = [
      1116352408,
      1899447441,
      3049323471,
      3921009573,
      961987163,
      1508970993,
      2453635748,
      2870763221,
      3624381080,
      310598401,
      607225278,
      1426881987,
      1925078388,
      2162078206,
      2614888103,
      3248222580,
      3835390401,
      4022224774,
      264347078,
      604807628,
      770255983,
      1249150122,
      1555081692,
      1996064986,
      2554220882,
      2821834349,
      2952996808,
      3210313671,
      3336571891,
      3584528711,
      113926993,
      338241895,
      666307205,
      773529912,
      1294757372,
      1396182291,
      1695183700,
      1986661051,
      2177026350,
      2456956037,
      2730485921,
      2820302411,
      3259730800,
      3345764771,
      3516065817,
      3600352804,
      4094571909,
      275423344,
      430227734,
      506948616,
      659060556,
      883997877,
      958139571,
      1322822218,
      1537002063,
      1747873779,
      1955562222,
      2024104815,
      2227730452,
      2361852424,
      2428436474,
      2756734187,
      3204031479,
      3329325298
    ];
    _initialized = true;
  }
  function _update(s, w, bytes) {
    var t1, t2, s0, s1, ch, maj, i, a, b, c, d, e, f, g, h;
    var len = bytes.length();
    while (len >= 64) {
      for (i = 0; i < 16; ++i) {
        w[i] = bytes.getInt32();
      }
      for (; i < 64; ++i) {
        t1 = w[i - 2];
        t1 = (t1 >>> 17 | t1 << 15) ^ (t1 >>> 19 | t1 << 13) ^ t1 >>> 10;
        t2 = w[i - 15];
        t2 = (t2 >>> 7 | t2 << 25) ^ (t2 >>> 18 | t2 << 14) ^ t2 >>> 3;
        w[i] = t1 + w[i - 7] + t2 + w[i - 16] | 0;
      }
      a = s.h0;
      b = s.h1;
      c = s.h2;
      d = s.h3;
      e = s.h4;
      f = s.h5;
      g = s.h6;
      h = s.h7;
      for (i = 0; i < 64; ++i) {
        s1 = (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
        ch = g ^ e & (f ^ g);
        s0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
        maj = a & b | c & (a ^ b);
        t1 = h + s1 + ch + _k[i] + w[i];
        t2 = s0 + maj;
        h = g;
        g = f;
        f = e;
        e = d + t1 >>> 0;
        d = c;
        c = b;
        b = a;
        a = t1 + t2 >>> 0;
      }
      s.h0 = s.h0 + a | 0;
      s.h1 = s.h1 + b | 0;
      s.h2 = s.h2 + c | 0;
      s.h3 = s.h3 + d | 0;
      s.h4 = s.h4 + e | 0;
      s.h5 = s.h5 + f | 0;
      s.h6 = s.h6 + g | 0;
      s.h7 = s.h7 + h | 0;
      len -= 64;
    }
  }
});

// node_modules/node-forge/lib/prng.js
var require_prng = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_util();
  var _crypto = null;
  if (forge2.util.isNodejs && !forge2.options.usePureJavaScript && !process.versions["node-webkit"]) {
    _crypto = require("crypto");
  }
  var prng = module2.exports = forge2.prng = forge2.prng || {};
  prng.create = function(plugin) {
    var ctx = {
      plugin,
      key: null,
      seed: null,
      time: null,
      reseeds: 0,
      generated: 0,
      keyBytes: ""
    };
    var md = plugin.md;
    var pools = new Array(32);
    for (var i = 0; i < 32; ++i) {
      pools[i] = md.create();
    }
    ctx.pools = pools;
    ctx.pool = 0;
    ctx.generate = function(count, callback) {
      if (!callback) {
        return ctx.generateSync(count);
      }
      var cipher = ctx.plugin.cipher;
      var increment = ctx.plugin.increment;
      var formatKey = ctx.plugin.formatKey;
      var formatSeed = ctx.plugin.formatSeed;
      var b = forge2.util.createBuffer();
      ctx.key = null;
      generate();
      function generate(err) {
        if (err) {
          return callback(err);
        }
        if (b.length() >= count) {
          return callback(null, b.getBytes(count));
        }
        if (ctx.generated > 1048575) {
          ctx.key = null;
        }
        if (ctx.key === null) {
          return forge2.util.nextTick(function() {
            _reseed(generate);
          });
        }
        var bytes = cipher(ctx.key, ctx.seed);
        ctx.generated += bytes.length;
        b.putBytes(bytes);
        ctx.key = formatKey(cipher(ctx.key, increment(ctx.seed)));
        ctx.seed = formatSeed(cipher(ctx.key, ctx.seed));
        forge2.util.setImmediate(generate);
      }
    };
    ctx.generateSync = function(count) {
      var cipher = ctx.plugin.cipher;
      var increment = ctx.plugin.increment;
      var formatKey = ctx.plugin.formatKey;
      var formatSeed = ctx.plugin.formatSeed;
      ctx.key = null;
      var b = forge2.util.createBuffer();
      while (b.length() < count) {
        if (ctx.generated > 1048575) {
          ctx.key = null;
        }
        if (ctx.key === null) {
          _reseedSync();
        }
        var bytes = cipher(ctx.key, ctx.seed);
        ctx.generated += bytes.length;
        b.putBytes(bytes);
        ctx.key = formatKey(cipher(ctx.key, increment(ctx.seed)));
        ctx.seed = formatSeed(cipher(ctx.key, ctx.seed));
      }
      return b.getBytes(count);
    };
    function _reseed(callback) {
      if (ctx.pools[0].messageLength >= 32) {
        _seed();
        return callback();
      }
      var needed = 32 - ctx.pools[0].messageLength << 5;
      ctx.seedFile(needed, function(err, bytes) {
        if (err) {
          return callback(err);
        }
        ctx.collect(bytes);
        _seed();
        callback();
      });
    }
    function _reseedSync() {
      if (ctx.pools[0].messageLength >= 32) {
        return _seed();
      }
      var needed = 32 - ctx.pools[0].messageLength << 5;
      ctx.collect(ctx.seedFileSync(needed));
      _seed();
    }
    function _seed() {
      ctx.reseeds = ctx.reseeds === 4294967295 ? 0 : ctx.reseeds + 1;
      var md2 = ctx.plugin.md.create();
      md2.update(ctx.keyBytes);
      var _2powK = 1;
      for (var k = 0; k < 32; ++k) {
        if (ctx.reseeds % _2powK === 0) {
          md2.update(ctx.pools[k].digest().getBytes());
          ctx.pools[k].start();
        }
        _2powK = _2powK << 1;
      }
      ctx.keyBytes = md2.digest().getBytes();
      md2.start();
      md2.update(ctx.keyBytes);
      var seedBytes = md2.digest().getBytes();
      ctx.key = ctx.plugin.formatKey(ctx.keyBytes);
      ctx.seed = ctx.plugin.formatSeed(seedBytes);
      ctx.generated = 0;
    }
    function defaultSeedFile(needed) {
      var getRandomValues = null;
      var globalScope = forge2.util.globalScope;
      var _crypto2 = globalScope.crypto || globalScope.msCrypto;
      if (_crypto2 && _crypto2.getRandomValues) {
        getRandomValues = function(arr) {
          return _crypto2.getRandomValues(arr);
        };
      }
      var b = forge2.util.createBuffer();
      if (getRandomValues) {
        while (b.length() < needed) {
          var count = Math.max(1, Math.min(needed - b.length(), 65536) / 4);
          var entropy = new Uint32Array(Math.floor(count));
          try {
            getRandomValues(entropy);
            for (var i2 = 0; i2 < entropy.length; ++i2) {
              b.putInt32(entropy[i2]);
            }
          } catch (e) {
            if (!(typeof QuotaExceededError !== "undefined" && e instanceof QuotaExceededError)) {
              throw e;
            }
          }
        }
      }
      if (b.length() < needed) {
        var hi, lo, next;
        var seed = Math.floor(Math.random() * 65536);
        while (b.length() < needed) {
          lo = 16807 * (seed & 65535);
          hi = 16807 * (seed >> 16);
          lo += (hi & 32767) << 16;
          lo += hi >> 15;
          lo = (lo & 2147483647) + (lo >> 31);
          seed = lo & 4294967295;
          for (var i2 = 0; i2 < 3; ++i2) {
            next = seed >>> (i2 << 3);
            next ^= Math.floor(Math.random() * 256);
            b.putByte(String.fromCharCode(next & 255));
          }
        }
      }
      return b.getBytes(needed);
    }
    if (_crypto) {
      ctx.seedFile = function(needed, callback) {
        _crypto.randomBytes(needed, function(err, bytes) {
          if (err) {
            return callback(err);
          }
          callback(null, bytes.toString());
        });
      };
      ctx.seedFileSync = function(needed) {
        return _crypto.randomBytes(needed).toString();
      };
    } else {
      ctx.seedFile = function(needed, callback) {
        try {
          callback(null, defaultSeedFile(needed));
        } catch (e) {
          callback(e);
        }
      };
      ctx.seedFileSync = defaultSeedFile;
    }
    ctx.collect = function(bytes) {
      var count = bytes.length;
      for (var i2 = 0; i2 < count; ++i2) {
        ctx.pools[ctx.pool].update(bytes.substr(i2, 1));
        ctx.pool = ctx.pool === 31 ? 0 : ctx.pool + 1;
      }
    };
    ctx.collectInt = function(i2, n) {
      var bytes = "";
      for (var x = 0; x < n; x += 8) {
        bytes += String.fromCharCode(i2 >> x & 255);
      }
      ctx.collect(bytes);
    };
    ctx.registerWorker = function(worker) {
      if (worker === self) {
        ctx.seedFile = function(needed, callback) {
          function listener2(e) {
            var data = e.data;
            if (data.forge && data.forge.prng) {
              self.removeEventListener("message", listener2);
              callback(data.forge.prng.err, data.forge.prng.bytes);
            }
          }
          self.addEventListener("message", listener2);
          self.postMessage({forge: {prng: {needed}}});
        };
      } else {
        var listener = function(e) {
          var data = e.data;
          if (data.forge && data.forge.prng) {
            ctx.seedFile(data.forge.prng.needed, function(err, bytes) {
              worker.postMessage({forge: {prng: {err, bytes}}});
            });
          }
        };
        worker.addEventListener("message", listener);
      }
    };
    return ctx;
  };
});

// node_modules/node-forge/lib/random.js
var require_random = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_aes();
  require_sha256();
  require_prng();
  require_util();
  (function() {
    if (forge2.random && forge2.random.getBytes) {
      module2.exports = forge2.random;
      return;
    }
    (function(jQuery2) {
      var prng_aes = {};
      var _prng_aes_output = new Array(4);
      var _prng_aes_buffer = forge2.util.createBuffer();
      prng_aes.formatKey = function(key2) {
        var tmp = forge2.util.createBuffer(key2);
        key2 = new Array(4);
        key2[0] = tmp.getInt32();
        key2[1] = tmp.getInt32();
        key2[2] = tmp.getInt32();
        key2[3] = tmp.getInt32();
        return forge2.aes._expandKey(key2, false);
      };
      prng_aes.formatSeed = function(seed) {
        var tmp = forge2.util.createBuffer(seed);
        seed = new Array(4);
        seed[0] = tmp.getInt32();
        seed[1] = tmp.getInt32();
        seed[2] = tmp.getInt32();
        seed[3] = tmp.getInt32();
        return seed;
      };
      prng_aes.cipher = function(key2, seed) {
        forge2.aes._updateBlock(key2, seed, _prng_aes_output, false);
        _prng_aes_buffer.putInt32(_prng_aes_output[0]);
        _prng_aes_buffer.putInt32(_prng_aes_output[1]);
        _prng_aes_buffer.putInt32(_prng_aes_output[2]);
        _prng_aes_buffer.putInt32(_prng_aes_output[3]);
        return _prng_aes_buffer.getBytes();
      };
      prng_aes.increment = function(seed) {
        ++seed[3];
        return seed;
      };
      prng_aes.md = forge2.md.sha256;
      function spawnPrng() {
        var ctx = forge2.prng.create(prng_aes);
        ctx.getBytes = function(count, callback) {
          return ctx.generate(count, callback);
        };
        ctx.getBytesSync = function(count) {
          return ctx.generate(count);
        };
        return ctx;
      }
      var _ctx = spawnPrng();
      var getRandomValues = null;
      var globalScope = forge2.util.globalScope;
      var _crypto = globalScope.crypto || globalScope.msCrypto;
      if (_crypto && _crypto.getRandomValues) {
        getRandomValues = function(arr) {
          return _crypto.getRandomValues(arr);
        };
      }
      if (forge2.options.usePureJavaScript || !forge2.util.isNodejs && !getRandomValues) {
        if (typeof window === "undefined" || window.document === void 0) {
        }
        _ctx.collectInt(+new Date(), 32);
        if (typeof navigator !== "undefined") {
          var _navBytes = "";
          for (var key in navigator) {
            try {
              if (typeof navigator[key] == "string") {
                _navBytes += navigator[key];
              }
            } catch (e) {
            }
          }
          _ctx.collect(_navBytes);
          _navBytes = null;
        }
        if (jQuery2) {
          jQuery2().mousemove(function(e) {
            _ctx.collectInt(e.clientX, 16);
            _ctx.collectInt(e.clientY, 16);
          });
          jQuery2().keypress(function(e) {
            _ctx.collectInt(e.charCode, 8);
          });
        }
      }
      if (!forge2.random) {
        forge2.random = _ctx;
      } else {
        for (var key in _ctx) {
          forge2.random[key] = _ctx[key];
        }
      }
      forge2.random.createInstance = spawnPrng;
      module2.exports = forge2.random;
    })(typeof jQuery !== "undefined" ? jQuery : null);
  })();
});

// node_modules/node-forge/lib/rc2.js
var require_rc2 = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_util();
  var piTable = [
    217,
    120,
    249,
    196,
    25,
    221,
    181,
    237,
    40,
    233,
    253,
    121,
    74,
    160,
    216,
    157,
    198,
    126,
    55,
    131,
    43,
    118,
    83,
    142,
    98,
    76,
    100,
    136,
    68,
    139,
    251,
    162,
    23,
    154,
    89,
    245,
    135,
    179,
    79,
    19,
    97,
    69,
    109,
    141,
    9,
    129,
    125,
    50,
    189,
    143,
    64,
    235,
    134,
    183,
    123,
    11,
    240,
    149,
    33,
    34,
    92,
    107,
    78,
    130,
    84,
    214,
    101,
    147,
    206,
    96,
    178,
    28,
    115,
    86,
    192,
    20,
    167,
    140,
    241,
    220,
    18,
    117,
    202,
    31,
    59,
    190,
    228,
    209,
    66,
    61,
    212,
    48,
    163,
    60,
    182,
    38,
    111,
    191,
    14,
    218,
    70,
    105,
    7,
    87,
    39,
    242,
    29,
    155,
    188,
    148,
    67,
    3,
    248,
    17,
    199,
    246,
    144,
    239,
    62,
    231,
    6,
    195,
    213,
    47,
    200,
    102,
    30,
    215,
    8,
    232,
    234,
    222,
    128,
    82,
    238,
    247,
    132,
    170,
    114,
    172,
    53,
    77,
    106,
    42,
    150,
    26,
    210,
    113,
    90,
    21,
    73,
    116,
    75,
    159,
    208,
    94,
    4,
    24,
    164,
    236,
    194,
    224,
    65,
    110,
    15,
    81,
    203,
    204,
    36,
    145,
    175,
    80,
    161,
    244,
    112,
    57,
    153,
    124,
    58,
    133,
    35,
    184,
    180,
    122,
    252,
    2,
    54,
    91,
    37,
    85,
    151,
    49,
    45,
    93,
    250,
    152,
    227,
    138,
    146,
    174,
    5,
    223,
    41,
    16,
    103,
    108,
    186,
    201,
    211,
    0,
    230,
    207,
    225,
    158,
    168,
    44,
    99,
    22,
    1,
    63,
    88,
    226,
    137,
    169,
    13,
    56,
    52,
    27,
    171,
    51,
    255,
    176,
    187,
    72,
    12,
    95,
    185,
    177,
    205,
    46,
    197,
    243,
    219,
    71,
    229,
    165,
    156,
    119,
    10,
    166,
    32,
    104,
    254,
    127,
    193,
    173
  ];
  var s = [1, 2, 3, 5];
  var rol = function(word, bits) {
    return word << bits & 65535 | (word & 65535) >> 16 - bits;
  };
  var ror = function(word, bits) {
    return (word & 65535) >> bits | word << 16 - bits & 65535;
  };
  module2.exports = forge2.rc2 = forge2.rc2 || {};
  forge2.rc2.expandKey = function(key, effKeyBits) {
    if (typeof key === "string") {
      key = forge2.util.createBuffer(key);
    }
    effKeyBits = effKeyBits || 128;
    var L = key;
    var T = key.length();
    var T1 = effKeyBits;
    var T8 = Math.ceil(T1 / 8);
    var TM = 255 >> (T1 & 7);
    var i;
    for (i = T; i < 128; i++) {
      L.putByte(piTable[L.at(i - 1) + L.at(i - T) & 255]);
    }
    L.setAt(128 - T8, piTable[L.at(128 - T8) & TM]);
    for (i = 127 - T8; i >= 0; i--) {
      L.setAt(i, piTable[L.at(i + 1) ^ L.at(i + T8)]);
    }
    return L;
  };
  var createCipher = function(key, bits, encrypt) {
    var _finish = false, _input = null, _output = null, _iv = null;
    var mixRound, mashRound;
    var i, j, K = [];
    key = forge2.rc2.expandKey(key, bits);
    for (i = 0; i < 64; i++) {
      K.push(key.getInt16Le());
    }
    if (encrypt) {
      mixRound = function(R) {
        for (i = 0; i < 4; i++) {
          R[i] += K[j] + (R[(i + 3) % 4] & R[(i + 2) % 4]) + (~R[(i + 3) % 4] & R[(i + 1) % 4]);
          R[i] = rol(R[i], s[i]);
          j++;
        }
      };
      mashRound = function(R) {
        for (i = 0; i < 4; i++) {
          R[i] += K[R[(i + 3) % 4] & 63];
        }
      };
    } else {
      mixRound = function(R) {
        for (i = 3; i >= 0; i--) {
          R[i] = ror(R[i], s[i]);
          R[i] -= K[j] + (R[(i + 3) % 4] & R[(i + 2) % 4]) + (~R[(i + 3) % 4] & R[(i + 1) % 4]);
          j--;
        }
      };
      mashRound = function(R) {
        for (i = 3; i >= 0; i--) {
          R[i] -= K[R[(i + 3) % 4] & 63];
        }
      };
    }
    var runPlan = function(plan) {
      var R = [];
      for (i = 0; i < 4; i++) {
        var val = _input.getInt16Le();
        if (_iv !== null) {
          if (encrypt) {
            val ^= _iv.getInt16Le();
          } else {
            _iv.putInt16Le(val);
          }
        }
        R.push(val & 65535);
      }
      j = encrypt ? 0 : 63;
      for (var ptr = 0; ptr < plan.length; ptr++) {
        for (var ctr = 0; ctr < plan[ptr][0]; ctr++) {
          plan[ptr][1](R);
        }
      }
      for (i = 0; i < 4; i++) {
        if (_iv !== null) {
          if (encrypt) {
            _iv.putInt16Le(R[i]);
          } else {
            R[i] ^= _iv.getInt16Le();
          }
        }
        _output.putInt16Le(R[i]);
      }
    };
    var cipher = null;
    cipher = {
      start: function(iv, output) {
        if (iv) {
          if (typeof iv === "string") {
            iv = forge2.util.createBuffer(iv);
          }
        }
        _finish = false;
        _input = forge2.util.createBuffer();
        _output = output || new forge2.util.createBuffer();
        _iv = iv;
        cipher.output = _output;
      },
      update: function(input) {
        if (!_finish) {
          _input.putBuffer(input);
        }
        while (_input.length() >= 8) {
          runPlan([
            [5, mixRound],
            [1, mashRound],
            [6, mixRound],
            [1, mashRound],
            [5, mixRound]
          ]);
        }
      },
      finish: function(pad) {
        var rval = true;
        if (encrypt) {
          if (pad) {
            rval = pad(8, _input, !encrypt);
          } else {
            var padding = _input.length() === 8 ? 8 : 8 - _input.length();
            _input.fillWithByte(padding, padding);
          }
        }
        if (rval) {
          _finish = true;
          cipher.update();
        }
        if (!encrypt) {
          rval = _input.length() === 0;
          if (rval) {
            if (pad) {
              rval = pad(8, _output, !encrypt);
            } else {
              var len = _output.length();
              var count = _output.at(len - 1);
              if (count > len) {
                rval = false;
              } else {
                _output.truncate(count);
              }
            }
          }
        }
        return rval;
      }
    };
    return cipher;
  };
  forge2.rc2.startEncrypting = function(key, iv, output) {
    var cipher = forge2.rc2.createEncryptionCipher(key, 128);
    cipher.start(iv, output);
    return cipher;
  };
  forge2.rc2.createEncryptionCipher = function(key, bits) {
    return createCipher(key, bits, true);
  };
  forge2.rc2.startDecrypting = function(key, iv, output) {
    var cipher = forge2.rc2.createDecryptionCipher(key, 128);
    cipher.start(iv, output);
    return cipher;
  };
  forge2.rc2.createDecryptionCipher = function(key, bits) {
    return createCipher(key, bits, false);
  };
});

// node_modules/node-forge/lib/jsbn.js
var require_jsbn = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  module2.exports = forge2.jsbn = forge2.jsbn || {};
  var dbits;
  var canary = 244837814094590;
  var j_lm = (canary & 16777215) == 15715070;
  function BigInteger(a, b, c) {
    this.data = [];
    if (a != null)
      if (typeof a == "number")
        this.fromNumber(a, b, c);
      else if (b == null && typeof a != "string")
        this.fromString(a, 256);
      else
        this.fromString(a, b);
  }
  forge2.jsbn.BigInteger = BigInteger;
  function nbi() {
    return new BigInteger(null);
  }
  function am1(i, x, w, j, c, n) {
    while (--n >= 0) {
      var v = x * this.data[i++] + w.data[j] + c;
      c = Math.floor(v / 67108864);
      w.data[j++] = v & 67108863;
    }
    return c;
  }
  function am2(i, x, w, j, c, n) {
    var xl = x & 32767, xh = x >> 15;
    while (--n >= 0) {
      var l = this.data[i] & 32767;
      var h = this.data[i++] >> 15;
      var m = xh * l + h * xl;
      l = xl * l + ((m & 32767) << 15) + w.data[j] + (c & 1073741823);
      c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
      w.data[j++] = l & 1073741823;
    }
    return c;
  }
  function am3(i, x, w, j, c, n) {
    var xl = x & 16383, xh = x >> 14;
    while (--n >= 0) {
      var l = this.data[i] & 16383;
      var h = this.data[i++] >> 14;
      var m = xh * l + h * xl;
      l = xl * l + ((m & 16383) << 14) + w.data[j] + c;
      c = (l >> 28) + (m >> 14) + xh * h;
      w.data[j++] = l & 268435455;
    }
    return c;
  }
  if (typeof navigator === "undefined") {
    BigInteger.prototype.am = am3;
    dbits = 28;
  } else if (j_lm && navigator.appName == "Microsoft Internet Explorer") {
    BigInteger.prototype.am = am2;
    dbits = 30;
  } else if (j_lm && navigator.appName != "Netscape") {
    BigInteger.prototype.am = am1;
    dbits = 26;
  } else {
    BigInteger.prototype.am = am3;
    dbits = 28;
  }
  BigInteger.prototype.DB = dbits;
  BigInteger.prototype.DM = (1 << dbits) - 1;
  BigInteger.prototype.DV = 1 << dbits;
  var BI_FP = 52;
  BigInteger.prototype.FV = Math.pow(2, BI_FP);
  BigInteger.prototype.F1 = BI_FP - dbits;
  BigInteger.prototype.F2 = 2 * dbits - BI_FP;
  var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
  var BI_RC = new Array();
  var rr;
  var vv;
  rr = "0".charCodeAt(0);
  for (vv = 0; vv <= 9; ++vv)
    BI_RC[rr++] = vv;
  rr = "a".charCodeAt(0);
  for (vv = 10; vv < 36; ++vv)
    BI_RC[rr++] = vv;
  rr = "A".charCodeAt(0);
  for (vv = 10; vv < 36; ++vv)
    BI_RC[rr++] = vv;
  function int2char(n) {
    return BI_RM.charAt(n);
  }
  function intAt(s, i) {
    var c = BI_RC[s.charCodeAt(i)];
    return c == null ? -1 : c;
  }
  function bnpCopyTo(r) {
    for (var i = this.t - 1; i >= 0; --i)
      r.data[i] = this.data[i];
    r.t = this.t;
    r.s = this.s;
  }
  function bnpFromInt(x) {
    this.t = 1;
    this.s = x < 0 ? -1 : 0;
    if (x > 0)
      this.data[0] = x;
    else if (x < -1)
      this.data[0] = x + this.DV;
    else
      this.t = 0;
  }
  function nbv(i) {
    var r = nbi();
    r.fromInt(i);
    return r;
  }
  function bnpFromString(s, b) {
    var k;
    if (b == 16)
      k = 4;
    else if (b == 8)
      k = 3;
    else if (b == 256)
      k = 8;
    else if (b == 2)
      k = 1;
    else if (b == 32)
      k = 5;
    else if (b == 4)
      k = 2;
    else {
      this.fromRadix(s, b);
      return;
    }
    this.t = 0;
    this.s = 0;
    var i = s.length, mi = false, sh = 0;
    while (--i >= 0) {
      var x = k == 8 ? s[i] & 255 : intAt(s, i);
      if (x < 0) {
        if (s.charAt(i) == "-")
          mi = true;
        continue;
      }
      mi = false;
      if (sh == 0)
        this.data[this.t++] = x;
      else if (sh + k > this.DB) {
        this.data[this.t - 1] |= (x & (1 << this.DB - sh) - 1) << sh;
        this.data[this.t++] = x >> this.DB - sh;
      } else
        this.data[this.t - 1] |= x << sh;
      sh += k;
      if (sh >= this.DB)
        sh -= this.DB;
    }
    if (k == 8 && (s[0] & 128) != 0) {
      this.s = -1;
      if (sh > 0)
        this.data[this.t - 1] |= (1 << this.DB - sh) - 1 << sh;
    }
    this.clamp();
    if (mi)
      BigInteger.ZERO.subTo(this, this);
  }
  function bnpClamp() {
    var c = this.s & this.DM;
    while (this.t > 0 && this.data[this.t - 1] == c)
      --this.t;
  }
  function bnToString(b) {
    if (this.s < 0)
      return "-" + this.negate().toString(b);
    var k;
    if (b == 16)
      k = 4;
    else if (b == 8)
      k = 3;
    else if (b == 2)
      k = 1;
    else if (b == 32)
      k = 5;
    else if (b == 4)
      k = 2;
    else
      return this.toRadix(b);
    var km = (1 << k) - 1, d, m = false, r = "", i = this.t;
    var p = this.DB - i * this.DB % k;
    if (i-- > 0) {
      if (p < this.DB && (d = this.data[i] >> p) > 0) {
        m = true;
        r = int2char(d);
      }
      while (i >= 0) {
        if (p < k) {
          d = (this.data[i] & (1 << p) - 1) << k - p;
          d |= this.data[--i] >> (p += this.DB - k);
        } else {
          d = this.data[i] >> (p -= k) & km;
          if (p <= 0) {
            p += this.DB;
            --i;
          }
        }
        if (d > 0)
          m = true;
        if (m)
          r += int2char(d);
      }
    }
    return m ? r : "0";
  }
  function bnNegate() {
    var r = nbi();
    BigInteger.ZERO.subTo(this, r);
    return r;
  }
  function bnAbs() {
    return this.s < 0 ? this.negate() : this;
  }
  function bnCompareTo(a) {
    var r = this.s - a.s;
    if (r != 0)
      return r;
    var i = this.t;
    r = i - a.t;
    if (r != 0)
      return this.s < 0 ? -r : r;
    while (--i >= 0)
      if ((r = this.data[i] - a.data[i]) != 0)
        return r;
    return 0;
  }
  function nbits(x) {
    var r = 1, t;
    if ((t = x >>> 16) != 0) {
      x = t;
      r += 16;
    }
    if ((t = x >> 8) != 0) {
      x = t;
      r += 8;
    }
    if ((t = x >> 4) != 0) {
      x = t;
      r += 4;
    }
    if ((t = x >> 2) != 0) {
      x = t;
      r += 2;
    }
    if ((t = x >> 1) != 0) {
      x = t;
      r += 1;
    }
    return r;
  }
  function bnBitLength() {
    if (this.t <= 0)
      return 0;
    return this.DB * (this.t - 1) + nbits(this.data[this.t - 1] ^ this.s & this.DM);
  }
  function bnpDLShiftTo(n, r) {
    var i;
    for (i = this.t - 1; i >= 0; --i)
      r.data[i + n] = this.data[i];
    for (i = n - 1; i >= 0; --i)
      r.data[i] = 0;
    r.t = this.t + n;
    r.s = this.s;
  }
  function bnpDRShiftTo(n, r) {
    for (var i = n; i < this.t; ++i)
      r.data[i - n] = this.data[i];
    r.t = Math.max(this.t - n, 0);
    r.s = this.s;
  }
  function bnpLShiftTo(n, r) {
    var bs = n % this.DB;
    var cbs = this.DB - bs;
    var bm = (1 << cbs) - 1;
    var ds = Math.floor(n / this.DB), c = this.s << bs & this.DM, i;
    for (i = this.t - 1; i >= 0; --i) {
      r.data[i + ds + 1] = this.data[i] >> cbs | c;
      c = (this.data[i] & bm) << bs;
    }
    for (i = ds - 1; i >= 0; --i)
      r.data[i] = 0;
    r.data[ds] = c;
    r.t = this.t + ds + 1;
    r.s = this.s;
    r.clamp();
  }
  function bnpRShiftTo(n, r) {
    r.s = this.s;
    var ds = Math.floor(n / this.DB);
    if (ds >= this.t) {
      r.t = 0;
      return;
    }
    var bs = n % this.DB;
    var cbs = this.DB - bs;
    var bm = (1 << bs) - 1;
    r.data[0] = this.data[ds] >> bs;
    for (var i = ds + 1; i < this.t; ++i) {
      r.data[i - ds - 1] |= (this.data[i] & bm) << cbs;
      r.data[i - ds] = this.data[i] >> bs;
    }
    if (bs > 0)
      r.data[this.t - ds - 1] |= (this.s & bm) << cbs;
    r.t = this.t - ds;
    r.clamp();
  }
  function bnpSubTo(a, r) {
    var i = 0, c = 0, m = Math.min(a.t, this.t);
    while (i < m) {
      c += this.data[i] - a.data[i];
      r.data[i++] = c & this.DM;
      c >>= this.DB;
    }
    if (a.t < this.t) {
      c -= a.s;
      while (i < this.t) {
        c += this.data[i];
        r.data[i++] = c & this.DM;
        c >>= this.DB;
      }
      c += this.s;
    } else {
      c += this.s;
      while (i < a.t) {
        c -= a.data[i];
        r.data[i++] = c & this.DM;
        c >>= this.DB;
      }
      c -= a.s;
    }
    r.s = c < 0 ? -1 : 0;
    if (c < -1)
      r.data[i++] = this.DV + c;
    else if (c > 0)
      r.data[i++] = c;
    r.t = i;
    r.clamp();
  }
  function bnpMultiplyTo(a, r) {
    var x = this.abs(), y = a.abs();
    var i = x.t;
    r.t = i + y.t;
    while (--i >= 0)
      r.data[i] = 0;
    for (i = 0; i < y.t; ++i)
      r.data[i + x.t] = x.am(0, y.data[i], r, i, 0, x.t);
    r.s = 0;
    r.clamp();
    if (this.s != a.s)
      BigInteger.ZERO.subTo(r, r);
  }
  function bnpSquareTo(r) {
    var x = this.abs();
    var i = r.t = 2 * x.t;
    while (--i >= 0)
      r.data[i] = 0;
    for (i = 0; i < x.t - 1; ++i) {
      var c = x.am(i, x.data[i], r, 2 * i, 0, 1);
      if ((r.data[i + x.t] += x.am(i + 1, 2 * x.data[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
        r.data[i + x.t] -= x.DV;
        r.data[i + x.t + 1] = 1;
      }
    }
    if (r.t > 0)
      r.data[r.t - 1] += x.am(i, x.data[i], r, 2 * i, 0, 1);
    r.s = 0;
    r.clamp();
  }
  function bnpDivRemTo(m, q, r) {
    var pm = m.abs();
    if (pm.t <= 0)
      return;
    var pt = this.abs();
    if (pt.t < pm.t) {
      if (q != null)
        q.fromInt(0);
      if (r != null)
        this.copyTo(r);
      return;
    }
    if (r == null)
      r = nbi();
    var y = nbi(), ts = this.s, ms = m.s;
    var nsh = this.DB - nbits(pm.data[pm.t - 1]);
    if (nsh > 0) {
      pm.lShiftTo(nsh, y);
      pt.lShiftTo(nsh, r);
    } else {
      pm.copyTo(y);
      pt.copyTo(r);
    }
    var ys = y.t;
    var y0 = y.data[ys - 1];
    if (y0 == 0)
      return;
    var yt = y0 * (1 << this.F1) + (ys > 1 ? y.data[ys - 2] >> this.F2 : 0);
    var d1 = this.FV / yt, d2 = (1 << this.F1) / yt, e = 1 << this.F2;
    var i = r.t, j = i - ys, t = q == null ? nbi() : q;
    y.dlShiftTo(j, t);
    if (r.compareTo(t) >= 0) {
      r.data[r.t++] = 1;
      r.subTo(t, r);
    }
    BigInteger.ONE.dlShiftTo(ys, t);
    t.subTo(y, y);
    while (y.t < ys)
      y.data[y.t++] = 0;
    while (--j >= 0) {
      var qd = r.data[--i] == y0 ? this.DM : Math.floor(r.data[i] * d1 + (r.data[i - 1] + e) * d2);
      if ((r.data[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
        y.dlShiftTo(j, t);
        r.subTo(t, r);
        while (r.data[i] < --qd)
          r.subTo(t, r);
      }
    }
    if (q != null) {
      r.drShiftTo(ys, q);
      if (ts != ms)
        BigInteger.ZERO.subTo(q, q);
    }
    r.t = ys;
    r.clamp();
    if (nsh > 0)
      r.rShiftTo(nsh, r);
    if (ts < 0)
      BigInteger.ZERO.subTo(r, r);
  }
  function bnMod(a) {
    var r = nbi();
    this.abs().divRemTo(a, null, r);
    if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0)
      a.subTo(r, r);
    return r;
  }
  function Classic(m) {
    this.m = m;
  }
  function cConvert(x) {
    if (x.s < 0 || x.compareTo(this.m) >= 0)
      return x.mod(this.m);
    else
      return x;
  }
  function cRevert(x) {
    return x;
  }
  function cReduce(x) {
    x.divRemTo(this.m, null, x);
  }
  function cMulTo(x, y, r) {
    x.multiplyTo(y, r);
    this.reduce(r);
  }
  function cSqrTo(x, r) {
    x.squareTo(r);
    this.reduce(r);
  }
  Classic.prototype.convert = cConvert;
  Classic.prototype.revert = cRevert;
  Classic.prototype.reduce = cReduce;
  Classic.prototype.mulTo = cMulTo;
  Classic.prototype.sqrTo = cSqrTo;
  function bnpInvDigit() {
    if (this.t < 1)
      return 0;
    var x = this.data[0];
    if ((x & 1) == 0)
      return 0;
    var y = x & 3;
    y = y * (2 - (x & 15) * y) & 15;
    y = y * (2 - (x & 255) * y) & 255;
    y = y * (2 - ((x & 65535) * y & 65535)) & 65535;
    y = y * (2 - x * y % this.DV) % this.DV;
    return y > 0 ? this.DV - y : -y;
  }
  function Montgomery(m) {
    this.m = m;
    this.mp = m.invDigit();
    this.mpl = this.mp & 32767;
    this.mph = this.mp >> 15;
    this.um = (1 << m.DB - 15) - 1;
    this.mt2 = 2 * m.t;
  }
  function montConvert(x) {
    var r = nbi();
    x.abs().dlShiftTo(this.m.t, r);
    r.divRemTo(this.m, null, r);
    if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0)
      this.m.subTo(r, r);
    return r;
  }
  function montRevert(x) {
    var r = nbi();
    x.copyTo(r);
    this.reduce(r);
    return r;
  }
  function montReduce(x) {
    while (x.t <= this.mt2)
      x.data[x.t++] = 0;
    for (var i = 0; i < this.m.t; ++i) {
      var j = x.data[i] & 32767;
      var u0 = j * this.mpl + ((j * this.mph + (x.data[i] >> 15) * this.mpl & this.um) << 15) & x.DM;
      j = i + this.m.t;
      x.data[j] += this.m.am(0, u0, x, i, 0, this.m.t);
      while (x.data[j] >= x.DV) {
        x.data[j] -= x.DV;
        x.data[++j]++;
      }
    }
    x.clamp();
    x.drShiftTo(this.m.t, x);
    if (x.compareTo(this.m) >= 0)
      x.subTo(this.m, x);
  }
  function montSqrTo(x, r) {
    x.squareTo(r);
    this.reduce(r);
  }
  function montMulTo(x, y, r) {
    x.multiplyTo(y, r);
    this.reduce(r);
  }
  Montgomery.prototype.convert = montConvert;
  Montgomery.prototype.revert = montRevert;
  Montgomery.prototype.reduce = montReduce;
  Montgomery.prototype.mulTo = montMulTo;
  Montgomery.prototype.sqrTo = montSqrTo;
  function bnpIsEven() {
    return (this.t > 0 ? this.data[0] & 1 : this.s) == 0;
  }
  function bnpExp(e, z) {
    if (e > 4294967295 || e < 1)
      return BigInteger.ONE;
    var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e) - 1;
    g.copyTo(r);
    while (--i >= 0) {
      z.sqrTo(r, r2);
      if ((e & 1 << i) > 0)
        z.mulTo(r2, g, r);
      else {
        var t = r;
        r = r2;
        r2 = t;
      }
    }
    return z.revert(r);
  }
  function bnModPowInt(e, m) {
    var z;
    if (e < 256 || m.isEven())
      z = new Classic(m);
    else
      z = new Montgomery(m);
    return this.exp(e, z);
  }
  BigInteger.prototype.copyTo = bnpCopyTo;
  BigInteger.prototype.fromInt = bnpFromInt;
  BigInteger.prototype.fromString = bnpFromString;
  BigInteger.prototype.clamp = bnpClamp;
  BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
  BigInteger.prototype.drShiftTo = bnpDRShiftTo;
  BigInteger.prototype.lShiftTo = bnpLShiftTo;
  BigInteger.prototype.rShiftTo = bnpRShiftTo;
  BigInteger.prototype.subTo = bnpSubTo;
  BigInteger.prototype.multiplyTo = bnpMultiplyTo;
  BigInteger.prototype.squareTo = bnpSquareTo;
  BigInteger.prototype.divRemTo = bnpDivRemTo;
  BigInteger.prototype.invDigit = bnpInvDigit;
  BigInteger.prototype.isEven = bnpIsEven;
  BigInteger.prototype.exp = bnpExp;
  BigInteger.prototype.toString = bnToString;
  BigInteger.prototype.negate = bnNegate;
  BigInteger.prototype.abs = bnAbs;
  BigInteger.prototype.compareTo = bnCompareTo;
  BigInteger.prototype.bitLength = bnBitLength;
  BigInteger.prototype.mod = bnMod;
  BigInteger.prototype.modPowInt = bnModPowInt;
  BigInteger.ZERO = nbv(0);
  BigInteger.ONE = nbv(1);
  function bnClone() {
    var r = nbi();
    this.copyTo(r);
    return r;
  }
  function bnIntValue() {
    if (this.s < 0) {
      if (this.t == 1)
        return this.data[0] - this.DV;
      else if (this.t == 0)
        return -1;
    } else if (this.t == 1)
      return this.data[0];
    else if (this.t == 0)
      return 0;
    return (this.data[1] & (1 << 32 - this.DB) - 1) << this.DB | this.data[0];
  }
  function bnByteValue() {
    return this.t == 0 ? this.s : this.data[0] << 24 >> 24;
  }
  function bnShortValue() {
    return this.t == 0 ? this.s : this.data[0] << 16 >> 16;
  }
  function bnpChunkSize(r) {
    return Math.floor(Math.LN2 * this.DB / Math.log(r));
  }
  function bnSigNum() {
    if (this.s < 0)
      return -1;
    else if (this.t <= 0 || this.t == 1 && this.data[0] <= 0)
      return 0;
    else
      return 1;
  }
  function bnpToRadix(b) {
    if (b == null)
      b = 10;
    if (this.signum() == 0 || b < 2 || b > 36)
      return "0";
    var cs = this.chunkSize(b);
    var a = Math.pow(b, cs);
    var d = nbv(a), y = nbi(), z = nbi(), r = "";
    this.divRemTo(d, y, z);
    while (y.signum() > 0) {
      r = (a + z.intValue()).toString(b).substr(1) + r;
      y.divRemTo(d, y, z);
    }
    return z.intValue().toString(b) + r;
  }
  function bnpFromRadix(s, b) {
    this.fromInt(0);
    if (b == null)
      b = 10;
    var cs = this.chunkSize(b);
    var d = Math.pow(b, cs), mi = false, j = 0, w = 0;
    for (var i = 0; i < s.length; ++i) {
      var x = intAt(s, i);
      if (x < 0) {
        if (s.charAt(i) == "-" && this.signum() == 0)
          mi = true;
        continue;
      }
      w = b * w + x;
      if (++j >= cs) {
        this.dMultiply(d);
        this.dAddOffset(w, 0);
        j = 0;
        w = 0;
      }
    }
    if (j > 0) {
      this.dMultiply(Math.pow(b, j));
      this.dAddOffset(w, 0);
    }
    if (mi)
      BigInteger.ZERO.subTo(this, this);
  }
  function bnpFromNumber(a, b, c) {
    if (typeof b == "number") {
      if (a < 2)
        this.fromInt(1);
      else {
        this.fromNumber(a, c);
        if (!this.testBit(a - 1))
          this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
        if (this.isEven())
          this.dAddOffset(1, 0);
        while (!this.isProbablePrime(b)) {
          this.dAddOffset(2, 0);
          if (this.bitLength() > a)
            this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
        }
      }
    } else {
      var x = new Array(), t = a & 7;
      x.length = (a >> 3) + 1;
      b.nextBytes(x);
      if (t > 0)
        x[0] &= (1 << t) - 1;
      else
        x[0] = 0;
      this.fromString(x, 256);
    }
  }
  function bnToByteArray() {
    var i = this.t, r = new Array();
    r[0] = this.s;
    var p = this.DB - i * this.DB % 8, d, k = 0;
    if (i-- > 0) {
      if (p < this.DB && (d = this.data[i] >> p) != (this.s & this.DM) >> p)
        r[k++] = d | this.s << this.DB - p;
      while (i >= 0) {
        if (p < 8) {
          d = (this.data[i] & (1 << p) - 1) << 8 - p;
          d |= this.data[--i] >> (p += this.DB - 8);
        } else {
          d = this.data[i] >> (p -= 8) & 255;
          if (p <= 0) {
            p += this.DB;
            --i;
          }
        }
        if ((d & 128) != 0)
          d |= -256;
        if (k == 0 && (this.s & 128) != (d & 128))
          ++k;
        if (k > 0 || d != this.s)
          r[k++] = d;
      }
    }
    return r;
  }
  function bnEquals(a) {
    return this.compareTo(a) == 0;
  }
  function bnMin(a) {
    return this.compareTo(a) < 0 ? this : a;
  }
  function bnMax(a) {
    return this.compareTo(a) > 0 ? this : a;
  }
  function bnpBitwiseTo(a, op, r) {
    var i, f, m = Math.min(a.t, this.t);
    for (i = 0; i < m; ++i)
      r.data[i] = op(this.data[i], a.data[i]);
    if (a.t < this.t) {
      f = a.s & this.DM;
      for (i = m; i < this.t; ++i)
        r.data[i] = op(this.data[i], f);
      r.t = this.t;
    } else {
      f = this.s & this.DM;
      for (i = m; i < a.t; ++i)
        r.data[i] = op(f, a.data[i]);
      r.t = a.t;
    }
    r.s = op(this.s, a.s);
    r.clamp();
  }
  function op_and(x, y) {
    return x & y;
  }
  function bnAnd(a) {
    var r = nbi();
    this.bitwiseTo(a, op_and, r);
    return r;
  }
  function op_or(x, y) {
    return x | y;
  }
  function bnOr(a) {
    var r = nbi();
    this.bitwiseTo(a, op_or, r);
    return r;
  }
  function op_xor(x, y) {
    return x ^ y;
  }
  function bnXor(a) {
    var r = nbi();
    this.bitwiseTo(a, op_xor, r);
    return r;
  }
  function op_andnot(x, y) {
    return x & ~y;
  }
  function bnAndNot(a) {
    var r = nbi();
    this.bitwiseTo(a, op_andnot, r);
    return r;
  }
  function bnNot() {
    var r = nbi();
    for (var i = 0; i < this.t; ++i)
      r.data[i] = this.DM & ~this.data[i];
    r.t = this.t;
    r.s = ~this.s;
    return r;
  }
  function bnShiftLeft(n) {
    var r = nbi();
    if (n < 0)
      this.rShiftTo(-n, r);
    else
      this.lShiftTo(n, r);
    return r;
  }
  function bnShiftRight(n) {
    var r = nbi();
    if (n < 0)
      this.lShiftTo(-n, r);
    else
      this.rShiftTo(n, r);
    return r;
  }
  function lbit(x) {
    if (x == 0)
      return -1;
    var r = 0;
    if ((x & 65535) == 0) {
      x >>= 16;
      r += 16;
    }
    if ((x & 255) == 0) {
      x >>= 8;
      r += 8;
    }
    if ((x & 15) == 0) {
      x >>= 4;
      r += 4;
    }
    if ((x & 3) == 0) {
      x >>= 2;
      r += 2;
    }
    if ((x & 1) == 0)
      ++r;
    return r;
  }
  function bnGetLowestSetBit() {
    for (var i = 0; i < this.t; ++i)
      if (this.data[i] != 0)
        return i * this.DB + lbit(this.data[i]);
    if (this.s < 0)
      return this.t * this.DB;
    return -1;
  }
  function cbit(x) {
    var r = 0;
    while (x != 0) {
      x &= x - 1;
      ++r;
    }
    return r;
  }
  function bnBitCount() {
    var r = 0, x = this.s & this.DM;
    for (var i = 0; i < this.t; ++i)
      r += cbit(this.data[i] ^ x);
    return r;
  }
  function bnTestBit(n) {
    var j = Math.floor(n / this.DB);
    if (j >= this.t)
      return this.s != 0;
    return (this.data[j] & 1 << n % this.DB) != 0;
  }
  function bnpChangeBit(n, op) {
    var r = BigInteger.ONE.shiftLeft(n);
    this.bitwiseTo(r, op, r);
    return r;
  }
  function bnSetBit(n) {
    return this.changeBit(n, op_or);
  }
  function bnClearBit(n) {
    return this.changeBit(n, op_andnot);
  }
  function bnFlipBit(n) {
    return this.changeBit(n, op_xor);
  }
  function bnpAddTo(a, r) {
    var i = 0, c = 0, m = Math.min(a.t, this.t);
    while (i < m) {
      c += this.data[i] + a.data[i];
      r.data[i++] = c & this.DM;
      c >>= this.DB;
    }
    if (a.t < this.t) {
      c += a.s;
      while (i < this.t) {
        c += this.data[i];
        r.data[i++] = c & this.DM;
        c >>= this.DB;
      }
      c += this.s;
    } else {
      c += this.s;
      while (i < a.t) {
        c += a.data[i];
        r.data[i++] = c & this.DM;
        c >>= this.DB;
      }
      c += a.s;
    }
    r.s = c < 0 ? -1 : 0;
    if (c > 0)
      r.data[i++] = c;
    else if (c < -1)
      r.data[i++] = this.DV + c;
    r.t = i;
    r.clamp();
  }
  function bnAdd(a) {
    var r = nbi();
    this.addTo(a, r);
    return r;
  }
  function bnSubtract(a) {
    var r = nbi();
    this.subTo(a, r);
    return r;
  }
  function bnMultiply(a) {
    var r = nbi();
    this.multiplyTo(a, r);
    return r;
  }
  function bnDivide(a) {
    var r = nbi();
    this.divRemTo(a, r, null);
    return r;
  }
  function bnRemainder(a) {
    var r = nbi();
    this.divRemTo(a, null, r);
    return r;
  }
  function bnDivideAndRemainder(a) {
    var q = nbi(), r = nbi();
    this.divRemTo(a, q, r);
    return new Array(q, r);
  }
  function bnpDMultiply(n) {
    this.data[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
    ++this.t;
    this.clamp();
  }
  function bnpDAddOffset(n, w) {
    if (n == 0)
      return;
    while (this.t <= w)
      this.data[this.t++] = 0;
    this.data[w] += n;
    while (this.data[w] >= this.DV) {
      this.data[w] -= this.DV;
      if (++w >= this.t)
        this.data[this.t++] = 0;
      ++this.data[w];
    }
  }
  function NullExp() {
  }
  function nNop(x) {
    return x;
  }
  function nMulTo(x, y, r) {
    x.multiplyTo(y, r);
  }
  function nSqrTo(x, r) {
    x.squareTo(r);
  }
  NullExp.prototype.convert = nNop;
  NullExp.prototype.revert = nNop;
  NullExp.prototype.mulTo = nMulTo;
  NullExp.prototype.sqrTo = nSqrTo;
  function bnPow(e) {
    return this.exp(e, new NullExp());
  }
  function bnpMultiplyLowerTo(a, n, r) {
    var i = Math.min(this.t + a.t, n);
    r.s = 0;
    r.t = i;
    while (i > 0)
      r.data[--i] = 0;
    var j;
    for (j = r.t - this.t; i < j; ++i)
      r.data[i + this.t] = this.am(0, a.data[i], r, i, 0, this.t);
    for (j = Math.min(a.t, n); i < j; ++i)
      this.am(0, a.data[i], r, i, 0, n - i);
    r.clamp();
  }
  function bnpMultiplyUpperTo(a, n, r) {
    --n;
    var i = r.t = this.t + a.t - n;
    r.s = 0;
    while (--i >= 0)
      r.data[i] = 0;
    for (i = Math.max(n - this.t, 0); i < a.t; ++i)
      r.data[this.t + i - n] = this.am(n - i, a.data[i], r, 0, 0, this.t + i - n);
    r.clamp();
    r.drShiftTo(1, r);
  }
  function Barrett(m) {
    this.r2 = nbi();
    this.q3 = nbi();
    BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
    this.mu = this.r2.divide(m);
    this.m = m;
  }
  function barrettConvert(x) {
    if (x.s < 0 || x.t > 2 * this.m.t)
      return x.mod(this.m);
    else if (x.compareTo(this.m) < 0)
      return x;
    else {
      var r = nbi();
      x.copyTo(r);
      this.reduce(r);
      return r;
    }
  }
  function barrettRevert(x) {
    return x;
  }
  function barrettReduce(x) {
    x.drShiftTo(this.m.t - 1, this.r2);
    if (x.t > this.m.t + 1) {
      x.t = this.m.t + 1;
      x.clamp();
    }
    this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
    this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
    while (x.compareTo(this.r2) < 0)
      x.dAddOffset(1, this.m.t + 1);
    x.subTo(this.r2, x);
    while (x.compareTo(this.m) >= 0)
      x.subTo(this.m, x);
  }
  function barrettSqrTo(x, r) {
    x.squareTo(r);
    this.reduce(r);
  }
  function barrettMulTo(x, y, r) {
    x.multiplyTo(y, r);
    this.reduce(r);
  }
  Barrett.prototype.convert = barrettConvert;
  Barrett.prototype.revert = barrettRevert;
  Barrett.prototype.reduce = barrettReduce;
  Barrett.prototype.mulTo = barrettMulTo;
  Barrett.prototype.sqrTo = barrettSqrTo;
  function bnModPow(e, m) {
    var i = e.bitLength(), k, r = nbv(1), z;
    if (i <= 0)
      return r;
    else if (i < 18)
      k = 1;
    else if (i < 48)
      k = 3;
    else if (i < 144)
      k = 4;
    else if (i < 768)
      k = 5;
    else
      k = 6;
    if (i < 8)
      z = new Classic(m);
    else if (m.isEven())
      z = new Barrett(m);
    else
      z = new Montgomery(m);
    var g = new Array(), n = 3, k1 = k - 1, km = (1 << k) - 1;
    g[1] = z.convert(this);
    if (k > 1) {
      var g2 = nbi();
      z.sqrTo(g[1], g2);
      while (n <= km) {
        g[n] = nbi();
        z.mulTo(g2, g[n - 2], g[n]);
        n += 2;
      }
    }
    var j = e.t - 1, w, is1 = true, r2 = nbi(), t;
    i = nbits(e.data[j]) - 1;
    while (j >= 0) {
      if (i >= k1)
        w = e.data[j] >> i - k1 & km;
      else {
        w = (e.data[j] & (1 << i + 1) - 1) << k1 - i;
        if (j > 0)
          w |= e.data[j - 1] >> this.DB + i - k1;
      }
      n = k;
      while ((w & 1) == 0) {
        w >>= 1;
        --n;
      }
      if ((i -= n) < 0) {
        i += this.DB;
        --j;
      }
      if (is1) {
        g[w].copyTo(r);
        is1 = false;
      } else {
        while (n > 1) {
          z.sqrTo(r, r2);
          z.sqrTo(r2, r);
          n -= 2;
        }
        if (n > 0)
          z.sqrTo(r, r2);
        else {
          t = r;
          r = r2;
          r2 = t;
        }
        z.mulTo(r2, g[w], r);
      }
      while (j >= 0 && (e.data[j] & 1 << i) == 0) {
        z.sqrTo(r, r2);
        t = r;
        r = r2;
        r2 = t;
        if (--i < 0) {
          i = this.DB - 1;
          --j;
        }
      }
    }
    return z.revert(r);
  }
  function bnGCD(a) {
    var x = this.s < 0 ? this.negate() : this.clone();
    var y = a.s < 0 ? a.negate() : a.clone();
    if (x.compareTo(y) < 0) {
      var t = x;
      x = y;
      y = t;
    }
    var i = x.getLowestSetBit(), g = y.getLowestSetBit();
    if (g < 0)
      return x;
    if (i < g)
      g = i;
    if (g > 0) {
      x.rShiftTo(g, x);
      y.rShiftTo(g, y);
    }
    while (x.signum() > 0) {
      if ((i = x.getLowestSetBit()) > 0)
        x.rShiftTo(i, x);
      if ((i = y.getLowestSetBit()) > 0)
        y.rShiftTo(i, y);
      if (x.compareTo(y) >= 0) {
        x.subTo(y, x);
        x.rShiftTo(1, x);
      } else {
        y.subTo(x, y);
        y.rShiftTo(1, y);
      }
    }
    if (g > 0)
      y.lShiftTo(g, y);
    return y;
  }
  function bnpModInt(n) {
    if (n <= 0)
      return 0;
    var d = this.DV % n, r = this.s < 0 ? n - 1 : 0;
    if (this.t > 0)
      if (d == 0)
        r = this.data[0] % n;
      else
        for (var i = this.t - 1; i >= 0; --i)
          r = (d * r + this.data[i]) % n;
    return r;
  }
  function bnModInverse(m) {
    var ac = m.isEven();
    if (this.isEven() && ac || m.signum() == 0)
      return BigInteger.ZERO;
    var u = m.clone(), v = this.clone();
    var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
    while (u.signum() != 0) {
      while (u.isEven()) {
        u.rShiftTo(1, u);
        if (ac) {
          if (!a.isEven() || !b.isEven()) {
            a.addTo(this, a);
            b.subTo(m, b);
          }
          a.rShiftTo(1, a);
        } else if (!b.isEven())
          b.subTo(m, b);
        b.rShiftTo(1, b);
      }
      while (v.isEven()) {
        v.rShiftTo(1, v);
        if (ac) {
          if (!c.isEven() || !d.isEven()) {
            c.addTo(this, c);
            d.subTo(m, d);
          }
          c.rShiftTo(1, c);
        } else if (!d.isEven())
          d.subTo(m, d);
        d.rShiftTo(1, d);
      }
      if (u.compareTo(v) >= 0) {
        u.subTo(v, u);
        if (ac)
          a.subTo(c, a);
        b.subTo(d, b);
      } else {
        v.subTo(u, v);
        if (ac)
          c.subTo(a, c);
        d.subTo(b, d);
      }
    }
    if (v.compareTo(BigInteger.ONE) != 0)
      return BigInteger.ZERO;
    if (d.compareTo(m) >= 0)
      return d.subtract(m);
    if (d.signum() < 0)
      d.addTo(m, d);
    else
      return d;
    if (d.signum() < 0)
      return d.add(m);
    else
      return d;
  }
  var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509];
  var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
  function bnIsProbablePrime(t) {
    var i, x = this.abs();
    if (x.t == 1 && x.data[0] <= lowprimes[lowprimes.length - 1]) {
      for (i = 0; i < lowprimes.length; ++i)
        if (x.data[0] == lowprimes[i])
          return true;
      return false;
    }
    if (x.isEven())
      return false;
    i = 1;
    while (i < lowprimes.length) {
      var m = lowprimes[i], j = i + 1;
      while (j < lowprimes.length && m < lplim)
        m *= lowprimes[j++];
      m = x.modInt(m);
      while (i < j)
        if (m % lowprimes[i++] == 0)
          return false;
    }
    return x.millerRabin(t);
  }
  function bnpMillerRabin(t) {
    var n1 = this.subtract(BigInteger.ONE);
    var k = n1.getLowestSetBit();
    if (k <= 0)
      return false;
    var r = n1.shiftRight(k);
    var prng = bnGetPrng();
    var a;
    for (var i = 0; i < t; ++i) {
      do {
        a = new BigInteger(this.bitLength(), prng);
      } while (a.compareTo(BigInteger.ONE) <= 0 || a.compareTo(n1) >= 0);
      var y = a.modPow(r, this);
      if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
        var j = 1;
        while (j++ < k && y.compareTo(n1) != 0) {
          y = y.modPowInt(2, this);
          if (y.compareTo(BigInteger.ONE) == 0)
            return false;
        }
        if (y.compareTo(n1) != 0)
          return false;
      }
    }
    return true;
  }
  function bnGetPrng() {
    return {
      nextBytes: function(x) {
        for (var i = 0; i < x.length; ++i) {
          x[i] = Math.floor(Math.random() * 256);
        }
      }
    };
  }
  BigInteger.prototype.chunkSize = bnpChunkSize;
  BigInteger.prototype.toRadix = bnpToRadix;
  BigInteger.prototype.fromRadix = bnpFromRadix;
  BigInteger.prototype.fromNumber = bnpFromNumber;
  BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
  BigInteger.prototype.changeBit = bnpChangeBit;
  BigInteger.prototype.addTo = bnpAddTo;
  BigInteger.prototype.dMultiply = bnpDMultiply;
  BigInteger.prototype.dAddOffset = bnpDAddOffset;
  BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
  BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
  BigInteger.prototype.modInt = bnpModInt;
  BigInteger.prototype.millerRabin = bnpMillerRabin;
  BigInteger.prototype.clone = bnClone;
  BigInteger.prototype.intValue = bnIntValue;
  BigInteger.prototype.byteValue = bnByteValue;
  BigInteger.prototype.shortValue = bnShortValue;
  BigInteger.prototype.signum = bnSigNum;
  BigInteger.prototype.toByteArray = bnToByteArray;
  BigInteger.prototype.equals = bnEquals;
  BigInteger.prototype.min = bnMin;
  BigInteger.prototype.max = bnMax;
  BigInteger.prototype.and = bnAnd;
  BigInteger.prototype.or = bnOr;
  BigInteger.prototype.xor = bnXor;
  BigInteger.prototype.andNot = bnAndNot;
  BigInteger.prototype.not = bnNot;
  BigInteger.prototype.shiftLeft = bnShiftLeft;
  BigInteger.prototype.shiftRight = bnShiftRight;
  BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
  BigInteger.prototype.bitCount = bnBitCount;
  BigInteger.prototype.testBit = bnTestBit;
  BigInteger.prototype.setBit = bnSetBit;
  BigInteger.prototype.clearBit = bnClearBit;
  BigInteger.prototype.flipBit = bnFlipBit;
  BigInteger.prototype.add = bnAdd;
  BigInteger.prototype.subtract = bnSubtract;
  BigInteger.prototype.multiply = bnMultiply;
  BigInteger.prototype.divide = bnDivide;
  BigInteger.prototype.remainder = bnRemainder;
  BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
  BigInteger.prototype.modPow = bnModPow;
  BigInteger.prototype.modInverse = bnModInverse;
  BigInteger.prototype.pow = bnPow;
  BigInteger.prototype.gcd = bnGCD;
  BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
});

// node_modules/node-forge/lib/sha1.js
var require_sha1 = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_md();
  require_util();
  var sha1 = module2.exports = forge2.sha1 = forge2.sha1 || {};
  forge2.md.sha1 = forge2.md.algorithms.sha1 = sha1;
  sha1.create = function() {
    if (!_initialized) {
      _init();
    }
    var _state = null;
    var _input = forge2.util.createBuffer();
    var _w = new Array(80);
    var md = {
      algorithm: "sha1",
      blockLength: 64,
      digestLength: 20,
      messageLength: 0,
      fullMessageLength: null,
      messageLengthSize: 8
    };
    md.start = function() {
      md.messageLength = 0;
      md.fullMessageLength = md.messageLength64 = [];
      var int32s = md.messageLengthSize / 4;
      for (var i = 0; i < int32s; ++i) {
        md.fullMessageLength.push(0);
      }
      _input = forge2.util.createBuffer();
      _state = {
        h0: 1732584193,
        h1: 4023233417,
        h2: 2562383102,
        h3: 271733878,
        h4: 3285377520
      };
      return md;
    };
    md.start();
    md.update = function(msg, encoding) {
      if (encoding === "utf8") {
        msg = forge2.util.encodeUtf8(msg);
      }
      var len = msg.length;
      md.messageLength += len;
      len = [len / 4294967296 >>> 0, len >>> 0];
      for (var i = md.fullMessageLength.length - 1; i >= 0; --i) {
        md.fullMessageLength[i] += len[1];
        len[1] = len[0] + (md.fullMessageLength[i] / 4294967296 >>> 0);
        md.fullMessageLength[i] = md.fullMessageLength[i] >>> 0;
        len[0] = len[1] / 4294967296 >>> 0;
      }
      _input.putBytes(msg);
      _update(_state, _w, _input);
      if (_input.read > 2048 || _input.length() === 0) {
        _input.compact();
      }
      return md;
    };
    md.digest = function() {
      var finalBlock = forge2.util.createBuffer();
      finalBlock.putBytes(_input.bytes());
      var remaining = md.fullMessageLength[md.fullMessageLength.length - 1] + md.messageLengthSize;
      var overflow = remaining & md.blockLength - 1;
      finalBlock.putBytes(_padding.substr(0, md.blockLength - overflow));
      var next, carry;
      var bits = md.fullMessageLength[0] * 8;
      for (var i = 0; i < md.fullMessageLength.length - 1; ++i) {
        next = md.fullMessageLength[i + 1] * 8;
        carry = next / 4294967296 >>> 0;
        bits += carry;
        finalBlock.putInt32(bits >>> 0);
        bits = next >>> 0;
      }
      finalBlock.putInt32(bits);
      var s2 = {
        h0: _state.h0,
        h1: _state.h1,
        h2: _state.h2,
        h3: _state.h3,
        h4: _state.h4
      };
      _update(s2, _w, finalBlock);
      var rval = forge2.util.createBuffer();
      rval.putInt32(s2.h0);
      rval.putInt32(s2.h1);
      rval.putInt32(s2.h2);
      rval.putInt32(s2.h3);
      rval.putInt32(s2.h4);
      return rval;
    };
    return md;
  };
  var _padding = null;
  var _initialized = false;
  function _init() {
    _padding = String.fromCharCode(128);
    _padding += forge2.util.fillString(String.fromCharCode(0), 64);
    _initialized = true;
  }
  function _update(s, w, bytes) {
    var t, a, b, c, d, e, f, i;
    var len = bytes.length();
    while (len >= 64) {
      a = s.h0;
      b = s.h1;
      c = s.h2;
      d = s.h3;
      e = s.h4;
      for (i = 0; i < 16; ++i) {
        t = bytes.getInt32();
        w[i] = t;
        f = d ^ b & (c ^ d);
        t = (a << 5 | a >>> 27) + f + e + 1518500249 + t;
        e = d;
        d = c;
        c = (b << 30 | b >>> 2) >>> 0;
        b = a;
        a = t;
      }
      for (; i < 20; ++i) {
        t = w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16];
        t = t << 1 | t >>> 31;
        w[i] = t;
        f = d ^ b & (c ^ d);
        t = (a << 5 | a >>> 27) + f + e + 1518500249 + t;
        e = d;
        d = c;
        c = (b << 30 | b >>> 2) >>> 0;
        b = a;
        a = t;
      }
      for (; i < 32; ++i) {
        t = w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16];
        t = t << 1 | t >>> 31;
        w[i] = t;
        f = b ^ c ^ d;
        t = (a << 5 | a >>> 27) + f + e + 1859775393 + t;
        e = d;
        d = c;
        c = (b << 30 | b >>> 2) >>> 0;
        b = a;
        a = t;
      }
      for (; i < 40; ++i) {
        t = w[i - 6] ^ w[i - 16] ^ w[i - 28] ^ w[i - 32];
        t = t << 2 | t >>> 30;
        w[i] = t;
        f = b ^ c ^ d;
        t = (a << 5 | a >>> 27) + f + e + 1859775393 + t;
        e = d;
        d = c;
        c = (b << 30 | b >>> 2) >>> 0;
        b = a;
        a = t;
      }
      for (; i < 60; ++i) {
        t = w[i - 6] ^ w[i - 16] ^ w[i - 28] ^ w[i - 32];
        t = t << 2 | t >>> 30;
        w[i] = t;
        f = b & c | d & (b ^ c);
        t = (a << 5 | a >>> 27) + f + e + 2400959708 + t;
        e = d;
        d = c;
        c = (b << 30 | b >>> 2) >>> 0;
        b = a;
        a = t;
      }
      for (; i < 80; ++i) {
        t = w[i - 6] ^ w[i - 16] ^ w[i - 28] ^ w[i - 32];
        t = t << 2 | t >>> 30;
        w[i] = t;
        f = b ^ c ^ d;
        t = (a << 5 | a >>> 27) + f + e + 3395469782 + t;
        e = d;
        d = c;
        c = (b << 30 | b >>> 2) >>> 0;
        b = a;
        a = t;
      }
      s.h0 = s.h0 + a | 0;
      s.h1 = s.h1 + b | 0;
      s.h2 = s.h2 + c | 0;
      s.h3 = s.h3 + d | 0;
      s.h4 = s.h4 + e | 0;
      len -= 64;
    }
  }
});

// node_modules/node-forge/lib/pkcs1.js
var require_pkcs1 = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_util();
  require_random();
  require_sha1();
  var pkcs1 = module2.exports = forge2.pkcs1 = forge2.pkcs1 || {};
  pkcs1.encode_rsa_oaep = function(key, message, options) {
    var label;
    var seed;
    var md;
    var mgf1Md;
    if (typeof options === "string") {
      label = options;
      seed = arguments[3] || void 0;
      md = arguments[4] || void 0;
    } else if (options) {
      label = options.label || void 0;
      seed = options.seed || void 0;
      md = options.md || void 0;
      if (options.mgf1 && options.mgf1.md) {
        mgf1Md = options.mgf1.md;
      }
    }
    if (!md) {
      md = forge2.md.sha1.create();
    } else {
      md.start();
    }
    if (!mgf1Md) {
      mgf1Md = md;
    }
    var keyLength = Math.ceil(key.n.bitLength() / 8);
    var maxLength = keyLength - 2 * md.digestLength - 2;
    if (message.length > maxLength) {
      var error = new Error("RSAES-OAEP input message length is too long.");
      error.length = message.length;
      error.maxLength = maxLength;
      throw error;
    }
    if (!label) {
      label = "";
    }
    md.update(label, "raw");
    var lHash = md.digest();
    var PS = "";
    var PS_length = maxLength - message.length;
    for (var i = 0; i < PS_length; i++) {
      PS += "\0";
    }
    var DB = lHash.getBytes() + PS + "" + message;
    if (!seed) {
      seed = forge2.random.getBytes(md.digestLength);
    } else if (seed.length !== md.digestLength) {
      var error = new Error("Invalid RSAES-OAEP seed. The seed length must match the digest length.");
      error.seedLength = seed.length;
      error.digestLength = md.digestLength;
      throw error;
    }
    var dbMask = rsa_mgf1(seed, keyLength - md.digestLength - 1, mgf1Md);
    var maskedDB = forge2.util.xorBytes(DB, dbMask, DB.length);
    var seedMask = rsa_mgf1(maskedDB, md.digestLength, mgf1Md);
    var maskedSeed = forge2.util.xorBytes(seed, seedMask, seed.length);
    return "\0" + maskedSeed + maskedDB;
  };
  pkcs1.decode_rsa_oaep = function(key, em, options) {
    var label;
    var md;
    var mgf1Md;
    if (typeof options === "string") {
      label = options;
      md = arguments[3] || void 0;
    } else if (options) {
      label = options.label || void 0;
      md = options.md || void 0;
      if (options.mgf1 && options.mgf1.md) {
        mgf1Md = options.mgf1.md;
      }
    }
    var keyLength = Math.ceil(key.n.bitLength() / 8);
    if (em.length !== keyLength) {
      var error = new Error("RSAES-OAEP encoded message length is invalid.");
      error.length = em.length;
      error.expectedLength = keyLength;
      throw error;
    }
    if (md === void 0) {
      md = forge2.md.sha1.create();
    } else {
      md.start();
    }
    if (!mgf1Md) {
      mgf1Md = md;
    }
    if (keyLength < 2 * md.digestLength + 2) {
      throw new Error("RSAES-OAEP key is too short for the hash function.");
    }
    if (!label) {
      label = "";
    }
    md.update(label, "raw");
    var lHash = md.digest().getBytes();
    var y = em.charAt(0);
    var maskedSeed = em.substring(1, md.digestLength + 1);
    var maskedDB = em.substring(1 + md.digestLength);
    var seedMask = rsa_mgf1(maskedDB, md.digestLength, mgf1Md);
    var seed = forge2.util.xorBytes(maskedSeed, seedMask, maskedSeed.length);
    var dbMask = rsa_mgf1(seed, keyLength - md.digestLength - 1, mgf1Md);
    var db = forge2.util.xorBytes(maskedDB, dbMask, maskedDB.length);
    var lHashPrime = db.substring(0, md.digestLength);
    var error = y !== "\0";
    for (var i = 0; i < md.digestLength; ++i) {
      error |= lHash.charAt(i) !== lHashPrime.charAt(i);
    }
    var in_ps = 1;
    var index = md.digestLength;
    for (var j = md.digestLength; j < db.length; j++) {
      var code = db.charCodeAt(j);
      var is_0 = code & 1 ^ 1;
      var error_mask = in_ps ? 65534 : 0;
      error |= code & error_mask;
      in_ps = in_ps & is_0;
      index += in_ps;
    }
    if (error || db.charCodeAt(index) !== 1) {
      throw new Error("Invalid RSAES-OAEP padding.");
    }
    return db.substring(index + 1);
  };
  function rsa_mgf1(seed, maskLength, hash) {
    if (!hash) {
      hash = forge2.md.sha1.create();
    }
    var t = "";
    var count = Math.ceil(maskLength / hash.digestLength);
    for (var i = 0; i < count; ++i) {
      var c = String.fromCharCode(i >> 24 & 255, i >> 16 & 255, i >> 8 & 255, i & 255);
      hash.start();
      hash.update(seed + c);
      t += hash.digest().getBytes();
    }
    return t.substring(0, maskLength);
  }
});

// node_modules/node-forge/lib/prime.js
var require_prime = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_util();
  require_jsbn();
  require_random();
  (function() {
    if (forge2.prime) {
      module2.exports = forge2.prime;
      return;
    }
    var prime = module2.exports = forge2.prime = forge2.prime || {};
    var BigInteger = forge2.jsbn.BigInteger;
    var GCD_30_DELTA = [6, 4, 2, 4, 2, 4, 6, 2];
    var THIRTY = new BigInteger(null);
    THIRTY.fromInt(30);
    var op_or = function(x, y) {
      return x | y;
    };
    prime.generateProbablePrime = function(bits, options, callback) {
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      options = options || {};
      var algorithm = options.algorithm || "PRIMEINC";
      if (typeof algorithm === "string") {
        algorithm = {name: algorithm};
      }
      algorithm.options = algorithm.options || {};
      var prng = options.prng || forge2.random;
      var rng = {
        nextBytes: function(x) {
          var b = prng.getBytesSync(x.length);
          for (var i = 0; i < x.length; ++i) {
            x[i] = b.charCodeAt(i);
          }
        }
      };
      if (algorithm.name === "PRIMEINC") {
        return primeincFindPrime(bits, rng, algorithm.options, callback);
      }
      throw new Error("Invalid prime generation algorithm: " + algorithm.name);
    };
    function primeincFindPrime(bits, rng, options, callback) {
      if ("workers" in options) {
        return primeincFindPrimeWithWorkers(bits, rng, options, callback);
      }
      return primeincFindPrimeWithoutWorkers(bits, rng, options, callback);
    }
    function primeincFindPrimeWithoutWorkers(bits, rng, options, callback) {
      var num = generateRandom(bits, rng);
      var deltaIdx = 0;
      var mrTests = getMillerRabinTests(num.bitLength());
      if ("millerRabinTests" in options) {
        mrTests = options.millerRabinTests;
      }
      var maxBlockTime = 10;
      if ("maxBlockTime" in options) {
        maxBlockTime = options.maxBlockTime;
      }
      _primeinc(num, bits, rng, deltaIdx, mrTests, maxBlockTime, callback);
    }
    function _primeinc(num, bits, rng, deltaIdx, mrTests, maxBlockTime, callback) {
      var start = +new Date();
      do {
        if (num.bitLength() > bits) {
          num = generateRandom(bits, rng);
        }
        if (num.isProbablePrime(mrTests)) {
          return callback(null, num);
        }
        num.dAddOffset(GCD_30_DELTA[deltaIdx++ % 8], 0);
      } while (maxBlockTime < 0 || +new Date() - start < maxBlockTime);
      forge2.util.setImmediate(function() {
        _primeinc(num, bits, rng, deltaIdx, mrTests, maxBlockTime, callback);
      });
    }
    function primeincFindPrimeWithWorkers(bits, rng, options, callback) {
      if (typeof Worker === "undefined") {
        return primeincFindPrimeWithoutWorkers(bits, rng, options, callback);
      }
      var num = generateRandom(bits, rng);
      var numWorkers = options.workers;
      var workLoad = options.workLoad || 100;
      var range = workLoad * 30 / 8;
      var workerScript = options.workerScript || "forge/prime.worker.js";
      if (numWorkers === -1) {
        return forge2.util.estimateCores(function(err, cores) {
          if (err) {
            cores = 2;
          }
          numWorkers = cores - 1;
          generate();
        });
      }
      generate();
      function generate() {
        numWorkers = Math.max(1, numWorkers);
        var workers = [];
        for (var i = 0; i < numWorkers; ++i) {
          workers[i] = new Worker(workerScript);
        }
        var running = numWorkers;
        for (var i = 0; i < numWorkers; ++i) {
          workers[i].addEventListener("message", workerMessage);
        }
        var found = false;
        function workerMessage(e) {
          if (found) {
            return;
          }
          --running;
          var data = e.data;
          if (data.found) {
            for (var i2 = 0; i2 < workers.length; ++i2) {
              workers[i2].terminate();
            }
            found = true;
            return callback(null, new BigInteger(data.prime, 16));
          }
          if (num.bitLength() > bits) {
            num = generateRandom(bits, rng);
          }
          var hex = num.toString(16);
          e.target.postMessage({
            hex,
            workLoad
          });
          num.dAddOffset(range, 0);
        }
      }
    }
    function generateRandom(bits, rng) {
      var num = new BigInteger(bits, rng);
      var bits1 = bits - 1;
      if (!num.testBit(bits1)) {
        num.bitwiseTo(BigInteger.ONE.shiftLeft(bits1), op_or, num);
      }
      num.dAddOffset(31 - num.mod(THIRTY).byteValue(), 0);
      return num;
    }
    function getMillerRabinTests(bits) {
      if (bits <= 100)
        return 27;
      if (bits <= 150)
        return 18;
      if (bits <= 200)
        return 15;
      if (bits <= 250)
        return 12;
      if (bits <= 300)
        return 9;
      if (bits <= 350)
        return 8;
      if (bits <= 400)
        return 7;
      if (bits <= 500)
        return 6;
      if (bits <= 600)
        return 5;
      if (bits <= 800)
        return 4;
      if (bits <= 1250)
        return 3;
      return 2;
    }
  })();
});

// node_modules/node-forge/lib/rsa.js
var require_rsa = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_asn1();
  require_jsbn();
  require_oids();
  require_pkcs1();
  require_prime();
  require_random();
  require_util();
  if (typeof BigInteger === "undefined") {
    BigInteger = forge2.jsbn.BigInteger;
  }
  var BigInteger;
  var _crypto = forge2.util.isNodejs ? require("crypto") : null;
  var asn1 = forge2.asn1;
  var util = forge2.util;
  forge2.pki = forge2.pki || {};
  module2.exports = forge2.pki.rsa = forge2.rsa = forge2.rsa || {};
  var pki2 = forge2.pki;
  var GCD_30_DELTA = [6, 4, 2, 4, 2, 4, 6, 2];
  var privateKeyValidator = {
    name: "PrivateKeyInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "PrivateKeyInfo.version",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "privateKeyVersion"
    }, {
      name: "PrivateKeyInfo.privateKeyAlgorithm",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: "AlgorithmIdentifier.algorithm",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: false,
        capture: "privateKeyOid"
      }]
    }, {
      name: "PrivateKeyInfo",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OCTETSTRING,
      constructed: false,
      capture: "privateKey"
    }]
  };
  var rsaPrivateKeyValidator = {
    name: "RSAPrivateKey",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "RSAPrivateKey.version",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "privateKeyVersion"
    }, {
      name: "RSAPrivateKey.modulus",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "privateKeyModulus"
    }, {
      name: "RSAPrivateKey.publicExponent",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "privateKeyPublicExponent"
    }, {
      name: "RSAPrivateKey.privateExponent",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "privateKeyPrivateExponent"
    }, {
      name: "RSAPrivateKey.prime1",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "privateKeyPrime1"
    }, {
      name: "RSAPrivateKey.prime2",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "privateKeyPrime2"
    }, {
      name: "RSAPrivateKey.exponent1",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "privateKeyExponent1"
    }, {
      name: "RSAPrivateKey.exponent2",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "privateKeyExponent2"
    }, {
      name: "RSAPrivateKey.coefficient",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "privateKeyCoefficient"
    }]
  };
  var rsaPublicKeyValidator = {
    name: "RSAPublicKey",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "RSAPublicKey.modulus",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "publicKeyModulus"
    }, {
      name: "RSAPublicKey.exponent",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "publicKeyExponent"
    }]
  };
  var publicKeyValidator = forge2.pki.rsa.publicKeyValidator = {
    name: "SubjectPublicKeyInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    captureAsn1: "subjectPublicKeyInfo",
    value: [{
      name: "SubjectPublicKeyInfo.AlgorithmIdentifier",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: "AlgorithmIdentifier.algorithm",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: false,
        capture: "publicKeyOid"
      }]
    }, {
      name: "SubjectPublicKeyInfo.subjectPublicKey",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.BITSTRING,
      constructed: false,
      value: [{
        name: "SubjectPublicKeyInfo.subjectPublicKey.RSAPublicKey",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        optional: true,
        captureAsn1: "rsaPublicKey"
      }]
    }]
  };
  var emsaPkcs1v15encode = function(md) {
    var oid;
    if (md.algorithm in pki2.oids) {
      oid = pki2.oids[md.algorithm];
    } else {
      var error = new Error("Unknown message digest algorithm.");
      error.algorithm = md.algorithm;
      throw error;
    }
    var oidBytes = asn1.oidToDer(oid).getBytes();
    var digestInfo = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
    var digestAlgorithm = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
    digestAlgorithm.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, oidBytes));
    digestAlgorithm.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, ""));
    var digest = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, md.digest().getBytes());
    digestInfo.value.push(digestAlgorithm);
    digestInfo.value.push(digest);
    return asn1.toDer(digestInfo).getBytes();
  };
  var _modPow = function(x, key, pub) {
    if (pub) {
      return x.modPow(key.e, key.n);
    }
    if (!key.p || !key.q) {
      return x.modPow(key.d, key.n);
    }
    if (!key.dP) {
      key.dP = key.d.mod(key.p.subtract(BigInteger.ONE));
    }
    if (!key.dQ) {
      key.dQ = key.d.mod(key.q.subtract(BigInteger.ONE));
    }
    if (!key.qInv) {
      key.qInv = key.q.modInverse(key.p);
    }
    var r;
    do {
      r = new BigInteger(forge2.util.bytesToHex(forge2.random.getBytes(key.n.bitLength() / 8)), 16);
    } while (r.compareTo(key.n) >= 0 || !r.gcd(key.n).equals(BigInteger.ONE));
    x = x.multiply(r.modPow(key.e, key.n)).mod(key.n);
    var xp = x.mod(key.p).modPow(key.dP, key.p);
    var xq = x.mod(key.q).modPow(key.dQ, key.q);
    while (xp.compareTo(xq) < 0) {
      xp = xp.add(key.p);
    }
    var y = xp.subtract(xq).multiply(key.qInv).mod(key.p).multiply(key.q).add(xq);
    y = y.multiply(r.modInverse(key.n)).mod(key.n);
    return y;
  };
  pki2.rsa.encrypt = function(m, key, bt) {
    var pub = bt;
    var eb;
    var k = Math.ceil(key.n.bitLength() / 8);
    if (bt !== false && bt !== true) {
      pub = bt === 2;
      eb = _encodePkcs1_v1_5(m, key, bt);
    } else {
      eb = forge2.util.createBuffer();
      eb.putBytes(m);
    }
    var x = new BigInteger(eb.toHex(), 16);
    var y = _modPow(x, key, pub);
    var yhex = y.toString(16);
    var ed = forge2.util.createBuffer();
    var zeros = k - Math.ceil(yhex.length / 2);
    while (zeros > 0) {
      ed.putByte(0);
      --zeros;
    }
    ed.putBytes(forge2.util.hexToBytes(yhex));
    return ed.getBytes();
  };
  pki2.rsa.decrypt = function(ed, key, pub, ml) {
    var k = Math.ceil(key.n.bitLength() / 8);
    if (ed.length !== k) {
      var error = new Error("Encrypted message length is invalid.");
      error.length = ed.length;
      error.expected = k;
      throw error;
    }
    var y = new BigInteger(forge2.util.createBuffer(ed).toHex(), 16);
    if (y.compareTo(key.n) >= 0) {
      throw new Error("Encrypted message is invalid.");
    }
    var x = _modPow(y, key, pub);
    var xhex = x.toString(16);
    var eb = forge2.util.createBuffer();
    var zeros = k - Math.ceil(xhex.length / 2);
    while (zeros > 0) {
      eb.putByte(0);
      --zeros;
    }
    eb.putBytes(forge2.util.hexToBytes(xhex));
    if (ml !== false) {
      return _decodePkcs1_v1_5(eb.getBytes(), key, pub);
    }
    return eb.getBytes();
  };
  pki2.rsa.createKeyPairGenerationState = function(bits, e, options) {
    if (typeof bits === "string") {
      bits = parseInt(bits, 10);
    }
    bits = bits || 2048;
    options = options || {};
    var prng = options.prng || forge2.random;
    var rng = {
      nextBytes: function(x) {
        var b = prng.getBytesSync(x.length);
        for (var i = 0; i < x.length; ++i) {
          x[i] = b.charCodeAt(i);
        }
      }
    };
    var algorithm = options.algorithm || "PRIMEINC";
    var rval;
    if (algorithm === "PRIMEINC") {
      rval = {
        algorithm,
        state: 0,
        bits,
        rng,
        eInt: e || 65537,
        e: new BigInteger(null),
        p: null,
        q: null,
        qBits: bits >> 1,
        pBits: bits - (bits >> 1),
        pqState: 0,
        num: null,
        keys: null
      };
      rval.e.fromInt(rval.eInt);
    } else {
      throw new Error("Invalid key generation algorithm: " + algorithm);
    }
    return rval;
  };
  pki2.rsa.stepKeyPairGenerationState = function(state, n) {
    if (!("algorithm" in state)) {
      state.algorithm = "PRIMEINC";
    }
    var THIRTY = new BigInteger(null);
    THIRTY.fromInt(30);
    var deltaIdx = 0;
    var op_or = function(x, y) {
      return x | y;
    };
    var t1 = +new Date();
    var t2;
    var total = 0;
    while (state.keys === null && (n <= 0 || total < n)) {
      if (state.state === 0) {
        var bits = state.p === null ? state.pBits : state.qBits;
        var bits1 = bits - 1;
        if (state.pqState === 0) {
          state.num = new BigInteger(bits, state.rng);
          if (!state.num.testBit(bits1)) {
            state.num.bitwiseTo(BigInteger.ONE.shiftLeft(bits1), op_or, state.num);
          }
          state.num.dAddOffset(31 - state.num.mod(THIRTY).byteValue(), 0);
          deltaIdx = 0;
          ++state.pqState;
        } else if (state.pqState === 1) {
          if (state.num.bitLength() > bits) {
            state.pqState = 0;
          } else if (state.num.isProbablePrime(_getMillerRabinTests(state.num.bitLength()))) {
            ++state.pqState;
          } else {
            state.num.dAddOffset(GCD_30_DELTA[deltaIdx++ % 8], 0);
          }
        } else if (state.pqState === 2) {
          state.pqState = state.num.subtract(BigInteger.ONE).gcd(state.e).compareTo(BigInteger.ONE) === 0 ? 3 : 0;
        } else if (state.pqState === 3) {
          state.pqState = 0;
          if (state.p === null) {
            state.p = state.num;
          } else {
            state.q = state.num;
          }
          if (state.p !== null && state.q !== null) {
            ++state.state;
          }
          state.num = null;
        }
      } else if (state.state === 1) {
        if (state.p.compareTo(state.q) < 0) {
          state.num = state.p;
          state.p = state.q;
          state.q = state.num;
        }
        ++state.state;
      } else if (state.state === 2) {
        state.p1 = state.p.subtract(BigInteger.ONE);
        state.q1 = state.q.subtract(BigInteger.ONE);
        state.phi = state.p1.multiply(state.q1);
        ++state.state;
      } else if (state.state === 3) {
        if (state.phi.gcd(state.e).compareTo(BigInteger.ONE) === 0) {
          ++state.state;
        } else {
          state.p = null;
          state.q = null;
          state.state = 0;
        }
      } else if (state.state === 4) {
        state.n = state.p.multiply(state.q);
        if (state.n.bitLength() === state.bits) {
          ++state.state;
        } else {
          state.q = null;
          state.state = 0;
        }
      } else if (state.state === 5) {
        var d = state.e.modInverse(state.phi);
        state.keys = {
          privateKey: pki2.rsa.setPrivateKey(state.n, state.e, d, state.p, state.q, d.mod(state.p1), d.mod(state.q1), state.q.modInverse(state.p)),
          publicKey: pki2.rsa.setPublicKey(state.n, state.e)
        };
      }
      t2 = +new Date();
      total += t2 - t1;
      t1 = t2;
    }
    return state.keys !== null;
  };
  pki2.rsa.generateKeyPair = function(bits, e, options, callback) {
    if (arguments.length === 1) {
      if (typeof bits === "object") {
        options = bits;
        bits = void 0;
      } else if (typeof bits === "function") {
        callback = bits;
        bits = void 0;
      }
    } else if (arguments.length === 2) {
      if (typeof bits === "number") {
        if (typeof e === "function") {
          callback = e;
          e = void 0;
        } else if (typeof e !== "number") {
          options = e;
          e = void 0;
        }
      } else {
        options = bits;
        callback = e;
        bits = void 0;
        e = void 0;
      }
    } else if (arguments.length === 3) {
      if (typeof e === "number") {
        if (typeof options === "function") {
          callback = options;
          options = void 0;
        }
      } else {
        callback = options;
        options = e;
        e = void 0;
      }
    }
    options = options || {};
    if (bits === void 0) {
      bits = options.bits || 2048;
    }
    if (e === void 0) {
      e = options.e || 65537;
    }
    if (!forge2.options.usePureJavaScript && !options.prng && bits >= 256 && bits <= 16384 && (e === 65537 || e === 3)) {
      if (callback) {
        if (_detectNodeCrypto("generateKeyPair")) {
          return _crypto.generateKeyPair("rsa", {
            modulusLength: bits,
            publicExponent: e,
            publicKeyEncoding: {
              type: "spki",
              format: "pem"
            },
            privateKeyEncoding: {
              type: "pkcs8",
              format: "pem"
            }
          }, function(err, pub, priv) {
            if (err) {
              return callback(err);
            }
            callback(null, {
              privateKey: pki2.privateKeyFromPem(priv),
              publicKey: pki2.publicKeyFromPem(pub)
            });
          });
        }
        if (_detectSubtleCrypto("generateKey") && _detectSubtleCrypto("exportKey")) {
          return util.globalScope.crypto.subtle.generateKey({
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: bits,
            publicExponent: _intToUint8Array(e),
            hash: {name: "SHA-256"}
          }, true, ["sign", "verify"]).then(function(pair) {
            return util.globalScope.crypto.subtle.exportKey("pkcs8", pair.privateKey);
          }).then(void 0, function(err) {
            callback(err);
          }).then(function(pkcs8) {
            if (pkcs8) {
              var privateKey = pki2.privateKeyFromAsn1(asn1.fromDer(forge2.util.createBuffer(pkcs8)));
              callback(null, {
                privateKey,
                publicKey: pki2.setRsaPublicKey(privateKey.n, privateKey.e)
              });
            }
          });
        }
        if (_detectSubtleMsCrypto("generateKey") && _detectSubtleMsCrypto("exportKey")) {
          var genOp = util.globalScope.msCrypto.subtle.generateKey({
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: bits,
            publicExponent: _intToUint8Array(e),
            hash: {name: "SHA-256"}
          }, true, ["sign", "verify"]);
          genOp.oncomplete = function(e2) {
            var pair = e2.target.result;
            var exportOp = util.globalScope.msCrypto.subtle.exportKey("pkcs8", pair.privateKey);
            exportOp.oncomplete = function(e3) {
              var pkcs8 = e3.target.result;
              var privateKey = pki2.privateKeyFromAsn1(asn1.fromDer(forge2.util.createBuffer(pkcs8)));
              callback(null, {
                privateKey,
                publicKey: pki2.setRsaPublicKey(privateKey.n, privateKey.e)
              });
            };
            exportOp.onerror = function(err) {
              callback(err);
            };
          };
          genOp.onerror = function(err) {
            callback(err);
          };
          return;
        }
      } else {
        if (_detectNodeCrypto("generateKeyPairSync")) {
          var keypair = _crypto.generateKeyPairSync("rsa", {
            modulusLength: bits,
            publicExponent: e,
            publicKeyEncoding: {
              type: "spki",
              format: "pem"
            },
            privateKeyEncoding: {
              type: "pkcs8",
              format: "pem"
            }
          });
          return {
            privateKey: pki2.privateKeyFromPem(keypair.privateKey),
            publicKey: pki2.publicKeyFromPem(keypair.publicKey)
          };
        }
      }
    }
    var state = pki2.rsa.createKeyPairGenerationState(bits, e, options);
    if (!callback) {
      pki2.rsa.stepKeyPairGenerationState(state, 0);
      return state.keys;
    }
    _generateKeyPair(state, options, callback);
  };
  pki2.setRsaPublicKey = pki2.rsa.setPublicKey = function(n, e) {
    var key = {
      n,
      e
    };
    key.encrypt = function(data, scheme, schemeOptions) {
      if (typeof scheme === "string") {
        scheme = scheme.toUpperCase();
      } else if (scheme === void 0) {
        scheme = "RSAES-PKCS1-V1_5";
      }
      if (scheme === "RSAES-PKCS1-V1_5") {
        scheme = {
          encode: function(m, key2, pub) {
            return _encodePkcs1_v1_5(m, key2, 2).getBytes();
          }
        };
      } else if (scheme === "RSA-OAEP" || scheme === "RSAES-OAEP") {
        scheme = {
          encode: function(m, key2) {
            return forge2.pkcs1.encode_rsa_oaep(key2, m, schemeOptions);
          }
        };
      } else if (["RAW", "NONE", "NULL", null].indexOf(scheme) !== -1) {
        scheme = {encode: function(e3) {
          return e3;
        }};
      } else if (typeof scheme === "string") {
        throw new Error('Unsupported encryption scheme: "' + scheme + '".');
      }
      var e2 = scheme.encode(data, key, true);
      return pki2.rsa.encrypt(e2, key, true);
    };
    key.verify = function(digest, signature, scheme) {
      if (typeof scheme === "string") {
        scheme = scheme.toUpperCase();
      } else if (scheme === void 0) {
        scheme = "RSASSA-PKCS1-V1_5";
      }
      if (scheme === "RSASSA-PKCS1-V1_5") {
        scheme = {
          verify: function(digest2, d2) {
            d2 = _decodePkcs1_v1_5(d2, key, true);
            var obj = asn1.fromDer(d2);
            return digest2 === obj.value[1].value;
          }
        };
      } else if (scheme === "NONE" || scheme === "NULL" || scheme === null) {
        scheme = {
          verify: function(digest2, d2) {
            d2 = _decodePkcs1_v1_5(d2, key, true);
            return digest2 === d2;
          }
        };
      }
      var d = pki2.rsa.decrypt(signature, key, true, false);
      return scheme.verify(digest, d, key.n.bitLength());
    };
    return key;
  };
  pki2.setRsaPrivateKey = pki2.rsa.setPrivateKey = function(n, e, d, p, q, dP, dQ, qInv) {
    var key = {
      n,
      e,
      d,
      p,
      q,
      dP,
      dQ,
      qInv
    };
    key.decrypt = function(data, scheme, schemeOptions) {
      if (typeof scheme === "string") {
        scheme = scheme.toUpperCase();
      } else if (scheme === void 0) {
        scheme = "RSAES-PKCS1-V1_5";
      }
      var d2 = pki2.rsa.decrypt(data, key, false, false);
      if (scheme === "RSAES-PKCS1-V1_5") {
        scheme = {decode: _decodePkcs1_v1_5};
      } else if (scheme === "RSA-OAEP" || scheme === "RSAES-OAEP") {
        scheme = {
          decode: function(d3, key2) {
            return forge2.pkcs1.decode_rsa_oaep(key2, d3, schemeOptions);
          }
        };
      } else if (["RAW", "NONE", "NULL", null].indexOf(scheme) !== -1) {
        scheme = {decode: function(d3) {
          return d3;
        }};
      } else {
        throw new Error('Unsupported encryption scheme: "' + scheme + '".');
      }
      return scheme.decode(d2, key, false);
    };
    key.sign = function(md, scheme) {
      var bt = false;
      if (typeof scheme === "string") {
        scheme = scheme.toUpperCase();
      }
      if (scheme === void 0 || scheme === "RSASSA-PKCS1-V1_5") {
        scheme = {encode: emsaPkcs1v15encode};
        bt = 1;
      } else if (scheme === "NONE" || scheme === "NULL" || scheme === null) {
        scheme = {encode: function() {
          return md;
        }};
        bt = 1;
      }
      var d2 = scheme.encode(md, key.n.bitLength());
      return pki2.rsa.encrypt(d2, key, bt);
    };
    return key;
  };
  pki2.wrapRsaPrivateKey = function(rsaKey) {
    return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(0).getBytes()),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki2.oids.rsaEncryption).getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
      ]),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, asn1.toDer(rsaKey).getBytes())
    ]);
  };
  pki2.privateKeyFromAsn1 = function(obj) {
    var capture = {};
    var errors = [];
    if (asn1.validate(obj, privateKeyValidator, capture, errors)) {
      obj = asn1.fromDer(forge2.util.createBuffer(capture.privateKey));
    }
    capture = {};
    errors = [];
    if (!asn1.validate(obj, rsaPrivateKeyValidator, capture, errors)) {
      var error = new Error("Cannot read private key. ASN.1 object does not contain an RSAPrivateKey.");
      error.errors = errors;
      throw error;
    }
    var n, e, d, p, q, dP, dQ, qInv;
    n = forge2.util.createBuffer(capture.privateKeyModulus).toHex();
    e = forge2.util.createBuffer(capture.privateKeyPublicExponent).toHex();
    d = forge2.util.createBuffer(capture.privateKeyPrivateExponent).toHex();
    p = forge2.util.createBuffer(capture.privateKeyPrime1).toHex();
    q = forge2.util.createBuffer(capture.privateKeyPrime2).toHex();
    dP = forge2.util.createBuffer(capture.privateKeyExponent1).toHex();
    dQ = forge2.util.createBuffer(capture.privateKeyExponent2).toHex();
    qInv = forge2.util.createBuffer(capture.privateKeyCoefficient).toHex();
    return pki2.setRsaPrivateKey(new BigInteger(n, 16), new BigInteger(e, 16), new BigInteger(d, 16), new BigInteger(p, 16), new BigInteger(q, 16), new BigInteger(dP, 16), new BigInteger(dQ, 16), new BigInteger(qInv, 16));
  };
  pki2.privateKeyToAsn1 = pki2.privateKeyToRSAPrivateKey = function(key) {
    return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(0).getBytes()),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.n)),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.e)),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.d)),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.p)),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.q)),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.dP)),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.dQ)),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.qInv))
    ]);
  };
  pki2.publicKeyFromAsn1 = function(obj) {
    var capture = {};
    var errors = [];
    if (asn1.validate(obj, publicKeyValidator, capture, errors)) {
      var oid = asn1.derToOid(capture.publicKeyOid);
      if (oid !== pki2.oids.rsaEncryption) {
        var error = new Error("Cannot read public key. Unknown OID.");
        error.oid = oid;
        throw error;
      }
      obj = capture.rsaPublicKey;
    }
    errors = [];
    if (!asn1.validate(obj, rsaPublicKeyValidator, capture, errors)) {
      var error = new Error("Cannot read public key. ASN.1 object does not contain an RSAPublicKey.");
      error.errors = errors;
      throw error;
    }
    var n = forge2.util.createBuffer(capture.publicKeyModulus).toHex();
    var e = forge2.util.createBuffer(capture.publicKeyExponent).toHex();
    return pki2.setRsaPublicKey(new BigInteger(n, 16), new BigInteger(e, 16));
  };
  pki2.publicKeyToAsn1 = pki2.publicKeyToSubjectPublicKeyInfo = function(key) {
    return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki2.oids.rsaEncryption).getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
      ]),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, [
        pki2.publicKeyToRSAPublicKey(key)
      ])
    ]);
  };
  pki2.publicKeyToRSAPublicKey = function(key) {
    return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.n)),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.e))
    ]);
  };
  function _encodePkcs1_v1_5(m, key, bt) {
    var eb = forge2.util.createBuffer();
    var k = Math.ceil(key.n.bitLength() / 8);
    if (m.length > k - 11) {
      var error = new Error("Message is too long for PKCS#1 v1.5 padding.");
      error.length = m.length;
      error.max = k - 11;
      throw error;
    }
    eb.putByte(0);
    eb.putByte(bt);
    var padNum = k - 3 - m.length;
    var padByte;
    if (bt === 0 || bt === 1) {
      padByte = bt === 0 ? 0 : 255;
      for (var i = 0; i < padNum; ++i) {
        eb.putByte(padByte);
      }
    } else {
      while (padNum > 0) {
        var numZeros = 0;
        var padBytes = forge2.random.getBytes(padNum);
        for (var i = 0; i < padNum; ++i) {
          padByte = padBytes.charCodeAt(i);
          if (padByte === 0) {
            ++numZeros;
          } else {
            eb.putByte(padByte);
          }
        }
        padNum = numZeros;
      }
    }
    eb.putByte(0);
    eb.putBytes(m);
    return eb;
  }
  function _decodePkcs1_v1_5(em, key, pub, ml) {
    var k = Math.ceil(key.n.bitLength() / 8);
    var eb = forge2.util.createBuffer(em);
    var first = eb.getByte();
    var bt = eb.getByte();
    if (first !== 0 || pub && bt !== 0 && bt !== 1 || !pub && bt != 2 || pub && bt === 0 && typeof ml === "undefined") {
      throw new Error("Encryption block is invalid.");
    }
    var padNum = 0;
    if (bt === 0) {
      padNum = k - 3 - ml;
      for (var i = 0; i < padNum; ++i) {
        if (eb.getByte() !== 0) {
          throw new Error("Encryption block is invalid.");
        }
      }
    } else if (bt === 1) {
      padNum = 0;
      while (eb.length() > 1) {
        if (eb.getByte() !== 255) {
          --eb.read;
          break;
        }
        ++padNum;
      }
    } else if (bt === 2) {
      padNum = 0;
      while (eb.length() > 1) {
        if (eb.getByte() === 0) {
          --eb.read;
          break;
        }
        ++padNum;
      }
    }
    var zero = eb.getByte();
    if (zero !== 0 || padNum !== k - 3 - eb.length()) {
      throw new Error("Encryption block is invalid.");
    }
    return eb.getBytes();
  }
  function _generateKeyPair(state, options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    options = options || {};
    var opts = {
      algorithm: {
        name: options.algorithm || "PRIMEINC",
        options: {
          workers: options.workers || 2,
          workLoad: options.workLoad || 100,
          workerScript: options.workerScript
        }
      }
    };
    if ("prng" in options) {
      opts.prng = options.prng;
    }
    generate();
    function generate() {
      getPrime(state.pBits, function(err, num) {
        if (err) {
          return callback(err);
        }
        state.p = num;
        if (state.q !== null) {
          return finish(err, state.q);
        }
        getPrime(state.qBits, finish);
      });
    }
    function getPrime(bits, callback2) {
      forge2.prime.generateProbablePrime(bits, opts, callback2);
    }
    function finish(err, num) {
      if (err) {
        return callback(err);
      }
      state.q = num;
      if (state.p.compareTo(state.q) < 0) {
        var tmp = state.p;
        state.p = state.q;
        state.q = tmp;
      }
      if (state.p.subtract(BigInteger.ONE).gcd(state.e).compareTo(BigInteger.ONE) !== 0) {
        state.p = null;
        generate();
        return;
      }
      if (state.q.subtract(BigInteger.ONE).gcd(state.e).compareTo(BigInteger.ONE) !== 0) {
        state.q = null;
        getPrime(state.qBits, finish);
        return;
      }
      state.p1 = state.p.subtract(BigInteger.ONE);
      state.q1 = state.q.subtract(BigInteger.ONE);
      state.phi = state.p1.multiply(state.q1);
      if (state.phi.gcd(state.e).compareTo(BigInteger.ONE) !== 0) {
        state.p = state.q = null;
        generate();
        return;
      }
      state.n = state.p.multiply(state.q);
      if (state.n.bitLength() !== state.bits) {
        state.q = null;
        getPrime(state.qBits, finish);
        return;
      }
      var d = state.e.modInverse(state.phi);
      state.keys = {
        privateKey: pki2.rsa.setPrivateKey(state.n, state.e, d, state.p, state.q, d.mod(state.p1), d.mod(state.q1), state.q.modInverse(state.p)),
        publicKey: pki2.rsa.setPublicKey(state.n, state.e)
      };
      callback(null, state.keys);
    }
  }
  function _bnToBytes(b) {
    var hex = b.toString(16);
    if (hex[0] >= "8") {
      hex = "00" + hex;
    }
    var bytes = forge2.util.hexToBytes(hex);
    if (bytes.length > 1 && (bytes.charCodeAt(0) === 0 && (bytes.charCodeAt(1) & 128) === 0 || bytes.charCodeAt(0) === 255 && (bytes.charCodeAt(1) & 128) === 128)) {
      return bytes.substr(1);
    }
    return bytes;
  }
  function _getMillerRabinTests(bits) {
    if (bits <= 100)
      return 27;
    if (bits <= 150)
      return 18;
    if (bits <= 200)
      return 15;
    if (bits <= 250)
      return 12;
    if (bits <= 300)
      return 9;
    if (bits <= 350)
      return 8;
    if (bits <= 400)
      return 7;
    if (bits <= 500)
      return 6;
    if (bits <= 600)
      return 5;
    if (bits <= 800)
      return 4;
    if (bits <= 1250)
      return 3;
    return 2;
  }
  function _detectNodeCrypto(fn) {
    return forge2.util.isNodejs && typeof _crypto[fn] === "function";
  }
  function _detectSubtleCrypto(fn) {
    return typeof util.globalScope !== "undefined" && typeof util.globalScope.crypto === "object" && typeof util.globalScope.crypto.subtle === "object" && typeof util.globalScope.crypto.subtle[fn] === "function";
  }
  function _detectSubtleMsCrypto(fn) {
    return typeof util.globalScope !== "undefined" && typeof util.globalScope.msCrypto === "object" && typeof util.globalScope.msCrypto.subtle === "object" && typeof util.globalScope.msCrypto.subtle[fn] === "function";
  }
  function _intToUint8Array(x) {
    var bytes = forge2.util.hexToBytes(x.toString(16));
    var buffer = new Uint8Array(bytes.length);
    for (var i = 0; i < bytes.length; ++i) {
      buffer[i] = bytes.charCodeAt(i);
    }
    return buffer;
  }
});

// node_modules/node-forge/lib/pbe.js
var require_pbe = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_aes();
  require_asn1();
  require_des();
  require_md();
  require_oids();
  require_pbkdf2();
  require_pem();
  require_random();
  require_rc2();
  require_rsa();
  require_util();
  if (typeof BigInteger === "undefined") {
    BigInteger = forge2.jsbn.BigInteger;
  }
  var BigInteger;
  var asn1 = forge2.asn1;
  var pki2 = forge2.pki = forge2.pki || {};
  module2.exports = pki2.pbe = forge2.pbe = forge2.pbe || {};
  var oids = pki2.oids;
  var encryptedPrivateKeyValidator = {
    name: "EncryptedPrivateKeyInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "EncryptedPrivateKeyInfo.encryptionAlgorithm",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: "AlgorithmIdentifier.algorithm",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: false,
        capture: "encryptionOid"
      }, {
        name: "AlgorithmIdentifier.parameters",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        captureAsn1: "encryptionParams"
      }]
    }, {
      name: "EncryptedPrivateKeyInfo.encryptedData",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OCTETSTRING,
      constructed: false,
      capture: "encryptedData"
    }]
  };
  var PBES2AlgorithmsValidator = {
    name: "PBES2Algorithms",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "PBES2Algorithms.keyDerivationFunc",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: "PBES2Algorithms.keyDerivationFunc.oid",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: false,
        capture: "kdfOid"
      }, {
        name: "PBES2Algorithms.params",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "PBES2Algorithms.params.salt",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OCTETSTRING,
          constructed: false,
          capture: "kdfSalt"
        }, {
          name: "PBES2Algorithms.params.iterationCount",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "kdfIterationCount"
        }, {
          name: "PBES2Algorithms.params.keyLength",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          optional: true,
          capture: "keyLength"
        }, {
          name: "PBES2Algorithms.params.prf",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          optional: true,
          value: [{
            name: "PBES2Algorithms.params.prf.algorithm",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: "prfOid"
          }]
        }]
      }]
    }, {
      name: "PBES2Algorithms.encryptionScheme",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: "PBES2Algorithms.encryptionScheme.oid",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: false,
        capture: "encOid"
      }, {
        name: "PBES2Algorithms.encryptionScheme.iv",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OCTETSTRING,
        constructed: false,
        capture: "encIv"
      }]
    }]
  };
  var pkcs12PbeParamsValidator = {
    name: "pkcs-12PbeParams",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "pkcs-12PbeParams.salt",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OCTETSTRING,
      constructed: false,
      capture: "salt"
    }, {
      name: "pkcs-12PbeParams.iterations",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "iterations"
    }]
  };
  pki2.encryptPrivateKeyInfo = function(obj, password, options) {
    options = options || {};
    options.saltSize = options.saltSize || 8;
    options.count = options.count || 2048;
    options.algorithm = options.algorithm || "aes128";
    options.prfAlgorithm = options.prfAlgorithm || "sha1";
    var salt = forge2.random.getBytesSync(options.saltSize);
    var count = options.count;
    var countBytes = asn1.integerToDer(count);
    var dkLen;
    var encryptionAlgorithm;
    var encryptedData;
    if (options.algorithm.indexOf("aes") === 0 || options.algorithm === "des") {
      var ivLen, encOid, cipherFn;
      switch (options.algorithm) {
        case "aes128":
          dkLen = 16;
          ivLen = 16;
          encOid = oids["aes128-CBC"];
          cipherFn = forge2.aes.createEncryptionCipher;
          break;
        case "aes192":
          dkLen = 24;
          ivLen = 16;
          encOid = oids["aes192-CBC"];
          cipherFn = forge2.aes.createEncryptionCipher;
          break;
        case "aes256":
          dkLen = 32;
          ivLen = 16;
          encOid = oids["aes256-CBC"];
          cipherFn = forge2.aes.createEncryptionCipher;
          break;
        case "des":
          dkLen = 8;
          ivLen = 8;
          encOid = oids["desCBC"];
          cipherFn = forge2.des.createEncryptionCipher;
          break;
        default:
          var error = new Error("Cannot encrypt private key. Unknown encryption algorithm.");
          error.algorithm = options.algorithm;
          throw error;
      }
      var prfAlgorithm = "hmacWith" + options.prfAlgorithm.toUpperCase();
      var md = prfAlgorithmToMessageDigest(prfAlgorithm);
      var dk = forge2.pkcs5.pbkdf2(password, salt, count, dkLen, md);
      var iv = forge2.random.getBytesSync(ivLen);
      var cipher = cipherFn(dk);
      cipher.start(iv);
      cipher.update(asn1.toDer(obj));
      cipher.finish();
      encryptedData = cipher.output.getBytes();
      var params = createPbkdf2Params(salt, countBytes, dkLen, prfAlgorithm);
      encryptionAlgorithm = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(oids["pkcs5PBES2"]).getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(oids["pkcs5PBKDF2"]).getBytes()),
            params
          ]),
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(encOid).getBytes()),
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, iv)
          ])
        ])
      ]);
    } else if (options.algorithm === "3des") {
      dkLen = 24;
      var saltBytes = new forge2.util.ByteBuffer(salt);
      var dk = pki2.pbe.generatePkcs12Key(password, saltBytes, 1, count, dkLen);
      var iv = pki2.pbe.generatePkcs12Key(password, saltBytes, 2, count, dkLen);
      var cipher = forge2.des.createEncryptionCipher(dk);
      cipher.start(iv);
      cipher.update(asn1.toDer(obj));
      cipher.finish();
      encryptedData = cipher.output.getBytes();
      encryptionAlgorithm = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]).getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, salt),
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, countBytes.getBytes())
        ])
      ]);
    } else {
      var error = new Error("Cannot encrypt private key. Unknown encryption algorithm.");
      error.algorithm = options.algorithm;
      throw error;
    }
    var rval = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      encryptionAlgorithm,
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, encryptedData)
    ]);
    return rval;
  };
  pki2.decryptPrivateKeyInfo = function(obj, password) {
    var rval = null;
    var capture = {};
    var errors = [];
    if (!asn1.validate(obj, encryptedPrivateKeyValidator, capture, errors)) {
      var error = new Error("Cannot read encrypted private key. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
      error.errors = errors;
      throw error;
    }
    var oid = asn1.derToOid(capture.encryptionOid);
    var cipher = pki2.pbe.getCipher(oid, capture.encryptionParams, password);
    var encrypted = forge2.util.createBuffer(capture.encryptedData);
    cipher.update(encrypted);
    if (cipher.finish()) {
      rval = asn1.fromDer(cipher.output);
    }
    return rval;
  };
  pki2.encryptedPrivateKeyToPem = function(epki, maxline) {
    var msg = {
      type: "ENCRYPTED PRIVATE KEY",
      body: asn1.toDer(epki).getBytes()
    };
    return forge2.pem.encode(msg, {maxline});
  };
  pki2.encryptedPrivateKeyFromPem = function(pem) {
    var msg = forge2.pem.decode(pem)[0];
    if (msg.type !== "ENCRYPTED PRIVATE KEY") {
      var error = new Error('Could not convert encrypted private key from PEM; PEM header type is "ENCRYPTED PRIVATE KEY".');
      error.headerType = msg.type;
      throw error;
    }
    if (msg.procType && msg.procType.type === "ENCRYPTED") {
      throw new Error("Could not convert encrypted private key from PEM; PEM is encrypted.");
    }
    return asn1.fromDer(msg.body);
  };
  pki2.encryptRsaPrivateKey = function(rsaKey, password, options) {
    options = options || {};
    if (!options.legacy) {
      var rval = pki2.wrapRsaPrivateKey(pki2.privateKeyToAsn1(rsaKey));
      rval = pki2.encryptPrivateKeyInfo(rval, password, options);
      return pki2.encryptedPrivateKeyToPem(rval);
    }
    var algorithm;
    var iv;
    var dkLen;
    var cipherFn;
    switch (options.algorithm) {
      case "aes128":
        algorithm = "AES-128-CBC";
        dkLen = 16;
        iv = forge2.random.getBytesSync(16);
        cipherFn = forge2.aes.createEncryptionCipher;
        break;
      case "aes192":
        algorithm = "AES-192-CBC";
        dkLen = 24;
        iv = forge2.random.getBytesSync(16);
        cipherFn = forge2.aes.createEncryptionCipher;
        break;
      case "aes256":
        algorithm = "AES-256-CBC";
        dkLen = 32;
        iv = forge2.random.getBytesSync(16);
        cipherFn = forge2.aes.createEncryptionCipher;
        break;
      case "3des":
        algorithm = "DES-EDE3-CBC";
        dkLen = 24;
        iv = forge2.random.getBytesSync(8);
        cipherFn = forge2.des.createEncryptionCipher;
        break;
      case "des":
        algorithm = "DES-CBC";
        dkLen = 8;
        iv = forge2.random.getBytesSync(8);
        cipherFn = forge2.des.createEncryptionCipher;
        break;
      default:
        var error = new Error('Could not encrypt RSA private key; unsupported encryption algorithm "' + options.algorithm + '".');
        error.algorithm = options.algorithm;
        throw error;
    }
    var dk = forge2.pbe.opensslDeriveBytes(password, iv.substr(0, 8), dkLen);
    var cipher = cipherFn(dk);
    cipher.start(iv);
    cipher.update(asn1.toDer(pki2.privateKeyToAsn1(rsaKey)));
    cipher.finish();
    var msg = {
      type: "RSA PRIVATE KEY",
      procType: {
        version: "4",
        type: "ENCRYPTED"
      },
      dekInfo: {
        algorithm,
        parameters: forge2.util.bytesToHex(iv).toUpperCase()
      },
      body: cipher.output.getBytes()
    };
    return forge2.pem.encode(msg);
  };
  pki2.decryptRsaPrivateKey = function(pem, password) {
    var rval = null;
    var msg = forge2.pem.decode(pem)[0];
    if (msg.type !== "ENCRYPTED PRIVATE KEY" && msg.type !== "PRIVATE KEY" && msg.type !== "RSA PRIVATE KEY") {
      var error = new Error('Could not convert private key from PEM; PEM header type is not "ENCRYPTED PRIVATE KEY", "PRIVATE KEY", or "RSA PRIVATE KEY".');
      error.headerType = error;
      throw error;
    }
    if (msg.procType && msg.procType.type === "ENCRYPTED") {
      var dkLen;
      var cipherFn;
      switch (msg.dekInfo.algorithm) {
        case "DES-CBC":
          dkLen = 8;
          cipherFn = forge2.des.createDecryptionCipher;
          break;
        case "DES-EDE3-CBC":
          dkLen = 24;
          cipherFn = forge2.des.createDecryptionCipher;
          break;
        case "AES-128-CBC":
          dkLen = 16;
          cipherFn = forge2.aes.createDecryptionCipher;
          break;
        case "AES-192-CBC":
          dkLen = 24;
          cipherFn = forge2.aes.createDecryptionCipher;
          break;
        case "AES-256-CBC":
          dkLen = 32;
          cipherFn = forge2.aes.createDecryptionCipher;
          break;
        case "RC2-40-CBC":
          dkLen = 5;
          cipherFn = function(key) {
            return forge2.rc2.createDecryptionCipher(key, 40);
          };
          break;
        case "RC2-64-CBC":
          dkLen = 8;
          cipherFn = function(key) {
            return forge2.rc2.createDecryptionCipher(key, 64);
          };
          break;
        case "RC2-128-CBC":
          dkLen = 16;
          cipherFn = function(key) {
            return forge2.rc2.createDecryptionCipher(key, 128);
          };
          break;
        default:
          var error = new Error('Could not decrypt private key; unsupported encryption algorithm "' + msg.dekInfo.algorithm + '".');
          error.algorithm = msg.dekInfo.algorithm;
          throw error;
      }
      var iv = forge2.util.hexToBytes(msg.dekInfo.parameters);
      var dk = forge2.pbe.opensslDeriveBytes(password, iv.substr(0, 8), dkLen);
      var cipher = cipherFn(dk);
      cipher.start(iv);
      cipher.update(forge2.util.createBuffer(msg.body));
      if (cipher.finish()) {
        rval = cipher.output.getBytes();
      } else {
        return rval;
      }
    } else {
      rval = msg.body;
    }
    if (msg.type === "ENCRYPTED PRIVATE KEY") {
      rval = pki2.decryptPrivateKeyInfo(asn1.fromDer(rval), password);
    } else {
      rval = asn1.fromDer(rval);
    }
    if (rval !== null) {
      rval = pki2.privateKeyFromAsn1(rval);
    }
    return rval;
  };
  pki2.pbe.generatePkcs12Key = function(password, salt, id, iter, n, md) {
    var j, l;
    if (typeof md === "undefined" || md === null) {
      if (!("sha1" in forge2.md)) {
        throw new Error('"sha1" hash algorithm unavailable.');
      }
      md = forge2.md.sha1.create();
    }
    var u = md.digestLength;
    var v = md.blockLength;
    var result = new forge2.util.ByteBuffer();
    var passBuf = new forge2.util.ByteBuffer();
    if (password !== null && password !== void 0) {
      for (l = 0; l < password.length; l++) {
        passBuf.putInt16(password.charCodeAt(l));
      }
      passBuf.putInt16(0);
    }
    var p = passBuf.length();
    var s = salt.length();
    var D = new forge2.util.ByteBuffer();
    D.fillWithByte(id, v);
    var Slen = v * Math.ceil(s / v);
    var S = new forge2.util.ByteBuffer();
    for (l = 0; l < Slen; l++) {
      S.putByte(salt.at(l % s));
    }
    var Plen = v * Math.ceil(p / v);
    var P = new forge2.util.ByteBuffer();
    for (l = 0; l < Plen; l++) {
      P.putByte(passBuf.at(l % p));
    }
    var I = S;
    I.putBuffer(P);
    var c = Math.ceil(n / u);
    for (var i = 1; i <= c; i++) {
      var buf = new forge2.util.ByteBuffer();
      buf.putBytes(D.bytes());
      buf.putBytes(I.bytes());
      for (var round = 0; round < iter; round++) {
        md.start();
        md.update(buf.getBytes());
        buf = md.digest();
      }
      var B = new forge2.util.ByteBuffer();
      for (l = 0; l < v; l++) {
        B.putByte(buf.at(l % u));
      }
      var k = Math.ceil(s / v) + Math.ceil(p / v);
      var Inew = new forge2.util.ByteBuffer();
      for (j = 0; j < k; j++) {
        var chunk = new forge2.util.ByteBuffer(I.getBytes(v));
        var x = 511;
        for (l = B.length() - 1; l >= 0; l--) {
          x = x >> 8;
          x += B.at(l) + chunk.at(l);
          chunk.setAt(l, x & 255);
        }
        Inew.putBuffer(chunk);
      }
      I = Inew;
      result.putBuffer(buf);
    }
    result.truncate(result.length() - n);
    return result;
  };
  pki2.pbe.getCipher = function(oid, params, password) {
    switch (oid) {
      case pki2.oids["pkcs5PBES2"]:
        return pki2.pbe.getCipherForPBES2(oid, params, password);
      case pki2.oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]:
      case pki2.oids["pbewithSHAAnd40BitRC2-CBC"]:
        return pki2.pbe.getCipherForPKCS12PBE(oid, params, password);
      default:
        var error = new Error("Cannot read encrypted PBE data block. Unsupported OID.");
        error.oid = oid;
        error.supportedOids = [
          "pkcs5PBES2",
          "pbeWithSHAAnd3-KeyTripleDES-CBC",
          "pbewithSHAAnd40BitRC2-CBC"
        ];
        throw error;
    }
  };
  pki2.pbe.getCipherForPBES2 = function(oid, params, password) {
    var capture = {};
    var errors = [];
    if (!asn1.validate(params, PBES2AlgorithmsValidator, capture, errors)) {
      var error = new Error("Cannot read password-based-encryption algorithm parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
      error.errors = errors;
      throw error;
    }
    oid = asn1.derToOid(capture.kdfOid);
    if (oid !== pki2.oids["pkcs5PBKDF2"]) {
      var error = new Error("Cannot read encrypted private key. Unsupported key derivation function OID.");
      error.oid = oid;
      error.supportedOids = ["pkcs5PBKDF2"];
      throw error;
    }
    oid = asn1.derToOid(capture.encOid);
    if (oid !== pki2.oids["aes128-CBC"] && oid !== pki2.oids["aes192-CBC"] && oid !== pki2.oids["aes256-CBC"] && oid !== pki2.oids["des-EDE3-CBC"] && oid !== pki2.oids["desCBC"]) {
      var error = new Error("Cannot read encrypted private key. Unsupported encryption scheme OID.");
      error.oid = oid;
      error.supportedOids = [
        "aes128-CBC",
        "aes192-CBC",
        "aes256-CBC",
        "des-EDE3-CBC",
        "desCBC"
      ];
      throw error;
    }
    var salt = capture.kdfSalt;
    var count = forge2.util.createBuffer(capture.kdfIterationCount);
    count = count.getInt(count.length() << 3);
    var dkLen;
    var cipherFn;
    switch (pki2.oids[oid]) {
      case "aes128-CBC":
        dkLen = 16;
        cipherFn = forge2.aes.createDecryptionCipher;
        break;
      case "aes192-CBC":
        dkLen = 24;
        cipherFn = forge2.aes.createDecryptionCipher;
        break;
      case "aes256-CBC":
        dkLen = 32;
        cipherFn = forge2.aes.createDecryptionCipher;
        break;
      case "des-EDE3-CBC":
        dkLen = 24;
        cipherFn = forge2.des.createDecryptionCipher;
        break;
      case "desCBC":
        dkLen = 8;
        cipherFn = forge2.des.createDecryptionCipher;
        break;
    }
    var md = prfOidToMessageDigest(capture.prfOid);
    var dk = forge2.pkcs5.pbkdf2(password, salt, count, dkLen, md);
    var iv = capture.encIv;
    var cipher = cipherFn(dk);
    cipher.start(iv);
    return cipher;
  };
  pki2.pbe.getCipherForPKCS12PBE = function(oid, params, password) {
    var capture = {};
    var errors = [];
    if (!asn1.validate(params, pkcs12PbeParamsValidator, capture, errors)) {
      var error = new Error("Cannot read password-based-encryption algorithm parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
      error.errors = errors;
      throw error;
    }
    var salt = forge2.util.createBuffer(capture.salt);
    var count = forge2.util.createBuffer(capture.iterations);
    count = count.getInt(count.length() << 3);
    var dkLen, dIvLen, cipherFn;
    switch (oid) {
      case pki2.oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]:
        dkLen = 24;
        dIvLen = 8;
        cipherFn = forge2.des.startDecrypting;
        break;
      case pki2.oids["pbewithSHAAnd40BitRC2-CBC"]:
        dkLen = 5;
        dIvLen = 8;
        cipherFn = function(key2, iv2) {
          var cipher = forge2.rc2.createDecryptionCipher(key2, 40);
          cipher.start(iv2, null);
          return cipher;
        };
        break;
      default:
        var error = new Error("Cannot read PKCS #12 PBE data block. Unsupported OID.");
        error.oid = oid;
        throw error;
    }
    var md = prfOidToMessageDigest(capture.prfOid);
    var key = pki2.pbe.generatePkcs12Key(password, salt, 1, count, dkLen, md);
    md.start();
    var iv = pki2.pbe.generatePkcs12Key(password, salt, 2, count, dIvLen, md);
    return cipherFn(key, iv);
  };
  pki2.pbe.opensslDeriveBytes = function(password, salt, dkLen, md) {
    if (typeof md === "undefined" || md === null) {
      if (!("md5" in forge2.md)) {
        throw new Error('"md5" hash algorithm unavailable.');
      }
      md = forge2.md.md5.create();
    }
    if (salt === null) {
      salt = "";
    }
    var digests = [hash(md, password + salt)];
    for (var length = 16, i = 1; length < dkLen; ++i, length += 16) {
      digests.push(hash(md, digests[i - 1] + password + salt));
    }
    return digests.join("").substr(0, dkLen);
  };
  function hash(md, bytes) {
    return md.start().update(bytes).digest().getBytes();
  }
  function prfOidToMessageDigest(prfOid) {
    var prfAlgorithm;
    if (!prfOid) {
      prfAlgorithm = "hmacWithSHA1";
    } else {
      prfAlgorithm = pki2.oids[asn1.derToOid(prfOid)];
      if (!prfAlgorithm) {
        var error = new Error("Unsupported PRF OID.");
        error.oid = prfOid;
        error.supported = [
          "hmacWithSHA1",
          "hmacWithSHA224",
          "hmacWithSHA256",
          "hmacWithSHA384",
          "hmacWithSHA512"
        ];
        throw error;
      }
    }
    return prfAlgorithmToMessageDigest(prfAlgorithm);
  }
  function prfAlgorithmToMessageDigest(prfAlgorithm) {
    var factory = forge2.md;
    switch (prfAlgorithm) {
      case "hmacWithSHA224":
        factory = forge2.md.sha512;
      case "hmacWithSHA1":
      case "hmacWithSHA256":
      case "hmacWithSHA384":
      case "hmacWithSHA512":
        prfAlgorithm = prfAlgorithm.substr(8).toLowerCase();
        break;
      default:
        var error = new Error("Unsupported PRF algorithm.");
        error.algorithm = prfAlgorithm;
        error.supported = [
          "hmacWithSHA1",
          "hmacWithSHA224",
          "hmacWithSHA256",
          "hmacWithSHA384",
          "hmacWithSHA512"
        ];
        throw error;
    }
    if (!factory || !(prfAlgorithm in factory)) {
      throw new Error("Unknown hash algorithm: " + prfAlgorithm);
    }
    return factory[prfAlgorithm].create();
  }
  function createPbkdf2Params(salt, countBytes, dkLen, prfAlgorithm) {
    var params = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, salt),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, countBytes.getBytes())
    ]);
    if (prfAlgorithm !== "hmacWithSHA1") {
      params.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, forge2.util.hexToBytes(dkLen.toString(16))), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki2.oids[prfAlgorithm]).getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
      ]));
    }
    return params;
  }
});

// node_modules/node-forge/lib/pkcs7asn1.js
var require_pkcs7asn1 = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_asn1();
  require_util();
  var asn1 = forge2.asn1;
  var p7v = module2.exports = forge2.pkcs7asn1 = forge2.pkcs7asn1 || {};
  forge2.pkcs7 = forge2.pkcs7 || {};
  forge2.pkcs7.asn1 = p7v;
  var contentInfoValidator = {
    name: "ContentInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "ContentInfo.ContentType",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OID,
      constructed: false,
      capture: "contentType"
    }, {
      name: "ContentInfo.content",
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      type: 0,
      constructed: true,
      optional: true,
      captureAsn1: "content"
    }]
  };
  p7v.contentInfoValidator = contentInfoValidator;
  var encryptedContentInfoValidator = {
    name: "EncryptedContentInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "EncryptedContentInfo.contentType",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OID,
      constructed: false,
      capture: "contentType"
    }, {
      name: "EncryptedContentInfo.contentEncryptionAlgorithm",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: "EncryptedContentInfo.contentEncryptionAlgorithm.algorithm",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: false,
        capture: "encAlgorithm"
      }, {
        name: "EncryptedContentInfo.contentEncryptionAlgorithm.parameter",
        tagClass: asn1.Class.UNIVERSAL,
        captureAsn1: "encParameter"
      }]
    }, {
      name: "EncryptedContentInfo.encryptedContent",
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      type: 0,
      capture: "encryptedContent",
      captureAsn1: "encryptedContentAsn1"
    }]
  };
  p7v.envelopedDataValidator = {
    name: "EnvelopedData",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "EnvelopedData.Version",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "version"
    }, {
      name: "EnvelopedData.RecipientInfos",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SET,
      constructed: true,
      captureAsn1: "recipientInfos"
    }].concat(encryptedContentInfoValidator)
  };
  p7v.encryptedDataValidator = {
    name: "EncryptedData",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "EncryptedData.Version",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "version"
    }].concat(encryptedContentInfoValidator)
  };
  var signerValidator = {
    name: "SignerInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "SignerInfo.version",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false
    }, {
      name: "SignerInfo.issuerAndSerialNumber",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: "SignerInfo.issuerAndSerialNumber.issuer",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        captureAsn1: "issuer"
      }, {
        name: "SignerInfo.issuerAndSerialNumber.serialNumber",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: "serial"
      }]
    }, {
      name: "SignerInfo.digestAlgorithm",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: "SignerInfo.digestAlgorithm.algorithm",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: false,
        capture: "digestAlgorithm"
      }, {
        name: "SignerInfo.digestAlgorithm.parameter",
        tagClass: asn1.Class.UNIVERSAL,
        constructed: false,
        captureAsn1: "digestParameter",
        optional: true
      }]
    }, {
      name: "SignerInfo.authenticatedAttributes",
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      type: 0,
      constructed: true,
      optional: true,
      capture: "authenticatedAttributes"
    }, {
      name: "SignerInfo.digestEncryptionAlgorithm",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      capture: "signatureAlgorithm"
    }, {
      name: "SignerInfo.encryptedDigest",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OCTETSTRING,
      constructed: false,
      capture: "signature"
    }, {
      name: "SignerInfo.unauthenticatedAttributes",
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      type: 1,
      constructed: true,
      optional: true,
      capture: "unauthenticatedAttributes"
    }]
  };
  p7v.signedDataValidator = {
    name: "SignedData",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [
      {
        name: "SignedData.Version",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: "version"
      },
      {
        name: "SignedData.DigestAlgorithms",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SET,
        constructed: true,
        captureAsn1: "digestAlgorithms"
      },
      contentInfoValidator,
      {
        name: "SignedData.Certificates",
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 0,
        optional: true,
        captureAsn1: "certificates"
      },
      {
        name: "SignedData.CertificateRevocationLists",
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 1,
        optional: true,
        captureAsn1: "crls"
      },
      {
        name: "SignedData.SignerInfos",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SET,
        capture: "signerInfos",
        optional: true,
        value: [signerValidator]
      }
    ]
  };
  p7v.recipientInfoValidator = {
    name: "RecipientInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "RecipientInfo.version",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "version"
    }, {
      name: "RecipientInfo.issuerAndSerial",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: "RecipientInfo.issuerAndSerial.issuer",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        captureAsn1: "issuer"
      }, {
        name: "RecipientInfo.issuerAndSerial.serialNumber",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: "serial"
      }]
    }, {
      name: "RecipientInfo.keyEncryptionAlgorithm",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: "RecipientInfo.keyEncryptionAlgorithm.algorithm",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: false,
        capture: "encAlgorithm"
      }, {
        name: "RecipientInfo.keyEncryptionAlgorithm.parameter",
        tagClass: asn1.Class.UNIVERSAL,
        constructed: false,
        captureAsn1: "encParameter"
      }]
    }, {
      name: "RecipientInfo.encryptedKey",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OCTETSTRING,
      constructed: false,
      capture: "encKey"
    }]
  };
});

// node_modules/node-forge/lib/mgf1.js
var require_mgf1 = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_util();
  forge2.mgf = forge2.mgf || {};
  var mgf1 = module2.exports = forge2.mgf.mgf1 = forge2.mgf1 = forge2.mgf1 || {};
  mgf1.create = function(md) {
    var mgf = {
      generate: function(seed, maskLen) {
        var t = new forge2.util.ByteBuffer();
        var len = Math.ceil(maskLen / md.digestLength);
        for (var i = 0; i < len; i++) {
          var c = new forge2.util.ByteBuffer();
          c.putInt32(i);
          md.start();
          md.update(seed + c.getBytes());
          t.putBuffer(md.digest());
        }
        t.truncate(t.length() - maskLen);
        return t.getBytes();
      }
    };
    return mgf;
  };
});

// node_modules/node-forge/lib/mgf.js
var require_mgf = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_mgf1();
  module2.exports = forge2.mgf = forge2.mgf || {};
  forge2.mgf.mgf1 = forge2.mgf1;
});

// node_modules/node-forge/lib/pss.js
var require_pss = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_random();
  require_util();
  var pss = module2.exports = forge2.pss = forge2.pss || {};
  pss.create = function(options) {
    if (arguments.length === 3) {
      options = {
        md: arguments[0],
        mgf: arguments[1],
        saltLength: arguments[2]
      };
    }
    var hash = options.md;
    var mgf = options.mgf;
    var hLen = hash.digestLength;
    var salt_ = options.salt || null;
    if (typeof salt_ === "string") {
      salt_ = forge2.util.createBuffer(salt_);
    }
    var sLen;
    if ("saltLength" in options) {
      sLen = options.saltLength;
    } else if (salt_ !== null) {
      sLen = salt_.length();
    } else {
      throw new Error("Salt length not specified or specific salt not given.");
    }
    if (salt_ !== null && salt_.length() !== sLen) {
      throw new Error("Given salt length does not match length of given salt.");
    }
    var prng = options.prng || forge2.random;
    var pssobj = {};
    pssobj.encode = function(md, modBits) {
      var i;
      var emBits = modBits - 1;
      var emLen = Math.ceil(emBits / 8);
      var mHash = md.digest().getBytes();
      if (emLen < hLen + sLen + 2) {
        throw new Error("Message is too long to encrypt.");
      }
      var salt;
      if (salt_ === null) {
        salt = prng.getBytesSync(sLen);
      } else {
        salt = salt_.bytes();
      }
      var m_ = new forge2.util.ByteBuffer();
      m_.fillWithByte(0, 8);
      m_.putBytes(mHash);
      m_.putBytes(salt);
      hash.start();
      hash.update(m_.getBytes());
      var h = hash.digest().getBytes();
      var ps = new forge2.util.ByteBuffer();
      ps.fillWithByte(0, emLen - sLen - hLen - 2);
      ps.putByte(1);
      ps.putBytes(salt);
      var db = ps.getBytes();
      var maskLen = emLen - hLen - 1;
      var dbMask = mgf.generate(h, maskLen);
      var maskedDB = "";
      for (i = 0; i < maskLen; i++) {
        maskedDB += String.fromCharCode(db.charCodeAt(i) ^ dbMask.charCodeAt(i));
      }
      var mask = 65280 >> 8 * emLen - emBits & 255;
      maskedDB = String.fromCharCode(maskedDB.charCodeAt(0) & ~mask) + maskedDB.substr(1);
      return maskedDB + h + String.fromCharCode(188);
    };
    pssobj.verify = function(mHash, em, modBits) {
      var i;
      var emBits = modBits - 1;
      var emLen = Math.ceil(emBits / 8);
      em = em.substr(-emLen);
      if (emLen < hLen + sLen + 2) {
        throw new Error("Inconsistent parameters to PSS signature verification.");
      }
      if (em.charCodeAt(emLen - 1) !== 188) {
        throw new Error("Encoded message does not end in 0xBC.");
      }
      var maskLen = emLen - hLen - 1;
      var maskedDB = em.substr(0, maskLen);
      var h = em.substr(maskLen, hLen);
      var mask = 65280 >> 8 * emLen - emBits & 255;
      if ((maskedDB.charCodeAt(0) & mask) !== 0) {
        throw new Error("Bits beyond keysize not zero as expected.");
      }
      var dbMask = mgf.generate(h, maskLen);
      var db = "";
      for (i = 0; i < maskLen; i++) {
        db += String.fromCharCode(maskedDB.charCodeAt(i) ^ dbMask.charCodeAt(i));
      }
      db = String.fromCharCode(db.charCodeAt(0) & ~mask) + db.substr(1);
      var checkLen = emLen - hLen - sLen - 2;
      for (i = 0; i < checkLen; i++) {
        if (db.charCodeAt(i) !== 0) {
          throw new Error("Leftmost octets not zero as expected");
        }
      }
      if (db.charCodeAt(checkLen) !== 1) {
        throw new Error("Inconsistent PSS signature, 0x01 marker not found");
      }
      var salt = db.substr(-sLen);
      var m_ = new forge2.util.ByteBuffer();
      m_.fillWithByte(0, 8);
      m_.putBytes(mHash);
      m_.putBytes(salt);
      hash.start();
      hash.update(m_.getBytes());
      var h_ = hash.digest().getBytes();
      return h === h_;
    };
    return pssobj;
  };
});

// node_modules/node-forge/lib/x509.js
var require_x509 = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_aes();
  require_asn1();
  require_des();
  require_md();
  require_mgf();
  require_oids();
  require_pem();
  require_pss();
  require_rsa();
  require_util();
  var asn1 = forge2.asn1;
  var pki2 = module2.exports = forge2.pki = forge2.pki || {};
  var oids = pki2.oids;
  var _shortNames = {};
  _shortNames["CN"] = oids["commonName"];
  _shortNames["commonName"] = "CN";
  _shortNames["C"] = oids["countryName"];
  _shortNames["countryName"] = "C";
  _shortNames["L"] = oids["localityName"];
  _shortNames["localityName"] = "L";
  _shortNames["ST"] = oids["stateOrProvinceName"];
  _shortNames["stateOrProvinceName"] = "ST";
  _shortNames["O"] = oids["organizationName"];
  _shortNames["organizationName"] = "O";
  _shortNames["OU"] = oids["organizationalUnitName"];
  _shortNames["organizationalUnitName"] = "OU";
  _shortNames["E"] = oids["emailAddress"];
  _shortNames["emailAddress"] = "E";
  var publicKeyValidator = forge2.pki.rsa.publicKeyValidator;
  var x509CertificateValidator = {
    name: "Certificate",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "Certificate.TBSCertificate",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      captureAsn1: "tbsCertificate",
      value: [
        {
          name: "Certificate.TBSCertificate.version",
          tagClass: asn1.Class.CONTEXT_SPECIFIC,
          type: 0,
          constructed: true,
          optional: true,
          value: [{
            name: "Certificate.TBSCertificate.version.integer",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.INTEGER,
            constructed: false,
            capture: "certVersion"
          }]
        },
        {
          name: "Certificate.TBSCertificate.serialNumber",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: "certSerialNumber"
        },
        {
          name: "Certificate.TBSCertificate.signature",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: "Certificate.TBSCertificate.signature.algorithm",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: "certinfoSignatureOid"
          }, {
            name: "Certificate.TBSCertificate.signature.parameters",
            tagClass: asn1.Class.UNIVERSAL,
            optional: true,
            captureAsn1: "certinfoSignatureParams"
          }]
        },
        {
          name: "Certificate.TBSCertificate.issuer",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          captureAsn1: "certIssuer"
        },
        {
          name: "Certificate.TBSCertificate.validity",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: "Certificate.TBSCertificate.validity.notBefore (utc)",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.UTCTIME,
            constructed: false,
            optional: true,
            capture: "certValidity1UTCTime"
          }, {
            name: "Certificate.TBSCertificate.validity.notBefore (generalized)",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.GENERALIZEDTIME,
            constructed: false,
            optional: true,
            capture: "certValidity2GeneralizedTime"
          }, {
            name: "Certificate.TBSCertificate.validity.notAfter (utc)",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.UTCTIME,
            constructed: false,
            optional: true,
            capture: "certValidity3UTCTime"
          }, {
            name: "Certificate.TBSCertificate.validity.notAfter (generalized)",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.GENERALIZEDTIME,
            constructed: false,
            optional: true,
            capture: "certValidity4GeneralizedTime"
          }]
        },
        {
          name: "Certificate.TBSCertificate.subject",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          captureAsn1: "certSubject"
        },
        publicKeyValidator,
        {
          name: "Certificate.TBSCertificate.issuerUniqueID",
          tagClass: asn1.Class.CONTEXT_SPECIFIC,
          type: 1,
          constructed: true,
          optional: true,
          value: [{
            name: "Certificate.TBSCertificate.issuerUniqueID.id",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.BITSTRING,
            constructed: false,
            captureBitStringValue: "certIssuerUniqueId"
          }]
        },
        {
          name: "Certificate.TBSCertificate.subjectUniqueID",
          tagClass: asn1.Class.CONTEXT_SPECIFIC,
          type: 2,
          constructed: true,
          optional: true,
          value: [{
            name: "Certificate.TBSCertificate.subjectUniqueID.id",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.BITSTRING,
            constructed: false,
            captureBitStringValue: "certSubjectUniqueId"
          }]
        },
        {
          name: "Certificate.TBSCertificate.extensions",
          tagClass: asn1.Class.CONTEXT_SPECIFIC,
          type: 3,
          constructed: true,
          captureAsn1: "certExtensions",
          optional: true
        }
      ]
    }, {
      name: "Certificate.signatureAlgorithm",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: "Certificate.signatureAlgorithm.algorithm",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: false,
        capture: "certSignatureOid"
      }, {
        name: "Certificate.TBSCertificate.signature.parameters",
        tagClass: asn1.Class.UNIVERSAL,
        optional: true,
        captureAsn1: "certSignatureParams"
      }]
    }, {
      name: "Certificate.signatureValue",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.BITSTRING,
      constructed: false,
      captureBitStringValue: "certSignature"
    }]
  };
  var rsassaPssParameterValidator = {
    name: "rsapss",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "rsapss.hashAlgorithm",
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      type: 0,
      constructed: true,
      value: [{
        name: "rsapss.hashAlgorithm.AlgorithmIdentifier",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Class.SEQUENCE,
        constructed: true,
        optional: true,
        value: [{
          name: "rsapss.hashAlgorithm.AlgorithmIdentifier.algorithm",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: false,
          capture: "hashOid"
        }]
      }]
    }, {
      name: "rsapss.maskGenAlgorithm",
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      type: 1,
      constructed: true,
      value: [{
        name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Class.SEQUENCE,
        constructed: true,
        optional: true,
        value: [{
          name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.algorithm",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: false,
          capture: "maskGenOid"
        }, {
          name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.params",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.params.algorithm",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: "maskGenHashOid"
          }]
        }]
      }]
    }, {
      name: "rsapss.saltLength",
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      type: 2,
      optional: true,
      value: [{
        name: "rsapss.saltLength.saltLength",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Class.INTEGER,
        constructed: false,
        capture: "saltLength"
      }]
    }, {
      name: "rsapss.trailerField",
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      type: 3,
      optional: true,
      value: [{
        name: "rsapss.trailer.trailer",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Class.INTEGER,
        constructed: false,
        capture: "trailer"
      }]
    }]
  };
  var certificationRequestInfoValidator = {
    name: "CertificationRequestInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    captureAsn1: "certificationRequestInfo",
    value: [
      {
        name: "CertificationRequestInfo.integer",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: "certificationRequestInfoVersion"
      },
      {
        name: "CertificationRequestInfo.subject",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        captureAsn1: "certificationRequestInfoSubject"
      },
      publicKeyValidator,
      {
        name: "CertificationRequestInfo.attributes",
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 0,
        constructed: true,
        optional: true,
        capture: "certificationRequestInfoAttributes",
        value: [{
          name: "CertificationRequestInfo.attributes",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: "CertificationRequestInfo.attributes.type",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false
          }, {
            name: "CertificationRequestInfo.attributes.value",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.SET,
            constructed: true
          }]
        }]
      }
    ]
  };
  var certificationRequestValidator = {
    name: "CertificationRequest",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    captureAsn1: "csr",
    value: [
      certificationRequestInfoValidator,
      {
        name: "CertificationRequest.signatureAlgorithm",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "CertificationRequest.signatureAlgorithm.algorithm",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: false,
          capture: "csrSignatureOid"
        }, {
          name: "CertificationRequest.signatureAlgorithm.parameters",
          tagClass: asn1.Class.UNIVERSAL,
          optional: true,
          captureAsn1: "csrSignatureParams"
        }]
      },
      {
        name: "CertificationRequest.signature",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.BITSTRING,
        constructed: false,
        captureBitStringValue: "csrSignature"
      }
    ]
  };
  pki2.RDNAttributesAsArray = function(rdn, md) {
    var rval = [];
    var set, attr, obj;
    for (var si = 0; si < rdn.value.length; ++si) {
      set = rdn.value[si];
      for (var i = 0; i < set.value.length; ++i) {
        obj = {};
        attr = set.value[i];
        obj.type = asn1.derToOid(attr.value[0].value);
        obj.value = attr.value[1].value;
        obj.valueTagClass = attr.value[1].type;
        if (obj.type in oids) {
          obj.name = oids[obj.type];
          if (obj.name in _shortNames) {
            obj.shortName = _shortNames[obj.name];
          }
        }
        if (md) {
          md.update(obj.type);
          md.update(obj.value);
        }
        rval.push(obj);
      }
    }
    return rval;
  };
  pki2.CRIAttributesAsArray = function(attributes) {
    var rval = [];
    for (var si = 0; si < attributes.length; ++si) {
      var seq = attributes[si];
      var type = asn1.derToOid(seq.value[0].value);
      var values = seq.value[1].value;
      for (var vi = 0; vi < values.length; ++vi) {
        var obj = {};
        obj.type = type;
        obj.value = values[vi].value;
        obj.valueTagClass = values[vi].type;
        if (obj.type in oids) {
          obj.name = oids[obj.type];
          if (obj.name in _shortNames) {
            obj.shortName = _shortNames[obj.name];
          }
        }
        if (obj.type === oids.extensionRequest) {
          obj.extensions = [];
          for (var ei = 0; ei < obj.value.length; ++ei) {
            obj.extensions.push(pki2.certificateExtensionFromAsn1(obj.value[ei]));
          }
        }
        rval.push(obj);
      }
    }
    return rval;
  };
  function _getAttribute(obj, options) {
    if (typeof options === "string") {
      options = {shortName: options};
    }
    var rval = null;
    var attr;
    for (var i = 0; rval === null && i < obj.attributes.length; ++i) {
      attr = obj.attributes[i];
      if (options.type && options.type === attr.type) {
        rval = attr;
      } else if (options.name && options.name === attr.name) {
        rval = attr;
      } else if (options.shortName && options.shortName === attr.shortName) {
        rval = attr;
      }
    }
    return rval;
  }
  var _readSignatureParameters = function(oid, obj, fillDefaults) {
    var params = {};
    if (oid !== oids["RSASSA-PSS"]) {
      return params;
    }
    if (fillDefaults) {
      params = {
        hash: {
          algorithmOid: oids["sha1"]
        },
        mgf: {
          algorithmOid: oids["mgf1"],
          hash: {
            algorithmOid: oids["sha1"]
          }
        },
        saltLength: 20
      };
    }
    var capture = {};
    var errors = [];
    if (!asn1.validate(obj, rsassaPssParameterValidator, capture, errors)) {
      var error = new Error("Cannot read RSASSA-PSS parameter block.");
      error.errors = errors;
      throw error;
    }
    if (capture.hashOid !== void 0) {
      params.hash = params.hash || {};
      params.hash.algorithmOid = asn1.derToOid(capture.hashOid);
    }
    if (capture.maskGenOid !== void 0) {
      params.mgf = params.mgf || {};
      params.mgf.algorithmOid = asn1.derToOid(capture.maskGenOid);
      params.mgf.hash = params.mgf.hash || {};
      params.mgf.hash.algorithmOid = asn1.derToOid(capture.maskGenHashOid);
    }
    if (capture.saltLength !== void 0) {
      params.saltLength = capture.saltLength.charCodeAt(0);
    }
    return params;
  };
  pki2.certificateFromPem = function(pem, computeHash, strict) {
    var msg = forge2.pem.decode(pem)[0];
    if (msg.type !== "CERTIFICATE" && msg.type !== "X509 CERTIFICATE" && msg.type !== "TRUSTED CERTIFICATE") {
      var error = new Error('Could not convert certificate from PEM; PEM header type is not "CERTIFICATE", "X509 CERTIFICATE", or "TRUSTED CERTIFICATE".');
      error.headerType = msg.type;
      throw error;
    }
    if (msg.procType && msg.procType.type === "ENCRYPTED") {
      throw new Error("Could not convert certificate from PEM; PEM is encrypted.");
    }
    var obj = asn1.fromDer(msg.body, strict);
    return pki2.certificateFromAsn1(obj, computeHash);
  };
  pki2.certificateToPem = function(cert, maxline) {
    var msg = {
      type: "CERTIFICATE",
      body: asn1.toDer(pki2.certificateToAsn1(cert)).getBytes()
    };
    return forge2.pem.encode(msg, {maxline});
  };
  pki2.publicKeyFromPem = function(pem) {
    var msg = forge2.pem.decode(pem)[0];
    if (msg.type !== "PUBLIC KEY" && msg.type !== "RSA PUBLIC KEY") {
      var error = new Error('Could not convert public key from PEM; PEM header type is not "PUBLIC KEY" or "RSA PUBLIC KEY".');
      error.headerType = msg.type;
      throw error;
    }
    if (msg.procType && msg.procType.type === "ENCRYPTED") {
      throw new Error("Could not convert public key from PEM; PEM is encrypted.");
    }
    var obj = asn1.fromDer(msg.body);
    return pki2.publicKeyFromAsn1(obj);
  };
  pki2.publicKeyToPem = function(key, maxline) {
    var msg = {
      type: "PUBLIC KEY",
      body: asn1.toDer(pki2.publicKeyToAsn1(key)).getBytes()
    };
    return forge2.pem.encode(msg, {maxline});
  };
  pki2.publicKeyToRSAPublicKeyPem = function(key, maxline) {
    var msg = {
      type: "RSA PUBLIC KEY",
      body: asn1.toDer(pki2.publicKeyToRSAPublicKey(key)).getBytes()
    };
    return forge2.pem.encode(msg, {maxline});
  };
  pki2.getPublicKeyFingerprint = function(key, options) {
    options = options || {};
    var md = options.md || forge2.md.sha1.create();
    var type = options.type || "RSAPublicKey";
    var bytes;
    switch (type) {
      case "RSAPublicKey":
        bytes = asn1.toDer(pki2.publicKeyToRSAPublicKey(key)).getBytes();
        break;
      case "SubjectPublicKeyInfo":
        bytes = asn1.toDer(pki2.publicKeyToAsn1(key)).getBytes();
        break;
      default:
        throw new Error('Unknown fingerprint type "' + options.type + '".');
    }
    md.start();
    md.update(bytes);
    var digest = md.digest();
    if (options.encoding === "hex") {
      var hex = digest.toHex();
      if (options.delimiter) {
        return hex.match(/.{2}/g).join(options.delimiter);
      }
      return hex;
    } else if (options.encoding === "binary") {
      return digest.getBytes();
    } else if (options.encoding) {
      throw new Error('Unknown encoding "' + options.encoding + '".');
    }
    return digest;
  };
  pki2.certificationRequestFromPem = function(pem, computeHash, strict) {
    var msg = forge2.pem.decode(pem)[0];
    if (msg.type !== "CERTIFICATE REQUEST") {
      var error = new Error('Could not convert certification request from PEM; PEM header type is not "CERTIFICATE REQUEST".');
      error.headerType = msg.type;
      throw error;
    }
    if (msg.procType && msg.procType.type === "ENCRYPTED") {
      throw new Error("Could not convert certification request from PEM; PEM is encrypted.");
    }
    var obj = asn1.fromDer(msg.body, strict);
    return pki2.certificationRequestFromAsn1(obj, computeHash);
  };
  pki2.certificationRequestToPem = function(csr, maxline) {
    var msg = {
      type: "CERTIFICATE REQUEST",
      body: asn1.toDer(pki2.certificationRequestToAsn1(csr)).getBytes()
    };
    return forge2.pem.encode(msg, {maxline});
  };
  pki2.createCertificate = function() {
    var cert = {};
    cert.version = 2;
    cert.serialNumber = "00";
    cert.signatureOid = null;
    cert.signature = null;
    cert.siginfo = {};
    cert.siginfo.algorithmOid = null;
    cert.validity = {};
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.issuer = {};
    cert.issuer.getField = function(sn) {
      return _getAttribute(cert.issuer, sn);
    };
    cert.issuer.addField = function(attr) {
      _fillMissingFields([attr]);
      cert.issuer.attributes.push(attr);
    };
    cert.issuer.attributes = [];
    cert.issuer.hash = null;
    cert.subject = {};
    cert.subject.getField = function(sn) {
      return _getAttribute(cert.subject, sn);
    };
    cert.subject.addField = function(attr) {
      _fillMissingFields([attr]);
      cert.subject.attributes.push(attr);
    };
    cert.subject.attributes = [];
    cert.subject.hash = null;
    cert.extensions = [];
    cert.publicKey = null;
    cert.md = null;
    cert.setSubject = function(attrs, uniqueId) {
      _fillMissingFields(attrs);
      cert.subject.attributes = attrs;
      delete cert.subject.uniqueId;
      if (uniqueId) {
        cert.subject.uniqueId = uniqueId;
      }
      cert.subject.hash = null;
    };
    cert.setIssuer = function(attrs, uniqueId) {
      _fillMissingFields(attrs);
      cert.issuer.attributes = attrs;
      delete cert.issuer.uniqueId;
      if (uniqueId) {
        cert.issuer.uniqueId = uniqueId;
      }
      cert.issuer.hash = null;
    };
    cert.setExtensions = function(exts) {
      for (var i = 0; i < exts.length; ++i) {
        _fillMissingExtensionFields(exts[i], {cert});
      }
      cert.extensions = exts;
    };
    cert.getExtension = function(options) {
      if (typeof options === "string") {
        options = {name: options};
      }
      var rval = null;
      var ext;
      for (var i = 0; rval === null && i < cert.extensions.length; ++i) {
        ext = cert.extensions[i];
        if (options.id && ext.id === options.id) {
          rval = ext;
        } else if (options.name && ext.name === options.name) {
          rval = ext;
        }
      }
      return rval;
    };
    cert.sign = function(key, md) {
      cert.md = md || forge2.md.sha1.create();
      var algorithmOid = oids[cert.md.algorithm + "WithRSAEncryption"];
      if (!algorithmOid) {
        var error = new Error("Could not compute certificate digest. Unknown message digest algorithm OID.");
        error.algorithm = cert.md.algorithm;
        throw error;
      }
      cert.signatureOid = cert.siginfo.algorithmOid = algorithmOid;
      cert.tbsCertificate = pki2.getTBSCertificate(cert);
      var bytes = asn1.toDer(cert.tbsCertificate);
      cert.md.update(bytes.getBytes());
      cert.signature = key.sign(cert.md);
    };
    cert.verify = function(child) {
      var rval = false;
      if (!cert.issued(child)) {
        var issuer = child.issuer;
        var subject = cert.subject;
        var error = new Error("The parent certificate did not issue the given child certificate; the child certificate's issuer does not match the parent's subject.");
        error.expectedIssuer = issuer.attributes;
        error.actualIssuer = subject.attributes;
        throw error;
      }
      var md = child.md;
      if (md === null) {
        if (child.signatureOid in oids) {
          var oid = oids[child.signatureOid];
          switch (oid) {
            case "sha1WithRSAEncryption":
              md = forge2.md.sha1.create();
              break;
            case "md5WithRSAEncryption":
              md = forge2.md.md5.create();
              break;
            case "sha256WithRSAEncryption":
              md = forge2.md.sha256.create();
              break;
            case "sha384WithRSAEncryption":
              md = forge2.md.sha384.create();
              break;
            case "sha512WithRSAEncryption":
              md = forge2.md.sha512.create();
              break;
            case "RSASSA-PSS":
              md = forge2.md.sha256.create();
              break;
          }
        }
        if (md === null) {
          var error = new Error("Could not compute certificate digest. Unknown signature OID.");
          error.signatureOid = child.signatureOid;
          throw error;
        }
        var tbsCertificate = child.tbsCertificate || pki2.getTBSCertificate(child);
        var bytes = asn1.toDer(tbsCertificate);
        md.update(bytes.getBytes());
      }
      if (md !== null) {
        var scheme;
        switch (child.signatureOid) {
          case oids.sha1WithRSAEncryption:
            scheme = void 0;
            break;
          case oids["RSASSA-PSS"]:
            var hash, mgf;
            hash = oids[child.signatureParameters.mgf.hash.algorithmOid];
            if (hash === void 0 || forge2.md[hash] === void 0) {
              var error = new Error("Unsupported MGF hash function.");
              error.oid = child.signatureParameters.mgf.hash.algorithmOid;
              error.name = hash;
              throw error;
            }
            mgf = oids[child.signatureParameters.mgf.algorithmOid];
            if (mgf === void 0 || forge2.mgf[mgf] === void 0) {
              var error = new Error("Unsupported MGF function.");
              error.oid = child.signatureParameters.mgf.algorithmOid;
              error.name = mgf;
              throw error;
            }
            mgf = forge2.mgf[mgf].create(forge2.md[hash].create());
            hash = oids[child.signatureParameters.hash.algorithmOid];
            if (hash === void 0 || forge2.md[hash] === void 0) {
              throw {
                message: "Unsupported RSASSA-PSS hash function.",
                oid: child.signatureParameters.hash.algorithmOid,
                name: hash
              };
            }
            scheme = forge2.pss.create(forge2.md[hash].create(), mgf, child.signatureParameters.saltLength);
            break;
        }
        rval = cert.publicKey.verify(md.digest().getBytes(), child.signature, scheme);
      }
      return rval;
    };
    cert.isIssuer = function(parent) {
      var rval = false;
      var i = cert.issuer;
      var s = parent.subject;
      if (i.hash && s.hash) {
        rval = i.hash === s.hash;
      } else if (i.attributes.length === s.attributes.length) {
        rval = true;
        var iattr, sattr;
        for (var n = 0; rval && n < i.attributes.length; ++n) {
          iattr = i.attributes[n];
          sattr = s.attributes[n];
          if (iattr.type !== sattr.type || iattr.value !== sattr.value) {
            rval = false;
          }
        }
      }
      return rval;
    };
    cert.issued = function(child) {
      return child.isIssuer(cert);
    };
    cert.generateSubjectKeyIdentifier = function() {
      return pki2.getPublicKeyFingerprint(cert.publicKey, {type: "RSAPublicKey"});
    };
    cert.verifySubjectKeyIdentifier = function() {
      var oid = oids["subjectKeyIdentifier"];
      for (var i = 0; i < cert.extensions.length; ++i) {
        var ext = cert.extensions[i];
        if (ext.id === oid) {
          var ski = cert.generateSubjectKeyIdentifier().getBytes();
          return forge2.util.hexToBytes(ext.subjectKeyIdentifier) === ski;
        }
      }
      return false;
    };
    return cert;
  };
  pki2.certificateFromAsn1 = function(obj, computeHash) {
    var capture = {};
    var errors = [];
    if (!asn1.validate(obj, x509CertificateValidator, capture, errors)) {
      var error = new Error("Cannot read X.509 certificate. ASN.1 object is not an X509v3 Certificate.");
      error.errors = errors;
      throw error;
    }
    var oid = asn1.derToOid(capture.publicKeyOid);
    if (oid !== pki2.oids.rsaEncryption) {
      throw new Error("Cannot read public key. OID is not RSA.");
    }
    var cert = pki2.createCertificate();
    cert.version = capture.certVersion ? capture.certVersion.charCodeAt(0) : 0;
    var serial = forge2.util.createBuffer(capture.certSerialNumber);
    cert.serialNumber = serial.toHex();
    cert.signatureOid = forge2.asn1.derToOid(capture.certSignatureOid);
    cert.signatureParameters = _readSignatureParameters(cert.signatureOid, capture.certSignatureParams, true);
    cert.siginfo.algorithmOid = forge2.asn1.derToOid(capture.certinfoSignatureOid);
    cert.siginfo.parameters = _readSignatureParameters(cert.siginfo.algorithmOid, capture.certinfoSignatureParams, false);
    cert.signature = capture.certSignature;
    var validity = [];
    if (capture.certValidity1UTCTime !== void 0) {
      validity.push(asn1.utcTimeToDate(capture.certValidity1UTCTime));
    }
    if (capture.certValidity2GeneralizedTime !== void 0) {
      validity.push(asn1.generalizedTimeToDate(capture.certValidity2GeneralizedTime));
    }
    if (capture.certValidity3UTCTime !== void 0) {
      validity.push(asn1.utcTimeToDate(capture.certValidity3UTCTime));
    }
    if (capture.certValidity4GeneralizedTime !== void 0) {
      validity.push(asn1.generalizedTimeToDate(capture.certValidity4GeneralizedTime));
    }
    if (validity.length > 2) {
      throw new Error("Cannot read notBefore/notAfter validity times; more than two times were provided in the certificate.");
    }
    if (validity.length < 2) {
      throw new Error("Cannot read notBefore/notAfter validity times; they were not provided as either UTCTime or GeneralizedTime.");
    }
    cert.validity.notBefore = validity[0];
    cert.validity.notAfter = validity[1];
    cert.tbsCertificate = capture.tbsCertificate;
    if (computeHash) {
      cert.md = null;
      if (cert.signatureOid in oids) {
        var oid = oids[cert.signatureOid];
        switch (oid) {
          case "sha1WithRSAEncryption":
            cert.md = forge2.md.sha1.create();
            break;
          case "md5WithRSAEncryption":
            cert.md = forge2.md.md5.create();
            break;
          case "sha256WithRSAEncryption":
            cert.md = forge2.md.sha256.create();
            break;
          case "sha384WithRSAEncryption":
            cert.md = forge2.md.sha384.create();
            break;
          case "sha512WithRSAEncryption":
            cert.md = forge2.md.sha512.create();
            break;
          case "RSASSA-PSS":
            cert.md = forge2.md.sha256.create();
            break;
        }
      }
      if (cert.md === null) {
        var error = new Error("Could not compute certificate digest. Unknown signature OID.");
        error.signatureOid = cert.signatureOid;
        throw error;
      }
      var bytes = asn1.toDer(cert.tbsCertificate);
      cert.md.update(bytes.getBytes());
    }
    var imd = forge2.md.sha1.create();
    cert.issuer.getField = function(sn) {
      return _getAttribute(cert.issuer, sn);
    };
    cert.issuer.addField = function(attr) {
      _fillMissingFields([attr]);
      cert.issuer.attributes.push(attr);
    };
    cert.issuer.attributes = pki2.RDNAttributesAsArray(capture.certIssuer, imd);
    if (capture.certIssuerUniqueId) {
      cert.issuer.uniqueId = capture.certIssuerUniqueId;
    }
    cert.issuer.hash = imd.digest().toHex();
    var smd = forge2.md.sha1.create();
    cert.subject.getField = function(sn) {
      return _getAttribute(cert.subject, sn);
    };
    cert.subject.addField = function(attr) {
      _fillMissingFields([attr]);
      cert.subject.attributes.push(attr);
    };
    cert.subject.attributes = pki2.RDNAttributesAsArray(capture.certSubject, smd);
    if (capture.certSubjectUniqueId) {
      cert.subject.uniqueId = capture.certSubjectUniqueId;
    }
    cert.subject.hash = smd.digest().toHex();
    if (capture.certExtensions) {
      cert.extensions = pki2.certificateExtensionsFromAsn1(capture.certExtensions);
    } else {
      cert.extensions = [];
    }
    cert.publicKey = pki2.publicKeyFromAsn1(capture.subjectPublicKeyInfo);
    return cert;
  };
  pki2.certificateExtensionsFromAsn1 = function(exts) {
    var rval = [];
    for (var i = 0; i < exts.value.length; ++i) {
      var extseq = exts.value[i];
      for (var ei = 0; ei < extseq.value.length; ++ei) {
        rval.push(pki2.certificateExtensionFromAsn1(extseq.value[ei]));
      }
    }
    return rval;
  };
  pki2.certificateExtensionFromAsn1 = function(ext) {
    var e = {};
    e.id = asn1.derToOid(ext.value[0].value);
    e.critical = false;
    if (ext.value[1].type === asn1.Type.BOOLEAN) {
      e.critical = ext.value[1].value.charCodeAt(0) !== 0;
      e.value = ext.value[2].value;
    } else {
      e.value = ext.value[1].value;
    }
    if (e.id in oids) {
      e.name = oids[e.id];
      if (e.name === "keyUsage") {
        var ev = asn1.fromDer(e.value);
        var b2 = 0;
        var b3 = 0;
        if (ev.value.length > 1) {
          b2 = ev.value.charCodeAt(1);
          b3 = ev.value.length > 2 ? ev.value.charCodeAt(2) : 0;
        }
        e.digitalSignature = (b2 & 128) === 128;
        e.nonRepudiation = (b2 & 64) === 64;
        e.keyEncipherment = (b2 & 32) === 32;
        e.dataEncipherment = (b2 & 16) === 16;
        e.keyAgreement = (b2 & 8) === 8;
        e.keyCertSign = (b2 & 4) === 4;
        e.cRLSign = (b2 & 2) === 2;
        e.encipherOnly = (b2 & 1) === 1;
        e.decipherOnly = (b3 & 128) === 128;
      } else if (e.name === "basicConstraints") {
        var ev = asn1.fromDer(e.value);
        if (ev.value.length > 0 && ev.value[0].type === asn1.Type.BOOLEAN) {
          e.cA = ev.value[0].value.charCodeAt(0) !== 0;
        } else {
          e.cA = false;
        }
        var value = null;
        if (ev.value.length > 0 && ev.value[0].type === asn1.Type.INTEGER) {
          value = ev.value[0].value;
        } else if (ev.value.length > 1) {
          value = ev.value[1].value;
        }
        if (value !== null) {
          e.pathLenConstraint = asn1.derToInteger(value);
        }
      } else if (e.name === "extKeyUsage") {
        var ev = asn1.fromDer(e.value);
        for (var vi = 0; vi < ev.value.length; ++vi) {
          var oid = asn1.derToOid(ev.value[vi].value);
          if (oid in oids) {
            e[oids[oid]] = true;
          } else {
            e[oid] = true;
          }
        }
      } else if (e.name === "nsCertType") {
        var ev = asn1.fromDer(e.value);
        var b2 = 0;
        if (ev.value.length > 1) {
          b2 = ev.value.charCodeAt(1);
        }
        e.client = (b2 & 128) === 128;
        e.server = (b2 & 64) === 64;
        e.email = (b2 & 32) === 32;
        e.objsign = (b2 & 16) === 16;
        e.reserved = (b2 & 8) === 8;
        e.sslCA = (b2 & 4) === 4;
        e.emailCA = (b2 & 2) === 2;
        e.objCA = (b2 & 1) === 1;
      } else if (e.name === "subjectAltName" || e.name === "issuerAltName") {
        e.altNames = [];
        var gn;
        var ev = asn1.fromDer(e.value);
        for (var n = 0; n < ev.value.length; ++n) {
          gn = ev.value[n];
          var altName = {
            type: gn.type,
            value: gn.value
          };
          e.altNames.push(altName);
          switch (gn.type) {
            case 1:
            case 2:
            case 6:
              break;
            case 7:
              altName.ip = forge2.util.bytesToIP(gn.value);
              break;
            case 8:
              altName.oid = asn1.derToOid(gn.value);
              break;
            default:
          }
        }
      } else if (e.name === "subjectKeyIdentifier") {
        var ev = asn1.fromDer(e.value);
        e.subjectKeyIdentifier = forge2.util.bytesToHex(ev.value);
      }
    }
    return e;
  };
  pki2.certificationRequestFromAsn1 = function(obj, computeHash) {
    var capture = {};
    var errors = [];
    if (!asn1.validate(obj, certificationRequestValidator, capture, errors)) {
      var error = new Error("Cannot read PKCS#10 certificate request. ASN.1 object is not a PKCS#10 CertificationRequest.");
      error.errors = errors;
      throw error;
    }
    var oid = asn1.derToOid(capture.publicKeyOid);
    if (oid !== pki2.oids.rsaEncryption) {
      throw new Error("Cannot read public key. OID is not RSA.");
    }
    var csr = pki2.createCertificationRequest();
    csr.version = capture.csrVersion ? capture.csrVersion.charCodeAt(0) : 0;
    csr.signatureOid = forge2.asn1.derToOid(capture.csrSignatureOid);
    csr.signatureParameters = _readSignatureParameters(csr.signatureOid, capture.csrSignatureParams, true);
    csr.siginfo.algorithmOid = forge2.asn1.derToOid(capture.csrSignatureOid);
    csr.siginfo.parameters = _readSignatureParameters(csr.siginfo.algorithmOid, capture.csrSignatureParams, false);
    csr.signature = capture.csrSignature;
    csr.certificationRequestInfo = capture.certificationRequestInfo;
    if (computeHash) {
      csr.md = null;
      if (csr.signatureOid in oids) {
        var oid = oids[csr.signatureOid];
        switch (oid) {
          case "sha1WithRSAEncryption":
            csr.md = forge2.md.sha1.create();
            break;
          case "md5WithRSAEncryption":
            csr.md = forge2.md.md5.create();
            break;
          case "sha256WithRSAEncryption":
            csr.md = forge2.md.sha256.create();
            break;
          case "sha384WithRSAEncryption":
            csr.md = forge2.md.sha384.create();
            break;
          case "sha512WithRSAEncryption":
            csr.md = forge2.md.sha512.create();
            break;
          case "RSASSA-PSS":
            csr.md = forge2.md.sha256.create();
            break;
        }
      }
      if (csr.md === null) {
        var error = new Error("Could not compute certification request digest. Unknown signature OID.");
        error.signatureOid = csr.signatureOid;
        throw error;
      }
      var bytes = asn1.toDer(csr.certificationRequestInfo);
      csr.md.update(bytes.getBytes());
    }
    var smd = forge2.md.sha1.create();
    csr.subject.getField = function(sn) {
      return _getAttribute(csr.subject, sn);
    };
    csr.subject.addField = function(attr) {
      _fillMissingFields([attr]);
      csr.subject.attributes.push(attr);
    };
    csr.subject.attributes = pki2.RDNAttributesAsArray(capture.certificationRequestInfoSubject, smd);
    csr.subject.hash = smd.digest().toHex();
    csr.publicKey = pki2.publicKeyFromAsn1(capture.subjectPublicKeyInfo);
    csr.getAttribute = function(sn) {
      return _getAttribute(csr, sn);
    };
    csr.addAttribute = function(attr) {
      _fillMissingFields([attr]);
      csr.attributes.push(attr);
    };
    csr.attributes = pki2.CRIAttributesAsArray(capture.certificationRequestInfoAttributes || []);
    return csr;
  };
  pki2.createCertificationRequest = function() {
    var csr = {};
    csr.version = 0;
    csr.signatureOid = null;
    csr.signature = null;
    csr.siginfo = {};
    csr.siginfo.algorithmOid = null;
    csr.subject = {};
    csr.subject.getField = function(sn) {
      return _getAttribute(csr.subject, sn);
    };
    csr.subject.addField = function(attr) {
      _fillMissingFields([attr]);
      csr.subject.attributes.push(attr);
    };
    csr.subject.attributes = [];
    csr.subject.hash = null;
    csr.publicKey = null;
    csr.attributes = [];
    csr.getAttribute = function(sn) {
      return _getAttribute(csr, sn);
    };
    csr.addAttribute = function(attr) {
      _fillMissingFields([attr]);
      csr.attributes.push(attr);
    };
    csr.md = null;
    csr.setSubject = function(attrs) {
      _fillMissingFields(attrs);
      csr.subject.attributes = attrs;
      csr.subject.hash = null;
    };
    csr.setAttributes = function(attrs) {
      _fillMissingFields(attrs);
      csr.attributes = attrs;
    };
    csr.sign = function(key, md) {
      csr.md = md || forge2.md.sha1.create();
      var algorithmOid = oids[csr.md.algorithm + "WithRSAEncryption"];
      if (!algorithmOid) {
        var error = new Error("Could not compute certification request digest. Unknown message digest algorithm OID.");
        error.algorithm = csr.md.algorithm;
        throw error;
      }
      csr.signatureOid = csr.siginfo.algorithmOid = algorithmOid;
      csr.certificationRequestInfo = pki2.getCertificationRequestInfo(csr);
      var bytes = asn1.toDer(csr.certificationRequestInfo);
      csr.md.update(bytes.getBytes());
      csr.signature = key.sign(csr.md);
    };
    csr.verify = function() {
      var rval = false;
      var md = csr.md;
      if (md === null) {
        if (csr.signatureOid in oids) {
          var oid = oids[csr.signatureOid];
          switch (oid) {
            case "sha1WithRSAEncryption":
              md = forge2.md.sha1.create();
              break;
            case "md5WithRSAEncryption":
              md = forge2.md.md5.create();
              break;
            case "sha256WithRSAEncryption":
              md = forge2.md.sha256.create();
              break;
            case "sha384WithRSAEncryption":
              md = forge2.md.sha384.create();
              break;
            case "sha512WithRSAEncryption":
              md = forge2.md.sha512.create();
              break;
            case "RSASSA-PSS":
              md = forge2.md.sha256.create();
              break;
          }
        }
        if (md === null) {
          var error = new Error("Could not compute certification request digest. Unknown signature OID.");
          error.signatureOid = csr.signatureOid;
          throw error;
        }
        var cri = csr.certificationRequestInfo || pki2.getCertificationRequestInfo(csr);
        var bytes = asn1.toDer(cri);
        md.update(bytes.getBytes());
      }
      if (md !== null) {
        var scheme;
        switch (csr.signatureOid) {
          case oids.sha1WithRSAEncryption:
            break;
          case oids["RSASSA-PSS"]:
            var hash, mgf;
            hash = oids[csr.signatureParameters.mgf.hash.algorithmOid];
            if (hash === void 0 || forge2.md[hash] === void 0) {
              var error = new Error("Unsupported MGF hash function.");
              error.oid = csr.signatureParameters.mgf.hash.algorithmOid;
              error.name = hash;
              throw error;
            }
            mgf = oids[csr.signatureParameters.mgf.algorithmOid];
            if (mgf === void 0 || forge2.mgf[mgf] === void 0) {
              var error = new Error("Unsupported MGF function.");
              error.oid = csr.signatureParameters.mgf.algorithmOid;
              error.name = mgf;
              throw error;
            }
            mgf = forge2.mgf[mgf].create(forge2.md[hash].create());
            hash = oids[csr.signatureParameters.hash.algorithmOid];
            if (hash === void 0 || forge2.md[hash] === void 0) {
              var error = new Error("Unsupported RSASSA-PSS hash function.");
              error.oid = csr.signatureParameters.hash.algorithmOid;
              error.name = hash;
              throw error;
            }
            scheme = forge2.pss.create(forge2.md[hash].create(), mgf, csr.signatureParameters.saltLength);
            break;
        }
        rval = csr.publicKey.verify(md.digest().getBytes(), csr.signature, scheme);
      }
      return rval;
    };
    return csr;
  };
  function _dnToAsn1(obj) {
    var rval = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
    var attr, set;
    var attrs = obj.attributes;
    for (var i = 0; i < attrs.length; ++i) {
      attr = attrs[i];
      var value = attr.value;
      var valueTagClass = asn1.Type.PRINTABLESTRING;
      if ("valueTagClass" in attr) {
        valueTagClass = attr.valueTagClass;
        if (valueTagClass === asn1.Type.UTF8) {
          value = forge2.util.encodeUtf8(value);
        }
      }
      set = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(attr.type).getBytes()),
          asn1.create(asn1.Class.UNIVERSAL, valueTagClass, false, value)
        ])
      ]);
      rval.value.push(set);
    }
    return rval;
  }
  function _fillMissingFields(attrs) {
    var attr;
    for (var i = 0; i < attrs.length; ++i) {
      attr = attrs[i];
      if (typeof attr.name === "undefined") {
        if (attr.type && attr.type in pki2.oids) {
          attr.name = pki2.oids[attr.type];
        } else if (attr.shortName && attr.shortName in _shortNames) {
          attr.name = pki2.oids[_shortNames[attr.shortName]];
        }
      }
      if (typeof attr.type === "undefined") {
        if (attr.name && attr.name in pki2.oids) {
          attr.type = pki2.oids[attr.name];
        } else {
          var error = new Error("Attribute type not specified.");
          error.attribute = attr;
          throw error;
        }
      }
      if (typeof attr.shortName === "undefined") {
        if (attr.name && attr.name in _shortNames) {
          attr.shortName = _shortNames[attr.name];
        }
      }
      if (attr.type === oids.extensionRequest) {
        attr.valueConstructed = true;
        attr.valueTagClass = asn1.Type.SEQUENCE;
        if (!attr.value && attr.extensions) {
          attr.value = [];
          for (var ei = 0; ei < attr.extensions.length; ++ei) {
            attr.value.push(pki2.certificateExtensionToAsn1(_fillMissingExtensionFields(attr.extensions[ei])));
          }
        }
      }
      if (typeof attr.value === "undefined") {
        var error = new Error("Attribute value not specified.");
        error.attribute = attr;
        throw error;
      }
    }
  }
  function _fillMissingExtensionFields(e, options) {
    options = options || {};
    if (typeof e.name === "undefined") {
      if (e.id && e.id in pki2.oids) {
        e.name = pki2.oids[e.id];
      }
    }
    if (typeof e.id === "undefined") {
      if (e.name && e.name in pki2.oids) {
        e.id = pki2.oids[e.name];
      } else {
        var error = new Error("Extension ID not specified.");
        error.extension = e;
        throw error;
      }
    }
    if (typeof e.value !== "undefined") {
      return e;
    }
    if (e.name === "keyUsage") {
      var unused = 0;
      var b2 = 0;
      var b3 = 0;
      if (e.digitalSignature) {
        b2 |= 128;
        unused = 7;
      }
      if (e.nonRepudiation) {
        b2 |= 64;
        unused = 6;
      }
      if (e.keyEncipherment) {
        b2 |= 32;
        unused = 5;
      }
      if (e.dataEncipherment) {
        b2 |= 16;
        unused = 4;
      }
      if (e.keyAgreement) {
        b2 |= 8;
        unused = 3;
      }
      if (e.keyCertSign) {
        b2 |= 4;
        unused = 2;
      }
      if (e.cRLSign) {
        b2 |= 2;
        unused = 1;
      }
      if (e.encipherOnly) {
        b2 |= 1;
        unused = 0;
      }
      if (e.decipherOnly) {
        b3 |= 128;
        unused = 7;
      }
      var value = String.fromCharCode(unused);
      if (b3 !== 0) {
        value += String.fromCharCode(b2) + String.fromCharCode(b3);
      } else if (b2 !== 0) {
        value += String.fromCharCode(b2);
      }
      e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, value);
    } else if (e.name === "basicConstraints") {
      e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
      if (e.cA) {
        e.value.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BOOLEAN, false, String.fromCharCode(255)));
      }
      if ("pathLenConstraint" in e) {
        e.value.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(e.pathLenConstraint).getBytes()));
      }
    } else if (e.name === "extKeyUsage") {
      e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
      var seq = e.value.value;
      for (var key in e) {
        if (e[key] !== true) {
          continue;
        }
        if (key in oids) {
          seq.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(oids[key]).getBytes()));
        } else if (key.indexOf(".") !== -1) {
          seq.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(key).getBytes()));
        }
      }
    } else if (e.name === "nsCertType") {
      var unused = 0;
      var b2 = 0;
      if (e.client) {
        b2 |= 128;
        unused = 7;
      }
      if (e.server) {
        b2 |= 64;
        unused = 6;
      }
      if (e.email) {
        b2 |= 32;
        unused = 5;
      }
      if (e.objsign) {
        b2 |= 16;
        unused = 4;
      }
      if (e.reserved) {
        b2 |= 8;
        unused = 3;
      }
      if (e.sslCA) {
        b2 |= 4;
        unused = 2;
      }
      if (e.emailCA) {
        b2 |= 2;
        unused = 1;
      }
      if (e.objCA) {
        b2 |= 1;
        unused = 0;
      }
      var value = String.fromCharCode(unused);
      if (b2 !== 0) {
        value += String.fromCharCode(b2);
      }
      e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, value);
    } else if (e.name === "subjectAltName" || e.name === "issuerAltName") {
      e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
      var altName;
      for (var n = 0; n < e.altNames.length; ++n) {
        altName = e.altNames[n];
        var value = altName.value;
        if (altName.type === 7 && altName.ip) {
          value = forge2.util.bytesFromIP(altName.ip);
          if (value === null) {
            var error = new Error('Extension "ip" value is not a valid IPv4 or IPv6 address.');
            error.extension = e;
            throw error;
          }
        } else if (altName.type === 8) {
          if (altName.oid) {
            value = asn1.oidToDer(asn1.oidToDer(altName.oid));
          } else {
            value = asn1.oidToDer(value);
          }
        }
        e.value.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, altName.type, false, value));
      }
    } else if (e.name === "nsComment" && options.cert) {
      if (!/^[\x00-\x7F]*$/.test(e.comment) || e.comment.length < 1 || e.comment.length > 128) {
        throw new Error('Invalid "nsComment" content.');
      }
      e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.IA5STRING, false, e.comment);
    } else if (e.name === "subjectKeyIdentifier" && options.cert) {
      var ski = options.cert.generateSubjectKeyIdentifier();
      e.subjectKeyIdentifier = ski.toHex();
      e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, ski.getBytes());
    } else if (e.name === "authorityKeyIdentifier" && options.cert) {
      e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
      var seq = e.value.value;
      if (e.keyIdentifier) {
        var keyIdentifier = e.keyIdentifier === true ? options.cert.generateSubjectKeyIdentifier().getBytes() : e.keyIdentifier;
        seq.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, false, keyIdentifier));
      }
      if (e.authorityCertIssuer) {
        var authorityCertIssuer = [
          asn1.create(asn1.Class.CONTEXT_SPECIFIC, 4, true, [
            _dnToAsn1(e.authorityCertIssuer === true ? options.cert.issuer : e.authorityCertIssuer)
          ])
        ];
        seq.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, authorityCertIssuer));
      }
      if (e.serialNumber) {
        var serialNumber = forge2.util.hexToBytes(e.serialNumber === true ? options.cert.serialNumber : e.serialNumber);
        seq.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 2, false, serialNumber));
      }
    } else if (e.name === "cRLDistributionPoints") {
      e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
      var seq = e.value.value;
      var subSeq = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
      var fullNameGeneralNames = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, []);
      var altName;
      for (var n = 0; n < e.altNames.length; ++n) {
        altName = e.altNames[n];
        var value = altName.value;
        if (altName.type === 7 && altName.ip) {
          value = forge2.util.bytesFromIP(altName.ip);
          if (value === null) {
            var error = new Error('Extension "ip" value is not a valid IPv4 or IPv6 address.');
            error.extension = e;
            throw error;
          }
        } else if (altName.type === 8) {
          if (altName.oid) {
            value = asn1.oidToDer(asn1.oidToDer(altName.oid));
          } else {
            value = asn1.oidToDer(value);
          }
        }
        fullNameGeneralNames.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, altName.type, false, value));
      }
      subSeq.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [fullNameGeneralNames]));
      seq.push(subSeq);
    }
    if (typeof e.value === "undefined") {
      var error = new Error("Extension value not specified.");
      error.extension = e;
      throw error;
    }
    return e;
  }
  function _signatureParametersToAsn1(oid, params) {
    switch (oid) {
      case oids["RSASSA-PSS"]:
        var parts = [];
        if (params.hash.algorithmOid !== void 0) {
          parts.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(params.hash.algorithmOid).getBytes()),
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
            ])
          ]));
        }
        if (params.mgf.algorithmOid !== void 0) {
          parts.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(params.mgf.algorithmOid).getBytes()),
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(params.mgf.hash.algorithmOid).getBytes()),
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
              ])
            ])
          ]));
        }
        if (params.saltLength !== void 0) {
          parts.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 2, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(params.saltLength).getBytes())
          ]));
        }
        return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, parts);
      default:
        return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "");
    }
  }
  function _CRIAttributesToAsn1(csr) {
    var rval = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, []);
    if (csr.attributes.length === 0) {
      return rval;
    }
    var attrs = csr.attributes;
    for (var i = 0; i < attrs.length; ++i) {
      var attr = attrs[i];
      var value = attr.value;
      var valueTagClass = asn1.Type.UTF8;
      if ("valueTagClass" in attr) {
        valueTagClass = attr.valueTagClass;
      }
      if (valueTagClass === asn1.Type.UTF8) {
        value = forge2.util.encodeUtf8(value);
      }
      var valueConstructed = false;
      if ("valueConstructed" in attr) {
        valueConstructed = attr.valueConstructed;
      }
      var seq = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(attr.type).getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, [
          asn1.create(asn1.Class.UNIVERSAL, valueTagClass, valueConstructed, value)
        ])
      ]);
      rval.value.push(seq);
    }
    return rval;
  }
  var jan_1_1950 = new Date("1950-01-01T00:00:00Z");
  var jan_1_2050 = new Date("2050-01-01T00:00:00Z");
  function _dateToAsn1(date) {
    if (date >= jan_1_1950 && date < jan_1_2050) {
      return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.UTCTIME, false, asn1.dateToUtcTime(date));
    } else {
      return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.GENERALIZEDTIME, false, asn1.dateToGeneralizedTime(date));
    }
  }
  pki2.getTBSCertificate = function(cert) {
    var notBefore = _dateToAsn1(cert.validity.notBefore);
    var notAfter = _dateToAsn1(cert.validity.notAfter);
    var tbs = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(cert.version).getBytes())
      ]),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, forge2.util.hexToBytes(cert.serialNumber)),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(cert.siginfo.algorithmOid).getBytes()),
        _signatureParametersToAsn1(cert.siginfo.algorithmOid, cert.siginfo.parameters)
      ]),
      _dnToAsn1(cert.issuer),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        notBefore,
        notAfter
      ]),
      _dnToAsn1(cert.subject),
      pki2.publicKeyToAsn1(cert.publicKey)
    ]);
    if (cert.issuer.uniqueId) {
      tbs.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, String.fromCharCode(0) + cert.issuer.uniqueId)
      ]));
    }
    if (cert.subject.uniqueId) {
      tbs.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 2, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, String.fromCharCode(0) + cert.subject.uniqueId)
      ]));
    }
    if (cert.extensions.length > 0) {
      tbs.value.push(pki2.certificateExtensionsToAsn1(cert.extensions));
    }
    return tbs;
  };
  pki2.getCertificationRequestInfo = function(csr) {
    var cri = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(csr.version).getBytes()),
      _dnToAsn1(csr.subject),
      pki2.publicKeyToAsn1(csr.publicKey),
      _CRIAttributesToAsn1(csr)
    ]);
    return cri;
  };
  pki2.distinguishedNameToAsn1 = function(dn) {
    return _dnToAsn1(dn);
  };
  pki2.certificateToAsn1 = function(cert) {
    var tbsCertificate = cert.tbsCertificate || pki2.getTBSCertificate(cert);
    return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      tbsCertificate,
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(cert.signatureOid).getBytes()),
        _signatureParametersToAsn1(cert.signatureOid, cert.signatureParameters)
      ]),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, String.fromCharCode(0) + cert.signature)
    ]);
  };
  pki2.certificateExtensionsToAsn1 = function(exts) {
    var rval = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 3, true, []);
    var seq = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
    rval.value.push(seq);
    for (var i = 0; i < exts.length; ++i) {
      seq.value.push(pki2.certificateExtensionToAsn1(exts[i]));
    }
    return rval;
  };
  pki2.certificateExtensionToAsn1 = function(ext) {
    var extseq = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
    extseq.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(ext.id).getBytes()));
    if (ext.critical) {
      extseq.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BOOLEAN, false, String.fromCharCode(255)));
    }
    var value = ext.value;
    if (typeof ext.value !== "string") {
      value = asn1.toDer(value).getBytes();
    }
    extseq.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, value));
    return extseq;
  };
  pki2.certificationRequestToAsn1 = function(csr) {
    var cri = csr.certificationRequestInfo || pki2.getCertificationRequestInfo(csr);
    return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      cri,
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(csr.signatureOid).getBytes()),
        _signatureParametersToAsn1(csr.signatureOid, csr.signatureParameters)
      ]),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, String.fromCharCode(0) + csr.signature)
    ]);
  };
  pki2.createCaStore = function(certs) {
    var caStore = {
      certs: {}
    };
    caStore.getIssuer = function(cert2) {
      var rval = getBySubject(cert2.issuer);
      return rval;
    };
    caStore.addCertificate = function(cert2) {
      if (typeof cert2 === "string") {
        cert2 = forge2.pki.certificateFromPem(cert2);
      }
      ensureSubjectHasHash(cert2.subject);
      if (!caStore.hasCertificate(cert2)) {
        if (cert2.subject.hash in caStore.certs) {
          var tmp = caStore.certs[cert2.subject.hash];
          if (!forge2.util.isArray(tmp)) {
            tmp = [tmp];
          }
          tmp.push(cert2);
          caStore.certs[cert2.subject.hash] = tmp;
        } else {
          caStore.certs[cert2.subject.hash] = cert2;
        }
      }
    };
    caStore.hasCertificate = function(cert2) {
      if (typeof cert2 === "string") {
        cert2 = forge2.pki.certificateFromPem(cert2);
      }
      var match = getBySubject(cert2.subject);
      if (!match) {
        return false;
      }
      if (!forge2.util.isArray(match)) {
        match = [match];
      }
      var der1 = asn1.toDer(pki2.certificateToAsn1(cert2)).getBytes();
      for (var i2 = 0; i2 < match.length; ++i2) {
        var der2 = asn1.toDer(pki2.certificateToAsn1(match[i2])).getBytes();
        if (der1 === der2) {
          return true;
        }
      }
      return false;
    };
    caStore.listAllCertificates = function() {
      var certList = [];
      for (var hash in caStore.certs) {
        if (caStore.certs.hasOwnProperty(hash)) {
          var value = caStore.certs[hash];
          if (!forge2.util.isArray(value)) {
            certList.push(value);
          } else {
            for (var i2 = 0; i2 < value.length; ++i2) {
              certList.push(value[i2]);
            }
          }
        }
      }
      return certList;
    };
    caStore.removeCertificate = function(cert2) {
      var result;
      if (typeof cert2 === "string") {
        cert2 = forge2.pki.certificateFromPem(cert2);
      }
      ensureSubjectHasHash(cert2.subject);
      if (!caStore.hasCertificate(cert2)) {
        return null;
      }
      var match = getBySubject(cert2.subject);
      if (!forge2.util.isArray(match)) {
        result = caStore.certs[cert2.subject.hash];
        delete caStore.certs[cert2.subject.hash];
        return result;
      }
      var der1 = asn1.toDer(pki2.certificateToAsn1(cert2)).getBytes();
      for (var i2 = 0; i2 < match.length; ++i2) {
        var der2 = asn1.toDer(pki2.certificateToAsn1(match[i2])).getBytes();
        if (der1 === der2) {
          result = match[i2];
          match.splice(i2, 1);
        }
      }
      if (match.length === 0) {
        delete caStore.certs[cert2.subject.hash];
      }
      return result;
    };
    function getBySubject(subject) {
      ensureSubjectHasHash(subject);
      return caStore.certs[subject.hash] || null;
    }
    function ensureSubjectHasHash(subject) {
      if (!subject.hash) {
        var md = forge2.md.sha1.create();
        subject.attributes = pki2.RDNAttributesAsArray(_dnToAsn1(subject), md);
        subject.hash = md.digest().toHex();
      }
    }
    if (certs) {
      for (var i = 0; i < certs.length; ++i) {
        var cert = certs[i];
        caStore.addCertificate(cert);
      }
    }
    return caStore;
  };
  pki2.certificateError = {
    bad_certificate: "forge.pki.BadCertificate",
    unsupported_certificate: "forge.pki.UnsupportedCertificate",
    certificate_revoked: "forge.pki.CertificateRevoked",
    certificate_expired: "forge.pki.CertificateExpired",
    certificate_unknown: "forge.pki.CertificateUnknown",
    unknown_ca: "forge.pki.UnknownCertificateAuthority"
  };
  pki2.verifyCertificateChain = function(caStore, chain, options) {
    if (typeof options === "function") {
      options = {verify: options};
    }
    options = options || {};
    chain = chain.slice(0);
    var certs = chain.slice(0);
    var validityCheckDate = options.validityCheckDate;
    if (typeof validityCheckDate === "undefined") {
      validityCheckDate = new Date();
    }
    var first = true;
    var error = null;
    var depth = 0;
    do {
      var cert = chain.shift();
      var parent = null;
      var selfSigned = false;
      if (validityCheckDate) {
        if (validityCheckDate < cert.validity.notBefore || validityCheckDate > cert.validity.notAfter) {
          error = {
            message: "Certificate is not valid yet or has expired.",
            error: pki2.certificateError.certificate_expired,
            notBefore: cert.validity.notBefore,
            notAfter: cert.validity.notAfter,
            now: validityCheckDate
          };
        }
      }
      if (error === null) {
        parent = chain[0] || caStore.getIssuer(cert);
        if (parent === null) {
          if (cert.isIssuer(cert)) {
            selfSigned = true;
            parent = cert;
          }
        }
        if (parent) {
          var parents = parent;
          if (!forge2.util.isArray(parents)) {
            parents = [parents];
          }
          var verified = false;
          while (!verified && parents.length > 0) {
            parent = parents.shift();
            try {
              verified = parent.verify(cert);
            } catch (ex) {
            }
          }
          if (!verified) {
            error = {
              message: "Certificate signature is invalid.",
              error: pki2.certificateError.bad_certificate
            };
          }
        }
        if (error === null && (!parent || selfSigned) && !caStore.hasCertificate(cert)) {
          error = {
            message: "Certificate is not trusted.",
            error: pki2.certificateError.unknown_ca
          };
        }
      }
      if (error === null && parent && !cert.isIssuer(parent)) {
        error = {
          message: "Certificate issuer is invalid.",
          error: pki2.certificateError.bad_certificate
        };
      }
      if (error === null) {
        var se = {
          keyUsage: true,
          basicConstraints: true
        };
        for (var i = 0; error === null && i < cert.extensions.length; ++i) {
          var ext = cert.extensions[i];
          if (ext.critical && !(ext.name in se)) {
            error = {
              message: "Certificate has an unsupported critical extension.",
              error: pki2.certificateError.unsupported_certificate
            };
          }
        }
      }
      if (error === null && (!first || chain.length === 0 && (!parent || selfSigned))) {
        var bcExt = cert.getExtension("basicConstraints");
        var keyUsageExt = cert.getExtension("keyUsage");
        if (keyUsageExt !== null) {
          if (!keyUsageExt.keyCertSign || bcExt === null) {
            error = {
              message: "Certificate keyUsage or basicConstraints conflict or indicate that the certificate is not a CA. If the certificate is the only one in the chain or isn't the first then the certificate must be a valid CA.",
              error: pki2.certificateError.bad_certificate
            };
          }
        }
        if (error === null && bcExt !== null && !bcExt.cA) {
          error = {
            message: "Certificate basicConstraints indicates the certificate is not a CA.",
            error: pki2.certificateError.bad_certificate
          };
        }
        if (error === null && keyUsageExt !== null && "pathLenConstraint" in bcExt) {
          var pathLen = depth - 1;
          if (pathLen > bcExt.pathLenConstraint) {
            error = {
              message: "Certificate basicConstraints pathLenConstraint violated.",
              error: pki2.certificateError.bad_certificate
            };
          }
        }
      }
      var vfd = error === null ? true : error.error;
      var ret = options.verify ? options.verify(vfd, depth, certs) : vfd;
      if (ret === true) {
        error = null;
      } else {
        if (vfd === true) {
          error = {
            message: "The application rejected the certificate.",
            error: pki2.certificateError.bad_certificate
          };
        }
        if (ret || ret === 0) {
          if (typeof ret === "object" && !forge2.util.isArray(ret)) {
            if (ret.message) {
              error.message = ret.message;
            }
            if (ret.error) {
              error.error = ret.error;
            }
          } else if (typeof ret === "string") {
            error.error = ret;
          }
        }
        throw error;
      }
      first = false;
      ++depth;
    } while (chain.length > 0);
    return true;
  };
});

// node_modules/node-forge/lib/pkcs12.js
var require_pkcs12 = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_asn1();
  require_hmac();
  require_oids();
  require_pkcs7asn1();
  require_pbe();
  require_random();
  require_rsa();
  require_sha1();
  require_util();
  require_x509();
  var asn1 = forge2.asn1;
  var pki2 = forge2.pki;
  var p12 = module2.exports = forge2.pkcs12 = forge2.pkcs12 || {};
  var contentInfoValidator = {
    name: "ContentInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "ContentInfo.contentType",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OID,
      constructed: false,
      capture: "contentType"
    }, {
      name: "ContentInfo.content",
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      constructed: true,
      captureAsn1: "content"
    }]
  };
  var pfxValidator = {
    name: "PFX",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [
      {
        name: "PFX.version",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: "version"
      },
      contentInfoValidator,
      {
        name: "PFX.macData",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        optional: true,
        captureAsn1: "mac",
        value: [{
          name: "PFX.macData.mac",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: "PFX.macData.mac.digestAlgorithm",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.SEQUENCE,
            constructed: true,
            value: [{
              name: "PFX.macData.mac.digestAlgorithm.algorithm",
              tagClass: asn1.Class.UNIVERSAL,
              type: asn1.Type.OID,
              constructed: false,
              capture: "macAlgorithm"
            }, {
              name: "PFX.macData.mac.digestAlgorithm.parameters",
              tagClass: asn1.Class.UNIVERSAL,
              captureAsn1: "macAlgorithmParameters"
            }]
          }, {
            name: "PFX.macData.mac.digest",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OCTETSTRING,
            constructed: false,
            capture: "macDigest"
          }]
        }, {
          name: "PFX.macData.macSalt",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OCTETSTRING,
          constructed: false,
          capture: "macSalt"
        }, {
          name: "PFX.macData.iterations",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          optional: true,
          capture: "macIterations"
        }]
      }
    ]
  };
  var safeBagValidator = {
    name: "SafeBag",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "SafeBag.bagId",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OID,
      constructed: false,
      capture: "bagId"
    }, {
      name: "SafeBag.bagValue",
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      constructed: true,
      captureAsn1: "bagValue"
    }, {
      name: "SafeBag.bagAttributes",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SET,
      constructed: true,
      optional: true,
      capture: "bagAttributes"
    }]
  };
  var attributeValidator = {
    name: "Attribute",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "Attribute.attrId",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OID,
      constructed: false,
      capture: "oid"
    }, {
      name: "Attribute.attrValues",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SET,
      constructed: true,
      capture: "values"
    }]
  };
  var certBagValidator = {
    name: "CertBag",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "CertBag.certId",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OID,
      constructed: false,
      capture: "certId"
    }, {
      name: "CertBag.certValue",
      tagClass: asn1.Class.CONTEXT_SPECIFIC,
      constructed: true,
      value: [{
        name: "CertBag.certValue[0]",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Class.OCTETSTRING,
        constructed: false,
        capture: "cert"
      }]
    }]
  };
  function _getBagsByAttribute(safeContents, attrName, attrValue, bagType) {
    var result = [];
    for (var i = 0; i < safeContents.length; i++) {
      for (var j = 0; j < safeContents[i].safeBags.length; j++) {
        var bag = safeContents[i].safeBags[j];
        if (bagType !== void 0 && bag.type !== bagType) {
          continue;
        }
        if (attrName === null) {
          result.push(bag);
          continue;
        }
        if (bag.attributes[attrName] !== void 0 && bag.attributes[attrName].indexOf(attrValue) >= 0) {
          result.push(bag);
        }
      }
    }
    return result;
  }
  p12.pkcs12FromAsn1 = function(obj, strict, password) {
    if (typeof strict === "string") {
      password = strict;
      strict = true;
    } else if (strict === void 0) {
      strict = true;
    }
    var capture = {};
    var errors = [];
    if (!asn1.validate(obj, pfxValidator, capture, errors)) {
      var error = new Error("Cannot read PKCS#12 PFX. ASN.1 object is not an PKCS#12 PFX.");
      error.errors = error;
      throw error;
    }
    var pfx = {
      version: capture.version.charCodeAt(0),
      safeContents: [],
      getBags: function(filter) {
        var rval = {};
        var localKeyId;
        if ("localKeyId" in filter) {
          localKeyId = filter.localKeyId;
        } else if ("localKeyIdHex" in filter) {
          localKeyId = forge2.util.hexToBytes(filter.localKeyIdHex);
        }
        if (localKeyId === void 0 && !("friendlyName" in filter) && "bagType" in filter) {
          rval[filter.bagType] = _getBagsByAttribute(pfx.safeContents, null, null, filter.bagType);
        }
        if (localKeyId !== void 0) {
          rval.localKeyId = _getBagsByAttribute(pfx.safeContents, "localKeyId", localKeyId, filter.bagType);
        }
        if ("friendlyName" in filter) {
          rval.friendlyName = _getBagsByAttribute(pfx.safeContents, "friendlyName", filter.friendlyName, filter.bagType);
        }
        return rval;
      },
      getBagsByFriendlyName: function(friendlyName, bagType) {
        return _getBagsByAttribute(pfx.safeContents, "friendlyName", friendlyName, bagType);
      },
      getBagsByLocalKeyId: function(localKeyId, bagType) {
        return _getBagsByAttribute(pfx.safeContents, "localKeyId", localKeyId, bagType);
      }
    };
    if (capture.version.charCodeAt(0) !== 3) {
      var error = new Error("PKCS#12 PFX of version other than 3 not supported.");
      error.version = capture.version.charCodeAt(0);
      throw error;
    }
    if (asn1.derToOid(capture.contentType) !== pki2.oids.data) {
      var error = new Error("Only PKCS#12 PFX in password integrity mode supported.");
      error.oid = asn1.derToOid(capture.contentType);
      throw error;
    }
    var data = capture.content.value[0];
    if (data.tagClass !== asn1.Class.UNIVERSAL || data.type !== asn1.Type.OCTETSTRING) {
      throw new Error("PKCS#12 authSafe content data is not an OCTET STRING.");
    }
    data = _decodePkcs7Data(data);
    if (capture.mac) {
      var md = null;
      var macKeyBytes = 0;
      var macAlgorithm = asn1.derToOid(capture.macAlgorithm);
      switch (macAlgorithm) {
        case pki2.oids.sha1:
          md = forge2.md.sha1.create();
          macKeyBytes = 20;
          break;
        case pki2.oids.sha256:
          md = forge2.md.sha256.create();
          macKeyBytes = 32;
          break;
        case pki2.oids.sha384:
          md = forge2.md.sha384.create();
          macKeyBytes = 48;
          break;
        case pki2.oids.sha512:
          md = forge2.md.sha512.create();
          macKeyBytes = 64;
          break;
        case pki2.oids.md5:
          md = forge2.md.md5.create();
          macKeyBytes = 16;
          break;
      }
      if (md === null) {
        throw new Error("PKCS#12 uses unsupported MAC algorithm: " + macAlgorithm);
      }
      var macSalt = new forge2.util.ByteBuffer(capture.macSalt);
      var macIterations = "macIterations" in capture ? parseInt(forge2.util.bytesToHex(capture.macIterations), 16) : 1;
      var macKey = p12.generateKey(password, macSalt, 3, macIterations, macKeyBytes, md);
      var mac = forge2.hmac.create();
      mac.start(md, macKey);
      mac.update(data.value);
      var macValue = mac.getMac();
      if (macValue.getBytes() !== capture.macDigest) {
        throw new Error("PKCS#12 MAC could not be verified. Invalid password?");
      }
    }
    _decodeAuthenticatedSafe(pfx, data.value, strict, password);
    return pfx;
  };
  function _decodePkcs7Data(data) {
    if (data.composed || data.constructed) {
      var value = forge2.util.createBuffer();
      for (var i = 0; i < data.value.length; ++i) {
        value.putBytes(data.value[i].value);
      }
      data.composed = data.constructed = false;
      data.value = value.getBytes();
    }
    return data;
  }
  function _decodeAuthenticatedSafe(pfx, authSafe, strict, password) {
    authSafe = asn1.fromDer(authSafe, strict);
    if (authSafe.tagClass !== asn1.Class.UNIVERSAL || authSafe.type !== asn1.Type.SEQUENCE || authSafe.constructed !== true) {
      throw new Error("PKCS#12 AuthenticatedSafe expected to be a SEQUENCE OF ContentInfo");
    }
    for (var i = 0; i < authSafe.value.length; i++) {
      var contentInfo = authSafe.value[i];
      var capture = {};
      var errors = [];
      if (!asn1.validate(contentInfo, contentInfoValidator, capture, errors)) {
        var error = new Error("Cannot read ContentInfo.");
        error.errors = errors;
        throw error;
      }
      var obj = {
        encrypted: false
      };
      var safeContents = null;
      var data = capture.content.value[0];
      switch (asn1.derToOid(capture.contentType)) {
        case pki2.oids.data:
          if (data.tagClass !== asn1.Class.UNIVERSAL || data.type !== asn1.Type.OCTETSTRING) {
            throw new Error("PKCS#12 SafeContents Data is not an OCTET STRING.");
          }
          safeContents = _decodePkcs7Data(data).value;
          break;
        case pki2.oids.encryptedData:
          safeContents = _decryptSafeContents(data, password);
          obj.encrypted = true;
          break;
        default:
          var error = new Error("Unsupported PKCS#12 contentType.");
          error.contentType = asn1.derToOid(capture.contentType);
          throw error;
      }
      obj.safeBags = _decodeSafeContents(safeContents, strict, password);
      pfx.safeContents.push(obj);
    }
  }
  function _decryptSafeContents(data, password) {
    var capture = {};
    var errors = [];
    if (!asn1.validate(data, forge2.pkcs7.asn1.encryptedDataValidator, capture, errors)) {
      var error = new Error("Cannot read EncryptedContentInfo.");
      error.errors = errors;
      throw error;
    }
    var oid = asn1.derToOid(capture.contentType);
    if (oid !== pki2.oids.data) {
      var error = new Error("PKCS#12 EncryptedContentInfo ContentType is not Data.");
      error.oid = oid;
      throw error;
    }
    oid = asn1.derToOid(capture.encAlgorithm);
    var cipher = pki2.pbe.getCipher(oid, capture.encParameter, password);
    var encryptedContentAsn1 = _decodePkcs7Data(capture.encryptedContentAsn1);
    var encrypted = forge2.util.createBuffer(encryptedContentAsn1.value);
    cipher.update(encrypted);
    if (!cipher.finish()) {
      throw new Error("Failed to decrypt PKCS#12 SafeContents.");
    }
    return cipher.output.getBytes();
  }
  function _decodeSafeContents(safeContents, strict, password) {
    if (!strict && safeContents.length === 0) {
      return [];
    }
    safeContents = asn1.fromDer(safeContents, strict);
    if (safeContents.tagClass !== asn1.Class.UNIVERSAL || safeContents.type !== asn1.Type.SEQUENCE || safeContents.constructed !== true) {
      throw new Error("PKCS#12 SafeContents expected to be a SEQUENCE OF SafeBag.");
    }
    var res = [];
    for (var i = 0; i < safeContents.value.length; i++) {
      var safeBag = safeContents.value[i];
      var capture = {};
      var errors = [];
      if (!asn1.validate(safeBag, safeBagValidator, capture, errors)) {
        var error = new Error("Cannot read SafeBag.");
        error.errors = errors;
        throw error;
      }
      var bag = {
        type: asn1.derToOid(capture.bagId),
        attributes: _decodeBagAttributes(capture.bagAttributes)
      };
      res.push(bag);
      var validator, decoder;
      var bagAsn1 = capture.bagValue.value[0];
      switch (bag.type) {
        case pki2.oids.pkcs8ShroudedKeyBag:
          bagAsn1 = pki2.decryptPrivateKeyInfo(bagAsn1, password);
          if (bagAsn1 === null) {
            throw new Error("Unable to decrypt PKCS#8 ShroudedKeyBag, wrong password?");
          }
        case pki2.oids.keyBag:
          try {
            bag.key = pki2.privateKeyFromAsn1(bagAsn1);
          } catch (e) {
            bag.key = null;
            bag.asn1 = bagAsn1;
          }
          continue;
        case pki2.oids.certBag:
          validator = certBagValidator;
          decoder = function() {
            if (asn1.derToOid(capture.certId) !== pki2.oids.x509Certificate) {
              var error2 = new Error("Unsupported certificate type, only X.509 supported.");
              error2.oid = asn1.derToOid(capture.certId);
              throw error2;
            }
            var certAsn1 = asn1.fromDer(capture.cert, strict);
            try {
              bag.cert = pki2.certificateFromAsn1(certAsn1, true);
            } catch (e) {
              bag.cert = null;
              bag.asn1 = certAsn1;
            }
          };
          break;
        default:
          var error = new Error("Unsupported PKCS#12 SafeBag type.");
          error.oid = bag.type;
          throw error;
      }
      if (validator !== void 0 && !asn1.validate(bagAsn1, validator, capture, errors)) {
        var error = new Error("Cannot read PKCS#12 " + validator.name);
        error.errors = errors;
        throw error;
      }
      decoder();
    }
    return res;
  }
  function _decodeBagAttributes(attributes) {
    var decodedAttrs = {};
    if (attributes !== void 0) {
      for (var i = 0; i < attributes.length; ++i) {
        var capture = {};
        var errors = [];
        if (!asn1.validate(attributes[i], attributeValidator, capture, errors)) {
          var error = new Error("Cannot read PKCS#12 BagAttribute.");
          error.errors = errors;
          throw error;
        }
        var oid = asn1.derToOid(capture.oid);
        if (pki2.oids[oid] === void 0) {
          continue;
        }
        decodedAttrs[pki2.oids[oid]] = [];
        for (var j = 0; j < capture.values.length; ++j) {
          decodedAttrs[pki2.oids[oid]].push(capture.values[j].value);
        }
      }
    }
    return decodedAttrs;
  }
  p12.toPkcs12Asn1 = function(key, cert, password, options) {
    options = options || {};
    options.saltSize = options.saltSize || 8;
    options.count = options.count || 2048;
    options.algorithm = options.algorithm || options.encAlgorithm || "aes128";
    if (!("useMac" in options)) {
      options.useMac = true;
    }
    if (!("localKeyId" in options)) {
      options.localKeyId = null;
    }
    if (!("generateLocalKeyId" in options)) {
      options.generateLocalKeyId = true;
    }
    var localKeyId = options.localKeyId;
    var bagAttrs;
    if (localKeyId !== null) {
      localKeyId = forge2.util.hexToBytes(localKeyId);
    } else if (options.generateLocalKeyId) {
      if (cert) {
        var pairedCert = forge2.util.isArray(cert) ? cert[0] : cert;
        if (typeof pairedCert === "string") {
          pairedCert = pki2.certificateFromPem(pairedCert);
        }
        var sha1 = forge2.md.sha1.create();
        sha1.update(asn1.toDer(pki2.certificateToAsn1(pairedCert)).getBytes());
        localKeyId = sha1.digest().getBytes();
      } else {
        localKeyId = forge2.random.getBytes(20);
      }
    }
    var attrs = [];
    if (localKeyId !== null) {
      attrs.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki2.oids.localKeyId).getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, localKeyId)
        ])
      ]));
    }
    if ("friendlyName" in options) {
      attrs.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki2.oids.friendlyName).getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BMPSTRING, false, options.friendlyName)
        ])
      ]));
    }
    if (attrs.length > 0) {
      bagAttrs = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, attrs);
    }
    var contents = [];
    var chain = [];
    if (cert !== null) {
      if (forge2.util.isArray(cert)) {
        chain = cert;
      } else {
        chain = [cert];
      }
    }
    var certSafeBags = [];
    for (var i = 0; i < chain.length; ++i) {
      cert = chain[i];
      if (typeof cert === "string") {
        cert = pki2.certificateFromPem(cert);
      }
      var certBagAttrs = i === 0 ? bagAttrs : void 0;
      var certAsn1 = pki2.certificateToAsn1(cert);
      var certSafeBag = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki2.oids.certBag).getBytes()),
        asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki2.oids.x509Certificate).getBytes()),
            asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, asn1.toDer(certAsn1).getBytes())
            ])
          ])
        ]),
        certBagAttrs
      ]);
      certSafeBags.push(certSafeBag);
    }
    if (certSafeBags.length > 0) {
      var certSafeContents = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, certSafeBags);
      var certCI = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki2.oids.data).getBytes()),
        asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, asn1.toDer(certSafeContents).getBytes())
        ])
      ]);
      contents.push(certCI);
    }
    var keyBag = null;
    if (key !== null) {
      var pkAsn1 = pki2.wrapRsaPrivateKey(pki2.privateKeyToAsn1(key));
      if (password === null) {
        keyBag = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki2.oids.keyBag).getBytes()),
          asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
            pkAsn1
          ]),
          bagAttrs
        ]);
      } else {
        keyBag = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki2.oids.pkcs8ShroudedKeyBag).getBytes()),
          asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
            pki2.encryptPrivateKeyInfo(pkAsn1, password, options)
          ]),
          bagAttrs
        ]);
      }
      var keySafeContents = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [keyBag]);
      var keyCI = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki2.oids.data).getBytes()),
        asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, asn1.toDer(keySafeContents).getBytes())
        ])
      ]);
      contents.push(keyCI);
    }
    var safe = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, contents);
    var macData;
    if (options.useMac) {
      var sha1 = forge2.md.sha1.create();
      var macSalt = new forge2.util.ByteBuffer(forge2.random.getBytes(options.saltSize));
      var count = options.count;
      var key = p12.generateKey(password, macSalt, 3, count, 20);
      var mac = forge2.hmac.create();
      mac.start(sha1, key);
      mac.update(asn1.toDer(safe).getBytes());
      var macValue = mac.getMac();
      macData = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki2.oids.sha1).getBytes()),
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
          ]),
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, macValue.getBytes())
        ]),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, macSalt.getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(count).getBytes())
      ]);
    }
    return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(3).getBytes()),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki2.oids.data).getBytes()),
        asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, asn1.toDer(safe).getBytes())
        ])
      ]),
      macData
    ]);
  };
  p12.generateKey = forge2.pbe.generatePkcs12Key;
});

// node_modules/node-forge/lib/pki.js
var require_pki = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_asn1();
  require_oids();
  require_pbe();
  require_pem();
  require_pbkdf2();
  require_pkcs12();
  require_pss();
  require_rsa();
  require_util();
  require_x509();
  var asn1 = forge2.asn1;
  var pki2 = module2.exports = forge2.pki = forge2.pki || {};
  pki2.pemToDer = function(pem) {
    var msg = forge2.pem.decode(pem)[0];
    if (msg.procType && msg.procType.type === "ENCRYPTED") {
      throw new Error("Could not convert PEM to DER; PEM is encrypted.");
    }
    return forge2.util.createBuffer(msg.body);
  };
  pki2.privateKeyFromPem = function(pem) {
    var msg = forge2.pem.decode(pem)[0];
    if (msg.type !== "PRIVATE KEY" && msg.type !== "RSA PRIVATE KEY") {
      var error = new Error('Could not convert private key from PEM; PEM header type is not "PRIVATE KEY" or "RSA PRIVATE KEY".');
      error.headerType = msg.type;
      throw error;
    }
    if (msg.procType && msg.procType.type === "ENCRYPTED") {
      throw new Error("Could not convert private key from PEM; PEM is encrypted.");
    }
    var obj = asn1.fromDer(msg.body);
    return pki2.privateKeyFromAsn1(obj);
  };
  pki2.privateKeyToPem = function(key, maxline) {
    var msg = {
      type: "RSA PRIVATE KEY",
      body: asn1.toDer(pki2.privateKeyToAsn1(key)).getBytes()
    };
    return forge2.pem.encode(msg, {maxline});
  };
  pki2.privateKeyInfoToPem = function(pki3, maxline) {
    var msg = {
      type: "PRIVATE KEY",
      body: asn1.toDer(pki3).getBytes()
    };
    return forge2.pem.encode(msg, {maxline});
  };
});

// node_modules/node-forge/lib/tls.js
var require_tls = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_asn1();
  require_hmac();
  require_md5();
  require_pem();
  require_pki();
  require_random();
  require_sha1();
  require_util();
  var prf_TLS1 = function(secret, label, seed, length) {
    var rval = forge2.util.createBuffer();
    var idx = secret.length >> 1;
    var slen = idx + (secret.length & 1);
    var s1 = secret.substr(0, slen);
    var s2 = secret.substr(idx, slen);
    var ai = forge2.util.createBuffer();
    var hmac = forge2.hmac.create();
    seed = label + seed;
    var md5itr = Math.ceil(length / 16);
    var sha1itr = Math.ceil(length / 20);
    hmac.start("MD5", s1);
    var md5bytes = forge2.util.createBuffer();
    ai.putBytes(seed);
    for (var i = 0; i < md5itr; ++i) {
      hmac.start(null, null);
      hmac.update(ai.getBytes());
      ai.putBuffer(hmac.digest());
      hmac.start(null, null);
      hmac.update(ai.bytes() + seed);
      md5bytes.putBuffer(hmac.digest());
    }
    hmac.start("SHA1", s2);
    var sha1bytes = forge2.util.createBuffer();
    ai.clear();
    ai.putBytes(seed);
    for (var i = 0; i < sha1itr; ++i) {
      hmac.start(null, null);
      hmac.update(ai.getBytes());
      ai.putBuffer(hmac.digest());
      hmac.start(null, null);
      hmac.update(ai.bytes() + seed);
      sha1bytes.putBuffer(hmac.digest());
    }
    rval.putBytes(forge2.util.xorBytes(md5bytes.getBytes(), sha1bytes.getBytes(), length));
    return rval;
  };
  var hmac_sha1 = function(key2, seqNum, record) {
    var hmac = forge2.hmac.create();
    hmac.start("SHA1", key2);
    var b = forge2.util.createBuffer();
    b.putInt32(seqNum[0]);
    b.putInt32(seqNum[1]);
    b.putByte(record.type);
    b.putByte(record.version.major);
    b.putByte(record.version.minor);
    b.putInt16(record.length);
    b.putBytes(record.fragment.bytes());
    hmac.update(b.getBytes());
    return hmac.digest().getBytes();
  };
  var deflate = function(c, record, s) {
    var rval = false;
    try {
      var bytes = c.deflate(record.fragment.getBytes());
      record.fragment = forge2.util.createBuffer(bytes);
      record.length = bytes.length;
      rval = true;
    } catch (ex) {
    }
    return rval;
  };
  var inflate = function(c, record, s) {
    var rval = false;
    try {
      var bytes = c.inflate(record.fragment.getBytes());
      record.fragment = forge2.util.createBuffer(bytes);
      record.length = bytes.length;
      rval = true;
    } catch (ex) {
    }
    return rval;
  };
  var readVector = function(b, lenBytes) {
    var len = 0;
    switch (lenBytes) {
      case 1:
        len = b.getByte();
        break;
      case 2:
        len = b.getInt16();
        break;
      case 3:
        len = b.getInt24();
        break;
      case 4:
        len = b.getInt32();
        break;
    }
    return forge2.util.createBuffer(b.getBytes(len));
  };
  var writeVector = function(b, lenBytes, v) {
    b.putInt(v.length(), lenBytes << 3);
    b.putBuffer(v);
  };
  var tls = {};
  tls.Versions = {
    TLS_1_0: {major: 3, minor: 1},
    TLS_1_1: {major: 3, minor: 2},
    TLS_1_2: {major: 3, minor: 3}
  };
  tls.SupportedVersions = [
    tls.Versions.TLS_1_1,
    tls.Versions.TLS_1_0
  ];
  tls.Version = tls.SupportedVersions[0];
  tls.MaxFragment = 16384 - 1024;
  tls.ConnectionEnd = {
    server: 0,
    client: 1
  };
  tls.PRFAlgorithm = {
    tls_prf_sha256: 0
  };
  tls.BulkCipherAlgorithm = {
    none: null,
    rc4: 0,
    des3: 1,
    aes: 2
  };
  tls.CipherType = {
    stream: 0,
    block: 1,
    aead: 2
  };
  tls.MACAlgorithm = {
    none: null,
    hmac_md5: 0,
    hmac_sha1: 1,
    hmac_sha256: 2,
    hmac_sha384: 3,
    hmac_sha512: 4
  };
  tls.CompressionMethod = {
    none: 0,
    deflate: 1
  };
  tls.ContentType = {
    change_cipher_spec: 20,
    alert: 21,
    handshake: 22,
    application_data: 23,
    heartbeat: 24
  };
  tls.HandshakeType = {
    hello_request: 0,
    client_hello: 1,
    server_hello: 2,
    certificate: 11,
    server_key_exchange: 12,
    certificate_request: 13,
    server_hello_done: 14,
    certificate_verify: 15,
    client_key_exchange: 16,
    finished: 20
  };
  tls.Alert = {};
  tls.Alert.Level = {
    warning: 1,
    fatal: 2
  };
  tls.Alert.Description = {
    close_notify: 0,
    unexpected_message: 10,
    bad_record_mac: 20,
    decryption_failed: 21,
    record_overflow: 22,
    decompression_failure: 30,
    handshake_failure: 40,
    bad_certificate: 42,
    unsupported_certificate: 43,
    certificate_revoked: 44,
    certificate_expired: 45,
    certificate_unknown: 46,
    illegal_parameter: 47,
    unknown_ca: 48,
    access_denied: 49,
    decode_error: 50,
    decrypt_error: 51,
    export_restriction: 60,
    protocol_version: 70,
    insufficient_security: 71,
    internal_error: 80,
    user_canceled: 90,
    no_renegotiation: 100
  };
  tls.HeartbeatMessageType = {
    heartbeat_request: 1,
    heartbeat_response: 2
  };
  tls.CipherSuites = {};
  tls.getCipherSuite = function(twoBytes) {
    var rval = null;
    for (var key2 in tls.CipherSuites) {
      var cs = tls.CipherSuites[key2];
      if (cs.id[0] === twoBytes.charCodeAt(0) && cs.id[1] === twoBytes.charCodeAt(1)) {
        rval = cs;
        break;
      }
    }
    return rval;
  };
  tls.handleUnexpected = function(c, record) {
    var ignore = !c.open && c.entity === tls.ConnectionEnd.client;
    if (!ignore) {
      c.error(c, {
        message: "Unexpected message. Received TLS record out of order.",
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.unexpected_message
        }
      });
    }
  };
  tls.handleHelloRequest = function(c, record, length) {
    if (!c.handshaking && c.handshakes > 0) {
      tls.queue(c, tls.createAlert(c, {
        level: tls.Alert.Level.warning,
        description: tls.Alert.Description.no_renegotiation
      }));
      tls.flush(c);
    }
    c.process();
  };
  tls.parseHelloMessage = function(c, record, length) {
    var msg = null;
    var client = c.entity === tls.ConnectionEnd.client;
    if (length < 38) {
      c.error(c, {
        message: client ? "Invalid ServerHello message. Message too short." : "Invalid ClientHello message. Message too short.",
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.illegal_parameter
        }
      });
    } else {
      var b = record.fragment;
      var remaining = b.length();
      msg = {
        version: {
          major: b.getByte(),
          minor: b.getByte()
        },
        random: forge2.util.createBuffer(b.getBytes(32)),
        session_id: readVector(b, 1),
        extensions: []
      };
      if (client) {
        msg.cipher_suite = b.getBytes(2);
        msg.compression_method = b.getByte();
      } else {
        msg.cipher_suites = readVector(b, 2);
        msg.compression_methods = readVector(b, 1);
      }
      remaining = length - (remaining - b.length());
      if (remaining > 0) {
        var exts = readVector(b, 2);
        while (exts.length() > 0) {
          msg.extensions.push({
            type: [exts.getByte(), exts.getByte()],
            data: readVector(exts, 2)
          });
        }
        if (!client) {
          for (var i = 0; i < msg.extensions.length; ++i) {
            var ext = msg.extensions[i];
            if (ext.type[0] === 0 && ext.type[1] === 0) {
              var snl = readVector(ext.data, 2);
              while (snl.length() > 0) {
                var snType = snl.getByte();
                if (snType !== 0) {
                  break;
                }
                c.session.extensions.server_name.serverNameList.push(readVector(snl, 2).getBytes());
              }
            }
          }
        }
      }
      if (c.session.version) {
        if (msg.version.major !== c.session.version.major || msg.version.minor !== c.session.version.minor) {
          return c.error(c, {
            message: "TLS version change is disallowed during renegotiation.",
            send: true,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.protocol_version
            }
          });
        }
      }
      if (client) {
        c.session.cipherSuite = tls.getCipherSuite(msg.cipher_suite);
      } else {
        var tmp = forge2.util.createBuffer(msg.cipher_suites.bytes());
        while (tmp.length() > 0) {
          c.session.cipherSuite = tls.getCipherSuite(tmp.getBytes(2));
          if (c.session.cipherSuite !== null) {
            break;
          }
        }
      }
      if (c.session.cipherSuite === null) {
        return c.error(c, {
          message: "No cipher suites in common.",
          send: true,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.handshake_failure
          },
          cipherSuite: forge2.util.bytesToHex(msg.cipher_suite)
        });
      }
      if (client) {
        c.session.compressionMethod = msg.compression_method;
      } else {
        c.session.compressionMethod = tls.CompressionMethod.none;
      }
    }
    return msg;
  };
  tls.createSecurityParameters = function(c, msg) {
    var client = c.entity === tls.ConnectionEnd.client;
    var msgRandom = msg.random.bytes();
    var cRandom = client ? c.session.sp.client_random : msgRandom;
    var sRandom = client ? msgRandom : tls.createRandom().getBytes();
    c.session.sp = {
      entity: c.entity,
      prf_algorithm: tls.PRFAlgorithm.tls_prf_sha256,
      bulk_cipher_algorithm: null,
      cipher_type: null,
      enc_key_length: null,
      block_length: null,
      fixed_iv_length: null,
      record_iv_length: null,
      mac_algorithm: null,
      mac_length: null,
      mac_key_length: null,
      compression_algorithm: c.session.compressionMethod,
      pre_master_secret: null,
      master_secret: null,
      client_random: cRandom,
      server_random: sRandom
    };
  };
  tls.handleServerHello = function(c, record, length) {
    var msg = tls.parseHelloMessage(c, record, length);
    if (c.fail) {
      return;
    }
    if (msg.version.minor <= c.version.minor) {
      c.version.minor = msg.version.minor;
    } else {
      return c.error(c, {
        message: "Incompatible TLS version.",
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.protocol_version
        }
      });
    }
    c.session.version = c.version;
    var sessionId = msg.session_id.bytes();
    if (sessionId.length > 0 && sessionId === c.session.id) {
      c.expect = SCC;
      c.session.resuming = true;
      c.session.sp.server_random = msg.random.bytes();
    } else {
      c.expect = SCE;
      c.session.resuming = false;
      tls.createSecurityParameters(c, msg);
    }
    c.session.id = sessionId;
    c.process();
  };
  tls.handleClientHello = function(c, record, length) {
    var msg = tls.parseHelloMessage(c, record, length);
    if (c.fail) {
      return;
    }
    var sessionId = msg.session_id.bytes();
    var session = null;
    if (c.sessionCache) {
      session = c.sessionCache.getSession(sessionId);
      if (session === null) {
        sessionId = "";
      } else if (session.version.major !== msg.version.major || session.version.minor > msg.version.minor) {
        session = null;
        sessionId = "";
      }
    }
    if (sessionId.length === 0) {
      sessionId = forge2.random.getBytes(32);
    }
    c.session.id = sessionId;
    c.session.clientHelloVersion = msg.version;
    c.session.sp = {};
    if (session) {
      c.version = c.session.version = session.version;
      c.session.sp = session.sp;
    } else {
      var version;
      for (var i = 1; i < tls.SupportedVersions.length; ++i) {
        version = tls.SupportedVersions[i];
        if (version.minor <= msg.version.minor) {
          break;
        }
      }
      c.version = {major: version.major, minor: version.minor};
      c.session.version = c.version;
    }
    if (session !== null) {
      c.expect = CCC;
      c.session.resuming = true;
      c.session.sp.client_random = msg.random.bytes();
    } else {
      c.expect = c.verifyClient !== false ? CCE : CKE;
      c.session.resuming = false;
      tls.createSecurityParameters(c, msg);
    }
    c.open = true;
    tls.queue(c, tls.createRecord(c, {
      type: tls.ContentType.handshake,
      data: tls.createServerHello(c)
    }));
    if (c.session.resuming) {
      tls.queue(c, tls.createRecord(c, {
        type: tls.ContentType.change_cipher_spec,
        data: tls.createChangeCipherSpec()
      }));
      c.state.pending = tls.createConnectionState(c);
      c.state.current.write = c.state.pending.write;
      tls.queue(c, tls.createRecord(c, {
        type: tls.ContentType.handshake,
        data: tls.createFinished(c)
      }));
    } else {
      tls.queue(c, tls.createRecord(c, {
        type: tls.ContentType.handshake,
        data: tls.createCertificate(c)
      }));
      if (!c.fail) {
        tls.queue(c, tls.createRecord(c, {
          type: tls.ContentType.handshake,
          data: tls.createServerKeyExchange(c)
        }));
        if (c.verifyClient !== false) {
          tls.queue(c, tls.createRecord(c, {
            type: tls.ContentType.handshake,
            data: tls.createCertificateRequest(c)
          }));
        }
        tls.queue(c, tls.createRecord(c, {
          type: tls.ContentType.handshake,
          data: tls.createServerHelloDone(c)
        }));
      }
    }
    tls.flush(c);
    c.process();
  };
  tls.handleCertificate = function(c, record, length) {
    if (length < 3) {
      return c.error(c, {
        message: "Invalid Certificate message. Message too short.",
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.illegal_parameter
        }
      });
    }
    var b = record.fragment;
    var msg = {
      certificate_list: readVector(b, 3)
    };
    var cert, asn1;
    var certs = [];
    try {
      while (msg.certificate_list.length() > 0) {
        cert = readVector(msg.certificate_list, 3);
        asn1 = forge2.asn1.fromDer(cert);
        cert = forge2.pki.certificateFromAsn1(asn1, true);
        certs.push(cert);
      }
    } catch (ex) {
      return c.error(c, {
        message: "Could not parse certificate list.",
        cause: ex,
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.bad_certificate
        }
      });
    }
    var client = c.entity === tls.ConnectionEnd.client;
    if ((client || c.verifyClient === true) && certs.length === 0) {
      c.error(c, {
        message: client ? "No server certificate provided." : "No client certificate provided.",
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.illegal_parameter
        }
      });
    } else if (certs.length === 0) {
      c.expect = client ? SKE : CKE;
    } else {
      if (client) {
        c.session.serverCertificate = certs[0];
      } else {
        c.session.clientCertificate = certs[0];
      }
      if (tls.verifyCertificateChain(c, certs)) {
        c.expect = client ? SKE : CKE;
      }
    }
    c.process();
  };
  tls.handleServerKeyExchange = function(c, record, length) {
    if (length > 0) {
      return c.error(c, {
        message: "Invalid key parameters. Only RSA is supported.",
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.unsupported_certificate
        }
      });
    }
    c.expect = SCR;
    c.process();
  };
  tls.handleClientKeyExchange = function(c, record, length) {
    if (length < 48) {
      return c.error(c, {
        message: "Invalid key parameters. Only RSA is supported.",
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.unsupported_certificate
        }
      });
    }
    var b = record.fragment;
    var msg = {
      enc_pre_master_secret: readVector(b, 2).getBytes()
    };
    var privateKey = null;
    if (c.getPrivateKey) {
      try {
        privateKey = c.getPrivateKey(c, c.session.serverCertificate);
        privateKey = forge2.pki.privateKeyFromPem(privateKey);
      } catch (ex) {
        c.error(c, {
          message: "Could not get private key.",
          cause: ex,
          send: true,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.internal_error
          }
        });
      }
    }
    if (privateKey === null) {
      return c.error(c, {
        message: "No private key set.",
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.internal_error
        }
      });
    }
    try {
      var sp = c.session.sp;
      sp.pre_master_secret = privateKey.decrypt(msg.enc_pre_master_secret);
      var version = c.session.clientHelloVersion;
      if (version.major !== sp.pre_master_secret.charCodeAt(0) || version.minor !== sp.pre_master_secret.charCodeAt(1)) {
        throw new Error("TLS version rollback attack detected.");
      }
    } catch (ex) {
      sp.pre_master_secret = forge2.random.getBytes(48);
    }
    c.expect = CCC;
    if (c.session.clientCertificate !== null) {
      c.expect = CCV;
    }
    c.process();
  };
  tls.handleCertificateRequest = function(c, record, length) {
    if (length < 3) {
      return c.error(c, {
        message: "Invalid CertificateRequest. Message too short.",
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.illegal_parameter
        }
      });
    }
    var b = record.fragment;
    var msg = {
      certificate_types: readVector(b, 1),
      certificate_authorities: readVector(b, 2)
    };
    c.session.certificateRequest = msg;
    c.expect = SHD;
    c.process();
  };
  tls.handleCertificateVerify = function(c, record, length) {
    if (length < 2) {
      return c.error(c, {
        message: "Invalid CertificateVerify. Message too short.",
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.illegal_parameter
        }
      });
    }
    var b = record.fragment;
    b.read -= 4;
    var msgBytes = b.bytes();
    b.read += 4;
    var msg = {
      signature: readVector(b, 2).getBytes()
    };
    var verify = forge2.util.createBuffer();
    verify.putBuffer(c.session.md5.digest());
    verify.putBuffer(c.session.sha1.digest());
    verify = verify.getBytes();
    try {
      var cert = c.session.clientCertificate;
      if (!cert.publicKey.verify(verify, msg.signature, "NONE")) {
        throw new Error("CertificateVerify signature does not match.");
      }
      c.session.md5.update(msgBytes);
      c.session.sha1.update(msgBytes);
    } catch (ex) {
      return c.error(c, {
        message: "Bad signature in CertificateVerify.",
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.handshake_failure
        }
      });
    }
    c.expect = CCC;
    c.process();
  };
  tls.handleServerHelloDone = function(c, record, length) {
    if (length > 0) {
      return c.error(c, {
        message: "Invalid ServerHelloDone message. Invalid length.",
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.record_overflow
        }
      });
    }
    if (c.serverCertificate === null) {
      var error = {
        message: "No server certificate provided. Not enough security.",
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.insufficient_security
        }
      };
      var depth = 0;
      var ret = c.verify(c, error.alert.description, depth, []);
      if (ret !== true) {
        if (ret || ret === 0) {
          if (typeof ret === "object" && !forge2.util.isArray(ret)) {
            if (ret.message) {
              error.message = ret.message;
            }
            if (ret.alert) {
              error.alert.description = ret.alert;
            }
          } else if (typeof ret === "number") {
            error.alert.description = ret;
          }
        }
        return c.error(c, error);
      }
    }
    if (c.session.certificateRequest !== null) {
      record = tls.createRecord(c, {
        type: tls.ContentType.handshake,
        data: tls.createCertificate(c)
      });
      tls.queue(c, record);
    }
    record = tls.createRecord(c, {
      type: tls.ContentType.handshake,
      data: tls.createClientKeyExchange(c)
    });
    tls.queue(c, record);
    c.expect = SER;
    var callback = function(c2, signature) {
      if (c2.session.certificateRequest !== null && c2.session.clientCertificate !== null) {
        tls.queue(c2, tls.createRecord(c2, {
          type: tls.ContentType.handshake,
          data: tls.createCertificateVerify(c2, signature)
        }));
      }
      tls.queue(c2, tls.createRecord(c2, {
        type: tls.ContentType.change_cipher_spec,
        data: tls.createChangeCipherSpec()
      }));
      c2.state.pending = tls.createConnectionState(c2);
      c2.state.current.write = c2.state.pending.write;
      tls.queue(c2, tls.createRecord(c2, {
        type: tls.ContentType.handshake,
        data: tls.createFinished(c2)
      }));
      c2.expect = SCC;
      tls.flush(c2);
      c2.process();
    };
    if (c.session.certificateRequest === null || c.session.clientCertificate === null) {
      return callback(c, null);
    }
    tls.getClientSignature(c, callback);
  };
  tls.handleChangeCipherSpec = function(c, record) {
    if (record.fragment.getByte() !== 1) {
      return c.error(c, {
        message: "Invalid ChangeCipherSpec message received.",
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.illegal_parameter
        }
      });
    }
    var client = c.entity === tls.ConnectionEnd.client;
    if (c.session.resuming && client || !c.session.resuming && !client) {
      c.state.pending = tls.createConnectionState(c);
    }
    c.state.current.read = c.state.pending.read;
    if (!c.session.resuming && client || c.session.resuming && !client) {
      c.state.pending = null;
    }
    c.expect = client ? SFI : CFI;
    c.process();
  };
  tls.handleFinished = function(c, record, length) {
    var b = record.fragment;
    b.read -= 4;
    var msgBytes = b.bytes();
    b.read += 4;
    var vd = record.fragment.getBytes();
    b = forge2.util.createBuffer();
    b.putBuffer(c.session.md5.digest());
    b.putBuffer(c.session.sha1.digest());
    var client = c.entity === tls.ConnectionEnd.client;
    var label = client ? "server finished" : "client finished";
    var sp = c.session.sp;
    var vdl = 12;
    var prf = prf_TLS1;
    b = prf(sp.master_secret, label, b.getBytes(), vdl);
    if (b.getBytes() !== vd) {
      return c.error(c, {
        message: "Invalid verify_data in Finished message.",
        send: true,
        alert: {
          level: tls.Alert.Level.fatal,
          description: tls.Alert.Description.decrypt_error
        }
      });
    }
    c.session.md5.update(msgBytes);
    c.session.sha1.update(msgBytes);
    if (c.session.resuming && client || !c.session.resuming && !client) {
      tls.queue(c, tls.createRecord(c, {
        type: tls.ContentType.change_cipher_spec,
        data: tls.createChangeCipherSpec()
      }));
      c.state.current.write = c.state.pending.write;
      c.state.pending = null;
      tls.queue(c, tls.createRecord(c, {
        type: tls.ContentType.handshake,
        data: tls.createFinished(c)
      }));
    }
    c.expect = client ? SAD : CAD;
    c.handshaking = false;
    ++c.handshakes;
    c.peerCertificate = client ? c.session.serverCertificate : c.session.clientCertificate;
    tls.flush(c);
    c.isConnected = true;
    c.connected(c);
    c.process();
  };
  tls.handleAlert = function(c, record) {
    var b = record.fragment;
    var alert = {
      level: b.getByte(),
      description: b.getByte()
    };
    var msg;
    switch (alert.description) {
      case tls.Alert.Description.close_notify:
        msg = "Connection closed.";
        break;
      case tls.Alert.Description.unexpected_message:
        msg = "Unexpected message.";
        break;
      case tls.Alert.Description.bad_record_mac:
        msg = "Bad record MAC.";
        break;
      case tls.Alert.Description.decryption_failed:
        msg = "Decryption failed.";
        break;
      case tls.Alert.Description.record_overflow:
        msg = "Record overflow.";
        break;
      case tls.Alert.Description.decompression_failure:
        msg = "Decompression failed.";
        break;
      case tls.Alert.Description.handshake_failure:
        msg = "Handshake failure.";
        break;
      case tls.Alert.Description.bad_certificate:
        msg = "Bad certificate.";
        break;
      case tls.Alert.Description.unsupported_certificate:
        msg = "Unsupported certificate.";
        break;
      case tls.Alert.Description.certificate_revoked:
        msg = "Certificate revoked.";
        break;
      case tls.Alert.Description.certificate_expired:
        msg = "Certificate expired.";
        break;
      case tls.Alert.Description.certificate_unknown:
        msg = "Certificate unknown.";
        break;
      case tls.Alert.Description.illegal_parameter:
        msg = "Illegal parameter.";
        break;
      case tls.Alert.Description.unknown_ca:
        msg = "Unknown certificate authority.";
        break;
      case tls.Alert.Description.access_denied:
        msg = "Access denied.";
        break;
      case tls.Alert.Description.decode_error:
        msg = "Decode error.";
        break;
      case tls.Alert.Description.decrypt_error:
        msg = "Decrypt error.";
        break;
      case tls.Alert.Description.export_restriction:
        msg = "Export restriction.";
        break;
      case tls.Alert.Description.protocol_version:
        msg = "Unsupported protocol version.";
        break;
      case tls.Alert.Description.insufficient_security:
        msg = "Insufficient security.";
        break;
      case tls.Alert.Description.internal_error:
        msg = "Internal error.";
        break;
      case tls.Alert.Description.user_canceled:
        msg = "User canceled.";
        break;
      case tls.Alert.Description.no_renegotiation:
        msg = "Renegotiation not supported.";
        break;
      default:
        msg = "Unknown error.";
        break;
    }
    if (alert.description === tls.Alert.Description.close_notify) {
      return c.close();
    }
    c.error(c, {
      message: msg,
      send: false,
      origin: c.entity === tls.ConnectionEnd.client ? "server" : "client",
      alert
    });
    c.process();
  };
  tls.handleHandshake = function(c, record) {
    var b = record.fragment;
    var type = b.getByte();
    var length = b.getInt24();
    if (length > b.length()) {
      c.fragmented = record;
      record.fragment = forge2.util.createBuffer();
      b.read -= 4;
      return c.process();
    }
    c.fragmented = null;
    b.read -= 4;
    var bytes = b.bytes(length + 4);
    b.read += 4;
    if (type in hsTable[c.entity][c.expect]) {
      if (c.entity === tls.ConnectionEnd.server && !c.open && !c.fail) {
        c.handshaking = true;
        c.session = {
          version: null,
          extensions: {
            server_name: {
              serverNameList: []
            }
          },
          cipherSuite: null,
          compressionMethod: null,
          serverCertificate: null,
          clientCertificate: null,
          md5: forge2.md.md5.create(),
          sha1: forge2.md.sha1.create()
        };
      }
      if (type !== tls.HandshakeType.hello_request && type !== tls.HandshakeType.certificate_verify && type !== tls.HandshakeType.finished) {
        c.session.md5.update(bytes);
        c.session.sha1.update(bytes);
      }
      hsTable[c.entity][c.expect][type](c, record, length);
    } else {
      tls.handleUnexpected(c, record);
    }
  };
  tls.handleApplicationData = function(c, record) {
    c.data.putBuffer(record.fragment);
    c.dataReady(c);
    c.process();
  };
  tls.handleHeartbeat = function(c, record) {
    var b = record.fragment;
    var type = b.getByte();
    var length = b.getInt16();
    var payload = b.getBytes(length);
    if (type === tls.HeartbeatMessageType.heartbeat_request) {
      if (c.handshaking || length > payload.length) {
        return c.process();
      }
      tls.queue(c, tls.createRecord(c, {
        type: tls.ContentType.heartbeat,
        data: tls.createHeartbeat(tls.HeartbeatMessageType.heartbeat_response, payload)
      }));
      tls.flush(c);
    } else if (type === tls.HeartbeatMessageType.heartbeat_response) {
      if (payload !== c.expectedHeartbeatPayload) {
        return c.process();
      }
      if (c.heartbeatReceived) {
        c.heartbeatReceived(c, forge2.util.createBuffer(payload));
      }
    }
    c.process();
  };
  var SHE = 0;
  var SCE = 1;
  var SKE = 2;
  var SCR = 3;
  var SHD = 4;
  var SCC = 5;
  var SFI = 6;
  var SAD = 7;
  var SER = 8;
  var CHE = 0;
  var CCE = 1;
  var CKE = 2;
  var CCV = 3;
  var CCC = 4;
  var CFI = 5;
  var CAD = 6;
  var __ = tls.handleUnexpected;
  var R0 = tls.handleChangeCipherSpec;
  var R1 = tls.handleAlert;
  var R2 = tls.handleHandshake;
  var R3 = tls.handleApplicationData;
  var R4 = tls.handleHeartbeat;
  var ctTable = [];
  ctTable[tls.ConnectionEnd.client] = [
    [__, R1, R2, __, R4],
    [__, R1, R2, __, R4],
    [__, R1, R2, __, R4],
    [__, R1, R2, __, R4],
    [__, R1, R2, __, R4],
    [R0, R1, __, __, R4],
    [__, R1, R2, __, R4],
    [__, R1, R2, R3, R4],
    [__, R1, R2, __, R4]
  ];
  ctTable[tls.ConnectionEnd.server] = [
    [__, R1, R2, __, R4],
    [__, R1, R2, __, R4],
    [__, R1, R2, __, R4],
    [__, R1, R2, __, R4],
    [R0, R1, __, __, R4],
    [__, R1, R2, __, R4],
    [__, R1, R2, R3, R4],
    [__, R1, R2, __, R4]
  ];
  var H0 = tls.handleHelloRequest;
  var H1 = tls.handleServerHello;
  var H2 = tls.handleCertificate;
  var H3 = tls.handleServerKeyExchange;
  var H4 = tls.handleCertificateRequest;
  var H5 = tls.handleServerHelloDone;
  var H6 = tls.handleFinished;
  var hsTable = [];
  hsTable[tls.ConnectionEnd.client] = [
    [__, __, H1, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
    [H0, __, __, __, __, __, __, __, __, __, __, H2, H3, H4, H5, __, __, __, __, __, __],
    [H0, __, __, __, __, __, __, __, __, __, __, __, H3, H4, H5, __, __, __, __, __, __],
    [H0, __, __, __, __, __, __, __, __, __, __, __, __, H4, H5, __, __, __, __, __, __],
    [H0, __, __, __, __, __, __, __, __, __, __, __, __, __, H5, __, __, __, __, __, __],
    [H0, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
    [H0, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, H6],
    [H0, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
    [H0, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __]
  ];
  var H7 = tls.handleClientHello;
  var H8 = tls.handleClientKeyExchange;
  var H9 = tls.handleCertificateVerify;
  hsTable[tls.ConnectionEnd.server] = [
    [__, H7, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
    [__, __, __, __, __, __, __, __, __, __, __, H2, __, __, __, __, __, __, __, __, __],
    [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, H8, __, __, __, __],
    [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, H9, __, __, __, __, __],
    [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
    [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, H6],
    [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
    [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __]
  ];
  tls.generateKeys = function(c, sp) {
    var prf = prf_TLS1;
    var random = sp.client_random + sp.server_random;
    if (!c.session.resuming) {
      sp.master_secret = prf(sp.pre_master_secret, "master secret", random, 48).bytes();
      sp.pre_master_secret = null;
    }
    random = sp.server_random + sp.client_random;
    var length = 2 * sp.mac_key_length + 2 * sp.enc_key_length;
    var tls10 = c.version.major === tls.Versions.TLS_1_0.major && c.version.minor === tls.Versions.TLS_1_0.minor;
    if (tls10) {
      length += 2 * sp.fixed_iv_length;
    }
    var km = prf(sp.master_secret, "key expansion", random, length);
    var rval = {
      client_write_MAC_key: km.getBytes(sp.mac_key_length),
      server_write_MAC_key: km.getBytes(sp.mac_key_length),
      client_write_key: km.getBytes(sp.enc_key_length),
      server_write_key: km.getBytes(sp.enc_key_length)
    };
    if (tls10) {
      rval.client_write_IV = km.getBytes(sp.fixed_iv_length);
      rval.server_write_IV = km.getBytes(sp.fixed_iv_length);
    }
    return rval;
  };
  tls.createConnectionState = function(c) {
    var client = c.entity === tls.ConnectionEnd.client;
    var createMode = function() {
      var mode = {
        sequenceNumber: [0, 0],
        macKey: null,
        macLength: 0,
        macFunction: null,
        cipherState: null,
        cipherFunction: function(record) {
          return true;
        },
        compressionState: null,
        compressFunction: function(record) {
          return true;
        },
        updateSequenceNumber: function() {
          if (mode.sequenceNumber[1] === 4294967295) {
            mode.sequenceNumber[1] = 0;
            ++mode.sequenceNumber[0];
          } else {
            ++mode.sequenceNumber[1];
          }
        }
      };
      return mode;
    };
    var state = {
      read: createMode(),
      write: createMode()
    };
    state.read.update = function(c2, record) {
      if (!state.read.cipherFunction(record, state.read)) {
        c2.error(c2, {
          message: "Could not decrypt record or bad MAC.",
          send: true,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.bad_record_mac
          }
        });
      } else if (!state.read.compressFunction(c2, record, state.read)) {
        c2.error(c2, {
          message: "Could not decompress record.",
          send: true,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.decompression_failure
          }
        });
      }
      return !c2.fail;
    };
    state.write.update = function(c2, record) {
      if (!state.write.compressFunction(c2, record, state.write)) {
        c2.error(c2, {
          message: "Could not compress record.",
          send: false,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.internal_error
          }
        });
      } else if (!state.write.cipherFunction(record, state.write)) {
        c2.error(c2, {
          message: "Could not encrypt record.",
          send: false,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.internal_error
          }
        });
      }
      return !c2.fail;
    };
    if (c.session) {
      var sp = c.session.sp;
      c.session.cipherSuite.initSecurityParameters(sp);
      sp.keys = tls.generateKeys(c, sp);
      state.read.macKey = client ? sp.keys.server_write_MAC_key : sp.keys.client_write_MAC_key;
      state.write.macKey = client ? sp.keys.client_write_MAC_key : sp.keys.server_write_MAC_key;
      c.session.cipherSuite.initConnectionState(state, c, sp);
      switch (sp.compression_algorithm) {
        case tls.CompressionMethod.none:
          break;
        case tls.CompressionMethod.deflate:
          state.read.compressFunction = inflate;
          state.write.compressFunction = deflate;
          break;
        default:
          throw new Error("Unsupported compression algorithm.");
      }
    }
    return state;
  };
  tls.createRandom = function() {
    var d = new Date();
    var utc = +d + d.getTimezoneOffset() * 6e4;
    var rval = forge2.util.createBuffer();
    rval.putInt32(utc);
    rval.putBytes(forge2.random.getBytes(28));
    return rval;
  };
  tls.createRecord = function(c, options) {
    if (!options.data) {
      return null;
    }
    var record = {
      type: options.type,
      version: {
        major: c.version.major,
        minor: c.version.minor
      },
      length: options.data.length(),
      fragment: options.data
    };
    return record;
  };
  tls.createAlert = function(c, alert) {
    var b = forge2.util.createBuffer();
    b.putByte(alert.level);
    b.putByte(alert.description);
    return tls.createRecord(c, {
      type: tls.ContentType.alert,
      data: b
    });
  };
  tls.createClientHello = function(c) {
    c.session.clientHelloVersion = {
      major: c.version.major,
      minor: c.version.minor
    };
    var cipherSuites = forge2.util.createBuffer();
    for (var i = 0; i < c.cipherSuites.length; ++i) {
      var cs = c.cipherSuites[i];
      cipherSuites.putByte(cs.id[0]);
      cipherSuites.putByte(cs.id[1]);
    }
    var cSuites = cipherSuites.length();
    var compressionMethods = forge2.util.createBuffer();
    compressionMethods.putByte(tls.CompressionMethod.none);
    var cMethods = compressionMethods.length();
    var extensions = forge2.util.createBuffer();
    if (c.virtualHost) {
      var ext = forge2.util.createBuffer();
      ext.putByte(0);
      ext.putByte(0);
      var serverName = forge2.util.createBuffer();
      serverName.putByte(0);
      writeVector(serverName, 2, forge2.util.createBuffer(c.virtualHost));
      var snList = forge2.util.createBuffer();
      writeVector(snList, 2, serverName);
      writeVector(ext, 2, snList);
      extensions.putBuffer(ext);
    }
    var extLength = extensions.length();
    if (extLength > 0) {
      extLength += 2;
    }
    var sessionId = c.session.id;
    var length = sessionId.length + 1 + 2 + 4 + 28 + 2 + cSuites + 1 + cMethods + extLength;
    var rval = forge2.util.createBuffer();
    rval.putByte(tls.HandshakeType.client_hello);
    rval.putInt24(length);
    rval.putByte(c.version.major);
    rval.putByte(c.version.minor);
    rval.putBytes(c.session.sp.client_random);
    writeVector(rval, 1, forge2.util.createBuffer(sessionId));
    writeVector(rval, 2, cipherSuites);
    writeVector(rval, 1, compressionMethods);
    if (extLength > 0) {
      writeVector(rval, 2, extensions);
    }
    return rval;
  };
  tls.createServerHello = function(c) {
    var sessionId = c.session.id;
    var length = sessionId.length + 1 + 2 + 4 + 28 + 2 + 1;
    var rval = forge2.util.createBuffer();
    rval.putByte(tls.HandshakeType.server_hello);
    rval.putInt24(length);
    rval.putByte(c.version.major);
    rval.putByte(c.version.minor);
    rval.putBytes(c.session.sp.server_random);
    writeVector(rval, 1, forge2.util.createBuffer(sessionId));
    rval.putByte(c.session.cipherSuite.id[0]);
    rval.putByte(c.session.cipherSuite.id[1]);
    rval.putByte(c.session.compressionMethod);
    return rval;
  };
  tls.createCertificate = function(c) {
    var client = c.entity === tls.ConnectionEnd.client;
    var cert = null;
    if (c.getCertificate) {
      var hint;
      if (client) {
        hint = c.session.certificateRequest;
      } else {
        hint = c.session.extensions.server_name.serverNameList;
      }
      cert = c.getCertificate(c, hint);
    }
    var certList = forge2.util.createBuffer();
    if (cert !== null) {
      try {
        if (!forge2.util.isArray(cert)) {
          cert = [cert];
        }
        var asn1 = null;
        for (var i = 0; i < cert.length; ++i) {
          var msg = forge2.pem.decode(cert[i])[0];
          if (msg.type !== "CERTIFICATE" && msg.type !== "X509 CERTIFICATE" && msg.type !== "TRUSTED CERTIFICATE") {
            var error = new Error('Could not convert certificate from PEM; PEM header type is not "CERTIFICATE", "X509 CERTIFICATE", or "TRUSTED CERTIFICATE".');
            error.headerType = msg.type;
            throw error;
          }
          if (msg.procType && msg.procType.type === "ENCRYPTED") {
            throw new Error("Could not convert certificate from PEM; PEM is encrypted.");
          }
          var der = forge2.util.createBuffer(msg.body);
          if (asn1 === null) {
            asn1 = forge2.asn1.fromDer(der.bytes(), false);
          }
          var certBuffer = forge2.util.createBuffer();
          writeVector(certBuffer, 3, der);
          certList.putBuffer(certBuffer);
        }
        cert = forge2.pki.certificateFromAsn1(asn1);
        if (client) {
          c.session.clientCertificate = cert;
        } else {
          c.session.serverCertificate = cert;
        }
      } catch (ex) {
        return c.error(c, {
          message: "Could not send certificate list.",
          cause: ex,
          send: true,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.bad_certificate
          }
        });
      }
    }
    var length = 3 + certList.length();
    var rval = forge2.util.createBuffer();
    rval.putByte(tls.HandshakeType.certificate);
    rval.putInt24(length);
    writeVector(rval, 3, certList);
    return rval;
  };
  tls.createClientKeyExchange = function(c) {
    var b = forge2.util.createBuffer();
    b.putByte(c.session.clientHelloVersion.major);
    b.putByte(c.session.clientHelloVersion.minor);
    b.putBytes(forge2.random.getBytes(46));
    var sp = c.session.sp;
    sp.pre_master_secret = b.getBytes();
    var key2 = c.session.serverCertificate.publicKey;
    b = key2.encrypt(sp.pre_master_secret);
    var length = b.length + 2;
    var rval = forge2.util.createBuffer();
    rval.putByte(tls.HandshakeType.client_key_exchange);
    rval.putInt24(length);
    rval.putInt16(b.length);
    rval.putBytes(b);
    return rval;
  };
  tls.createServerKeyExchange = function(c) {
    var length = 0;
    var rval = forge2.util.createBuffer();
    if (length > 0) {
      rval.putByte(tls.HandshakeType.server_key_exchange);
      rval.putInt24(length);
    }
    return rval;
  };
  tls.getClientSignature = function(c, callback) {
    var b = forge2.util.createBuffer();
    b.putBuffer(c.session.md5.digest());
    b.putBuffer(c.session.sha1.digest());
    b = b.getBytes();
    c.getSignature = c.getSignature || function(c2, b2, callback2) {
      var privateKey = null;
      if (c2.getPrivateKey) {
        try {
          privateKey = c2.getPrivateKey(c2, c2.session.clientCertificate);
          privateKey = forge2.pki.privateKeyFromPem(privateKey);
        } catch (ex) {
          c2.error(c2, {
            message: "Could not get private key.",
            cause: ex,
            send: true,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.internal_error
            }
          });
        }
      }
      if (privateKey === null) {
        c2.error(c2, {
          message: "No private key set.",
          send: true,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.internal_error
          }
        });
      } else {
        b2 = privateKey.sign(b2, null);
      }
      callback2(c2, b2);
    };
    c.getSignature(c, b, callback);
  };
  tls.createCertificateVerify = function(c, signature) {
    var length = signature.length + 2;
    var rval = forge2.util.createBuffer();
    rval.putByte(tls.HandshakeType.certificate_verify);
    rval.putInt24(length);
    rval.putInt16(signature.length);
    rval.putBytes(signature);
    return rval;
  };
  tls.createCertificateRequest = function(c) {
    var certTypes = forge2.util.createBuffer();
    certTypes.putByte(1);
    var cAs = forge2.util.createBuffer();
    for (var key2 in c.caStore.certs) {
      var cert = c.caStore.certs[key2];
      var dn = forge2.pki.distinguishedNameToAsn1(cert.subject);
      var byteBuffer = forge2.asn1.toDer(dn);
      cAs.putInt16(byteBuffer.length());
      cAs.putBuffer(byteBuffer);
    }
    var length = 1 + certTypes.length() + 2 + cAs.length();
    var rval = forge2.util.createBuffer();
    rval.putByte(tls.HandshakeType.certificate_request);
    rval.putInt24(length);
    writeVector(rval, 1, certTypes);
    writeVector(rval, 2, cAs);
    return rval;
  };
  tls.createServerHelloDone = function(c) {
    var rval = forge2.util.createBuffer();
    rval.putByte(tls.HandshakeType.server_hello_done);
    rval.putInt24(0);
    return rval;
  };
  tls.createChangeCipherSpec = function() {
    var rval = forge2.util.createBuffer();
    rval.putByte(1);
    return rval;
  };
  tls.createFinished = function(c) {
    var b = forge2.util.createBuffer();
    b.putBuffer(c.session.md5.digest());
    b.putBuffer(c.session.sha1.digest());
    var client = c.entity === tls.ConnectionEnd.client;
    var sp = c.session.sp;
    var vdl = 12;
    var prf = prf_TLS1;
    var label = client ? "client finished" : "server finished";
    b = prf(sp.master_secret, label, b.getBytes(), vdl);
    var rval = forge2.util.createBuffer();
    rval.putByte(tls.HandshakeType.finished);
    rval.putInt24(b.length());
    rval.putBuffer(b);
    return rval;
  };
  tls.createHeartbeat = function(type, payload, payloadLength) {
    if (typeof payloadLength === "undefined") {
      payloadLength = payload.length;
    }
    var rval = forge2.util.createBuffer();
    rval.putByte(type);
    rval.putInt16(payloadLength);
    rval.putBytes(payload);
    var plaintextLength = rval.length();
    var paddingLength = Math.max(16, plaintextLength - payloadLength - 3);
    rval.putBytes(forge2.random.getBytes(paddingLength));
    return rval;
  };
  tls.queue = function(c, record) {
    if (!record) {
      return;
    }
    if (record.fragment.length() === 0) {
      if (record.type === tls.ContentType.handshake || record.type === tls.ContentType.alert || record.type === tls.ContentType.change_cipher_spec) {
        return;
      }
    }
    if (record.type === tls.ContentType.handshake) {
      var bytes = record.fragment.bytes();
      c.session.md5.update(bytes);
      c.session.sha1.update(bytes);
      bytes = null;
    }
    var records;
    if (record.fragment.length() <= tls.MaxFragment) {
      records = [record];
    } else {
      records = [];
      var data = record.fragment.bytes();
      while (data.length > tls.MaxFragment) {
        records.push(tls.createRecord(c, {
          type: record.type,
          data: forge2.util.createBuffer(data.slice(0, tls.MaxFragment))
        }));
        data = data.slice(tls.MaxFragment);
      }
      if (data.length > 0) {
        records.push(tls.createRecord(c, {
          type: record.type,
          data: forge2.util.createBuffer(data)
        }));
      }
    }
    for (var i = 0; i < records.length && !c.fail; ++i) {
      var rec = records[i];
      var s = c.state.current.write;
      if (s.update(c, rec)) {
        c.records.push(rec);
      }
    }
  };
  tls.flush = function(c) {
    for (var i = 0; i < c.records.length; ++i) {
      var record = c.records[i];
      c.tlsData.putByte(record.type);
      c.tlsData.putByte(record.version.major);
      c.tlsData.putByte(record.version.minor);
      c.tlsData.putInt16(record.fragment.length());
      c.tlsData.putBuffer(c.records[i].fragment);
    }
    c.records = [];
    return c.tlsDataReady(c);
  };
  var _certErrorToAlertDesc = function(error) {
    switch (error) {
      case true:
        return true;
      case forge2.pki.certificateError.bad_certificate:
        return tls.Alert.Description.bad_certificate;
      case forge2.pki.certificateError.unsupported_certificate:
        return tls.Alert.Description.unsupported_certificate;
      case forge2.pki.certificateError.certificate_revoked:
        return tls.Alert.Description.certificate_revoked;
      case forge2.pki.certificateError.certificate_expired:
        return tls.Alert.Description.certificate_expired;
      case forge2.pki.certificateError.certificate_unknown:
        return tls.Alert.Description.certificate_unknown;
      case forge2.pki.certificateError.unknown_ca:
        return tls.Alert.Description.unknown_ca;
      default:
        return tls.Alert.Description.bad_certificate;
    }
  };
  var _alertDescToCertError = function(desc) {
    switch (desc) {
      case true:
        return true;
      case tls.Alert.Description.bad_certificate:
        return forge2.pki.certificateError.bad_certificate;
      case tls.Alert.Description.unsupported_certificate:
        return forge2.pki.certificateError.unsupported_certificate;
      case tls.Alert.Description.certificate_revoked:
        return forge2.pki.certificateError.certificate_revoked;
      case tls.Alert.Description.certificate_expired:
        return forge2.pki.certificateError.certificate_expired;
      case tls.Alert.Description.certificate_unknown:
        return forge2.pki.certificateError.certificate_unknown;
      case tls.Alert.Description.unknown_ca:
        return forge2.pki.certificateError.unknown_ca;
      default:
        return forge2.pki.certificateError.bad_certificate;
    }
  };
  tls.verifyCertificateChain = function(c, chain) {
    try {
      var options = {};
      for (var key2 in c.verifyOptions) {
        options[key2] = c.verifyOptions[key2];
      }
      options.verify = function(vfd, depth, chain2) {
        var desc = _certErrorToAlertDesc(vfd);
        var ret = c.verify(c, vfd, depth, chain2);
        if (ret !== true) {
          if (typeof ret === "object" && !forge2.util.isArray(ret)) {
            var error = new Error("The application rejected the certificate.");
            error.send = true;
            error.alert = {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.bad_certificate
            };
            if (ret.message) {
              error.message = ret.message;
            }
            if (ret.alert) {
              error.alert.description = ret.alert;
            }
            throw error;
          }
          if (ret !== vfd) {
            ret = _alertDescToCertError(ret);
          }
        }
        return ret;
      };
      forge2.pki.verifyCertificateChain(c.caStore, chain, options);
    } catch (ex) {
      var err = ex;
      if (typeof err !== "object" || forge2.util.isArray(err)) {
        err = {
          send: true,
          alert: {
            level: tls.Alert.Level.fatal,
            description: _certErrorToAlertDesc(ex)
          }
        };
      }
      if (!("send" in err)) {
        err.send = true;
      }
      if (!("alert" in err)) {
        err.alert = {
          level: tls.Alert.Level.fatal,
          description: _certErrorToAlertDesc(err.error)
        };
      }
      c.error(c, err);
    }
    return !c.fail;
  };
  tls.createSessionCache = function(cache, capacity) {
    var rval = null;
    if (cache && cache.getSession && cache.setSession && cache.order) {
      rval = cache;
    } else {
      rval = {};
      rval.cache = cache || {};
      rval.capacity = Math.max(capacity || 100, 1);
      rval.order = [];
      for (var key2 in cache) {
        if (rval.order.length <= capacity) {
          rval.order.push(key2);
        } else {
          delete cache[key2];
        }
      }
      rval.getSession = function(sessionId) {
        var session = null;
        var key3 = null;
        if (sessionId) {
          key3 = forge2.util.bytesToHex(sessionId);
        } else if (rval.order.length > 0) {
          key3 = rval.order[0];
        }
        if (key3 !== null && key3 in rval.cache) {
          session = rval.cache[key3];
          delete rval.cache[key3];
          for (var i in rval.order) {
            if (rval.order[i] === key3) {
              rval.order.splice(i, 1);
              break;
            }
          }
        }
        return session;
      };
      rval.setSession = function(sessionId, session) {
        if (rval.order.length === rval.capacity) {
          var key3 = rval.order.shift();
          delete rval.cache[key3];
        }
        var key3 = forge2.util.bytesToHex(sessionId);
        rval.order.push(key3);
        rval.cache[key3] = session;
      };
    }
    return rval;
  };
  tls.createConnection = function(options) {
    var caStore = null;
    if (options.caStore) {
      if (forge2.util.isArray(options.caStore)) {
        caStore = forge2.pki.createCaStore(options.caStore);
      } else {
        caStore = options.caStore;
      }
    } else {
      caStore = forge2.pki.createCaStore();
    }
    var cipherSuites = options.cipherSuites || null;
    if (cipherSuites === null) {
      cipherSuites = [];
      for (var key2 in tls.CipherSuites) {
        cipherSuites.push(tls.CipherSuites[key2]);
      }
    }
    var entity = options.server || false ? tls.ConnectionEnd.server : tls.ConnectionEnd.client;
    var sessionCache = options.sessionCache ? tls.createSessionCache(options.sessionCache) : null;
    var c = {
      version: {major: tls.Version.major, minor: tls.Version.minor},
      entity,
      sessionId: options.sessionId,
      caStore,
      sessionCache,
      cipherSuites,
      connected: options.connected,
      virtualHost: options.virtualHost || null,
      verifyClient: options.verifyClient || false,
      verify: options.verify || function(cn, vfd, dpth, cts) {
        return vfd;
      },
      verifyOptions: options.verifyOptions || {},
      getCertificate: options.getCertificate || null,
      getPrivateKey: options.getPrivateKey || null,
      getSignature: options.getSignature || null,
      input: forge2.util.createBuffer(),
      tlsData: forge2.util.createBuffer(),
      data: forge2.util.createBuffer(),
      tlsDataReady: options.tlsDataReady,
      dataReady: options.dataReady,
      heartbeatReceived: options.heartbeatReceived,
      closed: options.closed,
      error: function(c2, ex) {
        ex.origin = ex.origin || (c2.entity === tls.ConnectionEnd.client ? "client" : "server");
        if (ex.send) {
          tls.queue(c2, tls.createAlert(c2, ex.alert));
          tls.flush(c2);
        }
        var fatal = ex.fatal !== false;
        if (fatal) {
          c2.fail = true;
        }
        options.error(c2, ex);
        if (fatal) {
          c2.close(false);
        }
      },
      deflate: options.deflate || null,
      inflate: options.inflate || null
    };
    c.reset = function(clearFail) {
      c.version = {major: tls.Version.major, minor: tls.Version.minor};
      c.record = null;
      c.session = null;
      c.peerCertificate = null;
      c.state = {
        pending: null,
        current: null
      };
      c.expect = c.entity === tls.ConnectionEnd.client ? SHE : CHE;
      c.fragmented = null;
      c.records = [];
      c.open = false;
      c.handshakes = 0;
      c.handshaking = false;
      c.isConnected = false;
      c.fail = !(clearFail || typeof clearFail === "undefined");
      c.input.clear();
      c.tlsData.clear();
      c.data.clear();
      c.state.current = tls.createConnectionState(c);
    };
    c.reset();
    var _update = function(c2, record) {
      var aligned = record.type - tls.ContentType.change_cipher_spec;
      var handlers = ctTable[c2.entity][c2.expect];
      if (aligned in handlers) {
        handlers[aligned](c2, record);
      } else {
        tls.handleUnexpected(c2, record);
      }
    };
    var _readRecordHeader = function(c2) {
      var rval = 0;
      var b = c2.input;
      var len = b.length();
      if (len < 5) {
        rval = 5 - len;
      } else {
        c2.record = {
          type: b.getByte(),
          version: {
            major: b.getByte(),
            minor: b.getByte()
          },
          length: b.getInt16(),
          fragment: forge2.util.createBuffer(),
          ready: false
        };
        var compatibleVersion = c2.record.version.major === c2.version.major;
        if (compatibleVersion && c2.session && c2.session.version) {
          compatibleVersion = c2.record.version.minor === c2.version.minor;
        }
        if (!compatibleVersion) {
          c2.error(c2, {
            message: "Incompatible TLS version.",
            send: true,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.protocol_version
            }
          });
        }
      }
      return rval;
    };
    var _readRecord = function(c2) {
      var rval = 0;
      var b = c2.input;
      var len = b.length();
      if (len < c2.record.length) {
        rval = c2.record.length - len;
      } else {
        c2.record.fragment.putBytes(b.getBytes(c2.record.length));
        b.compact();
        var s = c2.state.current.read;
        if (s.update(c2, c2.record)) {
          if (c2.fragmented !== null) {
            if (c2.fragmented.type === c2.record.type) {
              c2.fragmented.fragment.putBuffer(c2.record.fragment);
              c2.record = c2.fragmented;
            } else {
              c2.error(c2, {
                message: "Invalid fragmented record.",
                send: true,
                alert: {
                  level: tls.Alert.Level.fatal,
                  description: tls.Alert.Description.unexpected_message
                }
              });
            }
          }
          c2.record.ready = true;
        }
      }
      return rval;
    };
    c.handshake = function(sessionId) {
      if (c.entity !== tls.ConnectionEnd.client) {
        c.error(c, {
          message: "Cannot initiate handshake as a server.",
          fatal: false
        });
      } else if (c.handshaking) {
        c.error(c, {
          message: "Handshake already in progress.",
          fatal: false
        });
      } else {
        if (c.fail && !c.open && c.handshakes === 0) {
          c.fail = false;
        }
        c.handshaking = true;
        sessionId = sessionId || "";
        var session = null;
        if (sessionId.length > 0) {
          if (c.sessionCache) {
            session = c.sessionCache.getSession(sessionId);
          }
          if (session === null) {
            sessionId = "";
          }
        }
        if (sessionId.length === 0 && c.sessionCache) {
          session = c.sessionCache.getSession();
          if (session !== null) {
            sessionId = session.id;
          }
        }
        c.session = {
          id: sessionId,
          version: null,
          cipherSuite: null,
          compressionMethod: null,
          serverCertificate: null,
          certificateRequest: null,
          clientCertificate: null,
          sp: {},
          md5: forge2.md.md5.create(),
          sha1: forge2.md.sha1.create()
        };
        if (session) {
          c.version = session.version;
          c.session.sp = session.sp;
        }
        c.session.sp.client_random = tls.createRandom().getBytes();
        c.open = true;
        tls.queue(c, tls.createRecord(c, {
          type: tls.ContentType.handshake,
          data: tls.createClientHello(c)
        }));
        tls.flush(c);
      }
    };
    c.process = function(data) {
      var rval = 0;
      if (data) {
        c.input.putBytes(data);
      }
      if (!c.fail) {
        if (c.record !== null && c.record.ready && c.record.fragment.isEmpty()) {
          c.record = null;
        }
        if (c.record === null) {
          rval = _readRecordHeader(c);
        }
        if (!c.fail && c.record !== null && !c.record.ready) {
          rval = _readRecord(c);
        }
        if (!c.fail && c.record !== null && c.record.ready) {
          _update(c, c.record);
        }
      }
      return rval;
    };
    c.prepare = function(data) {
      tls.queue(c, tls.createRecord(c, {
        type: tls.ContentType.application_data,
        data: forge2.util.createBuffer(data)
      }));
      return tls.flush(c);
    };
    c.prepareHeartbeatRequest = function(payload, payloadLength) {
      if (payload instanceof forge2.util.ByteBuffer) {
        payload = payload.bytes();
      }
      if (typeof payloadLength === "undefined") {
        payloadLength = payload.length;
      }
      c.expectedHeartbeatPayload = payload;
      tls.queue(c, tls.createRecord(c, {
        type: tls.ContentType.heartbeat,
        data: tls.createHeartbeat(tls.HeartbeatMessageType.heartbeat_request, payload, payloadLength)
      }));
      return tls.flush(c);
    };
    c.close = function(clearFail) {
      if (!c.fail && c.sessionCache && c.session) {
        var session = {
          id: c.session.id,
          version: c.session.version,
          sp: c.session.sp
        };
        session.sp.keys = null;
        c.sessionCache.setSession(session.id, session);
      }
      if (c.open) {
        c.open = false;
        c.input.clear();
        if (c.isConnected || c.handshaking) {
          c.isConnected = c.handshaking = false;
          tls.queue(c, tls.createAlert(c, {
            level: tls.Alert.Level.warning,
            description: tls.Alert.Description.close_notify
          }));
          tls.flush(c);
        }
        c.closed(c);
      }
      c.reset(clearFail);
    };
    return c;
  };
  module2.exports = forge2.tls = forge2.tls || {};
  for (var key in tls) {
    if (typeof tls[key] !== "function") {
      forge2.tls[key] = tls[key];
    }
  }
  forge2.tls.prf_tls1 = prf_TLS1;
  forge2.tls.hmac_sha1 = hmac_sha1;
  forge2.tls.createSessionCache = tls.createSessionCache;
  forge2.tls.createConnection = tls.createConnection;
});

// node_modules/node-forge/lib/aesCipherSuites.js
var require_aesCipherSuites = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_aes();
  require_tls();
  var tls = module2.exports = forge2.tls;
  tls.CipherSuites["TLS_RSA_WITH_AES_128_CBC_SHA"] = {
    id: [0, 47],
    name: "TLS_RSA_WITH_AES_128_CBC_SHA",
    initSecurityParameters: function(sp) {
      sp.bulk_cipher_algorithm = tls.BulkCipherAlgorithm.aes;
      sp.cipher_type = tls.CipherType.block;
      sp.enc_key_length = 16;
      sp.block_length = 16;
      sp.fixed_iv_length = 16;
      sp.record_iv_length = 16;
      sp.mac_algorithm = tls.MACAlgorithm.hmac_sha1;
      sp.mac_length = 20;
      sp.mac_key_length = 20;
    },
    initConnectionState
  };
  tls.CipherSuites["TLS_RSA_WITH_AES_256_CBC_SHA"] = {
    id: [0, 53],
    name: "TLS_RSA_WITH_AES_256_CBC_SHA",
    initSecurityParameters: function(sp) {
      sp.bulk_cipher_algorithm = tls.BulkCipherAlgorithm.aes;
      sp.cipher_type = tls.CipherType.block;
      sp.enc_key_length = 32;
      sp.block_length = 16;
      sp.fixed_iv_length = 16;
      sp.record_iv_length = 16;
      sp.mac_algorithm = tls.MACAlgorithm.hmac_sha1;
      sp.mac_length = 20;
      sp.mac_key_length = 20;
    },
    initConnectionState
  };
  function initConnectionState(state, c, sp) {
    var client = c.entity === forge2.tls.ConnectionEnd.client;
    state.read.cipherState = {
      init: false,
      cipher: forge2.cipher.createDecipher("AES-CBC", client ? sp.keys.server_write_key : sp.keys.client_write_key),
      iv: client ? sp.keys.server_write_IV : sp.keys.client_write_IV
    };
    state.write.cipherState = {
      init: false,
      cipher: forge2.cipher.createCipher("AES-CBC", client ? sp.keys.client_write_key : sp.keys.server_write_key),
      iv: client ? sp.keys.client_write_IV : sp.keys.server_write_IV
    };
    state.read.cipherFunction = decrypt_aes_cbc_sha1;
    state.write.cipherFunction = encrypt_aes_cbc_sha1;
    state.read.macLength = state.write.macLength = sp.mac_length;
    state.read.macFunction = state.write.macFunction = tls.hmac_sha1;
  }
  function encrypt_aes_cbc_sha1(record, s) {
    var rval = false;
    var mac = s.macFunction(s.macKey, s.sequenceNumber, record);
    record.fragment.putBytes(mac);
    s.updateSequenceNumber();
    var iv;
    if (record.version.minor === tls.Versions.TLS_1_0.minor) {
      iv = s.cipherState.init ? null : s.cipherState.iv;
    } else {
      iv = forge2.random.getBytesSync(16);
    }
    s.cipherState.init = true;
    var cipher = s.cipherState.cipher;
    cipher.start({iv});
    if (record.version.minor >= tls.Versions.TLS_1_1.minor) {
      cipher.output.putBytes(iv);
    }
    cipher.update(record.fragment);
    if (cipher.finish(encrypt_aes_cbc_sha1_padding)) {
      record.fragment = cipher.output;
      record.length = record.fragment.length();
      rval = true;
    }
    return rval;
  }
  function encrypt_aes_cbc_sha1_padding(blockSize, input, decrypt) {
    if (!decrypt) {
      var padding = blockSize - input.length() % blockSize;
      input.fillWithByte(padding - 1, padding);
    }
    return true;
  }
  function decrypt_aes_cbc_sha1_padding(blockSize, output, decrypt) {
    var rval = true;
    if (decrypt) {
      var len = output.length();
      var paddingLength = output.last();
      for (var i = len - 1 - paddingLength; i < len - 1; ++i) {
        rval = rval && output.at(i) == paddingLength;
      }
      if (rval) {
        output.truncate(paddingLength + 1);
      }
    }
    return rval;
  }
  function decrypt_aes_cbc_sha1(record, s) {
    var rval = false;
    var iv;
    if (record.version.minor === tls.Versions.TLS_1_0.minor) {
      iv = s.cipherState.init ? null : s.cipherState.iv;
    } else {
      iv = record.fragment.getBytes(16);
    }
    s.cipherState.init = true;
    var cipher = s.cipherState.cipher;
    cipher.start({iv});
    cipher.update(record.fragment);
    rval = cipher.finish(decrypt_aes_cbc_sha1_padding);
    var macLen = s.macLength;
    var mac = forge2.random.getBytesSync(macLen);
    var len = cipher.output.length();
    if (len >= macLen) {
      record.fragment = cipher.output.getBytes(len - macLen);
      mac = cipher.output.getBytes(macLen);
    } else {
      record.fragment = cipher.output.getBytes();
    }
    record.fragment = forge2.util.createBuffer(record.fragment);
    record.length = record.fragment.length();
    var mac2 = s.macFunction(s.macKey, s.sequenceNumber, record);
    s.updateSequenceNumber();
    rval = compareMacs(s.macKey, mac, mac2) && rval;
    return rval;
  }
  function compareMacs(key, mac1, mac2) {
    var hmac = forge2.hmac.create();
    hmac.start("SHA1", key);
    hmac.update(mac1);
    mac1 = hmac.digest().getBytes();
    hmac.start(null, null);
    hmac.update(mac2);
    mac2 = hmac.digest().getBytes();
    return mac1 === mac2;
  }
});

// node_modules/node-forge/lib/debug.js
var require_debug = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  module2.exports = forge2.debug = forge2.debug || {};
  forge2.debug.storage = {};
  forge2.debug.get = function(cat, name) {
    var rval;
    if (typeof cat === "undefined") {
      rval = forge2.debug.storage;
    } else if (cat in forge2.debug.storage) {
      if (typeof name === "undefined") {
        rval = forge2.debug.storage[cat];
      } else {
        rval = forge2.debug.storage[cat][name];
      }
    }
    return rval;
  };
  forge2.debug.set = function(cat, name, data) {
    if (!(cat in forge2.debug.storage)) {
      forge2.debug.storage[cat] = {};
    }
    forge2.debug.storage[cat][name] = data;
  };
  forge2.debug.clear = function(cat, name) {
    if (typeof cat === "undefined") {
      forge2.debug.storage = {};
    } else if (cat in forge2.debug.storage) {
      if (typeof name === "undefined") {
        delete forge2.debug.storage[cat];
      } else {
        delete forge2.debug.storage[cat][name];
      }
    }
  };
});

// node_modules/node-forge/lib/sha512.js
var require_sha512 = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_md();
  require_util();
  var sha512 = module2.exports = forge2.sha512 = forge2.sha512 || {};
  forge2.md.sha512 = forge2.md.algorithms.sha512 = sha512;
  var sha384 = forge2.sha384 = forge2.sha512.sha384 = forge2.sha512.sha384 || {};
  sha384.create = function() {
    return sha512.create("SHA-384");
  };
  forge2.md.sha384 = forge2.md.algorithms.sha384 = sha384;
  forge2.sha512.sha256 = forge2.sha512.sha256 || {
    create: function() {
      return sha512.create("SHA-512/256");
    }
  };
  forge2.md["sha512/256"] = forge2.md.algorithms["sha512/256"] = forge2.sha512.sha256;
  forge2.sha512.sha224 = forge2.sha512.sha224 || {
    create: function() {
      return sha512.create("SHA-512/224");
    }
  };
  forge2.md["sha512/224"] = forge2.md.algorithms["sha512/224"] = forge2.sha512.sha224;
  sha512.create = function(algorithm) {
    if (!_initialized) {
      _init();
    }
    if (typeof algorithm === "undefined") {
      algorithm = "SHA-512";
    }
    if (!(algorithm in _states)) {
      throw new Error("Invalid SHA-512 algorithm: " + algorithm);
    }
    var _state = _states[algorithm];
    var _h = null;
    var _input = forge2.util.createBuffer();
    var _w = new Array(80);
    for (var wi = 0; wi < 80; ++wi) {
      _w[wi] = new Array(2);
    }
    var digestLength = 64;
    switch (algorithm) {
      case "SHA-384":
        digestLength = 48;
        break;
      case "SHA-512/256":
        digestLength = 32;
        break;
      case "SHA-512/224":
        digestLength = 28;
        break;
    }
    var md = {
      algorithm: algorithm.replace("-", "").toLowerCase(),
      blockLength: 128,
      digestLength,
      messageLength: 0,
      fullMessageLength: null,
      messageLengthSize: 16
    };
    md.start = function() {
      md.messageLength = 0;
      md.fullMessageLength = md.messageLength128 = [];
      var int32s = md.messageLengthSize / 4;
      for (var i = 0; i < int32s; ++i) {
        md.fullMessageLength.push(0);
      }
      _input = forge2.util.createBuffer();
      _h = new Array(_state.length);
      for (var i = 0; i < _state.length; ++i) {
        _h[i] = _state[i].slice(0);
      }
      return md;
    };
    md.start();
    md.update = function(msg, encoding) {
      if (encoding === "utf8") {
        msg = forge2.util.encodeUtf8(msg);
      }
      var len = msg.length;
      md.messageLength += len;
      len = [len / 4294967296 >>> 0, len >>> 0];
      for (var i = md.fullMessageLength.length - 1; i >= 0; --i) {
        md.fullMessageLength[i] += len[1];
        len[1] = len[0] + (md.fullMessageLength[i] / 4294967296 >>> 0);
        md.fullMessageLength[i] = md.fullMessageLength[i] >>> 0;
        len[0] = len[1] / 4294967296 >>> 0;
      }
      _input.putBytes(msg);
      _update(_h, _w, _input);
      if (_input.read > 2048 || _input.length() === 0) {
        _input.compact();
      }
      return md;
    };
    md.digest = function() {
      var finalBlock = forge2.util.createBuffer();
      finalBlock.putBytes(_input.bytes());
      var remaining = md.fullMessageLength[md.fullMessageLength.length - 1] + md.messageLengthSize;
      var overflow = remaining & md.blockLength - 1;
      finalBlock.putBytes(_padding.substr(0, md.blockLength - overflow));
      var next, carry;
      var bits = md.fullMessageLength[0] * 8;
      for (var i = 0; i < md.fullMessageLength.length - 1; ++i) {
        next = md.fullMessageLength[i + 1] * 8;
        carry = next / 4294967296 >>> 0;
        bits += carry;
        finalBlock.putInt32(bits >>> 0);
        bits = next >>> 0;
      }
      finalBlock.putInt32(bits);
      var h = new Array(_h.length);
      for (var i = 0; i < _h.length; ++i) {
        h[i] = _h[i].slice(0);
      }
      _update(h, _w, finalBlock);
      var rval = forge2.util.createBuffer();
      var hlen;
      if (algorithm === "SHA-512") {
        hlen = h.length;
      } else if (algorithm === "SHA-384") {
        hlen = h.length - 2;
      } else {
        hlen = h.length - 4;
      }
      for (var i = 0; i < hlen; ++i) {
        rval.putInt32(h[i][0]);
        if (i !== hlen - 1 || algorithm !== "SHA-512/224") {
          rval.putInt32(h[i][1]);
        }
      }
      return rval;
    };
    return md;
  };
  var _padding = null;
  var _initialized = false;
  var _k = null;
  var _states = null;
  function _init() {
    _padding = String.fromCharCode(128);
    _padding += forge2.util.fillString(String.fromCharCode(0), 128);
    _k = [
      [1116352408, 3609767458],
      [1899447441, 602891725],
      [3049323471, 3964484399],
      [3921009573, 2173295548],
      [961987163, 4081628472],
      [1508970993, 3053834265],
      [2453635748, 2937671579],
      [2870763221, 3664609560],
      [3624381080, 2734883394],
      [310598401, 1164996542],
      [607225278, 1323610764],
      [1426881987, 3590304994],
      [1925078388, 4068182383],
      [2162078206, 991336113],
      [2614888103, 633803317],
      [3248222580, 3479774868],
      [3835390401, 2666613458],
      [4022224774, 944711139],
      [264347078, 2341262773],
      [604807628, 2007800933],
      [770255983, 1495990901],
      [1249150122, 1856431235],
      [1555081692, 3175218132],
      [1996064986, 2198950837],
      [2554220882, 3999719339],
      [2821834349, 766784016],
      [2952996808, 2566594879],
      [3210313671, 3203337956],
      [3336571891, 1034457026],
      [3584528711, 2466948901],
      [113926993, 3758326383],
      [338241895, 168717936],
      [666307205, 1188179964],
      [773529912, 1546045734],
      [1294757372, 1522805485],
      [1396182291, 2643833823],
      [1695183700, 2343527390],
      [1986661051, 1014477480],
      [2177026350, 1206759142],
      [2456956037, 344077627],
      [2730485921, 1290863460],
      [2820302411, 3158454273],
      [3259730800, 3505952657],
      [3345764771, 106217008],
      [3516065817, 3606008344],
      [3600352804, 1432725776],
      [4094571909, 1467031594],
      [275423344, 851169720],
      [430227734, 3100823752],
      [506948616, 1363258195],
      [659060556, 3750685593],
      [883997877, 3785050280],
      [958139571, 3318307427],
      [1322822218, 3812723403],
      [1537002063, 2003034995],
      [1747873779, 3602036899],
      [1955562222, 1575990012],
      [2024104815, 1125592928],
      [2227730452, 2716904306],
      [2361852424, 442776044],
      [2428436474, 593698344],
      [2756734187, 3733110249],
      [3204031479, 2999351573],
      [3329325298, 3815920427],
      [3391569614, 3928383900],
      [3515267271, 566280711],
      [3940187606, 3454069534],
      [4118630271, 4000239992],
      [116418474, 1914138554],
      [174292421, 2731055270],
      [289380356, 3203993006],
      [460393269, 320620315],
      [685471733, 587496836],
      [852142971, 1086792851],
      [1017036298, 365543100],
      [1126000580, 2618297676],
      [1288033470, 3409855158],
      [1501505948, 4234509866],
      [1607167915, 987167468],
      [1816402316, 1246189591]
    ];
    _states = {};
    _states["SHA-512"] = [
      [1779033703, 4089235720],
      [3144134277, 2227873595],
      [1013904242, 4271175723],
      [2773480762, 1595750129],
      [1359893119, 2917565137],
      [2600822924, 725511199],
      [528734635, 4215389547],
      [1541459225, 327033209]
    ];
    _states["SHA-384"] = [
      [3418070365, 3238371032],
      [1654270250, 914150663],
      [2438529370, 812702999],
      [355462360, 4144912697],
      [1731405415, 4290775857],
      [2394180231, 1750603025],
      [3675008525, 1694076839],
      [1203062813, 3204075428]
    ];
    _states["SHA-512/256"] = [
      [573645204, 4230739756],
      [2673172387, 3360449730],
      [596883563, 1867755857],
      [2520282905, 1497426621],
      [2519219938, 2827943907],
      [3193839141, 1401305490],
      [721525244, 746961066],
      [246885852, 2177182882]
    ];
    _states["SHA-512/224"] = [
      [2352822216, 424955298],
      [1944164710, 2312950998],
      [502970286, 855612546],
      [1738396948, 1479516111],
      [258812777, 2077511080],
      [2011393907, 79989058],
      [1067287976, 1780299464],
      [286451373, 2446758561]
    ];
    _initialized = true;
  }
  function _update(s, w, bytes) {
    var t1_hi, t1_lo;
    var t2_hi, t2_lo;
    var s0_hi, s0_lo;
    var s1_hi, s1_lo;
    var ch_hi, ch_lo;
    var maj_hi, maj_lo;
    var a_hi, a_lo;
    var b_hi, b_lo;
    var c_hi, c_lo;
    var d_hi, d_lo;
    var e_hi, e_lo;
    var f_hi, f_lo;
    var g_hi, g_lo;
    var h_hi, h_lo;
    var i, hi, lo, w2, w7, w15, w16;
    var len = bytes.length();
    while (len >= 128) {
      for (i = 0; i < 16; ++i) {
        w[i][0] = bytes.getInt32() >>> 0;
        w[i][1] = bytes.getInt32() >>> 0;
      }
      for (; i < 80; ++i) {
        w2 = w[i - 2];
        hi = w2[0];
        lo = w2[1];
        t1_hi = ((hi >>> 19 | lo << 13) ^ (lo >>> 29 | hi << 3) ^ hi >>> 6) >>> 0;
        t1_lo = ((hi << 13 | lo >>> 19) ^ (lo << 3 | hi >>> 29) ^ (hi << 26 | lo >>> 6)) >>> 0;
        w15 = w[i - 15];
        hi = w15[0];
        lo = w15[1];
        t2_hi = ((hi >>> 1 | lo << 31) ^ (hi >>> 8 | lo << 24) ^ hi >>> 7) >>> 0;
        t2_lo = ((hi << 31 | lo >>> 1) ^ (hi << 24 | lo >>> 8) ^ (hi << 25 | lo >>> 7)) >>> 0;
        w7 = w[i - 7];
        w16 = w[i - 16];
        lo = t1_lo + w7[1] + t2_lo + w16[1];
        w[i][0] = t1_hi + w7[0] + t2_hi + w16[0] + (lo / 4294967296 >>> 0) >>> 0;
        w[i][1] = lo >>> 0;
      }
      a_hi = s[0][0];
      a_lo = s[0][1];
      b_hi = s[1][0];
      b_lo = s[1][1];
      c_hi = s[2][0];
      c_lo = s[2][1];
      d_hi = s[3][0];
      d_lo = s[3][1];
      e_hi = s[4][0];
      e_lo = s[4][1];
      f_hi = s[5][0];
      f_lo = s[5][1];
      g_hi = s[6][0];
      g_lo = s[6][1];
      h_hi = s[7][0];
      h_lo = s[7][1];
      for (i = 0; i < 80; ++i) {
        s1_hi = ((e_hi >>> 14 | e_lo << 18) ^ (e_hi >>> 18 | e_lo << 14) ^ (e_lo >>> 9 | e_hi << 23)) >>> 0;
        s1_lo = ((e_hi << 18 | e_lo >>> 14) ^ (e_hi << 14 | e_lo >>> 18) ^ (e_lo << 23 | e_hi >>> 9)) >>> 0;
        ch_hi = (g_hi ^ e_hi & (f_hi ^ g_hi)) >>> 0;
        ch_lo = (g_lo ^ e_lo & (f_lo ^ g_lo)) >>> 0;
        s0_hi = ((a_hi >>> 28 | a_lo << 4) ^ (a_lo >>> 2 | a_hi << 30) ^ (a_lo >>> 7 | a_hi << 25)) >>> 0;
        s0_lo = ((a_hi << 4 | a_lo >>> 28) ^ (a_lo << 30 | a_hi >>> 2) ^ (a_lo << 25 | a_hi >>> 7)) >>> 0;
        maj_hi = (a_hi & b_hi | c_hi & (a_hi ^ b_hi)) >>> 0;
        maj_lo = (a_lo & b_lo | c_lo & (a_lo ^ b_lo)) >>> 0;
        lo = h_lo + s1_lo + ch_lo + _k[i][1] + w[i][1];
        t1_hi = h_hi + s1_hi + ch_hi + _k[i][0] + w[i][0] + (lo / 4294967296 >>> 0) >>> 0;
        t1_lo = lo >>> 0;
        lo = s0_lo + maj_lo;
        t2_hi = s0_hi + maj_hi + (lo / 4294967296 >>> 0) >>> 0;
        t2_lo = lo >>> 0;
        h_hi = g_hi;
        h_lo = g_lo;
        g_hi = f_hi;
        g_lo = f_lo;
        f_hi = e_hi;
        f_lo = e_lo;
        lo = d_lo + t1_lo;
        e_hi = d_hi + t1_hi + (lo / 4294967296 >>> 0) >>> 0;
        e_lo = lo >>> 0;
        d_hi = c_hi;
        d_lo = c_lo;
        c_hi = b_hi;
        c_lo = b_lo;
        b_hi = a_hi;
        b_lo = a_lo;
        lo = t1_lo + t2_lo;
        a_hi = t1_hi + t2_hi + (lo / 4294967296 >>> 0) >>> 0;
        a_lo = lo >>> 0;
      }
      lo = s[0][1] + a_lo;
      s[0][0] = s[0][0] + a_hi + (lo / 4294967296 >>> 0) >>> 0;
      s[0][1] = lo >>> 0;
      lo = s[1][1] + b_lo;
      s[1][0] = s[1][0] + b_hi + (lo / 4294967296 >>> 0) >>> 0;
      s[1][1] = lo >>> 0;
      lo = s[2][1] + c_lo;
      s[2][0] = s[2][0] + c_hi + (lo / 4294967296 >>> 0) >>> 0;
      s[2][1] = lo >>> 0;
      lo = s[3][1] + d_lo;
      s[3][0] = s[3][0] + d_hi + (lo / 4294967296 >>> 0) >>> 0;
      s[3][1] = lo >>> 0;
      lo = s[4][1] + e_lo;
      s[4][0] = s[4][0] + e_hi + (lo / 4294967296 >>> 0) >>> 0;
      s[4][1] = lo >>> 0;
      lo = s[5][1] + f_lo;
      s[5][0] = s[5][0] + f_hi + (lo / 4294967296 >>> 0) >>> 0;
      s[5][1] = lo >>> 0;
      lo = s[6][1] + g_lo;
      s[6][0] = s[6][0] + g_hi + (lo / 4294967296 >>> 0) >>> 0;
      s[6][1] = lo >>> 0;
      lo = s[7][1] + h_lo;
      s[7][0] = s[7][0] + h_hi + (lo / 4294967296 >>> 0) >>> 0;
      s[7][1] = lo >>> 0;
      len -= 128;
    }
  }
});

// node_modules/node-forge/lib/asn1-validator.js
var require_asn1_validator = __commonJS((exports2) => {
  var forge2 = require_forge();
  require_asn1();
  var asn1 = forge2.asn1;
  exports2.privateKeyValidator = {
    name: "PrivateKeyInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    value: [{
      name: "PrivateKeyInfo.version",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: false,
      capture: "privateKeyVersion"
    }, {
      name: "PrivateKeyInfo.privateKeyAlgorithm",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: "AlgorithmIdentifier.algorithm",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: false,
        capture: "privateKeyOid"
      }]
    }, {
      name: "PrivateKeyInfo",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OCTETSTRING,
      constructed: false,
      capture: "privateKey"
    }]
  };
  exports2.publicKeyValidator = {
    name: "SubjectPublicKeyInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: true,
    captureAsn1: "subjectPublicKeyInfo",
    value: [
      {
        name: "SubjectPublicKeyInfo.AlgorithmIdentifier",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: "AlgorithmIdentifier.algorithm",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: false,
          capture: "publicKeyOid"
        }]
      },
      {
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.BITSTRING,
        constructed: false,
        composed: true,
        captureBitStringValue: "ed25519PublicKey"
      }
    ]
  };
});

// node_modules/node-forge/lib/ed25519.js
var require_ed25519 = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_jsbn();
  require_random();
  require_sha512();
  require_util();
  var asn1Validator = require_asn1_validator();
  var publicKeyValidator = asn1Validator.publicKeyValidator;
  var privateKeyValidator = asn1Validator.privateKeyValidator;
  if (typeof BigInteger === "undefined") {
    BigInteger = forge2.jsbn.BigInteger;
  }
  var BigInteger;
  var ByteBuffer = forge2.util.ByteBuffer;
  var NativeBuffer = typeof Buffer === "undefined" ? Uint8Array : Buffer;
  forge2.pki = forge2.pki || {};
  module2.exports = forge2.pki.ed25519 = forge2.ed25519 = forge2.ed25519 || {};
  var ed25519 = forge2.ed25519;
  ed25519.constants = {};
  ed25519.constants.PUBLIC_KEY_BYTE_LENGTH = 32;
  ed25519.constants.PRIVATE_KEY_BYTE_LENGTH = 64;
  ed25519.constants.SEED_BYTE_LENGTH = 32;
  ed25519.constants.SIGN_BYTE_LENGTH = 64;
  ed25519.constants.HASH_BYTE_LENGTH = 64;
  ed25519.generateKeyPair = function(options) {
    options = options || {};
    var seed = options.seed;
    if (seed === void 0) {
      seed = forge2.random.getBytesSync(ed25519.constants.SEED_BYTE_LENGTH);
    } else if (typeof seed === "string") {
      if (seed.length !== ed25519.constants.SEED_BYTE_LENGTH) {
        throw new TypeError('"seed" must be ' + ed25519.constants.SEED_BYTE_LENGTH + " bytes in length.");
      }
    } else if (!(seed instanceof Uint8Array)) {
      throw new TypeError('"seed" must be a node.js Buffer, Uint8Array, or a binary string.');
    }
    seed = messageToNativeBuffer({message: seed, encoding: "binary"});
    var pk = new NativeBuffer(ed25519.constants.PUBLIC_KEY_BYTE_LENGTH);
    var sk = new NativeBuffer(ed25519.constants.PRIVATE_KEY_BYTE_LENGTH);
    for (var i = 0; i < 32; ++i) {
      sk[i] = seed[i];
    }
    crypto_sign_keypair(pk, sk);
    return {publicKey: pk, privateKey: sk};
  };
  ed25519.privateKeyFromAsn1 = function(obj) {
    var capture = {};
    var errors = [];
    var valid = forge2.asn1.validate(obj, privateKeyValidator, capture, errors);
    if (!valid) {
      var error = new Error("Invalid Key.");
      error.errors = errors;
      throw error;
    }
    var oid = forge2.asn1.derToOid(capture.privateKeyOid);
    var ed25519Oid = forge2.oids.EdDSA25519;
    if (oid !== ed25519Oid) {
      throw new Error('Invalid OID "' + oid + '"; OID must be "' + ed25519Oid + '".');
    }
    var privateKey = capture.privateKey;
    var privateKeyBytes = messageToNativeBuffer({
      message: forge2.asn1.fromDer(privateKey).value,
      encoding: "binary"
    });
    return {privateKeyBytes};
  };
  ed25519.publicKeyFromAsn1 = function(obj) {
    var capture = {};
    var errors = [];
    var valid = forge2.asn1.validate(obj, publicKeyValidator, capture, errors);
    if (!valid) {
      var error = new Error("Invalid Key.");
      error.errors = errors;
      throw error;
    }
    var oid = forge2.asn1.derToOid(capture.publicKeyOid);
    var ed25519Oid = forge2.oids.EdDSA25519;
    if (oid !== ed25519Oid) {
      throw new Error('Invalid OID "' + oid + '"; OID must be "' + ed25519Oid + '".');
    }
    var publicKeyBytes = capture.ed25519PublicKey;
    if (publicKeyBytes.length !== ed25519.constants.PUBLIC_KEY_BYTE_LENGTH) {
      throw new Error("Key length is invalid.");
    }
    return messageToNativeBuffer({
      message: publicKeyBytes,
      encoding: "binary"
    });
  };
  ed25519.publicKeyFromPrivateKey = function(options) {
    options = options || {};
    var privateKey = messageToNativeBuffer({
      message: options.privateKey,
      encoding: "binary"
    });
    if (privateKey.length !== ed25519.constants.PRIVATE_KEY_BYTE_LENGTH) {
      throw new TypeError('"options.privateKey" must have a byte length of ' + ed25519.constants.PRIVATE_KEY_BYTE_LENGTH);
    }
    var pk = new NativeBuffer(ed25519.constants.PUBLIC_KEY_BYTE_LENGTH);
    for (var i = 0; i < pk.length; ++i) {
      pk[i] = privateKey[32 + i];
    }
    return pk;
  };
  ed25519.sign = function(options) {
    options = options || {};
    var msg = messageToNativeBuffer(options);
    var privateKey = messageToNativeBuffer({
      message: options.privateKey,
      encoding: "binary"
    });
    if (privateKey.length === ed25519.constants.SEED_BYTE_LENGTH) {
      var keyPair = ed25519.generateKeyPair({seed: privateKey});
      privateKey = keyPair.privateKey;
    } else if (privateKey.length !== ed25519.constants.PRIVATE_KEY_BYTE_LENGTH) {
      throw new TypeError('"options.privateKey" must have a byte length of ' + ed25519.constants.SEED_BYTE_LENGTH + " or " + ed25519.constants.PRIVATE_KEY_BYTE_LENGTH);
    }
    var signedMsg = new NativeBuffer(ed25519.constants.SIGN_BYTE_LENGTH + msg.length);
    crypto_sign(signedMsg, msg, msg.length, privateKey);
    var sig = new NativeBuffer(ed25519.constants.SIGN_BYTE_LENGTH);
    for (var i = 0; i < sig.length; ++i) {
      sig[i] = signedMsg[i];
    }
    return sig;
  };
  ed25519.verify = function(options) {
    options = options || {};
    var msg = messageToNativeBuffer(options);
    if (options.signature === void 0) {
      throw new TypeError('"options.signature" must be a node.js Buffer, a Uint8Array, a forge ByteBuffer, or a binary string.');
    }
    var sig = messageToNativeBuffer({
      message: options.signature,
      encoding: "binary"
    });
    if (sig.length !== ed25519.constants.SIGN_BYTE_LENGTH) {
      throw new TypeError('"options.signature" must have a byte length of ' + ed25519.constants.SIGN_BYTE_LENGTH);
    }
    var publicKey = messageToNativeBuffer({
      message: options.publicKey,
      encoding: "binary"
    });
    if (publicKey.length !== ed25519.constants.PUBLIC_KEY_BYTE_LENGTH) {
      throw new TypeError('"options.publicKey" must have a byte length of ' + ed25519.constants.PUBLIC_KEY_BYTE_LENGTH);
    }
    var sm = new NativeBuffer(ed25519.constants.SIGN_BYTE_LENGTH + msg.length);
    var m = new NativeBuffer(ed25519.constants.SIGN_BYTE_LENGTH + msg.length);
    var i;
    for (i = 0; i < ed25519.constants.SIGN_BYTE_LENGTH; ++i) {
      sm[i] = sig[i];
    }
    for (i = 0; i < msg.length; ++i) {
      sm[i + ed25519.constants.SIGN_BYTE_LENGTH] = msg[i];
    }
    return crypto_sign_open(m, sm, sm.length, publicKey) >= 0;
  };
  function messageToNativeBuffer(options) {
    var message = options.message;
    if (message instanceof Uint8Array || message instanceof NativeBuffer) {
      return message;
    }
    var encoding = options.encoding;
    if (message === void 0) {
      if (options.md) {
        message = options.md.digest().getBytes();
        encoding = "binary";
      } else {
        throw new TypeError('"options.message" or "options.md" not specified.');
      }
    }
    if (typeof message === "string" && !encoding) {
      throw new TypeError('"options.encoding" must be "binary" or "utf8".');
    }
    if (typeof message === "string") {
      if (typeof Buffer !== "undefined") {
        return Buffer.from(message, encoding);
      }
      message = new ByteBuffer(message, encoding);
    } else if (!(message instanceof ByteBuffer)) {
      throw new TypeError('"options.message" must be a node.js Buffer, a Uint8Array, a forge ByteBuffer, or a string with "options.encoding" specifying its encoding.');
    }
    var buffer = new NativeBuffer(message.length());
    for (var i = 0; i < buffer.length; ++i) {
      buffer[i] = message.at(i);
    }
    return buffer;
  }
  var gf0 = gf();
  var gf1 = gf([1]);
  var D = gf([
    30883,
    4953,
    19914,
    30187,
    55467,
    16705,
    2637,
    112,
    59544,
    30585,
    16505,
    36039,
    65139,
    11119,
    27886,
    20995
  ]);
  var D2 = gf([
    61785,
    9906,
    39828,
    60374,
    45398,
    33411,
    5274,
    224,
    53552,
    61171,
    33010,
    6542,
    64743,
    22239,
    55772,
    9222
  ]);
  var X = gf([
    54554,
    36645,
    11616,
    51542,
    42930,
    38181,
    51040,
    26924,
    56412,
    64982,
    57905,
    49316,
    21502,
    52590,
    14035,
    8553
  ]);
  var Y = gf([
    26200,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214
  ]);
  var L = new Float64Array([
    237,
    211,
    245,
    92,
    26,
    99,
    18,
    88,
    214,
    156,
    247,
    162,
    222,
    249,
    222,
    20,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    16
  ]);
  var I = gf([
    41136,
    18958,
    6951,
    50414,
    58488,
    44335,
    6150,
    12099,
    55207,
    15867,
    153,
    11085,
    57099,
    20417,
    9344,
    11139
  ]);
  function sha512(msg, msgLen) {
    var md = forge2.md.sha512.create();
    var buffer = new ByteBuffer(msg);
    md.update(buffer.getBytes(msgLen), "binary");
    var hash = md.digest().getBytes();
    if (typeof Buffer !== "undefined") {
      return Buffer.from(hash, "binary");
    }
    var out = new NativeBuffer(ed25519.constants.HASH_BYTE_LENGTH);
    for (var i = 0; i < 64; ++i) {
      out[i] = hash.charCodeAt(i);
    }
    return out;
  }
  function crypto_sign_keypair(pk, sk) {
    var p = [gf(), gf(), gf(), gf()];
    var i;
    var d = sha512(sk, 32);
    d[0] &= 248;
    d[31] &= 127;
    d[31] |= 64;
    scalarbase(p, d);
    pack(pk, p);
    for (i = 0; i < 32; ++i) {
      sk[i + 32] = pk[i];
    }
    return 0;
  }
  function crypto_sign(sm, m, n, sk) {
    var i, j, x = new Float64Array(64);
    var p = [gf(), gf(), gf(), gf()];
    var d = sha512(sk, 32);
    d[0] &= 248;
    d[31] &= 127;
    d[31] |= 64;
    var smlen = n + 64;
    for (i = 0; i < n; ++i) {
      sm[64 + i] = m[i];
    }
    for (i = 0; i < 32; ++i) {
      sm[32 + i] = d[32 + i];
    }
    var r = sha512(sm.subarray(32), n + 32);
    reduce(r);
    scalarbase(p, r);
    pack(sm, p);
    for (i = 32; i < 64; ++i) {
      sm[i] = sk[i];
    }
    var h = sha512(sm, n + 64);
    reduce(h);
    for (i = 32; i < 64; ++i) {
      x[i] = 0;
    }
    for (i = 0; i < 32; ++i) {
      x[i] = r[i];
    }
    for (i = 0; i < 32; ++i) {
      for (j = 0; j < 32; j++) {
        x[i + j] += h[i] * d[j];
      }
    }
    modL(sm.subarray(32), x);
    return smlen;
  }
  function crypto_sign_open(m, sm, n, pk) {
    var i, mlen;
    var t = new NativeBuffer(32);
    var p = [gf(), gf(), gf(), gf()], q = [gf(), gf(), gf(), gf()];
    mlen = -1;
    if (n < 64) {
      return -1;
    }
    if (unpackneg(q, pk)) {
      return -1;
    }
    for (i = 0; i < n; ++i) {
      m[i] = sm[i];
    }
    for (i = 0; i < 32; ++i) {
      m[i + 32] = pk[i];
    }
    var h = sha512(m, n);
    reduce(h);
    scalarmult(p, q, h);
    scalarbase(q, sm.subarray(32));
    add(p, q);
    pack(t, p);
    n -= 64;
    if (crypto_verify_32(sm, 0, t, 0)) {
      for (i = 0; i < n; ++i) {
        m[i] = 0;
      }
      return -1;
    }
    for (i = 0; i < n; ++i) {
      m[i] = sm[i + 64];
    }
    mlen = n;
    return mlen;
  }
  function modL(r, x) {
    var carry, i, j, k;
    for (i = 63; i >= 32; --i) {
      carry = 0;
      for (j = i - 32, k = i - 12; j < k; ++j) {
        x[j] += carry - 16 * x[i] * L[j - (i - 32)];
        carry = x[j] + 128 >> 8;
        x[j] -= carry * 256;
      }
      x[j] += carry;
      x[i] = 0;
    }
    carry = 0;
    for (j = 0; j < 32; ++j) {
      x[j] += carry - (x[31] >> 4) * L[j];
      carry = x[j] >> 8;
      x[j] &= 255;
    }
    for (j = 0; j < 32; ++j) {
      x[j] -= carry * L[j];
    }
    for (i = 0; i < 32; ++i) {
      x[i + 1] += x[i] >> 8;
      r[i] = x[i] & 255;
    }
  }
  function reduce(r) {
    var x = new Float64Array(64);
    for (var i = 0; i < 64; ++i) {
      x[i] = r[i];
      r[i] = 0;
    }
    modL(r, x);
  }
  function add(p, q) {
    var a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf(), g = gf(), h = gf(), t = gf();
    Z(a, p[1], p[0]);
    Z(t, q[1], q[0]);
    M(a, a, t);
    A(b, p[0], p[1]);
    A(t, q[0], q[1]);
    M(b, b, t);
    M(c, p[3], q[3]);
    M(c, c, D2);
    M(d, p[2], q[2]);
    A(d, d, d);
    Z(e, b, a);
    Z(f, d, c);
    A(g, d, c);
    A(h, b, a);
    M(p[0], e, f);
    M(p[1], h, g);
    M(p[2], g, f);
    M(p[3], e, h);
  }
  function cswap(p, q, b) {
    for (var i = 0; i < 4; ++i) {
      sel25519(p[i], q[i], b);
    }
  }
  function pack(r, p) {
    var tx = gf(), ty = gf(), zi = gf();
    inv25519(zi, p[2]);
    M(tx, p[0], zi);
    M(ty, p[1], zi);
    pack25519(r, ty);
    r[31] ^= par25519(tx) << 7;
  }
  function pack25519(o, n) {
    var i, j, b;
    var m = gf(), t = gf();
    for (i = 0; i < 16; ++i) {
      t[i] = n[i];
    }
    car25519(t);
    car25519(t);
    car25519(t);
    for (j = 0; j < 2; ++j) {
      m[0] = t[0] - 65517;
      for (i = 1; i < 15; ++i) {
        m[i] = t[i] - 65535 - (m[i - 1] >> 16 & 1);
        m[i - 1] &= 65535;
      }
      m[15] = t[15] - 32767 - (m[14] >> 16 & 1);
      b = m[15] >> 16 & 1;
      m[14] &= 65535;
      sel25519(t, m, 1 - b);
    }
    for (i = 0; i < 16; i++) {
      o[2 * i] = t[i] & 255;
      o[2 * i + 1] = t[i] >> 8;
    }
  }
  function unpackneg(r, p) {
    var t = gf(), chk = gf(), num = gf(), den = gf(), den2 = gf(), den4 = gf(), den6 = gf();
    set25519(r[2], gf1);
    unpack25519(r[1], p);
    S(num, r[1]);
    M(den, num, D);
    Z(num, num, r[2]);
    A(den, r[2], den);
    S(den2, den);
    S(den4, den2);
    M(den6, den4, den2);
    M(t, den6, num);
    M(t, t, den);
    pow2523(t, t);
    M(t, t, num);
    M(t, t, den);
    M(t, t, den);
    M(r[0], t, den);
    S(chk, r[0]);
    M(chk, chk, den);
    if (neq25519(chk, num)) {
      M(r[0], r[0], I);
    }
    S(chk, r[0]);
    M(chk, chk, den);
    if (neq25519(chk, num)) {
      return -1;
    }
    if (par25519(r[0]) === p[31] >> 7) {
      Z(r[0], gf0, r[0]);
    }
    M(r[3], r[0], r[1]);
    return 0;
  }
  function unpack25519(o, n) {
    var i;
    for (i = 0; i < 16; ++i) {
      o[i] = n[2 * i] + (n[2 * i + 1] << 8);
    }
    o[15] &= 32767;
  }
  function pow2523(o, i) {
    var c = gf();
    var a;
    for (a = 0; a < 16; ++a) {
      c[a] = i[a];
    }
    for (a = 250; a >= 0; --a) {
      S(c, c);
      if (a !== 1) {
        M(c, c, i);
      }
    }
    for (a = 0; a < 16; ++a) {
      o[a] = c[a];
    }
  }
  function neq25519(a, b) {
    var c = new NativeBuffer(32);
    var d = new NativeBuffer(32);
    pack25519(c, a);
    pack25519(d, b);
    return crypto_verify_32(c, 0, d, 0);
  }
  function crypto_verify_32(x, xi, y, yi) {
    return vn(x, xi, y, yi, 32);
  }
  function vn(x, xi, y, yi, n) {
    var i, d = 0;
    for (i = 0; i < n; ++i) {
      d |= x[xi + i] ^ y[yi + i];
    }
    return (1 & d - 1 >>> 8) - 1;
  }
  function par25519(a) {
    var d = new NativeBuffer(32);
    pack25519(d, a);
    return d[0] & 1;
  }
  function scalarmult(p, q, s) {
    var b, i;
    set25519(p[0], gf0);
    set25519(p[1], gf1);
    set25519(p[2], gf1);
    set25519(p[3], gf0);
    for (i = 255; i >= 0; --i) {
      b = s[i / 8 | 0] >> (i & 7) & 1;
      cswap(p, q, b);
      add(q, p);
      add(p, p);
      cswap(p, q, b);
    }
  }
  function scalarbase(p, s) {
    var q = [gf(), gf(), gf(), gf()];
    set25519(q[0], X);
    set25519(q[1], Y);
    set25519(q[2], gf1);
    M(q[3], X, Y);
    scalarmult(p, q, s);
  }
  function set25519(r, a) {
    var i;
    for (i = 0; i < 16; i++) {
      r[i] = a[i] | 0;
    }
  }
  function inv25519(o, i) {
    var c = gf();
    var a;
    for (a = 0; a < 16; ++a) {
      c[a] = i[a];
    }
    for (a = 253; a >= 0; --a) {
      S(c, c);
      if (a !== 2 && a !== 4) {
        M(c, c, i);
      }
    }
    for (a = 0; a < 16; ++a) {
      o[a] = c[a];
    }
  }
  function car25519(o) {
    var i, v, c = 1;
    for (i = 0; i < 16; ++i) {
      v = o[i] + c + 65535;
      c = Math.floor(v / 65536);
      o[i] = v - c * 65536;
    }
    o[0] += c - 1 + 37 * (c - 1);
  }
  function sel25519(p, q, b) {
    var t, c = ~(b - 1);
    for (var i = 0; i < 16; ++i) {
      t = c & (p[i] ^ q[i]);
      p[i] ^= t;
      q[i] ^= t;
    }
  }
  function gf(init) {
    var i, r = new Float64Array(16);
    if (init) {
      for (i = 0; i < init.length; ++i) {
        r[i] = init[i];
      }
    }
    return r;
  }
  function A(o, a, b) {
    for (var i = 0; i < 16; ++i) {
      o[i] = a[i] + b[i];
    }
  }
  function Z(o, a, b) {
    for (var i = 0; i < 16; ++i) {
      o[i] = a[i] - b[i];
    }
  }
  function S(o, a) {
    M(o, a, a);
  }
  function M(o, a, b) {
    var v, c, t0 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0, t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0, t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0, b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11], b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
    v = a[0];
    t0 += v * b0;
    t1 += v * b1;
    t2 += v * b2;
    t3 += v * b3;
    t4 += v * b4;
    t5 += v * b5;
    t6 += v * b6;
    t7 += v * b7;
    t8 += v * b8;
    t9 += v * b9;
    t10 += v * b10;
    t11 += v * b11;
    t12 += v * b12;
    t13 += v * b13;
    t14 += v * b14;
    t15 += v * b15;
    v = a[1];
    t1 += v * b0;
    t2 += v * b1;
    t3 += v * b2;
    t4 += v * b3;
    t5 += v * b4;
    t6 += v * b5;
    t7 += v * b6;
    t8 += v * b7;
    t9 += v * b8;
    t10 += v * b9;
    t11 += v * b10;
    t12 += v * b11;
    t13 += v * b12;
    t14 += v * b13;
    t15 += v * b14;
    t16 += v * b15;
    v = a[2];
    t2 += v * b0;
    t3 += v * b1;
    t4 += v * b2;
    t5 += v * b3;
    t6 += v * b4;
    t7 += v * b5;
    t8 += v * b6;
    t9 += v * b7;
    t10 += v * b8;
    t11 += v * b9;
    t12 += v * b10;
    t13 += v * b11;
    t14 += v * b12;
    t15 += v * b13;
    t16 += v * b14;
    t17 += v * b15;
    v = a[3];
    t3 += v * b0;
    t4 += v * b1;
    t5 += v * b2;
    t6 += v * b3;
    t7 += v * b4;
    t8 += v * b5;
    t9 += v * b6;
    t10 += v * b7;
    t11 += v * b8;
    t12 += v * b9;
    t13 += v * b10;
    t14 += v * b11;
    t15 += v * b12;
    t16 += v * b13;
    t17 += v * b14;
    t18 += v * b15;
    v = a[4];
    t4 += v * b0;
    t5 += v * b1;
    t6 += v * b2;
    t7 += v * b3;
    t8 += v * b4;
    t9 += v * b5;
    t10 += v * b6;
    t11 += v * b7;
    t12 += v * b8;
    t13 += v * b9;
    t14 += v * b10;
    t15 += v * b11;
    t16 += v * b12;
    t17 += v * b13;
    t18 += v * b14;
    t19 += v * b15;
    v = a[5];
    t5 += v * b0;
    t6 += v * b1;
    t7 += v * b2;
    t8 += v * b3;
    t9 += v * b4;
    t10 += v * b5;
    t11 += v * b6;
    t12 += v * b7;
    t13 += v * b8;
    t14 += v * b9;
    t15 += v * b10;
    t16 += v * b11;
    t17 += v * b12;
    t18 += v * b13;
    t19 += v * b14;
    t20 += v * b15;
    v = a[6];
    t6 += v * b0;
    t7 += v * b1;
    t8 += v * b2;
    t9 += v * b3;
    t10 += v * b4;
    t11 += v * b5;
    t12 += v * b6;
    t13 += v * b7;
    t14 += v * b8;
    t15 += v * b9;
    t16 += v * b10;
    t17 += v * b11;
    t18 += v * b12;
    t19 += v * b13;
    t20 += v * b14;
    t21 += v * b15;
    v = a[7];
    t7 += v * b0;
    t8 += v * b1;
    t9 += v * b2;
    t10 += v * b3;
    t11 += v * b4;
    t12 += v * b5;
    t13 += v * b6;
    t14 += v * b7;
    t15 += v * b8;
    t16 += v * b9;
    t17 += v * b10;
    t18 += v * b11;
    t19 += v * b12;
    t20 += v * b13;
    t21 += v * b14;
    t22 += v * b15;
    v = a[8];
    t8 += v * b0;
    t9 += v * b1;
    t10 += v * b2;
    t11 += v * b3;
    t12 += v * b4;
    t13 += v * b5;
    t14 += v * b6;
    t15 += v * b7;
    t16 += v * b8;
    t17 += v * b9;
    t18 += v * b10;
    t19 += v * b11;
    t20 += v * b12;
    t21 += v * b13;
    t22 += v * b14;
    t23 += v * b15;
    v = a[9];
    t9 += v * b0;
    t10 += v * b1;
    t11 += v * b2;
    t12 += v * b3;
    t13 += v * b4;
    t14 += v * b5;
    t15 += v * b6;
    t16 += v * b7;
    t17 += v * b8;
    t18 += v * b9;
    t19 += v * b10;
    t20 += v * b11;
    t21 += v * b12;
    t22 += v * b13;
    t23 += v * b14;
    t24 += v * b15;
    v = a[10];
    t10 += v * b0;
    t11 += v * b1;
    t12 += v * b2;
    t13 += v * b3;
    t14 += v * b4;
    t15 += v * b5;
    t16 += v * b6;
    t17 += v * b7;
    t18 += v * b8;
    t19 += v * b9;
    t20 += v * b10;
    t21 += v * b11;
    t22 += v * b12;
    t23 += v * b13;
    t24 += v * b14;
    t25 += v * b15;
    v = a[11];
    t11 += v * b0;
    t12 += v * b1;
    t13 += v * b2;
    t14 += v * b3;
    t15 += v * b4;
    t16 += v * b5;
    t17 += v * b6;
    t18 += v * b7;
    t19 += v * b8;
    t20 += v * b9;
    t21 += v * b10;
    t22 += v * b11;
    t23 += v * b12;
    t24 += v * b13;
    t25 += v * b14;
    t26 += v * b15;
    v = a[12];
    t12 += v * b0;
    t13 += v * b1;
    t14 += v * b2;
    t15 += v * b3;
    t16 += v * b4;
    t17 += v * b5;
    t18 += v * b6;
    t19 += v * b7;
    t20 += v * b8;
    t21 += v * b9;
    t22 += v * b10;
    t23 += v * b11;
    t24 += v * b12;
    t25 += v * b13;
    t26 += v * b14;
    t27 += v * b15;
    v = a[13];
    t13 += v * b0;
    t14 += v * b1;
    t15 += v * b2;
    t16 += v * b3;
    t17 += v * b4;
    t18 += v * b5;
    t19 += v * b6;
    t20 += v * b7;
    t21 += v * b8;
    t22 += v * b9;
    t23 += v * b10;
    t24 += v * b11;
    t25 += v * b12;
    t26 += v * b13;
    t27 += v * b14;
    t28 += v * b15;
    v = a[14];
    t14 += v * b0;
    t15 += v * b1;
    t16 += v * b2;
    t17 += v * b3;
    t18 += v * b4;
    t19 += v * b5;
    t20 += v * b6;
    t21 += v * b7;
    t22 += v * b8;
    t23 += v * b9;
    t24 += v * b10;
    t25 += v * b11;
    t26 += v * b12;
    t27 += v * b13;
    t28 += v * b14;
    t29 += v * b15;
    v = a[15];
    t15 += v * b0;
    t16 += v * b1;
    t17 += v * b2;
    t18 += v * b3;
    t19 += v * b4;
    t20 += v * b5;
    t21 += v * b6;
    t22 += v * b7;
    t23 += v * b8;
    t24 += v * b9;
    t25 += v * b10;
    t26 += v * b11;
    t27 += v * b12;
    t28 += v * b13;
    t29 += v * b14;
    t30 += v * b15;
    t0 += 38 * t16;
    t1 += 38 * t17;
    t2 += 38 * t18;
    t3 += 38 * t19;
    t4 += 38 * t20;
    t5 += 38 * t21;
    t6 += 38 * t22;
    t7 += 38 * t23;
    t8 += 38 * t24;
    t9 += 38 * t25;
    t10 += 38 * t26;
    t11 += 38 * t27;
    t12 += 38 * t28;
    t13 += 38 * t29;
    t14 += 38 * t30;
    c = 1;
    v = t0 + c + 65535;
    c = Math.floor(v / 65536);
    t0 = v - c * 65536;
    v = t1 + c + 65535;
    c = Math.floor(v / 65536);
    t1 = v - c * 65536;
    v = t2 + c + 65535;
    c = Math.floor(v / 65536);
    t2 = v - c * 65536;
    v = t3 + c + 65535;
    c = Math.floor(v / 65536);
    t3 = v - c * 65536;
    v = t4 + c + 65535;
    c = Math.floor(v / 65536);
    t4 = v - c * 65536;
    v = t5 + c + 65535;
    c = Math.floor(v / 65536);
    t5 = v - c * 65536;
    v = t6 + c + 65535;
    c = Math.floor(v / 65536);
    t6 = v - c * 65536;
    v = t7 + c + 65535;
    c = Math.floor(v / 65536);
    t7 = v - c * 65536;
    v = t8 + c + 65535;
    c = Math.floor(v / 65536);
    t8 = v - c * 65536;
    v = t9 + c + 65535;
    c = Math.floor(v / 65536);
    t9 = v - c * 65536;
    v = t10 + c + 65535;
    c = Math.floor(v / 65536);
    t10 = v - c * 65536;
    v = t11 + c + 65535;
    c = Math.floor(v / 65536);
    t11 = v - c * 65536;
    v = t12 + c + 65535;
    c = Math.floor(v / 65536);
    t12 = v - c * 65536;
    v = t13 + c + 65535;
    c = Math.floor(v / 65536);
    t13 = v - c * 65536;
    v = t14 + c + 65535;
    c = Math.floor(v / 65536);
    t14 = v - c * 65536;
    v = t15 + c + 65535;
    c = Math.floor(v / 65536);
    t15 = v - c * 65536;
    t0 += c - 1 + 37 * (c - 1);
    c = 1;
    v = t0 + c + 65535;
    c = Math.floor(v / 65536);
    t0 = v - c * 65536;
    v = t1 + c + 65535;
    c = Math.floor(v / 65536);
    t1 = v - c * 65536;
    v = t2 + c + 65535;
    c = Math.floor(v / 65536);
    t2 = v - c * 65536;
    v = t3 + c + 65535;
    c = Math.floor(v / 65536);
    t3 = v - c * 65536;
    v = t4 + c + 65535;
    c = Math.floor(v / 65536);
    t4 = v - c * 65536;
    v = t5 + c + 65535;
    c = Math.floor(v / 65536);
    t5 = v - c * 65536;
    v = t6 + c + 65535;
    c = Math.floor(v / 65536);
    t6 = v - c * 65536;
    v = t7 + c + 65535;
    c = Math.floor(v / 65536);
    t7 = v - c * 65536;
    v = t8 + c + 65535;
    c = Math.floor(v / 65536);
    t8 = v - c * 65536;
    v = t9 + c + 65535;
    c = Math.floor(v / 65536);
    t9 = v - c * 65536;
    v = t10 + c + 65535;
    c = Math.floor(v / 65536);
    t10 = v - c * 65536;
    v = t11 + c + 65535;
    c = Math.floor(v / 65536);
    t11 = v - c * 65536;
    v = t12 + c + 65535;
    c = Math.floor(v / 65536);
    t12 = v - c * 65536;
    v = t13 + c + 65535;
    c = Math.floor(v / 65536);
    t13 = v - c * 65536;
    v = t14 + c + 65535;
    c = Math.floor(v / 65536);
    t14 = v - c * 65536;
    v = t15 + c + 65535;
    c = Math.floor(v / 65536);
    t15 = v - c * 65536;
    t0 += c - 1 + 37 * (c - 1);
    o[0] = t0;
    o[1] = t1;
    o[2] = t2;
    o[3] = t3;
    o[4] = t4;
    o[5] = t5;
    o[6] = t6;
    o[7] = t7;
    o[8] = t8;
    o[9] = t9;
    o[10] = t10;
    o[11] = t11;
    o[12] = t12;
    o[13] = t13;
    o[14] = t14;
    o[15] = t15;
  }
});

// node_modules/node-forge/lib/kem.js
var require_kem = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_util();
  require_random();
  require_jsbn();
  module2.exports = forge2.kem = forge2.kem || {};
  var BigInteger = forge2.jsbn.BigInteger;
  forge2.kem.rsa = {};
  forge2.kem.rsa.create = function(kdf, options) {
    options = options || {};
    var prng = options.prng || forge2.random;
    var kem = {};
    kem.encrypt = function(publicKey, keyLength) {
      var byteLength = Math.ceil(publicKey.n.bitLength() / 8);
      var r;
      do {
        r = new BigInteger(forge2.util.bytesToHex(prng.getBytesSync(byteLength)), 16).mod(publicKey.n);
      } while (r.compareTo(BigInteger.ONE) <= 0);
      r = forge2.util.hexToBytes(r.toString(16));
      var zeros = byteLength - r.length;
      if (zeros > 0) {
        r = forge2.util.fillString(String.fromCharCode(0), zeros) + r;
      }
      var encapsulation = publicKey.encrypt(r, "NONE");
      var key = kdf.generate(r, keyLength);
      return {encapsulation, key};
    };
    kem.decrypt = function(privateKey, encapsulation, keyLength) {
      var r = privateKey.decrypt(encapsulation, "NONE");
      return kdf.generate(r, keyLength);
    };
    return kem;
  };
  forge2.kem.kdf1 = function(md, digestLength) {
    _createKDF(this, md, 0, digestLength || md.digestLength);
  };
  forge2.kem.kdf2 = function(md, digestLength) {
    _createKDF(this, md, 1, digestLength || md.digestLength);
  };
  function _createKDF(kdf, md, counterStart, digestLength) {
    kdf.generate = function(x, length) {
      var key = new forge2.util.ByteBuffer();
      var k = Math.ceil(length / digestLength) + counterStart;
      var c = new forge2.util.ByteBuffer();
      for (var i = counterStart; i < k; ++i) {
        c.putInt32(i);
        md.start();
        md.update(x + c.getBytes());
        var hash = md.digest();
        key.putBytes(hash.getBytes(digestLength));
      }
      key.truncate(key.length() - length);
      return key.getBytes();
    };
  }
});

// node_modules/node-forge/lib/log.js
var require_log = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_util();
  module2.exports = forge2.log = forge2.log || {};
  forge2.log.levels = [
    "none",
    "error",
    "warning",
    "info",
    "debug",
    "verbose",
    "max"
  ];
  var sLevelInfo = {};
  var sLoggers = [];
  var sConsoleLogger = null;
  forge2.log.LEVEL_LOCKED = 1 << 1;
  forge2.log.NO_LEVEL_CHECK = 1 << 2;
  forge2.log.INTERPOLATE = 1 << 3;
  for (var i = 0; i < forge2.log.levels.length; ++i) {
    level = forge2.log.levels[i];
    sLevelInfo[level] = {
      index: i,
      name: level.toUpperCase()
    };
  }
  var level;
  forge2.log.logMessage = function(message) {
    var messageLevelIndex = sLevelInfo[message.level].index;
    for (var i2 = 0; i2 < sLoggers.length; ++i2) {
      var logger2 = sLoggers[i2];
      if (logger2.flags & forge2.log.NO_LEVEL_CHECK) {
        logger2.f(message);
      } else {
        var loggerLevelIndex = sLevelInfo[logger2.level].index;
        if (messageLevelIndex <= loggerLevelIndex) {
          logger2.f(logger2, message);
        }
      }
    }
  };
  forge2.log.prepareStandard = function(message) {
    if (!("standard" in message)) {
      message.standard = sLevelInfo[message.level].name + " [" + message.category + "] " + message.message;
    }
  };
  forge2.log.prepareFull = function(message) {
    if (!("full" in message)) {
      var args = [message.message];
      args = args.concat([] || message["arguments"]);
      message.full = forge2.util.format.apply(this, args);
    }
  };
  forge2.log.prepareStandardFull = function(message) {
    if (!("standardFull" in message)) {
      forge2.log.prepareStandard(message);
      message.standardFull = message.standard;
    }
  };
  if (true) {
    levels = ["error", "warning", "info", "debug", "verbose"];
    for (var i = 0; i < levels.length; ++i) {
      (function(level2) {
        forge2.log[level2] = function(category, message) {
          var args = Array.prototype.slice.call(arguments).slice(2);
          var msg = {
            timestamp: new Date(),
            level: level2,
            category,
            message,
            arguments: args
          };
          forge2.log.logMessage(msg);
        };
      })(levels[i]);
    }
  }
  var levels;
  forge2.log.makeLogger = function(logFunction) {
    var logger2 = {
      flags: 0,
      f: logFunction
    };
    forge2.log.setLevel(logger2, "none");
    return logger2;
  };
  forge2.log.setLevel = function(logger2, level2) {
    var rval = false;
    if (logger2 && !(logger2.flags & forge2.log.LEVEL_LOCKED)) {
      for (var i2 = 0; i2 < forge2.log.levels.length; ++i2) {
        var aValidLevel = forge2.log.levels[i2];
        if (level2 == aValidLevel) {
          logger2.level = level2;
          rval = true;
          break;
        }
      }
    }
    return rval;
  };
  forge2.log.lock = function(logger2, lock2) {
    if (typeof lock2 === "undefined" || lock2) {
      logger2.flags |= forge2.log.LEVEL_LOCKED;
    } else {
      logger2.flags &= ~forge2.log.LEVEL_LOCKED;
    }
  };
  forge2.log.addLogger = function(logger2) {
    sLoggers.push(logger2);
  };
  if (typeof console !== "undefined" && "log" in console) {
    if (console.error && console.warn && console.info && console.debug) {
      levelHandlers = {
        error: console.error,
        warning: console.warn,
        info: console.info,
        debug: console.debug,
        verbose: console.debug
      };
      f = function(logger2, message) {
        forge2.log.prepareStandard(message);
        var handler = levelHandlers[message.level];
        var args = [message.standard];
        args = args.concat(message["arguments"].slice());
        handler.apply(console, args);
      };
      logger = forge2.log.makeLogger(f);
    } else {
      f = function(logger2, message) {
        forge2.log.prepareStandardFull(message);
        console.log(message.standardFull);
      };
      logger = forge2.log.makeLogger(f);
    }
    forge2.log.setLevel(logger, "debug");
    forge2.log.addLogger(logger);
    sConsoleLogger = logger;
  } else {
    console = {
      log: function() {
      }
    };
  }
  var logger;
  var levelHandlers;
  var f;
  if (sConsoleLogger !== null) {
    query = forge2.util.getQueryVariables();
    if ("console.level" in query) {
      forge2.log.setLevel(sConsoleLogger, query["console.level"].slice(-1)[0]);
    }
    if ("console.lock" in query) {
      lock = query["console.lock"].slice(-1)[0];
      if (lock == "true") {
        forge2.log.lock(sConsoleLogger);
      }
    }
  }
  var query;
  var lock;
  forge2.log.consoleLogger = sConsoleLogger;
});

// node_modules/node-forge/lib/md.all.js
var require_md_all = __commonJS((exports2, module2) => {
  module2.exports = require_md();
  require_md5();
  require_sha1();
  require_sha256();
  require_sha512();
});

// node_modules/node-forge/lib/pkcs7.js
var require_pkcs7 = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_aes();
  require_asn1();
  require_des();
  require_oids();
  require_pem();
  require_pkcs7asn1();
  require_random();
  require_util();
  require_x509();
  var asn1 = forge2.asn1;
  var p7 = module2.exports = forge2.pkcs7 = forge2.pkcs7 || {};
  p7.messageFromPem = function(pem) {
    var msg = forge2.pem.decode(pem)[0];
    if (msg.type !== "PKCS7") {
      var error = new Error('Could not convert PKCS#7 message from PEM; PEM header type is not "PKCS#7".');
      error.headerType = msg.type;
      throw error;
    }
    if (msg.procType && msg.procType.type === "ENCRYPTED") {
      throw new Error("Could not convert PKCS#7 message from PEM; PEM is encrypted.");
    }
    var obj = asn1.fromDer(msg.body);
    return p7.messageFromAsn1(obj);
  };
  p7.messageToPem = function(msg, maxline) {
    var pemObj = {
      type: "PKCS7",
      body: asn1.toDer(msg.toAsn1()).getBytes()
    };
    return forge2.pem.encode(pemObj, {maxline});
  };
  p7.messageFromAsn1 = function(obj) {
    var capture = {};
    var errors = [];
    if (!asn1.validate(obj, p7.asn1.contentInfoValidator, capture, errors)) {
      var error = new Error("Cannot read PKCS#7 message. ASN.1 object is not an PKCS#7 ContentInfo.");
      error.errors = errors;
      throw error;
    }
    var contentType = asn1.derToOid(capture.contentType);
    var msg;
    switch (contentType) {
      case forge2.pki.oids.envelopedData:
        msg = p7.createEnvelopedData();
        break;
      case forge2.pki.oids.encryptedData:
        msg = p7.createEncryptedData();
        break;
      case forge2.pki.oids.signedData:
        msg = p7.createSignedData();
        break;
      default:
        throw new Error("Cannot read PKCS#7 message. ContentType with OID " + contentType + " is not (yet) supported.");
    }
    msg.fromAsn1(capture.content.value[0]);
    return msg;
  };
  p7.createSignedData = function() {
    var msg = null;
    msg = {
      type: forge2.pki.oids.signedData,
      version: 1,
      certificates: [],
      crls: [],
      signers: [],
      digestAlgorithmIdentifiers: [],
      contentInfo: null,
      signerInfos: [],
      fromAsn1: function(obj) {
        _fromAsn1(msg, obj, p7.asn1.signedDataValidator);
        msg.certificates = [];
        msg.crls = [];
        msg.digestAlgorithmIdentifiers = [];
        msg.contentInfo = null;
        msg.signerInfos = [];
        if (msg.rawCapture.certificates) {
          var certs = msg.rawCapture.certificates.value;
          for (var i = 0; i < certs.length; ++i) {
            msg.certificates.push(forge2.pki.certificateFromAsn1(certs[i]));
          }
        }
      },
      toAsn1: function() {
        if (!msg.contentInfo) {
          msg.sign();
        }
        var certs = [];
        for (var i = 0; i < msg.certificates.length; ++i) {
          certs.push(forge2.pki.certificateToAsn1(msg.certificates[i]));
        }
        var crls = [];
        var signedData = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(msg.version).getBytes()),
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, msg.digestAlgorithmIdentifiers),
            msg.contentInfo
          ])
        ]);
        if (certs.length > 0) {
          signedData.value[0].value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, certs));
        }
        if (crls.length > 0) {
          signedData.value[0].value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, crls));
        }
        signedData.value[0].value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, msg.signerInfos));
        return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(msg.type).getBytes()),
          signedData
        ]);
      },
      addSigner: function(signer) {
        var issuer = signer.issuer;
        var serialNumber = signer.serialNumber;
        if (signer.certificate) {
          var cert = signer.certificate;
          if (typeof cert === "string") {
            cert = forge2.pki.certificateFromPem(cert);
          }
          issuer = cert.issuer.attributes;
          serialNumber = cert.serialNumber;
        }
        var key = signer.key;
        if (!key) {
          throw new Error("Could not add PKCS#7 signer; no private key specified.");
        }
        if (typeof key === "string") {
          key = forge2.pki.privateKeyFromPem(key);
        }
        var digestAlgorithm = signer.digestAlgorithm || forge2.pki.oids.sha1;
        switch (digestAlgorithm) {
          case forge2.pki.oids.sha1:
          case forge2.pki.oids.sha256:
          case forge2.pki.oids.sha384:
          case forge2.pki.oids.sha512:
          case forge2.pki.oids.md5:
            break;
          default:
            throw new Error("Could not add PKCS#7 signer; unknown message digest algorithm: " + digestAlgorithm);
        }
        var authenticatedAttributes = signer.authenticatedAttributes || [];
        if (authenticatedAttributes.length > 0) {
          var contentType = false;
          var messageDigest = false;
          for (var i = 0; i < authenticatedAttributes.length; ++i) {
            var attr = authenticatedAttributes[i];
            if (!contentType && attr.type === forge2.pki.oids.contentType) {
              contentType = true;
              if (messageDigest) {
                break;
              }
              continue;
            }
            if (!messageDigest && attr.type === forge2.pki.oids.messageDigest) {
              messageDigest = true;
              if (contentType) {
                break;
              }
              continue;
            }
          }
          if (!contentType || !messageDigest) {
            throw new Error("Invalid signer.authenticatedAttributes. If signer.authenticatedAttributes is specified, then it must contain at least two attributes, PKCS #9 content-type and PKCS #9 message-digest.");
          }
        }
        msg.signers.push({
          key,
          version: 1,
          issuer,
          serialNumber,
          digestAlgorithm,
          signatureAlgorithm: forge2.pki.oids.rsaEncryption,
          signature: null,
          authenticatedAttributes,
          unauthenticatedAttributes: []
        });
      },
      sign: function(options) {
        options = options || {};
        if (typeof msg.content !== "object" || msg.contentInfo === null) {
          msg.contentInfo = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(forge2.pki.oids.data).getBytes())
          ]);
          if ("content" in msg) {
            var content;
            if (msg.content instanceof forge2.util.ByteBuffer) {
              content = msg.content.bytes();
            } else if (typeof msg.content === "string") {
              content = forge2.util.encodeUtf8(msg.content);
            }
            if (options.detached) {
              msg.detachedContent = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, content);
            } else {
              msg.contentInfo.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
                asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, content)
              ]));
            }
          }
        }
        if (msg.signers.length === 0) {
          return;
        }
        var mds = addDigestAlgorithmIds();
        addSignerInfos(mds);
      },
      verify: function() {
        throw new Error("PKCS#7 signature verification not yet implemented.");
      },
      addCertificate: function(cert) {
        if (typeof cert === "string") {
          cert = forge2.pki.certificateFromPem(cert);
        }
        msg.certificates.push(cert);
      },
      addCertificateRevokationList: function(crl) {
        throw new Error("PKCS#7 CRL support not yet implemented.");
      }
    };
    return msg;
    function addDigestAlgorithmIds() {
      var mds = {};
      for (var i = 0; i < msg.signers.length; ++i) {
        var signer = msg.signers[i];
        var oid = signer.digestAlgorithm;
        if (!(oid in mds)) {
          mds[oid] = forge2.md[forge2.pki.oids[oid]].create();
        }
        if (signer.authenticatedAttributes.length === 0) {
          signer.md = mds[oid];
        } else {
          signer.md = forge2.md[forge2.pki.oids[oid]].create();
        }
      }
      msg.digestAlgorithmIdentifiers = [];
      for (var oid in mds) {
        msg.digestAlgorithmIdentifiers.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(oid).getBytes()),
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
        ]));
      }
      return mds;
    }
    function addSignerInfos(mds) {
      var content;
      if (msg.detachedContent) {
        content = msg.detachedContent;
      } else {
        content = msg.contentInfo.value[1];
        content = content.value[0];
      }
      if (!content) {
        throw new Error("Could not sign PKCS#7 message; there is no content to sign.");
      }
      var contentType = asn1.derToOid(msg.contentInfo.value[0].value);
      var bytes = asn1.toDer(content);
      bytes.getByte();
      asn1.getBerValueLength(bytes);
      bytes = bytes.getBytes();
      for (var oid in mds) {
        mds[oid].start().update(bytes);
      }
      var signingTime = new Date();
      for (var i = 0; i < msg.signers.length; ++i) {
        var signer = msg.signers[i];
        if (signer.authenticatedAttributes.length === 0) {
          if (contentType !== forge2.pki.oids.data) {
            throw new Error("Invalid signer; authenticatedAttributes must be present when the ContentInfo content type is not PKCS#7 Data.");
          }
        } else {
          signer.authenticatedAttributesAsn1 = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, []);
          var attrsAsn1 = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, []);
          for (var ai = 0; ai < signer.authenticatedAttributes.length; ++ai) {
            var attr = signer.authenticatedAttributes[ai];
            if (attr.type === forge2.pki.oids.messageDigest) {
              attr.value = mds[signer.digestAlgorithm].digest();
            } else if (attr.type === forge2.pki.oids.signingTime) {
              if (!attr.value) {
                attr.value = signingTime;
              }
            }
            attrsAsn1.value.push(_attributeToAsn1(attr));
            signer.authenticatedAttributesAsn1.value.push(_attributeToAsn1(attr));
          }
          bytes = asn1.toDer(attrsAsn1).getBytes();
          signer.md.start().update(bytes);
        }
        signer.signature = signer.key.sign(signer.md, "RSASSA-PKCS1-V1_5");
      }
      msg.signerInfos = _signersToAsn1(msg.signers);
    }
  };
  p7.createEncryptedData = function() {
    var msg = null;
    msg = {
      type: forge2.pki.oids.encryptedData,
      version: 0,
      encryptedContent: {
        algorithm: forge2.pki.oids["aes256-CBC"]
      },
      fromAsn1: function(obj) {
        _fromAsn1(msg, obj, p7.asn1.encryptedDataValidator);
      },
      decrypt: function(key) {
        if (key !== void 0) {
          msg.encryptedContent.key = key;
        }
        _decryptContent(msg);
      }
    };
    return msg;
  };
  p7.createEnvelopedData = function() {
    var msg = null;
    msg = {
      type: forge2.pki.oids.envelopedData,
      version: 0,
      recipients: [],
      encryptedContent: {
        algorithm: forge2.pki.oids["aes256-CBC"]
      },
      fromAsn1: function(obj) {
        var capture = _fromAsn1(msg, obj, p7.asn1.envelopedDataValidator);
        msg.recipients = _recipientsFromAsn1(capture.recipientInfos.value);
      },
      toAsn1: function() {
        return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(msg.type).getBytes()),
          asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(msg.version).getBytes()),
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, _recipientsToAsn1(msg.recipients)),
              asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, _encryptedContentToAsn1(msg.encryptedContent))
            ])
          ])
        ]);
      },
      findRecipient: function(cert) {
        var sAttr = cert.issuer.attributes;
        for (var i = 0; i < msg.recipients.length; ++i) {
          var r = msg.recipients[i];
          var rAttr = r.issuer;
          if (r.serialNumber !== cert.serialNumber) {
            continue;
          }
          if (rAttr.length !== sAttr.length) {
            continue;
          }
          var match = true;
          for (var j = 0; j < sAttr.length; ++j) {
            if (rAttr[j].type !== sAttr[j].type || rAttr[j].value !== sAttr[j].value) {
              match = false;
              break;
            }
          }
          if (match) {
            return r;
          }
        }
        return null;
      },
      decrypt: function(recipient, privKey) {
        if (msg.encryptedContent.key === void 0 && recipient !== void 0 && privKey !== void 0) {
          switch (recipient.encryptedContent.algorithm) {
            case forge2.pki.oids.rsaEncryption:
            case forge2.pki.oids.desCBC:
              var key = privKey.decrypt(recipient.encryptedContent.content);
              msg.encryptedContent.key = forge2.util.createBuffer(key);
              break;
            default:
              throw new Error("Unsupported asymmetric cipher, OID " + recipient.encryptedContent.algorithm);
          }
        }
        _decryptContent(msg);
      },
      addRecipient: function(cert) {
        msg.recipients.push({
          version: 0,
          issuer: cert.issuer.attributes,
          serialNumber: cert.serialNumber,
          encryptedContent: {
            algorithm: forge2.pki.oids.rsaEncryption,
            key: cert.publicKey
          }
        });
      },
      encrypt: function(key, cipher) {
        if (msg.encryptedContent.content === void 0) {
          cipher = cipher || msg.encryptedContent.algorithm;
          key = key || msg.encryptedContent.key;
          var keyLen, ivLen, ciphFn;
          switch (cipher) {
            case forge2.pki.oids["aes128-CBC"]:
              keyLen = 16;
              ivLen = 16;
              ciphFn = forge2.aes.createEncryptionCipher;
              break;
            case forge2.pki.oids["aes192-CBC"]:
              keyLen = 24;
              ivLen = 16;
              ciphFn = forge2.aes.createEncryptionCipher;
              break;
            case forge2.pki.oids["aes256-CBC"]:
              keyLen = 32;
              ivLen = 16;
              ciphFn = forge2.aes.createEncryptionCipher;
              break;
            case forge2.pki.oids["des-EDE3-CBC"]:
              keyLen = 24;
              ivLen = 8;
              ciphFn = forge2.des.createEncryptionCipher;
              break;
            default:
              throw new Error("Unsupported symmetric cipher, OID " + cipher);
          }
          if (key === void 0) {
            key = forge2.util.createBuffer(forge2.random.getBytes(keyLen));
          } else if (key.length() != keyLen) {
            throw new Error("Symmetric key has wrong length; got " + key.length() + " bytes, expected " + keyLen + ".");
          }
          msg.encryptedContent.algorithm = cipher;
          msg.encryptedContent.key = key;
          msg.encryptedContent.parameter = forge2.util.createBuffer(forge2.random.getBytes(ivLen));
          var ciph = ciphFn(key);
          ciph.start(msg.encryptedContent.parameter.copy());
          ciph.update(msg.content);
          if (!ciph.finish()) {
            throw new Error("Symmetric encryption failed.");
          }
          msg.encryptedContent.content = ciph.output;
        }
        for (var i = 0; i < msg.recipients.length; ++i) {
          var recipient = msg.recipients[i];
          if (recipient.encryptedContent.content !== void 0) {
            continue;
          }
          switch (recipient.encryptedContent.algorithm) {
            case forge2.pki.oids.rsaEncryption:
              recipient.encryptedContent.content = recipient.encryptedContent.key.encrypt(msg.encryptedContent.key.data);
              break;
            default:
              throw new Error("Unsupported asymmetric cipher, OID " + recipient.encryptedContent.algorithm);
          }
        }
      }
    };
    return msg;
  };
  function _recipientFromAsn1(obj) {
    var capture = {};
    var errors = [];
    if (!asn1.validate(obj, p7.asn1.recipientInfoValidator, capture, errors)) {
      var error = new Error("Cannot read PKCS#7 RecipientInfo. ASN.1 object is not an PKCS#7 RecipientInfo.");
      error.errors = errors;
      throw error;
    }
    return {
      version: capture.version.charCodeAt(0),
      issuer: forge2.pki.RDNAttributesAsArray(capture.issuer),
      serialNumber: forge2.util.createBuffer(capture.serial).toHex(),
      encryptedContent: {
        algorithm: asn1.derToOid(capture.encAlgorithm),
        parameter: capture.encParameter.value,
        content: capture.encKey
      }
    };
  }
  function _recipientToAsn1(obj) {
    return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(obj.version).getBytes()),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        forge2.pki.distinguishedNameToAsn1({attributes: obj.issuer}),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, forge2.util.hexToBytes(obj.serialNumber))
      ]),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(obj.encryptedContent.algorithm).getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
      ]),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, obj.encryptedContent.content)
    ]);
  }
  function _recipientsFromAsn1(infos) {
    var ret = [];
    for (var i = 0; i < infos.length; ++i) {
      ret.push(_recipientFromAsn1(infos[i]));
    }
    return ret;
  }
  function _recipientsToAsn1(recipients) {
    var ret = [];
    for (var i = 0; i < recipients.length; ++i) {
      ret.push(_recipientToAsn1(recipients[i]));
    }
    return ret;
  }
  function _signerToAsn1(obj) {
    var rval = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(obj.version).getBytes()),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        forge2.pki.distinguishedNameToAsn1({attributes: obj.issuer}),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, forge2.util.hexToBytes(obj.serialNumber))
      ]),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(obj.digestAlgorithm).getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
      ])
    ]);
    if (obj.authenticatedAttributesAsn1) {
      rval.value.push(obj.authenticatedAttributesAsn1);
    }
    rval.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(obj.signatureAlgorithm).getBytes()),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")
    ]));
    rval.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, obj.signature));
    if (obj.unauthenticatedAttributes.length > 0) {
      var attrsAsn1 = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, []);
      for (var i = 0; i < obj.unauthenticatedAttributes.length; ++i) {
        var attr = obj.unauthenticatedAttributes[i];
        attrsAsn1.values.push(_attributeToAsn1(attr));
      }
      rval.value.push(attrsAsn1);
    }
    return rval;
  }
  function _signersToAsn1(signers) {
    var ret = [];
    for (var i = 0; i < signers.length; ++i) {
      ret.push(_signerToAsn1(signers[i]));
    }
    return ret;
  }
  function _attributeToAsn1(attr) {
    var value;
    if (attr.type === forge2.pki.oids.contentType) {
      value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(attr.value).getBytes());
    } else if (attr.type === forge2.pki.oids.messageDigest) {
      value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, attr.value.bytes());
    } else if (attr.type === forge2.pki.oids.signingTime) {
      var jan_1_1950 = new Date("1950-01-01T00:00:00Z");
      var jan_1_2050 = new Date("2050-01-01T00:00:00Z");
      var date = attr.value;
      if (typeof date === "string") {
        var timestamp = Date.parse(date);
        if (!isNaN(timestamp)) {
          date = new Date(timestamp);
        } else if (date.length === 13) {
          date = asn1.utcTimeToDate(date);
        } else {
          date = asn1.generalizedTimeToDate(date);
        }
      }
      if (date >= jan_1_1950 && date < jan_1_2050) {
        value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.UTCTIME, false, asn1.dateToUtcTime(date));
      } else {
        value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.GENERALIZEDTIME, false, asn1.dateToGeneralizedTime(date));
      }
    }
    return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(attr.type).getBytes()),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, [
        value
      ])
    ]);
  }
  function _encryptedContentToAsn1(ec) {
    return [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(forge2.pki.oids.data).getBytes()),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(ec.algorithm).getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, ec.parameter.getBytes())
      ]),
      asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, ec.content.getBytes())
      ])
    ];
  }
  function _fromAsn1(msg, obj, validator) {
    var capture = {};
    var errors = [];
    if (!asn1.validate(obj, validator, capture, errors)) {
      var error = new Error("Cannot read PKCS#7 message. ASN.1 object is not a supported PKCS#7 message.");
      error.errors = error;
      throw error;
    }
    var contentType = asn1.derToOid(capture.contentType);
    if (contentType !== forge2.pki.oids.data) {
      throw new Error("Unsupported PKCS#7 message. Only wrapped ContentType Data supported.");
    }
    if (capture.encryptedContent) {
      var content = "";
      if (forge2.util.isArray(capture.encryptedContent)) {
        for (var i = 0; i < capture.encryptedContent.length; ++i) {
          if (capture.encryptedContent[i].type !== asn1.Type.OCTETSTRING) {
            throw new Error("Malformed PKCS#7 message, expecting encrypted content constructed of only OCTET STRING objects.");
          }
          content += capture.encryptedContent[i].value;
        }
      } else {
        content = capture.encryptedContent;
      }
      msg.encryptedContent = {
        algorithm: asn1.derToOid(capture.encAlgorithm),
        parameter: forge2.util.createBuffer(capture.encParameter.value),
        content: forge2.util.createBuffer(content)
      };
    }
    if (capture.content) {
      var content = "";
      if (forge2.util.isArray(capture.content)) {
        for (var i = 0; i < capture.content.length; ++i) {
          if (capture.content[i].type !== asn1.Type.OCTETSTRING) {
            throw new Error("Malformed PKCS#7 message, expecting content constructed of only OCTET STRING objects.");
          }
          content += capture.content[i].value;
        }
      } else {
        content = capture.content;
      }
      msg.content = forge2.util.createBuffer(content);
    }
    msg.version = capture.version.charCodeAt(0);
    msg.rawCapture = capture;
    return capture;
  }
  function _decryptContent(msg) {
    if (msg.encryptedContent.key === void 0) {
      throw new Error("Symmetric key not available.");
    }
    if (msg.content === void 0) {
      var ciph;
      switch (msg.encryptedContent.algorithm) {
        case forge2.pki.oids["aes128-CBC"]:
        case forge2.pki.oids["aes192-CBC"]:
        case forge2.pki.oids["aes256-CBC"]:
          ciph = forge2.aes.createDecryptionCipher(msg.encryptedContent.key);
          break;
        case forge2.pki.oids["desCBC"]:
        case forge2.pki.oids["des-EDE3-CBC"]:
          ciph = forge2.des.createDecryptionCipher(msg.encryptedContent.key);
          break;
        default:
          throw new Error("Unsupported symmetric cipher, OID " + msg.encryptedContent.algorithm);
      }
      ciph.start(msg.encryptedContent.parameter);
      ciph.update(msg.encryptedContent.content);
      if (!ciph.finish()) {
        throw new Error("Symmetric decryption failed.");
      }
      msg.content = ciph.output;
    }
  }
});

// node_modules/node-forge/lib/ssh.js
var require_ssh = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_aes();
  require_hmac();
  require_md5();
  require_sha1();
  require_util();
  var ssh = module2.exports = forge2.ssh = forge2.ssh || {};
  ssh.privateKeyToPutty = function(privateKey, passphrase, comment) {
    comment = comment || "";
    passphrase = passphrase || "";
    var algorithm = "ssh-rsa";
    var encryptionAlgorithm = passphrase === "" ? "none" : "aes256-cbc";
    var ppk = "PuTTY-User-Key-File-2: " + algorithm + "\r\n";
    ppk += "Encryption: " + encryptionAlgorithm + "\r\n";
    ppk += "Comment: " + comment + "\r\n";
    var pubbuffer = forge2.util.createBuffer();
    _addStringToBuffer(pubbuffer, algorithm);
    _addBigIntegerToBuffer(pubbuffer, privateKey.e);
    _addBigIntegerToBuffer(pubbuffer, privateKey.n);
    var pub = forge2.util.encode64(pubbuffer.bytes(), 64);
    var length = Math.floor(pub.length / 66) + 1;
    ppk += "Public-Lines: " + length + "\r\n";
    ppk += pub;
    var privbuffer = forge2.util.createBuffer();
    _addBigIntegerToBuffer(privbuffer, privateKey.d);
    _addBigIntegerToBuffer(privbuffer, privateKey.p);
    _addBigIntegerToBuffer(privbuffer, privateKey.q);
    _addBigIntegerToBuffer(privbuffer, privateKey.qInv);
    var priv;
    if (!passphrase) {
      priv = forge2.util.encode64(privbuffer.bytes(), 64);
    } else {
      var encLen = privbuffer.length() + 16 - 1;
      encLen -= encLen % 16;
      var padding = _sha1(privbuffer.bytes());
      padding.truncate(padding.length() - encLen + privbuffer.length());
      privbuffer.putBuffer(padding);
      var aeskey = forge2.util.createBuffer();
      aeskey.putBuffer(_sha1("\0\0\0\0", passphrase));
      aeskey.putBuffer(_sha1("\0\0\0", passphrase));
      var cipher = forge2.aes.createEncryptionCipher(aeskey.truncate(8), "CBC");
      cipher.start(forge2.util.createBuffer().fillWithByte(0, 16));
      cipher.update(privbuffer.copy());
      cipher.finish();
      var encrypted = cipher.output;
      encrypted.truncate(16);
      priv = forge2.util.encode64(encrypted.bytes(), 64);
    }
    length = Math.floor(priv.length / 66) + 1;
    ppk += "\r\nPrivate-Lines: " + length + "\r\n";
    ppk += priv;
    var mackey = _sha1("putty-private-key-file-mac-key", passphrase);
    var macbuffer = forge2.util.createBuffer();
    _addStringToBuffer(macbuffer, algorithm);
    _addStringToBuffer(macbuffer, encryptionAlgorithm);
    _addStringToBuffer(macbuffer, comment);
    macbuffer.putInt32(pubbuffer.length());
    macbuffer.putBuffer(pubbuffer);
    macbuffer.putInt32(privbuffer.length());
    macbuffer.putBuffer(privbuffer);
    var hmac = forge2.hmac.create();
    hmac.start("sha1", mackey);
    hmac.update(macbuffer.bytes());
    ppk += "\r\nPrivate-MAC: " + hmac.digest().toHex() + "\r\n";
    return ppk;
  };
  ssh.publicKeyToOpenSSH = function(key, comment) {
    var type = "ssh-rsa";
    comment = comment || "";
    var buffer = forge2.util.createBuffer();
    _addStringToBuffer(buffer, type);
    _addBigIntegerToBuffer(buffer, key.e);
    _addBigIntegerToBuffer(buffer, key.n);
    return type + " " + forge2.util.encode64(buffer.bytes()) + " " + comment;
  };
  ssh.privateKeyToOpenSSH = function(privateKey, passphrase) {
    if (!passphrase) {
      return forge2.pki.privateKeyToPem(privateKey);
    }
    return forge2.pki.encryptRsaPrivateKey(privateKey, passphrase, {legacy: true, algorithm: "aes128"});
  };
  ssh.getPublicKeyFingerprint = function(key, options) {
    options = options || {};
    var md = options.md || forge2.md.md5.create();
    var type = "ssh-rsa";
    var buffer = forge2.util.createBuffer();
    _addStringToBuffer(buffer, type);
    _addBigIntegerToBuffer(buffer, key.e);
    _addBigIntegerToBuffer(buffer, key.n);
    md.start();
    md.update(buffer.getBytes());
    var digest = md.digest();
    if (options.encoding === "hex") {
      var hex = digest.toHex();
      if (options.delimiter) {
        return hex.match(/.{2}/g).join(options.delimiter);
      }
      return hex;
    } else if (options.encoding === "binary") {
      return digest.getBytes();
    } else if (options.encoding) {
      throw new Error('Unknown encoding "' + options.encoding + '".');
    }
    return digest;
  };
  function _addBigIntegerToBuffer(buffer, val) {
    var hexVal = val.toString(16);
    if (hexVal[0] >= "8") {
      hexVal = "00" + hexVal;
    }
    var bytes = forge2.util.hexToBytes(hexVal);
    buffer.putInt32(bytes.length);
    buffer.putBytes(bytes);
  }
  function _addStringToBuffer(buffer, val) {
    buffer.putInt32(val.length);
    buffer.putString(val);
  }
  function _sha1() {
    var sha = forge2.md.sha1.create();
    var num = arguments.length;
    for (var i = 0; i < num; ++i) {
      sha.update(arguments[i]);
    }
    return sha.digest();
  }
});

// node_modules/node-forge/lib/task.js
var require_task = __commonJS((exports2, module2) => {
  var forge2 = require_forge();
  require_debug();
  require_log();
  require_util();
  var cat = "forge.task";
  var sVL = 0;
  var sTasks = {};
  var sNextTaskId = 0;
  forge2.debug.set(cat, "tasks", sTasks);
  var sTaskQueues = {};
  forge2.debug.set(cat, "queues", sTaskQueues);
  var sNoTaskName = "?";
  var sMaxRecursions = 30;
  var sTimeSlice = 20;
  var READY = "ready";
  var RUNNING = "running";
  var BLOCKED = "blocked";
  var SLEEPING = "sleeping";
  var DONE = "done";
  var ERROR = "error";
  var STOP = "stop";
  var START = "start";
  var BLOCK = "block";
  var UNBLOCK = "unblock";
  var SLEEP = "sleep";
  var WAKEUP = "wakeup";
  var CANCEL = "cancel";
  var FAIL = "fail";
  var sStateTable = {};
  sStateTable[READY] = {};
  sStateTable[READY][STOP] = READY;
  sStateTable[READY][START] = RUNNING;
  sStateTable[READY][CANCEL] = DONE;
  sStateTable[READY][FAIL] = ERROR;
  sStateTable[RUNNING] = {};
  sStateTable[RUNNING][STOP] = READY;
  sStateTable[RUNNING][START] = RUNNING;
  sStateTable[RUNNING][BLOCK] = BLOCKED;
  sStateTable[RUNNING][UNBLOCK] = RUNNING;
  sStateTable[RUNNING][SLEEP] = SLEEPING;
  sStateTable[RUNNING][WAKEUP] = RUNNING;
  sStateTable[RUNNING][CANCEL] = DONE;
  sStateTable[RUNNING][FAIL] = ERROR;
  sStateTable[BLOCKED] = {};
  sStateTable[BLOCKED][STOP] = BLOCKED;
  sStateTable[BLOCKED][START] = BLOCKED;
  sStateTable[BLOCKED][BLOCK] = BLOCKED;
  sStateTable[BLOCKED][UNBLOCK] = BLOCKED;
  sStateTable[BLOCKED][SLEEP] = BLOCKED;
  sStateTable[BLOCKED][WAKEUP] = BLOCKED;
  sStateTable[BLOCKED][CANCEL] = DONE;
  sStateTable[BLOCKED][FAIL] = ERROR;
  sStateTable[SLEEPING] = {};
  sStateTable[SLEEPING][STOP] = SLEEPING;
  sStateTable[SLEEPING][START] = SLEEPING;
  sStateTable[SLEEPING][BLOCK] = SLEEPING;
  sStateTable[SLEEPING][UNBLOCK] = SLEEPING;
  sStateTable[SLEEPING][SLEEP] = SLEEPING;
  sStateTable[SLEEPING][WAKEUP] = SLEEPING;
  sStateTable[SLEEPING][CANCEL] = DONE;
  sStateTable[SLEEPING][FAIL] = ERROR;
  sStateTable[DONE] = {};
  sStateTable[DONE][STOP] = DONE;
  sStateTable[DONE][START] = DONE;
  sStateTable[DONE][BLOCK] = DONE;
  sStateTable[DONE][UNBLOCK] = DONE;
  sStateTable[DONE][SLEEP] = DONE;
  sStateTable[DONE][WAKEUP] = DONE;
  sStateTable[DONE][CANCEL] = DONE;
  sStateTable[DONE][FAIL] = ERROR;
  sStateTable[ERROR] = {};
  sStateTable[ERROR][STOP] = ERROR;
  sStateTable[ERROR][START] = ERROR;
  sStateTable[ERROR][BLOCK] = ERROR;
  sStateTable[ERROR][UNBLOCK] = ERROR;
  sStateTable[ERROR][SLEEP] = ERROR;
  sStateTable[ERROR][WAKEUP] = ERROR;
  sStateTable[ERROR][CANCEL] = ERROR;
  sStateTable[ERROR][FAIL] = ERROR;
  var Task = function(options) {
    this.id = -1;
    this.name = options.name || sNoTaskName;
    this.parent = options.parent || null;
    this.run = options.run;
    this.subtasks = [];
    this.error = false;
    this.state = READY;
    this.blocks = 0;
    this.timeoutId = null;
    this.swapTime = null;
    this.userData = null;
    this.id = sNextTaskId++;
    sTasks[this.id] = this;
    if (sVL >= 1) {
      forge2.log.verbose(cat, "[%s][%s] init", this.id, this.name, this);
    }
  };
  Task.prototype.debug = function(msg) {
    msg = msg || "";
    forge2.log.debug(cat, msg, "[%s][%s] task:", this.id, this.name, this, "subtasks:", this.subtasks.length, "queue:", sTaskQueues);
  };
  Task.prototype.next = function(name, subrun) {
    if (typeof name === "function") {
      subrun = name;
      name = this.name;
    }
    var subtask = new Task({
      run: subrun,
      name,
      parent: this
    });
    subtask.state = RUNNING;
    subtask.type = this.type;
    subtask.successCallback = this.successCallback || null;
    subtask.failureCallback = this.failureCallback || null;
    this.subtasks.push(subtask);
    return this;
  };
  Task.prototype.parallel = function(name, subrun) {
    if (forge2.util.isArray(name)) {
      subrun = name;
      name = this.name;
    }
    return this.next(name, function(task) {
      var ptask = task;
      ptask.block(subrun.length);
      var startParallelTask = function(pname2, pi2) {
        forge2.task.start({
          type: pname2,
          run: function(task2) {
            subrun[pi2](task2);
          },
          success: function(task2) {
            ptask.unblock();
          },
          failure: function(task2) {
            ptask.unblock();
          }
        });
      };
      for (var i = 0; i < subrun.length; i++) {
        var pname = name + "__parallel-" + task.id + "-" + i;
        var pi = i;
        startParallelTask(pname, pi);
      }
    });
  };
  Task.prototype.stop = function() {
    this.state = sStateTable[this.state][STOP];
  };
  Task.prototype.start = function() {
    this.error = false;
    this.state = sStateTable[this.state][START];
    if (this.state === RUNNING) {
      this.start = new Date();
      this.run(this);
      runNext(this, 0);
    }
  };
  Task.prototype.block = function(n) {
    n = typeof n === "undefined" ? 1 : n;
    this.blocks += n;
    if (this.blocks > 0) {
      this.state = sStateTable[this.state][BLOCK];
    }
  };
  Task.prototype.unblock = function(n) {
    n = typeof n === "undefined" ? 1 : n;
    this.blocks -= n;
    if (this.blocks === 0 && this.state !== DONE) {
      this.state = RUNNING;
      runNext(this, 0);
    }
    return this.blocks;
  };
  Task.prototype.sleep = function(n) {
    n = typeof n === "undefined" ? 0 : n;
    this.state = sStateTable[this.state][SLEEP];
    var self2 = this;
    this.timeoutId = setTimeout(function() {
      self2.timeoutId = null;
      self2.state = RUNNING;
      runNext(self2, 0);
    }, n);
  };
  Task.prototype.wait = function(cond) {
    cond.wait(this);
  };
  Task.prototype.wakeup = function() {
    if (this.state === SLEEPING) {
      cancelTimeout(this.timeoutId);
      this.timeoutId = null;
      this.state = RUNNING;
      runNext(this, 0);
    }
  };
  Task.prototype.cancel = function() {
    this.state = sStateTable[this.state][CANCEL];
    this.permitsNeeded = 0;
    if (this.timeoutId !== null) {
      cancelTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.subtasks = [];
  };
  Task.prototype.fail = function(next) {
    this.error = true;
    finish(this, true);
    if (next) {
      next.error = this.error;
      next.swapTime = this.swapTime;
      next.userData = this.userData;
      runNext(next, 0);
    } else {
      if (this.parent !== null) {
        var parent = this.parent;
        while (parent.parent !== null) {
          parent.error = this.error;
          parent.swapTime = this.swapTime;
          parent.userData = this.userData;
          parent = parent.parent;
        }
        finish(parent, true);
      }
      if (this.failureCallback) {
        this.failureCallback(this);
      }
    }
  };
  var start = function(task) {
    task.error = false;
    task.state = sStateTable[task.state][START];
    setTimeout(function() {
      if (task.state === RUNNING) {
        task.swapTime = +new Date();
        task.run(task);
        runNext(task, 0);
      }
    }, 0);
  };
  var runNext = function(task, recurse) {
    var swap = recurse > sMaxRecursions || +new Date() - task.swapTime > sTimeSlice;
    var doNext = function(recurse2) {
      recurse2++;
      if (task.state === RUNNING) {
        if (swap) {
          task.swapTime = +new Date();
        }
        if (task.subtasks.length > 0) {
          var subtask = task.subtasks.shift();
          subtask.error = task.error;
          subtask.swapTime = task.swapTime;
          subtask.userData = task.userData;
          subtask.run(subtask);
          if (!subtask.error) {
            runNext(subtask, recurse2);
          }
        } else {
          finish(task);
          if (!task.error) {
            if (task.parent !== null) {
              task.parent.error = task.error;
              task.parent.swapTime = task.swapTime;
              task.parent.userData = task.userData;
              runNext(task.parent, recurse2);
            }
          }
        }
      }
    };
    if (swap) {
      setTimeout(doNext, 0);
    } else {
      doNext(recurse);
    }
  };
  var finish = function(task, suppressCallbacks) {
    task.state = DONE;
    delete sTasks[task.id];
    if (sVL >= 1) {
      forge2.log.verbose(cat, "[%s][%s] finish", task.id, task.name, task);
    }
    if (task.parent === null) {
      if (!(task.type in sTaskQueues)) {
        forge2.log.error(cat, "[%s][%s] task queue missing [%s]", task.id, task.name, task.type);
      } else if (sTaskQueues[task.type].length === 0) {
        forge2.log.error(cat, "[%s][%s] task queue empty [%s]", task.id, task.name, task.type);
      } else if (sTaskQueues[task.type][0] !== task) {
        forge2.log.error(cat, "[%s][%s] task not first in queue [%s]", task.id, task.name, task.type);
      } else {
        sTaskQueues[task.type].shift();
        if (sTaskQueues[task.type].length === 0) {
          if (sVL >= 1) {
            forge2.log.verbose(cat, "[%s][%s] delete queue [%s]", task.id, task.name, task.type);
          }
          delete sTaskQueues[task.type];
        } else {
          if (sVL >= 1) {
            forge2.log.verbose(cat, "[%s][%s] queue start next [%s] remain:%s", task.id, task.name, task.type, sTaskQueues[task.type].length);
          }
          sTaskQueues[task.type][0].start();
        }
      }
      if (!suppressCallbacks) {
        if (task.error && task.failureCallback) {
          task.failureCallback(task);
        } else if (!task.error && task.successCallback) {
          task.successCallback(task);
        }
      }
    }
  };
  module2.exports = forge2.task = forge2.task || {};
  forge2.task.start = function(options) {
    var task = new Task({
      run: options.run,
      name: options.name || sNoTaskName
    });
    task.type = options.type;
    task.successCallback = options.success || null;
    task.failureCallback = options.failure || null;
    if (!(task.type in sTaskQueues)) {
      if (sVL >= 1) {
        forge2.log.verbose(cat, "[%s][%s] create queue [%s]", task.id, task.name, task.type);
      }
      sTaskQueues[task.type] = [task];
      start(task);
    } else {
      sTaskQueues[options.type].push(task);
    }
  };
  forge2.task.cancel = function(type) {
    if (type in sTaskQueues) {
      sTaskQueues[type] = [sTaskQueues[type][0]];
    }
  };
  forge2.task.createCondition = function() {
    var cond = {
      tasks: {}
    };
    cond.wait = function(task) {
      if (!(task.id in cond.tasks)) {
        task.block();
        cond.tasks[task.id] = task;
      }
    };
    cond.notify = function() {
      var tmp = cond.tasks;
      cond.tasks = {};
      for (var id in tmp) {
        tmp[id].unblock();
      }
    };
    return cond;
  };
});

// node_modules/node-forge/lib/index.js
var require_lib = __commonJS((exports2, module2) => {
  module2.exports = require_forge();
  require_aes();
  require_aesCipherSuites();
  require_asn1();
  require_cipher();
  require_debug();
  require_des();
  require_ed25519();
  require_hmac();
  require_kem();
  require_log();
  require_md_all();
  require_mgf1();
  require_pbkdf2();
  require_pem();
  require_pkcs1();
  require_pkcs12();
  require_pkcs7();
  require_pki();
  require_prime();
  require_prng();
  require_pss();
  require_random();
  require_rc2();
  require_ssh();
  require_task();
  require_tls();
  require_util();
});

// node_modules/mkdirp/index.js
var require_mkdirp = __commonJS((exports2, module2) => {
  var path3 = require("path");
  var fs2 = require("fs");
  var _0777 = parseInt("0777", 8);
  module2.exports = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;
  function mkdirP(p, opts, f, made) {
    if (typeof opts === "function") {
      f = opts;
      opts = {};
    } else if (!opts || typeof opts !== "object") {
      opts = {mode: opts};
    }
    var mode = opts.mode;
    var xfs = opts.fs || fs2;
    if (mode === void 0) {
      mode = _0777;
    }
    if (!made)
      made = null;
    var cb = f || function() {
    };
    p = path3.resolve(p);
    xfs.mkdir(p, mode, function(er) {
      if (!er) {
        made = made || p;
        return cb(null, made);
      }
      switch (er.code) {
        case "ENOENT":
          if (path3.dirname(p) === p)
            return cb(er);
          mkdirP(path3.dirname(p), opts, function(er2, made2) {
            if (er2)
              cb(er2, made2);
            else
              mkdirP(p, opts, cb, made2);
          });
          break;
        default:
          xfs.stat(p, function(er2, stat) {
            if (er2 || !stat.isDirectory())
              cb(er, made);
            else
              cb(null, made);
          });
          break;
      }
    });
  }
  mkdirP.sync = function sync2(p, opts, made) {
    if (!opts || typeof opts !== "object") {
      opts = {mode: opts};
    }
    var mode = opts.mode;
    var xfs = opts.fs || fs2;
    if (mode === void 0) {
      mode = _0777;
    }
    if (!made)
      made = null;
    p = path3.resolve(p);
    try {
      xfs.mkdirSync(p, mode);
      made = made || p;
    } catch (err0) {
      switch (err0.code) {
        case "ENOENT":
          made = sync2(path3.dirname(p), opts, made);
          sync2(p, opts, made);
          break;
        default:
          var stat;
          try {
            stat = xfs.statSync(p);
          } catch (err1) {
            throw err0;
          }
          if (!stat.isDirectory())
            throw err0;
          break;
      }
    }
    return made;
  };
});

// node_modules/escape-string-regexp/index.js
var require_escape_string_regexp = __commonJS((exports2, module2) => {
  "use strict";
  var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
  module2.exports = function(str) {
    if (typeof str !== "string") {
      throw new TypeError("Expected a string");
    }
    return str.replace(matchOperatorsRe, "\\$&");
  };
});

// node_modules/chalk/node_modules/color-name/index.js
var require_color_name = __commonJS((exports2, module2) => {
  "use strict";
  module2.exports = {
    aliceblue: [240, 248, 255],
    antiquewhite: [250, 235, 215],
    aqua: [0, 255, 255],
    aquamarine: [127, 255, 212],
    azure: [240, 255, 255],
    beige: [245, 245, 220],
    bisque: [255, 228, 196],
    black: [0, 0, 0],
    blanchedalmond: [255, 235, 205],
    blue: [0, 0, 255],
    blueviolet: [138, 43, 226],
    brown: [165, 42, 42],
    burlywood: [222, 184, 135],
    cadetblue: [95, 158, 160],
    chartreuse: [127, 255, 0],
    chocolate: [210, 105, 30],
    coral: [255, 127, 80],
    cornflowerblue: [100, 149, 237],
    cornsilk: [255, 248, 220],
    crimson: [220, 20, 60],
    cyan: [0, 255, 255],
    darkblue: [0, 0, 139],
    darkcyan: [0, 139, 139],
    darkgoldenrod: [184, 134, 11],
    darkgray: [169, 169, 169],
    darkgreen: [0, 100, 0],
    darkgrey: [169, 169, 169],
    darkkhaki: [189, 183, 107],
    darkmagenta: [139, 0, 139],
    darkolivegreen: [85, 107, 47],
    darkorange: [255, 140, 0],
    darkorchid: [153, 50, 204],
    darkred: [139, 0, 0],
    darksalmon: [233, 150, 122],
    darkseagreen: [143, 188, 143],
    darkslateblue: [72, 61, 139],
    darkslategray: [47, 79, 79],
    darkslategrey: [47, 79, 79],
    darkturquoise: [0, 206, 209],
    darkviolet: [148, 0, 211],
    deeppink: [255, 20, 147],
    deepskyblue: [0, 191, 255],
    dimgray: [105, 105, 105],
    dimgrey: [105, 105, 105],
    dodgerblue: [30, 144, 255],
    firebrick: [178, 34, 34],
    floralwhite: [255, 250, 240],
    forestgreen: [34, 139, 34],
    fuchsia: [255, 0, 255],
    gainsboro: [220, 220, 220],
    ghostwhite: [248, 248, 255],
    gold: [255, 215, 0],
    goldenrod: [218, 165, 32],
    gray: [128, 128, 128],
    green: [0, 128, 0],
    greenyellow: [173, 255, 47],
    grey: [128, 128, 128],
    honeydew: [240, 255, 240],
    hotpink: [255, 105, 180],
    indianred: [205, 92, 92],
    indigo: [75, 0, 130],
    ivory: [255, 255, 240],
    khaki: [240, 230, 140],
    lavender: [230, 230, 250],
    lavenderblush: [255, 240, 245],
    lawngreen: [124, 252, 0],
    lemonchiffon: [255, 250, 205],
    lightblue: [173, 216, 230],
    lightcoral: [240, 128, 128],
    lightcyan: [224, 255, 255],
    lightgoldenrodyellow: [250, 250, 210],
    lightgray: [211, 211, 211],
    lightgreen: [144, 238, 144],
    lightgrey: [211, 211, 211],
    lightpink: [255, 182, 193],
    lightsalmon: [255, 160, 122],
    lightseagreen: [32, 178, 170],
    lightskyblue: [135, 206, 250],
    lightslategray: [119, 136, 153],
    lightslategrey: [119, 136, 153],
    lightsteelblue: [176, 196, 222],
    lightyellow: [255, 255, 224],
    lime: [0, 255, 0],
    limegreen: [50, 205, 50],
    linen: [250, 240, 230],
    magenta: [255, 0, 255],
    maroon: [128, 0, 0],
    mediumaquamarine: [102, 205, 170],
    mediumblue: [0, 0, 205],
    mediumorchid: [186, 85, 211],
    mediumpurple: [147, 112, 219],
    mediumseagreen: [60, 179, 113],
    mediumslateblue: [123, 104, 238],
    mediumspringgreen: [0, 250, 154],
    mediumturquoise: [72, 209, 204],
    mediumvioletred: [199, 21, 133],
    midnightblue: [25, 25, 112],
    mintcream: [245, 255, 250],
    mistyrose: [255, 228, 225],
    moccasin: [255, 228, 181],
    navajowhite: [255, 222, 173],
    navy: [0, 0, 128],
    oldlace: [253, 245, 230],
    olive: [128, 128, 0],
    olivedrab: [107, 142, 35],
    orange: [255, 165, 0],
    orangered: [255, 69, 0],
    orchid: [218, 112, 214],
    palegoldenrod: [238, 232, 170],
    palegreen: [152, 251, 152],
    paleturquoise: [175, 238, 238],
    palevioletred: [219, 112, 147],
    papayawhip: [255, 239, 213],
    peachpuff: [255, 218, 185],
    peru: [205, 133, 63],
    pink: [255, 192, 203],
    plum: [221, 160, 221],
    powderblue: [176, 224, 230],
    purple: [128, 0, 128],
    rebeccapurple: [102, 51, 153],
    red: [255, 0, 0],
    rosybrown: [188, 143, 143],
    royalblue: [65, 105, 225],
    saddlebrown: [139, 69, 19],
    salmon: [250, 128, 114],
    sandybrown: [244, 164, 96],
    seagreen: [46, 139, 87],
    seashell: [255, 245, 238],
    sienna: [160, 82, 45],
    silver: [192, 192, 192],
    skyblue: [135, 206, 235],
    slateblue: [106, 90, 205],
    slategray: [112, 128, 144],
    slategrey: [112, 128, 144],
    snow: [255, 250, 250],
    springgreen: [0, 255, 127],
    steelblue: [70, 130, 180],
    tan: [210, 180, 140],
    teal: [0, 128, 128],
    thistle: [216, 191, 216],
    tomato: [255, 99, 71],
    turquoise: [64, 224, 208],
    violet: [238, 130, 238],
    wheat: [245, 222, 179],
    white: [255, 255, 255],
    whitesmoke: [245, 245, 245],
    yellow: [255, 255, 0],
    yellowgreen: [154, 205, 50]
  };
});

// node_modules/chalk/node_modules/color-convert/conversions.js
var require_conversions = __commonJS((exports2, module2) => {
  var cssKeywords = require_color_name();
  var reverseKeywords = {};
  for (var key in cssKeywords) {
    if (cssKeywords.hasOwnProperty(key)) {
      reverseKeywords[cssKeywords[key]] = key;
    }
  }
  var convert = module2.exports = {
    rgb: {channels: 3, labels: "rgb"},
    hsl: {channels: 3, labels: "hsl"},
    hsv: {channels: 3, labels: "hsv"},
    hwb: {channels: 3, labels: "hwb"},
    cmyk: {channels: 4, labels: "cmyk"},
    xyz: {channels: 3, labels: "xyz"},
    lab: {channels: 3, labels: "lab"},
    lch: {channels: 3, labels: "lch"},
    hex: {channels: 1, labels: ["hex"]},
    keyword: {channels: 1, labels: ["keyword"]},
    ansi16: {channels: 1, labels: ["ansi16"]},
    ansi256: {channels: 1, labels: ["ansi256"]},
    hcg: {channels: 3, labels: ["h", "c", "g"]},
    apple: {channels: 3, labels: ["r16", "g16", "b16"]},
    gray: {channels: 1, labels: ["gray"]}
  };
  for (var model in convert) {
    if (convert.hasOwnProperty(model)) {
      if (!("channels" in convert[model])) {
        throw new Error("missing channels property: " + model);
      }
      if (!("labels" in convert[model])) {
        throw new Error("missing channel labels property: " + model);
      }
      if (convert[model].labels.length !== convert[model].channels) {
        throw new Error("channel and label counts mismatch: " + model);
      }
      channels = convert[model].channels;
      labels = convert[model].labels;
      delete convert[model].channels;
      delete convert[model].labels;
      Object.defineProperty(convert[model], "channels", {value: channels});
      Object.defineProperty(convert[model], "labels", {value: labels});
    }
  }
  var channels;
  var labels;
  convert.rgb.hsl = function(rgb) {
    var r = rgb[0] / 255;
    var g = rgb[1] / 255;
    var b = rgb[2] / 255;
    var min = Math.min(r, g, b);
    var max = Math.max(r, g, b);
    var delta = max - min;
    var h;
    var s;
    var l;
    if (max === min) {
      h = 0;
    } else if (r === max) {
      h = (g - b) / delta;
    } else if (g === max) {
      h = 2 + (b - r) / delta;
    } else if (b === max) {
      h = 4 + (r - g) / delta;
    }
    h = Math.min(h * 60, 360);
    if (h < 0) {
      h += 360;
    }
    l = (min + max) / 2;
    if (max === min) {
      s = 0;
    } else if (l <= 0.5) {
      s = delta / (max + min);
    } else {
      s = delta / (2 - max - min);
    }
    return [h, s * 100, l * 100];
  };
  convert.rgb.hsv = function(rgb) {
    var rdif;
    var gdif;
    var bdif;
    var h;
    var s;
    var r = rgb[0] / 255;
    var g = rgb[1] / 255;
    var b = rgb[2] / 255;
    var v = Math.max(r, g, b);
    var diff = v - Math.min(r, g, b);
    var diffc = function(c) {
      return (v - c) / 6 / diff + 1 / 2;
    };
    if (diff === 0) {
      h = s = 0;
    } else {
      s = diff / v;
      rdif = diffc(r);
      gdif = diffc(g);
      bdif = diffc(b);
      if (r === v) {
        h = bdif - gdif;
      } else if (g === v) {
        h = 1 / 3 + rdif - bdif;
      } else if (b === v) {
        h = 2 / 3 + gdif - rdif;
      }
      if (h < 0) {
        h += 1;
      } else if (h > 1) {
        h -= 1;
      }
    }
    return [
      h * 360,
      s * 100,
      v * 100
    ];
  };
  convert.rgb.hwb = function(rgb) {
    var r = rgb[0];
    var g = rgb[1];
    var b = rgb[2];
    var h = convert.rgb.hsl(rgb)[0];
    var w = 1 / 255 * Math.min(r, Math.min(g, b));
    b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));
    return [h, w * 100, b * 100];
  };
  convert.rgb.cmyk = function(rgb) {
    var r = rgb[0] / 255;
    var g = rgb[1] / 255;
    var b = rgb[2] / 255;
    var c;
    var m;
    var y;
    var k;
    k = Math.min(1 - r, 1 - g, 1 - b);
    c = (1 - r - k) / (1 - k) || 0;
    m = (1 - g - k) / (1 - k) || 0;
    y = (1 - b - k) / (1 - k) || 0;
    return [c * 100, m * 100, y * 100, k * 100];
  };
  function comparativeDistance(x, y) {
    return Math.pow(x[0] - y[0], 2) + Math.pow(x[1] - y[1], 2) + Math.pow(x[2] - y[2], 2);
  }
  convert.rgb.keyword = function(rgb) {
    var reversed = reverseKeywords[rgb];
    if (reversed) {
      return reversed;
    }
    var currentClosestDistance = Infinity;
    var currentClosestKeyword;
    for (var keyword in cssKeywords) {
      if (cssKeywords.hasOwnProperty(keyword)) {
        var value = cssKeywords[keyword];
        var distance = comparativeDistance(rgb, value);
        if (distance < currentClosestDistance) {
          currentClosestDistance = distance;
          currentClosestKeyword = keyword;
        }
      }
    }
    return currentClosestKeyword;
  };
  convert.keyword.rgb = function(keyword) {
    return cssKeywords[keyword];
  };
  convert.rgb.xyz = function(rgb) {
    var r = rgb[0] / 255;
    var g = rgb[1] / 255;
    var b = rgb[2] / 255;
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    var x = r * 0.4124 + g * 0.3576 + b * 0.1805;
    var y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    var z = r * 0.0193 + g * 0.1192 + b * 0.9505;
    return [x * 100, y * 100, z * 100];
  };
  convert.rgb.lab = function(rgb) {
    var xyz = convert.rgb.xyz(rgb);
    var x = xyz[0];
    var y = xyz[1];
    var z = xyz[2];
    var l;
    var a;
    var b;
    x /= 95.047;
    y /= 100;
    z /= 108.883;
    x = x > 8856e-6 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
    y = y > 8856e-6 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
    z = z > 8856e-6 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
    l = 116 * y - 16;
    a = 500 * (x - y);
    b = 200 * (y - z);
    return [l, a, b];
  };
  convert.hsl.rgb = function(hsl) {
    var h = hsl[0] / 360;
    var s = hsl[1] / 100;
    var l = hsl[2] / 100;
    var t1;
    var t2;
    var t3;
    var rgb;
    var val;
    if (s === 0) {
      val = l * 255;
      return [val, val, val];
    }
    if (l < 0.5) {
      t2 = l * (1 + s);
    } else {
      t2 = l + s - l * s;
    }
    t1 = 2 * l - t2;
    rgb = [0, 0, 0];
    for (var i = 0; i < 3; i++) {
      t3 = h + 1 / 3 * -(i - 1);
      if (t3 < 0) {
        t3++;
      }
      if (t3 > 1) {
        t3--;
      }
      if (6 * t3 < 1) {
        val = t1 + (t2 - t1) * 6 * t3;
      } else if (2 * t3 < 1) {
        val = t2;
      } else if (3 * t3 < 2) {
        val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
      } else {
        val = t1;
      }
      rgb[i] = val * 255;
    }
    return rgb;
  };
  convert.hsl.hsv = function(hsl) {
    var h = hsl[0];
    var s = hsl[1] / 100;
    var l = hsl[2] / 100;
    var smin = s;
    var lmin = Math.max(l, 0.01);
    var sv;
    var v;
    l *= 2;
    s *= l <= 1 ? l : 2 - l;
    smin *= lmin <= 1 ? lmin : 2 - lmin;
    v = (l + s) / 2;
    sv = l === 0 ? 2 * smin / (lmin + smin) : 2 * s / (l + s);
    return [h, sv * 100, v * 100];
  };
  convert.hsv.rgb = function(hsv) {
    var h = hsv[0] / 60;
    var s = hsv[1] / 100;
    var v = hsv[2] / 100;
    var hi = Math.floor(h) % 6;
    var f = h - Math.floor(h);
    var p = 255 * v * (1 - s);
    var q = 255 * v * (1 - s * f);
    var t = 255 * v * (1 - s * (1 - f));
    v *= 255;
    switch (hi) {
      case 0:
        return [v, t, p];
      case 1:
        return [q, v, p];
      case 2:
        return [p, v, t];
      case 3:
        return [p, q, v];
      case 4:
        return [t, p, v];
      case 5:
        return [v, p, q];
    }
  };
  convert.hsv.hsl = function(hsv) {
    var h = hsv[0];
    var s = hsv[1] / 100;
    var v = hsv[2] / 100;
    var vmin = Math.max(v, 0.01);
    var lmin;
    var sl;
    var l;
    l = (2 - s) * v;
    lmin = (2 - s) * vmin;
    sl = s * vmin;
    sl /= lmin <= 1 ? lmin : 2 - lmin;
    sl = sl || 0;
    l /= 2;
    return [h, sl * 100, l * 100];
  };
  convert.hwb.rgb = function(hwb) {
    var h = hwb[0] / 360;
    var wh = hwb[1] / 100;
    var bl = hwb[2] / 100;
    var ratio = wh + bl;
    var i;
    var v;
    var f;
    var n;
    if (ratio > 1) {
      wh /= ratio;
      bl /= ratio;
    }
    i = Math.floor(6 * h);
    v = 1 - bl;
    f = 6 * h - i;
    if ((i & 1) !== 0) {
      f = 1 - f;
    }
    n = wh + f * (v - wh);
    var r;
    var g;
    var b;
    switch (i) {
      default:
      case 6:
      case 0:
        r = v;
        g = n;
        b = wh;
        break;
      case 1:
        r = n;
        g = v;
        b = wh;
        break;
      case 2:
        r = wh;
        g = v;
        b = n;
        break;
      case 3:
        r = wh;
        g = n;
        b = v;
        break;
      case 4:
        r = n;
        g = wh;
        b = v;
        break;
      case 5:
        r = v;
        g = wh;
        b = n;
        break;
    }
    return [r * 255, g * 255, b * 255];
  };
  convert.cmyk.rgb = function(cmyk) {
    var c = cmyk[0] / 100;
    var m = cmyk[1] / 100;
    var y = cmyk[2] / 100;
    var k = cmyk[3] / 100;
    var r;
    var g;
    var b;
    r = 1 - Math.min(1, c * (1 - k) + k);
    g = 1 - Math.min(1, m * (1 - k) + k);
    b = 1 - Math.min(1, y * (1 - k) + k);
    return [r * 255, g * 255, b * 255];
  };
  convert.xyz.rgb = function(xyz) {
    var x = xyz[0] / 100;
    var y = xyz[1] / 100;
    var z = xyz[2] / 100;
    var r;
    var g;
    var b;
    r = x * 3.2406 + y * -1.5372 + z * -0.4986;
    g = x * -0.9689 + y * 1.8758 + z * 0.0415;
    b = x * 0.0557 + y * -0.204 + z * 1.057;
    r = r > 31308e-7 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : r * 12.92;
    g = g > 31308e-7 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : g * 12.92;
    b = b > 31308e-7 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : b * 12.92;
    r = Math.min(Math.max(0, r), 1);
    g = Math.min(Math.max(0, g), 1);
    b = Math.min(Math.max(0, b), 1);
    return [r * 255, g * 255, b * 255];
  };
  convert.xyz.lab = function(xyz) {
    var x = xyz[0];
    var y = xyz[1];
    var z = xyz[2];
    var l;
    var a;
    var b;
    x /= 95.047;
    y /= 100;
    z /= 108.883;
    x = x > 8856e-6 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
    y = y > 8856e-6 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
    z = z > 8856e-6 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
    l = 116 * y - 16;
    a = 500 * (x - y);
    b = 200 * (y - z);
    return [l, a, b];
  };
  convert.lab.xyz = function(lab) {
    var l = lab[0];
    var a = lab[1];
    var b = lab[2];
    var x;
    var y;
    var z;
    y = (l + 16) / 116;
    x = a / 500 + y;
    z = y - b / 200;
    var y2 = Math.pow(y, 3);
    var x2 = Math.pow(x, 3);
    var z2 = Math.pow(z, 3);
    y = y2 > 8856e-6 ? y2 : (y - 16 / 116) / 7.787;
    x = x2 > 8856e-6 ? x2 : (x - 16 / 116) / 7.787;
    z = z2 > 8856e-6 ? z2 : (z - 16 / 116) / 7.787;
    x *= 95.047;
    y *= 100;
    z *= 108.883;
    return [x, y, z];
  };
  convert.lab.lch = function(lab) {
    var l = lab[0];
    var a = lab[1];
    var b = lab[2];
    var hr;
    var h;
    var c;
    hr = Math.atan2(b, a);
    h = hr * 360 / 2 / Math.PI;
    if (h < 0) {
      h += 360;
    }
    c = Math.sqrt(a * a + b * b);
    return [l, c, h];
  };
  convert.lch.lab = function(lch) {
    var l = lch[0];
    var c = lch[1];
    var h = lch[2];
    var a;
    var b;
    var hr;
    hr = h / 360 * 2 * Math.PI;
    a = c * Math.cos(hr);
    b = c * Math.sin(hr);
    return [l, a, b];
  };
  convert.rgb.ansi16 = function(args) {
    var r = args[0];
    var g = args[1];
    var b = args[2];
    var value = 1 in arguments ? arguments[1] : convert.rgb.hsv(args)[2];
    value = Math.round(value / 50);
    if (value === 0) {
      return 30;
    }
    var ansi = 30 + (Math.round(b / 255) << 2 | Math.round(g / 255) << 1 | Math.round(r / 255));
    if (value === 2) {
      ansi += 60;
    }
    return ansi;
  };
  convert.hsv.ansi16 = function(args) {
    return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
  };
  convert.rgb.ansi256 = function(args) {
    var r = args[0];
    var g = args[1];
    var b = args[2];
    if (r === g && g === b) {
      if (r < 8) {
        return 16;
      }
      if (r > 248) {
        return 231;
      }
      return Math.round((r - 8) / 247 * 24) + 232;
    }
    var ansi = 16 + 36 * Math.round(r / 255 * 5) + 6 * Math.round(g / 255 * 5) + Math.round(b / 255 * 5);
    return ansi;
  };
  convert.ansi16.rgb = function(args) {
    var color = args % 10;
    if (color === 0 || color === 7) {
      if (args > 50) {
        color += 3.5;
      }
      color = color / 10.5 * 255;
      return [color, color, color];
    }
    var mult = (~~(args > 50) + 1) * 0.5;
    var r = (color & 1) * mult * 255;
    var g = (color >> 1 & 1) * mult * 255;
    var b = (color >> 2 & 1) * mult * 255;
    return [r, g, b];
  };
  convert.ansi256.rgb = function(args) {
    if (args >= 232) {
      var c = (args - 232) * 10 + 8;
      return [c, c, c];
    }
    args -= 16;
    var rem;
    var r = Math.floor(args / 36) / 5 * 255;
    var g = Math.floor((rem = args % 36) / 6) / 5 * 255;
    var b = rem % 6 / 5 * 255;
    return [r, g, b];
  };
  convert.rgb.hex = function(args) {
    var integer = ((Math.round(args[0]) & 255) << 16) + ((Math.round(args[1]) & 255) << 8) + (Math.round(args[2]) & 255);
    var string = integer.toString(16).toUpperCase();
    return "000000".substring(string.length) + string;
  };
  convert.hex.rgb = function(args) {
    var match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
    if (!match) {
      return [0, 0, 0];
    }
    var colorString = match[0];
    if (match[0].length === 3) {
      colorString = colorString.split("").map(function(char) {
        return char + char;
      }).join("");
    }
    var integer = parseInt(colorString, 16);
    var r = integer >> 16 & 255;
    var g = integer >> 8 & 255;
    var b = integer & 255;
    return [r, g, b];
  };
  convert.rgb.hcg = function(rgb) {
    var r = rgb[0] / 255;
    var g = rgb[1] / 255;
    var b = rgb[2] / 255;
    var max = Math.max(Math.max(r, g), b);
    var min = Math.min(Math.min(r, g), b);
    var chroma = max - min;
    var grayscale;
    var hue;
    if (chroma < 1) {
      grayscale = min / (1 - chroma);
    } else {
      grayscale = 0;
    }
    if (chroma <= 0) {
      hue = 0;
    } else if (max === r) {
      hue = (g - b) / chroma % 6;
    } else if (max === g) {
      hue = 2 + (b - r) / chroma;
    } else {
      hue = 4 + (r - g) / chroma + 4;
    }
    hue /= 6;
    hue %= 1;
    return [hue * 360, chroma * 100, grayscale * 100];
  };
  convert.hsl.hcg = function(hsl) {
    var s = hsl[1] / 100;
    var l = hsl[2] / 100;
    var c = 1;
    var f = 0;
    if (l < 0.5) {
      c = 2 * s * l;
    } else {
      c = 2 * s * (1 - l);
    }
    if (c < 1) {
      f = (l - 0.5 * c) / (1 - c);
    }
    return [hsl[0], c * 100, f * 100];
  };
  convert.hsv.hcg = function(hsv) {
    var s = hsv[1] / 100;
    var v = hsv[2] / 100;
    var c = s * v;
    var f = 0;
    if (c < 1) {
      f = (v - c) / (1 - c);
    }
    return [hsv[0], c * 100, f * 100];
  };
  convert.hcg.rgb = function(hcg) {
    var h = hcg[0] / 360;
    var c = hcg[1] / 100;
    var g = hcg[2] / 100;
    if (c === 0) {
      return [g * 255, g * 255, g * 255];
    }
    var pure = [0, 0, 0];
    var hi = h % 1 * 6;
    var v = hi % 1;
    var w = 1 - v;
    var mg = 0;
    switch (Math.floor(hi)) {
      case 0:
        pure[0] = 1;
        pure[1] = v;
        pure[2] = 0;
        break;
      case 1:
        pure[0] = w;
        pure[1] = 1;
        pure[2] = 0;
        break;
      case 2:
        pure[0] = 0;
        pure[1] = 1;
        pure[2] = v;
        break;
      case 3:
        pure[0] = 0;
        pure[1] = w;
        pure[2] = 1;
        break;
      case 4:
        pure[0] = v;
        pure[1] = 0;
        pure[2] = 1;
        break;
      default:
        pure[0] = 1;
        pure[1] = 0;
        pure[2] = w;
    }
    mg = (1 - c) * g;
    return [
      (c * pure[0] + mg) * 255,
      (c * pure[1] + mg) * 255,
      (c * pure[2] + mg) * 255
    ];
  };
  convert.hcg.hsv = function(hcg) {
    var c = hcg[1] / 100;
    var g = hcg[2] / 100;
    var v = c + g * (1 - c);
    var f = 0;
    if (v > 0) {
      f = c / v;
    }
    return [hcg[0], f * 100, v * 100];
  };
  convert.hcg.hsl = function(hcg) {
    var c = hcg[1] / 100;
    var g = hcg[2] / 100;
    var l = g * (1 - c) + 0.5 * c;
    var s = 0;
    if (l > 0 && l < 0.5) {
      s = c / (2 * l);
    } else if (l >= 0.5 && l < 1) {
      s = c / (2 * (1 - l));
    }
    return [hcg[0], s * 100, l * 100];
  };
  convert.hcg.hwb = function(hcg) {
    var c = hcg[1] / 100;
    var g = hcg[2] / 100;
    var v = c + g * (1 - c);
    return [hcg[0], (v - c) * 100, (1 - v) * 100];
  };
  convert.hwb.hcg = function(hwb) {
    var w = hwb[1] / 100;
    var b = hwb[2] / 100;
    var v = 1 - b;
    var c = v - w;
    var g = 0;
    if (c < 1) {
      g = (v - c) / (1 - c);
    }
    return [hwb[0], c * 100, g * 100];
  };
  convert.apple.rgb = function(apple) {
    return [apple[0] / 65535 * 255, apple[1] / 65535 * 255, apple[2] / 65535 * 255];
  };
  convert.rgb.apple = function(rgb) {
    return [rgb[0] / 255 * 65535, rgb[1] / 255 * 65535, rgb[2] / 255 * 65535];
  };
  convert.gray.rgb = function(args) {
    return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
  };
  convert.gray.hsl = convert.gray.hsv = function(args) {
    return [0, 0, args[0]];
  };
  convert.gray.hwb = function(gray) {
    return [0, 100, gray[0]];
  };
  convert.gray.cmyk = function(gray) {
    return [0, 0, 0, gray[0]];
  };
  convert.gray.lab = function(gray) {
    return [gray[0], 0, 0];
  };
  convert.gray.hex = function(gray) {
    var val = Math.round(gray[0] / 100 * 255) & 255;
    var integer = (val << 16) + (val << 8) + val;
    var string = integer.toString(16).toUpperCase();
    return "000000".substring(string.length) + string;
  };
  convert.rgb.gray = function(rgb) {
    var val = (rgb[0] + rgb[1] + rgb[2]) / 3;
    return [val / 255 * 100];
  };
});

// node_modules/chalk/node_modules/color-convert/route.js
var require_route = __commonJS((exports2, module2) => {
  var conversions = require_conversions();
  function buildGraph() {
    var graph = {};
    var models = Object.keys(conversions);
    for (var len = models.length, i = 0; i < len; i++) {
      graph[models[i]] = {
        distance: -1,
        parent: null
      };
    }
    return graph;
  }
  function deriveBFS(fromModel) {
    var graph = buildGraph();
    var queue = [fromModel];
    graph[fromModel].distance = 0;
    while (queue.length) {
      var current = queue.pop();
      var adjacents = Object.keys(conversions[current]);
      for (var len = adjacents.length, i = 0; i < len; i++) {
        var adjacent = adjacents[i];
        var node = graph[adjacent];
        if (node.distance === -1) {
          node.distance = graph[current].distance + 1;
          node.parent = current;
          queue.unshift(adjacent);
        }
      }
    }
    return graph;
  }
  function link(from, to) {
    return function(args) {
      return to(from(args));
    };
  }
  function wrapConversion(toModel, graph) {
    var path3 = [graph[toModel].parent, toModel];
    var fn = conversions[graph[toModel].parent][toModel];
    var cur = graph[toModel].parent;
    while (graph[cur].parent) {
      path3.unshift(graph[cur].parent);
      fn = link(conversions[graph[cur].parent][cur], fn);
      cur = graph[cur].parent;
    }
    fn.conversion = path3;
    return fn;
  }
  module2.exports = function(fromModel) {
    var graph = deriveBFS(fromModel);
    var conversion = {};
    var models = Object.keys(graph);
    for (var len = models.length, i = 0; i < len; i++) {
      var toModel = models[i];
      var node = graph[toModel];
      if (node.parent === null) {
        continue;
      }
      conversion[toModel] = wrapConversion(toModel, graph);
    }
    return conversion;
  };
});

// node_modules/chalk/node_modules/color-convert/index.js
var require_color_convert = __commonJS((exports2, module2) => {
  var conversions = require_conversions();
  var route = require_route();
  var convert = {};
  var models = Object.keys(conversions);
  function wrapRaw(fn) {
    var wrappedFn = function(args) {
      if (args === void 0 || args === null) {
        return args;
      }
      if (arguments.length > 1) {
        args = Array.prototype.slice.call(arguments);
      }
      return fn(args);
    };
    if ("conversion" in fn) {
      wrappedFn.conversion = fn.conversion;
    }
    return wrappedFn;
  }
  function wrapRounded(fn) {
    var wrappedFn = function(args) {
      if (args === void 0 || args === null) {
        return args;
      }
      if (arguments.length > 1) {
        args = Array.prototype.slice.call(arguments);
      }
      var result = fn(args);
      if (typeof result === "object") {
        for (var len = result.length, i = 0; i < len; i++) {
          result[i] = Math.round(result[i]);
        }
      }
      return result;
    };
    if ("conversion" in fn) {
      wrappedFn.conversion = fn.conversion;
    }
    return wrappedFn;
  }
  models.forEach(function(fromModel) {
    convert[fromModel] = {};
    Object.defineProperty(convert[fromModel], "channels", {value: conversions[fromModel].channels});
    Object.defineProperty(convert[fromModel], "labels", {value: conversions[fromModel].labels});
    var routes = route(fromModel);
    var routeModels = Object.keys(routes);
    routeModels.forEach(function(toModel) {
      var fn = routes[toModel];
      convert[fromModel][toModel] = wrapRounded(fn);
      convert[fromModel][toModel].raw = wrapRaw(fn);
    });
  });
  module2.exports = convert;
});

// node_modules/chalk/node_modules/ansi-styles/index.js
var require_ansi_styles = __commonJS((exports2, module2) => {
  "use strict";
  var colorConvert = require_color_convert();
  var wrapAnsi16 = (fn, offset) => function() {
    const code = fn.apply(colorConvert, arguments);
    return `[${code + offset}m`;
  };
  var wrapAnsi256 = (fn, offset) => function() {
    const code = fn.apply(colorConvert, arguments);
    return `[${38 + offset};5;${code}m`;
  };
  var wrapAnsi16m = (fn, offset) => function() {
    const rgb = fn.apply(colorConvert, arguments);
    return `[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
  };
  function assembleStyles() {
    const codes = new Map();
    const styles = {
      modifier: {
        reset: [0, 0],
        bold: [1, 22],
        dim: [2, 22],
        italic: [3, 23],
        underline: [4, 24],
        inverse: [7, 27],
        hidden: [8, 28],
        strikethrough: [9, 29]
      },
      color: {
        black: [30, 39],
        red: [31, 39],
        green: [32, 39],
        yellow: [33, 39],
        blue: [34, 39],
        magenta: [35, 39],
        cyan: [36, 39],
        white: [37, 39],
        gray: [90, 39],
        redBright: [91, 39],
        greenBright: [92, 39],
        yellowBright: [93, 39],
        blueBright: [94, 39],
        magentaBright: [95, 39],
        cyanBright: [96, 39],
        whiteBright: [97, 39]
      },
      bgColor: {
        bgBlack: [40, 49],
        bgRed: [41, 49],
        bgGreen: [42, 49],
        bgYellow: [43, 49],
        bgBlue: [44, 49],
        bgMagenta: [45, 49],
        bgCyan: [46, 49],
        bgWhite: [47, 49],
        bgBlackBright: [100, 49],
        bgRedBright: [101, 49],
        bgGreenBright: [102, 49],
        bgYellowBright: [103, 49],
        bgBlueBright: [104, 49],
        bgMagentaBright: [105, 49],
        bgCyanBright: [106, 49],
        bgWhiteBright: [107, 49]
      }
    };
    styles.color.grey = styles.color.gray;
    for (const groupName of Object.keys(styles)) {
      const group = styles[groupName];
      for (const styleName of Object.keys(group)) {
        const style = group[styleName];
        styles[styleName] = {
          open: `[${style[0]}m`,
          close: `[${style[1]}m`
        };
        group[styleName] = styles[styleName];
        codes.set(style[0], style[1]);
      }
      Object.defineProperty(styles, groupName, {
        value: group,
        enumerable: false
      });
      Object.defineProperty(styles, "codes", {
        value: codes,
        enumerable: false
      });
    }
    const ansi2ansi = (n) => n;
    const rgb2rgb = (r, g, b) => [r, g, b];
    styles.color.close = "[39m";
    styles.bgColor.close = "[49m";
    styles.color.ansi = {
      ansi: wrapAnsi16(ansi2ansi, 0)
    };
    styles.color.ansi256 = {
      ansi256: wrapAnsi256(ansi2ansi, 0)
    };
    styles.color.ansi16m = {
      rgb: wrapAnsi16m(rgb2rgb, 0)
    };
    styles.bgColor.ansi = {
      ansi: wrapAnsi16(ansi2ansi, 10)
    };
    styles.bgColor.ansi256 = {
      ansi256: wrapAnsi256(ansi2ansi, 10)
    };
    styles.bgColor.ansi16m = {
      rgb: wrapAnsi16m(rgb2rgb, 10)
    };
    for (let key of Object.keys(colorConvert)) {
      if (typeof colorConvert[key] !== "object") {
        continue;
      }
      const suite = colorConvert[key];
      if (key === "ansi16") {
        key = "ansi";
      }
      if ("ansi16" in suite) {
        styles.color.ansi[key] = wrapAnsi16(suite.ansi16, 0);
        styles.bgColor.ansi[key] = wrapAnsi16(suite.ansi16, 10);
      }
      if ("ansi256" in suite) {
        styles.color.ansi256[key] = wrapAnsi256(suite.ansi256, 0);
        styles.bgColor.ansi256[key] = wrapAnsi256(suite.ansi256, 10);
      }
      if ("rgb" in suite) {
        styles.color.ansi16m[key] = wrapAnsi16m(suite.rgb, 0);
        styles.bgColor.ansi16m[key] = wrapAnsi16m(suite.rgb, 10);
      }
    }
    return styles;
  }
  Object.defineProperty(module2, "exports", {
    enumerable: true,
    get: assembleStyles
  });
});

// node_modules/chalk/node_modules/has-flag/index.js
var require_has_flag = __commonJS((exports2, module2) => {
  "use strict";
  module2.exports = (flag, argv) => {
    argv = argv || process.argv;
    const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
    const pos = argv.indexOf(prefix + flag);
    const terminatorPos = argv.indexOf("--");
    return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
  };
});

// node_modules/chalk/node_modules/supports-color/index.js
var require_supports_color = __commonJS((exports2, module2) => {
  "use strict";
  var os = require("os");
  var hasFlag = require_has_flag();
  var env = process.env;
  var forceColor;
  if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false")) {
    forceColor = false;
  } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
    forceColor = true;
  }
  if ("FORCE_COLOR" in env) {
    forceColor = env.FORCE_COLOR.length === 0 || parseInt(env.FORCE_COLOR, 10) !== 0;
  }
  function translateLevel(level) {
    if (level === 0) {
      return false;
    }
    return {
      level,
      hasBasic: true,
      has256: level >= 2,
      has16m: level >= 3
    };
  }
  function supportsColor(stream) {
    if (forceColor === false) {
      return 0;
    }
    if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
      return 3;
    }
    if (hasFlag("color=256")) {
      return 2;
    }
    if (stream && !stream.isTTY && forceColor !== true) {
      return 0;
    }
    const min = forceColor ? 1 : 0;
    if (process.platform === "win32") {
      const osRelease = os.release().split(".");
      if (Number(process.versions.node.split(".")[0]) >= 8 && Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
        return Number(osRelease[2]) >= 14931 ? 3 : 2;
      }
      return 1;
    }
    if ("CI" in env) {
      if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
        return 1;
      }
      return min;
    }
    if ("TEAMCITY_VERSION" in env) {
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
    }
    if (env.COLORTERM === "truecolor") {
      return 3;
    }
    if ("TERM_PROGRAM" in env) {
      const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (env.TERM_PROGRAM) {
        case "iTerm.app":
          return version >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    if (/-256(color)?$/i.test(env.TERM)) {
      return 2;
    }
    if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
      return 1;
    }
    if ("COLORTERM" in env) {
      return 1;
    }
    if (env.TERM === "dumb") {
      return min;
    }
    return min;
  }
  function getSupportLevel(stream) {
    const level = supportsColor(stream);
    return translateLevel(level);
  }
  module2.exports = {
    supportsColor: getSupportLevel,
    stdout: getSupportLevel(process.stdout),
    stderr: getSupportLevel(process.stderr)
  };
});

// node_modules/chalk/templates.js
var require_templates = __commonJS((exports2, module2) => {
  "use strict";
  var TEMPLATE_REGEX = /(?:\\(u[a-f\d]{4}|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
  var STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
  var STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
  var ESCAPE_REGEX = /\\(u[a-f\d]{4}|x[a-f\d]{2}|.)|([^\\])/gi;
  var ESCAPES = new Map([
    ["n", "\n"],
    ["r", "\r"],
    ["t", "	"],
    ["b", "\b"],
    ["f", "\f"],
    ["v", "\v"],
    ["0", "\0"],
    ["\\", "\\"],
    ["e", ""],
    ["a", "\x07"]
  ]);
  function unescape2(c) {
    if (c[0] === "u" && c.length === 5 || c[0] === "x" && c.length === 3) {
      return String.fromCharCode(parseInt(c.slice(1), 16));
    }
    return ESCAPES.get(c) || c;
  }
  function parseArguments(name, args) {
    const results = [];
    const chunks = args.trim().split(/\s*,\s*/g);
    let matches;
    for (const chunk of chunks) {
      if (!isNaN(chunk)) {
        results.push(Number(chunk));
      } else if (matches = chunk.match(STRING_REGEX)) {
        results.push(matches[2].replace(ESCAPE_REGEX, (m, escape2, chr) => escape2 ? unescape2(escape2) : chr));
      } else {
        throw new Error(`Invalid Chalk template style argument: ${chunk} (in style '${name}')`);
      }
    }
    return results;
  }
  function parseStyle(style) {
    STYLE_REGEX.lastIndex = 0;
    const results = [];
    let matches;
    while ((matches = STYLE_REGEX.exec(style)) !== null) {
      const name = matches[1];
      if (matches[2]) {
        const args = parseArguments(name, matches[2]);
        results.push([name].concat(args));
      } else {
        results.push([name]);
      }
    }
    return results;
  }
  function buildStyle(chalk2, styles) {
    const enabled = {};
    for (const layer of styles) {
      for (const style of layer.styles) {
        enabled[style[0]] = layer.inverse ? null : style.slice(1);
      }
    }
    let current = chalk2;
    for (const styleName of Object.keys(enabled)) {
      if (Array.isArray(enabled[styleName])) {
        if (!(styleName in current)) {
          throw new Error(`Unknown Chalk style: ${styleName}`);
        }
        if (enabled[styleName].length > 0) {
          current = current[styleName].apply(current, enabled[styleName]);
        } else {
          current = current[styleName];
        }
      }
    }
    return current;
  }
  module2.exports = (chalk2, tmp) => {
    const styles = [];
    const chunks = [];
    let chunk = [];
    tmp.replace(TEMPLATE_REGEX, (m, escapeChar, inverse, style, close, chr) => {
      if (escapeChar) {
        chunk.push(unescape2(escapeChar));
      } else if (style) {
        const str = chunk.join("");
        chunk = [];
        chunks.push(styles.length === 0 ? str : buildStyle(chalk2, styles)(str));
        styles.push({inverse, styles: parseStyle(style)});
      } else if (close) {
        if (styles.length === 0) {
          throw new Error("Found extraneous } in Chalk template literal");
        }
        chunks.push(buildStyle(chalk2, styles)(chunk.join("")));
        chunk = [];
        styles.pop();
      } else {
        chunk.push(chr);
      }
    });
    chunks.push(chunk.join(""));
    if (styles.length > 0) {
      const errMsg = `Chalk template literal is missing ${styles.length} closing bracket${styles.length === 1 ? "" : "s"} (\`}\`)`;
      throw new Error(errMsg);
    }
    return chunks.join("");
  };
});

// node_modules/chalk/index.js
var require_chalk = __commonJS((exports2, module2) => {
  "use strict";
  var escapeStringRegexp = require_escape_string_regexp();
  var ansiStyles = require_ansi_styles();
  var stdoutColor = require_supports_color().stdout;
  var template = require_templates();
  var isSimpleWindowsTerm = process.platform === "win32" && !(process.env.TERM || "").toLowerCase().startsWith("xterm");
  var levelMapping = ["ansi", "ansi", "ansi256", "ansi16m"];
  var skipModels = new Set(["gray"]);
  var styles = Object.create(null);
  function applyOptions(obj, options) {
    options = options || {};
    const scLevel = stdoutColor ? stdoutColor.level : 0;
    obj.level = options.level === void 0 ? scLevel : options.level;
    obj.enabled = "enabled" in options ? options.enabled : obj.level > 0;
  }
  function Chalk(options) {
    if (!this || !(this instanceof Chalk) || this.template) {
      const chalk2 = {};
      applyOptions(chalk2, options);
      chalk2.template = function() {
        const args = [].slice.call(arguments);
        return chalkTag.apply(null, [chalk2.template].concat(args));
      };
      Object.setPrototypeOf(chalk2, Chalk.prototype);
      Object.setPrototypeOf(chalk2.template, chalk2);
      chalk2.template.constructor = Chalk;
      return chalk2.template;
    }
    applyOptions(this, options);
  }
  if (isSimpleWindowsTerm) {
    ansiStyles.blue.open = "[94m";
  }
  for (const key of Object.keys(ansiStyles)) {
    ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), "g");
    styles[key] = {
      get() {
        const codes = ansiStyles[key];
        return build.call(this, this._styles ? this._styles.concat(codes) : [codes], this._empty, key);
      }
    };
  }
  styles.visible = {
    get() {
      return build.call(this, this._styles || [], true, "visible");
    }
  };
  ansiStyles.color.closeRe = new RegExp(escapeStringRegexp(ansiStyles.color.close), "g");
  for (const model of Object.keys(ansiStyles.color.ansi)) {
    if (skipModels.has(model)) {
      continue;
    }
    styles[model] = {
      get() {
        const level = this.level;
        return function() {
          const open = ansiStyles.color[levelMapping[level]][model].apply(null, arguments);
          const codes = {
            open,
            close: ansiStyles.color.close,
            closeRe: ansiStyles.color.closeRe
          };
          return build.call(this, this._styles ? this._styles.concat(codes) : [codes], this._empty, model);
        };
      }
    };
  }
  ansiStyles.bgColor.closeRe = new RegExp(escapeStringRegexp(ansiStyles.bgColor.close), "g");
  for (const model of Object.keys(ansiStyles.bgColor.ansi)) {
    if (skipModels.has(model)) {
      continue;
    }
    const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
    styles[bgModel] = {
      get() {
        const level = this.level;
        return function() {
          const open = ansiStyles.bgColor[levelMapping[level]][model].apply(null, arguments);
          const codes = {
            open,
            close: ansiStyles.bgColor.close,
            closeRe: ansiStyles.bgColor.closeRe
          };
          return build.call(this, this._styles ? this._styles.concat(codes) : [codes], this._empty, model);
        };
      }
    };
  }
  var proto = Object.defineProperties(() => {
  }, styles);
  function build(_styles, _empty, key) {
    const builder = function() {
      return applyStyle.apply(builder, arguments);
    };
    builder._styles = _styles;
    builder._empty = _empty;
    const self2 = this;
    Object.defineProperty(builder, "level", {
      enumerable: true,
      get() {
        return self2.level;
      },
      set(level) {
        self2.level = level;
      }
    });
    Object.defineProperty(builder, "enabled", {
      enumerable: true,
      get() {
        return self2.enabled;
      },
      set(enabled) {
        self2.enabled = enabled;
      }
    });
    builder.hasGrey = this.hasGrey || key === "gray" || key === "grey";
    builder.__proto__ = proto;
    return builder;
  }
  function applyStyle() {
    const args = arguments;
    const argsLen = args.length;
    let str = String(arguments[0]);
    if (argsLen === 0) {
      return "";
    }
    if (argsLen > 1) {
      for (let a = 1; a < argsLen; a++) {
        str += " " + args[a];
      }
    }
    if (!this.enabled || this.level <= 0 || !str) {
      return this._empty ? "" : str;
    }
    const originalDim = ansiStyles.dim.open;
    if (isSimpleWindowsTerm && this.hasGrey) {
      ansiStyles.dim.open = "";
    }
    for (const code of this._styles.slice().reverse()) {
      str = code.open + str.replace(code.closeRe, code.open) + code.close;
      str = str.replace(/\r?\n/g, `${code.close}$&${code.open}`);
    }
    ansiStyles.dim.open = originalDim;
    return str;
  }
  function chalkTag(chalk2, strings) {
    if (!Array.isArray(strings)) {
      return [].slice.call(arguments, 1).join(" ");
    }
    const args = [].slice.call(arguments, 2);
    const parts = [strings.raw[0]];
    for (let i = 1; i < strings.length; i++) {
      parts.push(String(args[i - 1]).replace(/[{}\\]/g, "\\$&"));
      parts.push(String(strings.raw[i]));
    }
    return template(chalk2, parts.join(""));
  }
  Object.defineProperties(Chalk.prototype, styles);
  module2.exports = Chalk();
  module2.exports.supportsColor = stdoutColor;
  module2.exports.default = module2.exports;
});

// src/certifica.ts
__export(exports, {
  default: () => certifica_default
});
var forge = __toModule(require_lib());
var fs = __toModule(require("fs"));
var path2 = __toModule(require("path"));
var mkdirp = __toModule(require_mkdirp());

// src/settings.ts
var path = __toModule(require("path"));
var settings_default = {
  port: 8888,
  configFile: path.resolve(process.cwd(), "bproxy.conf.js"),
  downloadPath: "",
  https: [],
  sslAll: false,
  host: [],
  rules: [],
  certificate: {
    filename: "bproxy.ca.crt",
    keyFileName: "bproxy.ca.key.pem",
    name: "bproxy-cert",
    organizationName: "zoborzhang",
    OU: "https://github.com/zobor/bproxy",
    countryName: "CN",
    provinceName: "HuBei",
    localityName: "WuHan",
    keySize: 2048,
    getDefaultCABasePath() {
      const userHome = process.env.HOME || process.env.USERPROFILE || process.cwd();
      return path.resolve(userHome, "./.AppData/bproxy");
    },
    getDefaultCACertPath() {
      return path.resolve(this.getDefaultCABasePath(), this.filename);
    },
    getDefaultCAKeyPath() {
      return path.resolve(this.getDefaultCABasePath(), this.keyFileName);
    }
  }
};

// src/common.ts
var import_chalk = __toModule(require_chalk());
var {log} = console;
function logLevel(level) {
  return (target, key, descriptor) => {
    descriptor.value = function(message) {
      target.printf(message, level);
    };
  };
}
var Common = class {
  printf(message, level) {
    const info = level === "info" ? import_chalk.default.green("[INFO]") : level === "error" ? import_chalk.default.redBright("[ERROR]") : level === "debug" ? import_chalk.default.gray("[DEBUG]") : level === "warn" ? import_chalk.default.yellowBright("[WARN]") : "";
    const msg = typeof message === "object" ? JSON.stringify(message) : message;
    log(`${info} ${import_chalk.default.hex("#ccc")(msg)}`);
  }
  info(msg) {
  }
  error(msg) {
  }
  debug(msg) {
  }
  warn(msg) {
  }
};
__decorate([
  logLevel("info")
], Common.prototype, "info", 1);
__decorate([
  logLevel("error")
], Common.prototype, "error", 1);
__decorate([
  logLevel("debug")
], Common.prototype, "debug", 1);
__decorate([
  logLevel("warn")
], Common.prototype, "warn", 1);
var cm = new Common();

// src/dataset.ts
var dataset = {
  debug: true,
  logLevel: "error",
  language: "zh-cn"
};

// src/i18n.ts
var {language} = dataset;
var lang = {
  CERT_EXIST: {
    en: "",
    "zh-cn": "\u8BC1\u4E66\u5DF2\u5B58\u5728\uFF0C\u4E0D\u9700\u8981\u518D\u521B\u5EFA\u4E86!"
  },
  CREATE_CERTING: {
    en: "",
    "zh-cn": "\u672C\u5730\u4EE3\u7406\u670D\u52A1https\u8BC1\u4E66\u521B\u5EFA\u4E2D\uFF0C\u8BF7\u7A0D\u540E"
  },
  CREATE_CERT_SUC: {
    en: "",
    "zh-cn": "\u8BC1\u4E66\u521B\u5EFA\u6210\u529F"
  },
  CREATE_CERT_FAIL: {
    en: "",
    "zh-cn": "\u8BC1\u4E66\u521B\u5EFA\u5931\u8D25\uFF5E"
  },
  TRUST_CERT_PWD: {
    en: "",
    "zh-cn": "\u4FE1\u4EFB\u8BC1\u4E66\uFF0C\u4F60\u9700\u8981\u53EF\u80FD\u9700\u8981\u8F93\u5165\u8BA1\u7B97\u673A\u5BC6\u7801\u6388\u6743"
  },
  CERT_INSTALL_SUC: {
    en: "",
    "zh-cn": "\u8BC1\u4E66\u5B89\u88C5\u6210\u529F"
  },
  CERT_INSTALL_FAIL: {
    en: "",
    "zh-cn": "\u8BC1\u4E66\u5B89\u88C5\u5931\u8D25"
  },
  INSTALL_TIPS: {
    en: "auto instal certificate only support macOS\ndouble click bproxy.ca.crt to install",
    "zh-cn": "\u81EA\u52A8\u5B89\u88C5\u8BC1\u4E66\u76EE\u524D\u53EA\u652F\u6301MacOS\u7CFB\u7EDF\uFF0C\u5176\u4ED6\u7CFB\u7EDF\u8BF7\u53CC\u51FB\u8BC1\u4E66\u5B89\u88C5\uFF01"
  },
  START_LOCAL_SVR_SUC: {
    en: "",
    "zh-cn": "\u672C\u5730\u4EE3\u7406\u670D\u52A1\u5668\u542F\u52A8\u6210\u529F"
  },
  ERROR_CONFIG_PATH: {
    en: "",
    "zh-cn": "\u914D\u7F6E\u6587\u4EF6\u8DEF\u5F84\u4E0D\u80FD\u4E3A\u7A7A\uFF0C\u4F60\u53EF\u4EE5\u4F7F\u7528 . \u6765\u4EE3\u8868\u5F53\u524D\u76EE\u5F55"
  },
  CONFIG_FILE_UPDATE: {
    en: "",
    "zh-cn": "\u914D\u7F6E\u6587\u4EF6\u5DF2\u66F4\u65B0"
  }
};
var langLocal = {};
Object.keys(lang).forEach((key) => {
  langLocal[key] = lang[key][language];
});
var i18n_default = langLocal;

// src/certifica.ts
var {pki} = forge;
var config = settings_default.certificate;
var keys;
var Certificate = class {
  createCAForInstall(commonName) {
    const cert = pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = `${new Date().getTime()}`;
    cert.validity.notBefore = new Date();
    cert.validity.notBefore.setFullYear(cert.validity.notBefore.getFullYear() - 5);
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notAfter.getFullYear() + 20);
    const attrs = [{
      name: "commonName",
      value: commonName
    }, {
      name: "countryName",
      value: config.countryName
    }, {
      shortName: "ST",
      value: config.provinceName
    }, {
      name: "localityName",
      value: config.localityName
    }, {
      name: "organizationName",
      value: config.organizationName
    }, {
      shortName: "OU",
      value: config.OU
    }];
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    cert.setExtensions([{
      name: "basicConstraints",
      critical: true,
      cA: true
    }, {
      name: "keyUsage",
      critical: true,
      keyCertSign: true
    }, {
      name: "subjectKeyIdentifier"
    }]);
    cert.sign(keys.privateKey, forge.md.sha256.create());
    return {
      key: keys.privateKey,
      cert
    };
  }
  install(caPath) {
    const basePath = caPath || config.getDefaultCABasePath();
    const caCertPath = path2.resolve(basePath, config.filename);
    const caKeyPath = path2.resolve(basePath, config.keyFileName);
    try {
      fs.accessSync(caCertPath, fs.constants.R_OK);
      fs.accessSync(caKeyPath, fs.constants.R_OK);
      return {
        caCertPath,
        caKeyPath,
        create: true
      };
    } catch (e) {
      const caObj = this.createCAForInstall(config.filename);
      const caCert = caObj.cert;
      const cakey = caObj.key;
      const certPem = pki.certificateToPem(caCert);
      const keyPem = pki.privateKeyToPem(cakey);
      mkdirp.sync(path2.dirname(caCertPath));
      fs.writeFileSync(caCertPath, certPem);
      fs.writeFileSync(caKeyPath, keyPem);
    }
    return {
      caCertPath,
      caKeyPath,
      create: true
    };
  }
  init() {
    cm.info(i18n_default.CREATE_CERTING);
    keys = pki.rsa.generateKeyPair(config.keySize);
    const basePath = config.getDefaultCABasePath();
    const caCertPath = path2.resolve(basePath, config.filename);
    const caKeyPath = path2.resolve(basePath, config.keyFileName);
    const res = {
      caCertPath,
      caKeyPath,
      create: true
    };
    if (fs.existsSync(caCertPath) && fs.existsSync(caKeyPath)) {
      return res;
    }
    try {
      fs.accessSync(caCertPath, fs.constants.R_OK);
      fs.accessSync(caKeyPath, fs.constants.R_OK);
      return {
        caCertPath,
        caKeyPath,
        create: false
      };
    } catch (e) {
      const caObj = this.createCAForInstall(settings_default.certificate.name);
      const certPem = pki.certificateToPem(caObj.cert);
      const keyPem = pki.privateKeyToPem(caObj.key);
      mkdirp.sync(path2.dirname(caCertPath));
      fs.writeFileSync(caCertPath, certPem);
      fs.writeFileSync(caKeyPath, keyPem);
    }
    return res;
  }
  createFakeCertificateByDomain(caCert, caKey, domain) {
    const cert = pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = `${new Date().getTime()}`;
    cert.validity.notBefore = new Date();
    cert.validity.notBefore.setFullYear(cert.validity.notBefore.getFullYear() - 1);
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notAfter.getFullYear() + 1);
    const attrs = [{
      name: "commonName",
      value: domain
    }, {
      name: "countryName",
      value: config.countryName
    }, {
      shortName: "ST",
      value: config.provinceName
    }, {
      name: "localityName",
      value: config.localityName
    }, {
      name: "organizationName",
      value: config.organizationName
    }, {
      shortName: "OU",
      value: config.OU
    }];
    cert.setIssuer(caCert.subject.attributes);
    cert.setSubject(attrs);
    cert.setExtensions([{
      name: "basicConstraints",
      critical: true,
      cA: false
    }, {
      name: "keyUsage",
      critical: true,
      digitalSignature: true,
      contentCommitment: true,
      keyEncipherment: true,
      dataEncipherment: true,
      keyAgreement: true,
      keyCertSign: true,
      cRLSign: true,
      encipherOnly: true,
      decipherOnly: true
    }, {
      name: "subjectAltName",
      altNames: [{
        type: 2,
        value: domain
      }]
    }, {
      name: "subjectKeyIdentifier"
    }, {
      name: "extKeyUsage",
      serverAuth: true,
      clientAuth: true,
      codeSigning: true,
      emailProtection: true,
      timeStamping: true
    }, {
      name: "authorityKeyIdentifier"
    }]);
    cert.sign(caKey, forge.md.sha256.create());
    return {
      key: keys.privateKey,
      cert
    };
  }
};
var certifica_default = Certificate;
