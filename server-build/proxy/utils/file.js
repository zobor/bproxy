"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getFileTypeFromSuffix: ()=>getFileTypeFromSuffix,
    getResponseContentType: ()=>getResponseContentType,
    checkStringIsFileOrPath: ()=>checkStringIsFileOrPath
});
const _fs = /*#__PURE__*/ _interopRequireWildcard(require("fs"));
const _path = /*#__PURE__*/ _interopRequireWildcard(require("path"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function getFileTypeFromSuffix(filepath) {
    const ma = /[^\/^\\^.]+\.(\w+)$/ig.exec(filepath);
    if (ma && ma.length >= 2) {
        return ma[1].toLocaleLowerCase();
    }
    return '';
}
function getResponseContentType(suffix) {
    const mp = {
        'js': 'text/javascript; charset=UTF-8',
        'json': 'application/json; charset=UTF-8',
        'css': 'text/css; charset=utf-8',
        'scss': 'text/css; charset=utf-8',
        'svg': 'image/svg+xml',
        'png': 'image/png',
        'jpg': 'image/jpg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'avif': 'image/ivaf',
        'webp': 'image/webp',
        'bmp': 'image/bmp',
        'mp4': 'video/mp4',
        'mp3': 'audio/mp3',
        'ttf': 'font/ttf',
        'woff2': 'font/woff2'
    };
    return mp[suffix];
}
function checkStringIsFileOrPath(str, cwd) {
    const fp = cwd ? _path.resolve(cwd, str) : str;
    try {
        _fs.accessSync(fp, _fs.constants.R_OK);
    } catch (err) {
        return '';
    }
    const stat = _fs.lstatSync(fp);
    if (stat.isFile()) {
        return 'file';
    }
    if (stat.isDirectory()) {
        return 'path';
    }
    return '';
}
