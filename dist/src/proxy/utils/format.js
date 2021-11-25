"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSeconds = void 0;
const formatSeconds = (sec) => {
    if (sec > 1000) {
        return (sec / 1000).toFixed(1) + 's';
    }
    return `${sec}ms`;
};
exports.formatSeconds = formatSeconds;
