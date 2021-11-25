"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.buffer2string = exports.textDecode = exports.bytesToString = exports.isBuffer = void 0;
const pako = __importStar(require("pako"));
const brDecode_1 = require("../modules/brDecode");
function isBuffer(v) {
    return Object.prototype.toString.call(v) === '[object Uint8Array]' || Object.prototype.toString.call(v) === '[object ArrayBuffer]';
}
exports.isBuffer = isBuffer;
function bytesToString(bytes) {
    return String.fromCharCode.apply(null, new Int32Array(bytes));
}
exports.bytesToString = bytesToString;
function textDecode(buf) {
    const decode = new TextDecoder('utf-8');
    return decode.decode(buf);
}
exports.textDecode = textDecode;
function buffer2string(buffer, encoding) {
    if (!isBuffer(buffer)) {
        return '';
    }
    let data = '';
    try {
        if (encoding === null || encoding === void 0 ? void 0 : encoding.includes('gzip')) {
            data = pako.ungzip(new Uint8Array(buffer), { to: "string" });
        }
        else if (encoding === 'br') {
            const u8 = (0, brDecode_1.BrotliDecode)(new Int8Array(buffer));
            data = textDecode(u8);
        }
        else {
            data = String.fromCharCode.apply(null, new Uint8Array(buffer));
        }
    }
    catch (err) {
        console.error('[error]buffer2string:', err);
    }
    return data;
}
exports.buffer2string = buffer2string;
;
