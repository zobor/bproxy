"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseText = void 0;
const stream_1 = require("stream");
const responseText = (text, res) => {
    const s = new stream_1.Readable();
    s.push(text);
    s.push(null);
    s.pipe(res);
};
exports.responseText = responseText;
