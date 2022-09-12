"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "responseText", {
    enumerable: true,
    get: ()=>responseText
});
const _stream = require("stream");
const responseText = (text, res)=>{
    const s = new _stream.Readable();
    s.push(text);
    s.push(null);
    s.pipe(res);
};
