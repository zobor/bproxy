"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const classnames_1 = __importDefault(require("classnames"));
const ctx_1 = require("../../ctx");
require("./table.scss");
const format_1 = require("../../../proxy/utils/format");
const Table = (props) => {
    const { list } = props;
    const { state, dispatch } = (0, react_1.useContext)(ctx_1.Ctx);
    const { requestId } = state;
    const $table = (0, react_1.useRef)(null);
    const onClick = (req) => {
        dispatch({ type: "setShowDetail", showDetail: true });
        if (req.custom.requestId) {
            dispatch({ type: "setRequestId", requestId: req.custom.requestId });
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "table-box scrollbar-style" }, { children: [(0, jsx_runtime_1.jsxs)("table", Object.assign({ className: "table", ref: $table }, { children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", { children: "\u72B6\u6001" }, void 0), (0, jsx_runtime_1.jsx)("td", Object.assign({ className: "matched" }, { children: "\u5339\u914D" }), void 0), (0, jsx_runtime_1.jsx)("td", { children: "\u65B9\u5F0F" }, void 0), (0, jsx_runtime_1.jsx)("td", { children: "\u534F\u8BAE" }, void 0), (0, jsx_runtime_1.jsx)("td", { children: "\u57DF\u540D" }, void 0), (0, jsx_runtime_1.jsx)("td", { children: "\u5730\u5740" }, void 0), (0, jsx_runtime_1.jsx)("td", { children: "\u7C7B\u578B" }, void 0), (0, jsx_runtime_1.jsx)("td", { children: "\u8017\u65F6" }, void 0)] }, void 0) }, void 0), (0, jsx_runtime_1.jsx)("tbody", { children: list.map((req) => {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                            const statusCode = `${(_a = req === null || req === void 0 ? void 0 : req.custom) === null || _a === void 0 ? void 0 : _a.statusCode}`;
                            return ((0, jsx_runtime_1.jsxs)("tr", Object.assign({ className: (0, classnames_1.default)({
                                    active: requestId === ((_b = req === null || req === void 0 ? void 0 : req.custom) === null || _b === void 0 ? void 0 : _b.requestId),
                                    error: statusCode.indexOf('4') === 0 || statusCode.indexOf('5') === 0,
                                    matched: req.matched,
                                }), onClick: onClick.bind(null, req) }, { children: [(0, jsx_runtime_1.jsx)("td", Object.assign({ className: (0, classnames_1.default)({
                                            status: true,
                                        }) }, { children: (_c = req === null || req === void 0 ? void 0 : req.custom) === null || _c === void 0 ? void 0 : _c.statusCode }), void 0), (0, jsx_runtime_1.jsx)("td", Object.assign({ className: "matched" }, { children: req.matched ? '✔' : '✘' }), void 0), (0, jsx_runtime_1.jsx)("td", Object.assign({ className: "method" }, { children: (_d = req === null || req === void 0 ? void 0 : req.custom) === null || _d === void 0 ? void 0 : _d.method }), void 0), (0, jsx_runtime_1.jsx)("td", Object.assign({ className: "protocol" }, { children: (_e = req === null || req === void 0 ? void 0 : req.custom) === null || _e === void 0 ? void 0 : _e.protocol }), void 0), (0, jsx_runtime_1.jsx)("td", Object.assign({ className: "host", title: (_f = req === null || req === void 0 ? void 0 : req.custom) === null || _f === void 0 ? void 0 : _f.host }, { children: (_h = (_g = req === null || req === void 0 ? void 0 : req.custom) === null || _g === void 0 ? void 0 : _g.host) === null || _h === void 0 ? void 0 : _h.slice(0, 25) }), void 0), (0, jsx_runtime_1.jsx)("td", Object.assign({ className: "path", title: (_j = req === null || req === void 0 ? void 0 : req.custom) === null || _j === void 0 ? void 0 : _j.path }, { children: (_l = (_k = req === null || req === void 0 ? void 0 : req.custom) === null || _k === void 0 ? void 0 : _k.path) === null || _l === void 0 ? void 0 : _l.slice(0, 80) }), void 0), (0, jsx_runtime_1.jsx)("td", Object.assign({ className: "contentType" }, { children: (req === null || req === void 0 ? void 0 : req.responseHeaders) && ((req === null || req === void 0 ? void 0 : req.responseHeaders['content-type']) || '').replace(/;\s?\S+/, '').slice(0, 25) }), void 0), (0, jsx_runtime_1.jsx)("td", Object.assign({ className: "speed" }, { children: req.requestStartTime && req.requestEndTime ? `${(0, format_1.formatSeconds)(req.requestEndTime - req.requestStartTime)}` : '-' }), void 0)] }), (_m = req === null || req === void 0 ? void 0 : req.custom) === null || _m === void 0 ? void 0 : _m.requestId));
                        }) }, void 0)] }), void 0), list.length === 0 ? (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "empty-tip" }, { children: "\u6211\u5728\u7B49\u5F85 HTTP \u8BF7\u6C42\u7684\u5230\u6765..." }), void 0) : null] }), void 0));
};
exports.default = Table;
