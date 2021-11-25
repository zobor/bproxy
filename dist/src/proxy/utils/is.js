"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInspectContentType = void 0;
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
