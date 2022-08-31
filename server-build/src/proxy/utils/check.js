"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLikeJson = void 0;
const isLikeJson = (str) => {
    if (typeof str === 'string') {
        return /^\{[\S\s]+\}$/.test(str.trim()) || /^\[[\S\s]+\]$/.test(str.trim());
    }
    return false;
};
exports.isLikeJson = isLikeJson;
