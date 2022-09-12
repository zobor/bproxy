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
    isInspectContentType: ()=>isInspectContentType,
    isImageContentType: ()=>isImageContentType,
    isDetailViewAble: ()=>isDetailViewAble,
    isError: ()=>isError,
    isFunction: ()=>isFunction,
    isArray: ()=>isArray,
    isFile: ()=>isFile,
    isObject: ()=>isObject,
    isPlainObject: ()=>isPlainObject,
    isImage: ()=>isImage,
    isRegExp: ()=>isRegExp,
    isPromise: ()=>isPromise,
    isLocalServerRequest: ()=>isLocalServerRequest
});
const isInspectContentType = (headers)=>{
    if (!headers || !headers['content-type'] && !headers.accept) {
        return false;
    }
    const contentType = headers['content-type'] || '';
    const { accept =''  } = headers;
    return contentType.includes("json") || contentType.includes("x-www-form-urlencoded") || contentType.includes("javascript") || contentType.includes("text/") || contentType.includes("xml") || accept.includes("text/");
};
const isImageContentType = (headers)=>{
    if (!headers || !headers['content-type']) {
        return false;
    }
    const contentType = headers['content-type'] || '';
    return contentType.includes("image");
};
const isDetailViewAble = (headers)=>{
    return isImageContentType(headers) || isInspectContentType(headers);
};
const isError = (v)=>Object.prototype.toString.call(v) === '[object Error]';
const isFunction = (v)=>Object.prototype.toString.call(v) === '[object Function]';
const isArray = (v)=>Object.prototype.toString.call(v) === '[object Array]';
const isFile = (v)=>Object.prototype.toString.call(v) === '[object File]';
const isObject = (v)=>Object.prototype.toString.call(v) === '[object Object]';
const isPlainObject = (v)=>isObject(v) && Object.keys(v).length === 0;
const isImage = (v)=>Object.prototype.toString.call(v) === '[object HTMLImageElement]';
const isRegExp = (v)=>Object.prototype.toString.call(v) === '[object RegExp]';
const isPromise = (v)=>Object.prototype.toString.call(v) === '[object Promise]';
const isLocalServerRequest = (url)=>{
    return !(url.startsWith('http') || url.startsWith('https')) && !url.includes('/socket.io/');
};
