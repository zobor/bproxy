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
exports.getRandStr = exports.rand = exports.filterRequestList = exports.filterRequestItem = exports.parseRequest = exports.parseQueryString = exports.arrayBuf2string = exports.parseURL = void 0;
const qs = __importStar(require("qs"));
const parseURL = (url) => {
    const a = document.createElement('a');
    a.href = url;
    const res = {
        hostname: a.hostname,
        path: a.pathname,
        protocol: a.protocol.replace(':', ''),
        query: a.search.replace('?', ''),
        origin: a.origin,
    };
    return res;
};
exports.parseURL = parseURL;
const arrayBuf2string = (buf) => {
    const enc = new TextDecoder('utf-8');
    return enc.decode(buf);
};
exports.arrayBuf2string = arrayBuf2string;
const parseQueryString = (query) => {
    if (!query) {
        return {};
    }
    return qs.parse(query);
};
exports.parseQueryString = parseQueryString;
const parseRequest = (req) => {
    const { hostname, path, protocol, query, origin } = (0, exports.parseURL)(req.url);
    const params = (0, exports.parseQueryString)(query);
    return Object.assign(req, {
        host: hostname,
        path,
        protocol,
        origin,
        requestParams: params,
    });
};
exports.parseRequest = parseRequest;
const filterRequestItem = (request, filter) => {
    var _a, _b, _c, _d, _e, _f;
    const { filterString, filterType } = filter;
    if (!filterString) {
        return true;
    }
    switch (filterType) {
        case "url":
            return (_b = (_a = request === null || request === void 0 ? void 0 : request.custom) === null || _a === void 0 ? void 0 : _a.url) === null || _b === void 0 ? void 0 : _b.includes(filterString);
        case "path":
            return (_d = (_c = request === null || request === void 0 ? void 0 : request.custom) === null || _c === void 0 ? void 0 : _c.path) === null || _d === void 0 ? void 0 : _d.includes(filterString);
        case "host":
            return (_f = (_e = request === null || request === void 0 ? void 0 : request.custom) === null || _e === void 0 ? void 0 : _e.host) === null || _f === void 0 ? void 0 : _f.includes(filterString);
        default:
            return false;
    }
};
exports.filterRequestItem = filterRequestItem;
const filterRequestList = (list, filter) => list.filter((item) => (0, exports.filterRequestItem)(item, filter));
exports.filterRequestList = filterRequestList;
const rand = (min, max) => {
    return parseInt(Math.random() * (max - min + 1) + min, 10);
};
exports.rand = rand;
const getRandStr = (len = 12) => {
    const base = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const max = base.length - 1;
    return Array(len).fill(0).map((_, idx) => base[(0, exports.rand)(idx === 0 ? 10 : 0, max)]).join('');
};
exports.getRandStr = getRandStr;
