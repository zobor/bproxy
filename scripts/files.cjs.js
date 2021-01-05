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
  for (var name2 in all)
    __defProp(target, name2, {get: all[name2], enumerable: true});
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

// node_modules/swear/index.min.js
var require_index_min = __commonJS((exports2, module2) => {
  (function(global, factory) {
    typeof exports2 === "object" && typeof module2 !== "undefined" ? module2.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = global || self, global.swear = factory());
  })(exports2, function() {
    "use strict";
    const resolve = async (value) => {
      value = await value;
      if (Array.isArray(value)) {
        return await Promise.all(value.map(resolve));
      }
      return value;
    };
    const reject = (message) => Promise.reject(new Error(message));
    const regexpCallback = (cb) => cb instanceof RegExp ? cb.test.bind(cb) : cb;
    const callback = (cb, self2) => (...args) => regexpCallback(cb).call(self2, ...args);
    const extend = (cb, self2) => async (value, i, all) => ({value, extra: await callback(cb, self2)(value, i, all)});
    const extraUp = ({extra}) => extra;
    const valueUp = ({value}) => value;
    const extendArray = {every: async (obj, cb, self2) => {
      for (let i = 0; i < obj.length; i++) {
        const found = await callback(cb, self2)(obj[i], i, obj);
        if (!found)
          return false;
      }
      return true;
    }, filter: async (obj, cb, self2) => {
      const data = await resolve(obj.map(extend(cb, self2)));
      return data.filter(extraUp).map(valueUp);
    }, find: async (obj, cb, self2) => {
      for (let i = 0; i < obj.length; i++) {
        const found = await callback(cb, self2)(obj[i], i, obj);
        if (found)
          return obj[i];
      }
    }, findIndex: async (obj, cb, self2) => {
      for (let i = 0; i < obj.length; i++) {
        const found = await callback(cb, self2)(obj[i], i, obj);
        if (found)
          return i;
      }
      return -1;
    }, forEach: async (obj, cb, self2) => {
      await resolve(obj.map(extend(cb, self2)));
      return obj;
    }, reduce: async (obj, cb, init) => {
      const hasInit = typeof init !== "undefined";
      if (!hasInit)
        init = obj[0];
      for (let i = hasInit ? 0 : 1; i < obj.length; i++) {
        init = await callback(cb)(init, obj[i], i, obj);
      }
      return init;
    }, reduceRight: async (obj, cb, init) => {
      const hasInit = typeof init !== "undefined";
      if (!hasInit)
        init = obj[obj.length - 1];
      for (let i = obj.length - (hasInit ? 1 : 2); i >= 0; i--) {
        init = await callback(cb)(init, obj[i], i, obj);
      }
      return init;
    }, some: async (obj, cb, self2) => {
      for (let i = 0; i < obj.length; i++) {
        const found = await callback(cb, self2)(obj[i], i, obj);
        if (found)
          return true;
      }
      return false;
    }};
    const getter = (obj, extend2) => (target, key) => {
      if (key === "then")
        return (...args) => {
          return resolve(obj).then(...args);
        };
      if (key === "catch")
        return (...args) => {
          return root(resolve(obj).catch(...args));
        };
      return func(resolve(obj).then((obj2) => {
        if (typeof key === "symbol")
          return obj2[key];
        if (key in extend2) {
          return func((...args) => extend2[key](obj2, ...args), extend2);
        }
        if (typeof obj2 === "number" && key in extend2.number) {
          return func((...args) => extend2.number[key](obj2, ...args), extend2);
        }
        if (typeof obj2 === "string" && key in extend2.string) {
          return func((...args) => extend2.string[key](obj2, ...args), extend2);
        }
        if (Array.isArray(obj2) && key in extend2.array) {
          return func((...args) => extend2.array[key](obj2, ...args), extend2);
        }
        if (obj2[key] && obj2[key].bind) {
          return func(obj2[key].bind(obj2), extend2);
        }
        return func(obj2[key], extend2);
      }), extend2);
    };
    const applier = (obj, extend2) => (target, self2, args) => {
      return func(resolve(obj).then((obj2) => {
        if (typeof obj2 !== "function") {
          return reject(`You tried to call "${JSON.stringify(obj2)}" (${typeof obj2}) as a function, but it is not.`);
        }
        return obj2(...args);
      }), extend2);
    };
    const func = (obj, extend2) => new Proxy(() => {
    }, {get: getter(obj, extend2), apply: applier(obj, extend2)});
    const root = (obj, {number, string, array, ...others} = {}) => {
      if (typeof obj === "function") {
        return (...args) => root(Promise.all(args).then((args2) => obj(...args2)));
      }
      return new Proxy({}, {get: getter(obj, {number: {...number}, string: {...string}, array: {...extendArray, ...array}, ...others})});
    };
    return root;
  });
});

// node_modules/atocha/atocha.min.js
var require_atocha_min = __commonJS((exports2, module2) => {
  (function(global, factory) {
    typeof exports2 === "object" && typeof module2 !== "undefined" ? module2.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = global || self, global.atocha = factory());
  })(exports2, function() {
    "use strict";
    const swear2 = require_index_min();
    const {promisify: promisify2} = require("util");
    const exec = promisify2(require("child_process").exec);
    var atocha = (command, buffer = 10) => {
      const maxBuffer = buffer * 1024 * 1024;
      return swear2(exec(command, {maxBuffer}).then((out) => {
        if (out.stderr)
          throw new Error(out.stderr);
        return out.stdout.trim();
      }));
    };
    return atocha;
  });
});

// scripts/files.js
__export(exports, {
  abs: () => abs,
  cat: () => cat,
  copy: () => copy,
  default: () => files_default,
  dir: () => dir,
  exists: () => exists,
  home: () => home,
  join: () => join,
  list: () => list,
  ls: () => list,
  mkdir: () => mkdir,
  move: () => move,
  name: () => name,
  read: () => cat,
  remove: () => remove,
  sep: () => sep,
  stat: () => stat,
  swear: () => import_swear.default,
  tmp: () => tmp,
  walk: () => walk,
  write: () => write
});
var import_fs = __toModule(require("fs"));
var import_path = __toModule(require("path"));
var import_os = __toModule(require("os"));
var import_util = __toModule(require("util"));
var import_swear = __toModule(require_index_min());
var import_atocha = __toModule(require_atocha_min());
var mac = () => process.platform === "darwin";
var linux = () => process.platform === "linux";
var abs = import_swear.default(async (name2 = ".", base = process.cwd()) => {
  name2 = await name2;
  base = await base;
  if (import_path.default.isAbsolute(name2))
    return name2;
  if (!base || typeof base !== "string") {
    base = process.cwd();
  }
  return join(base, name2);
});
var readFile = import_util.promisify(import_fs.default.readFile);
var cat = import_swear.default(async (name2) => {
  name2 = await abs(name2);
  return readFile(name2, "utf-8").catch((err) => "");
});
var copyAsync = import_util.promisify(import_fs.default.copyFile);
var copy = import_swear.default(async (src, dst) => {
  src = await abs(src);
  dst = await abs(dst);
  await mkdir(dir(dst));
  await copyAsync(src, dst);
  return dst;
});
var dir = import_swear.default(async (name2) => {
  name2 = await abs(name2);
  return import_path.default.dirname(name2);
});
var existsAsync = import_util.promisify(import_fs.default.exists);
var exists = import_swear.default(async (name2) => {
  name2 = await abs(name2);
  return existsAsync(name2).catch((res) => res);
});
var home = import_swear.default((...args) => join(import_os.homedir(), ...args).then(mkdir));
var join = import_swear.default((...parts) => abs(import_path.default.join(...parts)));
var readDir = import_util.promisify(import_fs.default.readdir);
var list = import_swear.default(async (dir2) => {
  dir2 = await abs(dir2);
  const files2 = await readDir(dir2);
  return import_swear.default(files2).map((file) => abs(file, dir2));
});
var mkdirAsync = import_util.promisify(import_fs.default.mkdir);
var mkdir = import_swear.default(async (name2) => {
  name2 = await abs(name2);
  const list2 = name2.split(import_path.default.sep).map((part, i, all) => all.slice(0, i + 1).join(import_path.default.sep)).filter(Boolean);
  for (let path2 of list2) {
    if (await exists(path2))
      continue;
    await mkdirAsync(path2).catch((err) => {
    });
  }
  return name2;
});
var renameAsync = import_util.promisify(import_fs.default.rename);
var move = import_swear.default(async (src, dst) => {
  src = await abs(src);
  dst = await abs(dst);
  await mkdir(dir(dst));
  await renameAsync(src, dst);
  return dst;
});
var name = import_swear.default((file) => import_path.default.basename(file));
var removeDirAsync = import_util.promisify(import_fs.default.rmdir);
var removeFileAsync = import_util.promisify(import_fs.default.unlink);
var remove = import_swear.default(async (name2) => {
  name2 = await abs(name2);
  if (name2 === "/")
    throw new Error("Cannot remove the root folder `/`");
  if (!await exists(name2))
    return name2;
  if (await stat(name2).isDirectory()) {
    await list(name2).map(remove);
    await removeDirAsync(name2).catch((err) => {
    });
  } else {
    await removeFileAsync(name2).catch((err) => {
    });
  }
  return name2;
});
var sep = import_path.default.sep;
var statAsync = import_util.promisify(import_fs.default.lstat);
var stat = import_swear.default(async (name2) => {
  name2 = await abs(name2);
  return statAsync(name2).catch((err) => {
  });
});
var tmp = import_swear.default(async (path2) => {
  path2 = await abs(path2, import_os.tmpdir());
  return mkdir(path2);
});
var rWalk = (name2) => {
  const file = abs(name2);
  const deeper = async (file2) => {
    if (await stat(file2).isDirectory()) {
      return rWalk(file2);
    }
    return [file2];
  };
  return list(file).map(deeper).reduce((all, arr) => all.concat(arr), []);
};
var walk = import_swear.default(async (name2) => {
  name2 = await abs(name2);
  if (!await exists(name2))
    return [];
  if (linux() || mac()) {
    try {
      return await import_atocha.default(`find ${name2} -type f`).split("\n").filter(Boolean);
    } catch (error) {
    }
  }
  return rWalk(name2).filter(Boolean);
});
var writeFile = import_util.promisify(import_fs.default.writeFile);
var write = import_swear.default(async (name2, body = "") => {
  name2 = await abs(name2);
  await mkdir(dir(name2));
  await writeFile(name2, body, "utf-8");
  return name2;
});
var files = {
  abs,
  cat,
  copy,
  dir,
  exists,
  home,
  join,
  list,
  ls: list,
  mkdir,
  move,
  name,
  read: cat,
  remove,
  sep,
  stat,
  swear: import_swear.default,
  tmp,
  walk,
  write
};
var files_default = files;
