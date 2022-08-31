"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLocalServerRequest = exports.isPromise = exports.isRegExp = exports.isImage = exports.isPlainObject = exports.isObject = exports.isFile = exports.isArray = exports.isFunction = exports.isError = exports.isDetailViewAble = exports.isImageContentType = exports.isInspectContentType = void 0;
const isInspectContentType = (headers) => {
    if (!headers || (!headers['content-type'] && !headers.accept)) {
        return false;
    }
    const contentType = headers['content-type'] || '';
    const { accept = '' } = headers;
    return (contentType.includes("json") ||
        contentType.includes("x-www-form-urlencoded") ||
        contentType.includes("javascript") ||
        contentType.includes("text/") ||
        contentType.includes("xml") ||
        accept.includes("text/"));
};
exports.isInspectContentType = isInspectContentType;
const isImageContentType = (headers) => {
    if (!headers || (!headers['content-type'])) {
        return false;
    }
    const contentType = headers['content-type'] || '';
    return contentType.includes("image");
};
exports.isImageContentType = isImageContentType;
const isDetailViewAble = (headers) => {
    return (0, exports.isImageContentType)(headers) || (0, exports.isInspectContentType)(headers);
};
exports.isDetailViewAble = isDetailViewAble;
const isError = (v) => Object.prototype.toString.call(v) === '[object Error]';
exports.isError = isError;
const isFunction = (v) => Object.prototype.toString.call(v) === '[object Function]';
exports.isFunction = isFunction;
const isArray = (v) => Object.prototype.toString.call(v) === '[object Array]';
exports.isArray = isArray;
const isFile = (v) => Object.prototype.toString.call(v) === '[object File]';
exports.isFile = isFile;
const isObject = (v) => Object.prototype.toString.call(v) === '[object Object]';
exports.isObject = isObject;
const isPlainObject = (v) => (0, exports.isObject)(v) && Object.keys(v).length === 0;
exports.isPlainObject = isPlainObject;
const isImage = (v) => Object.prototype.toString.call(v) === '[object HTMLImageElement]';
exports.isImage = isImage;
const isRegExp = (v) => Object.prototype.toString.call(v) === '[object RegExp]';
exports.isRegExp = isRegExp;
const isPromise = (v) => Object.prototype.toString.call(v) === '[object Promise]';
exports.isPromise = isPromise;
const isLocalServerRequest = (url) => {
    return !(url.startsWith('http') || url.startsWith('https')) && !url.includes('/socket.io/');
};
exports.isLocalServerRequest = isLocalServerRequest;
