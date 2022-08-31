"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkStringIsFileOrPath = exports.getResponseContentType = exports.getFileTypeFromSuffix = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function getFileTypeFromSuffix(filepath) {
    const ma = /[^\/^\\^.]+\.(\w+)$/ig.exec(filepath);
    if (ma && ma.length >= 2) {
        return ma[1].toLocaleLowerCase();
    }
    return '';
}
exports.getFileTypeFromSuffix = getFileTypeFromSuffix;
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
        'woff2': 'font/woff2',
    };
    return mp[suffix];
}
exports.getResponseContentType = getResponseContentType;
function checkStringIsFileOrPath(str, cwd) {
    const fp = cwd ? path.resolve(cwd, str) : str;
    try {
        fs.accessSync(fp, fs.constants.R_OK);
    }
    catch (err) {
        return '';
    }
    const stat = fs.lstatSync(fp);
    if (stat.isFile()) {
        return 'file';
    }
    if (stat.isDirectory()) {
        return 'path';
    }
    return '';
}
exports.checkStringIsFileOrPath = checkStringIsFileOrPath;
