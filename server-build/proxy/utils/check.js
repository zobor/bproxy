"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isLikeJson", {
    enumerable: true,
    get: ()=>isLikeJson
});
const isLikeJson = (str)=>{
    if (typeof str === 'string') {
        return /^\{[\S\s]+\}$/.test(str.trim()) || /^\[[\S\s]+\]$/.test(str.trim());
    }
    return false;
};
