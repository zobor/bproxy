"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ctx_1 = require("../../ctx");
const useRequest_1 = __importDefault(require("../../hooks/useRequest"));
const Detail_1 = __importDefault(require("./Detail"));
const Table_1 = __importDefault(require("./Table"));
const controller_1 = __importDefault(require("./controller"));
require("./index.scss");
const DetailMemo = (0, react_1.memo)(Detail_1.default);
exports.default = () => {
    var _a;
    const { state, dispatch } = (0, react_1.useContext)(ctx_1.Ctx);
    const { requestId, filterString, filterType } = state;
    const { list, clean } = (0, useRequest_1.default)(state.proxySwitch, filterType, filterString);
    const [detail, setDetail] = (0, react_1.useState)(null);
    const detailMemo = (0, react_1.useMemo)(() => {
        return detail;
    }, [(_a = detail === null || detail === void 0 ? void 0 : detail.custom) === null || _a === void 0 ? void 0 : _a.requestId]);
    const [connected, setConnected] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const item = list.find((item) => item.custom.requestId === requestId);
        if (item) {
            setDetail(item);
        }
    }, [list, requestId]);
    (0, react_1.useEffect)(() => {
        dispatch({ type: 'setClean', clean });
        setInterval(() => {
            var _a, _b;
            setConnected((_b = (_a = window) === null || _a === void 0 ? void 0 : _a.$socket) === null || _b === void 0 ? void 0 : _b.connected);
        }, 2000);
    }, []);
    return (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "app-main" }, { children: [(0, jsx_runtime_1.jsx)(controller_1.default, { connected: connected }, void 0), (0, jsx_runtime_1.jsx)(Table_1.default, { list: list }, void 0), (0, jsx_runtime_1.jsx)(DetailMemo, { detail: detailMemo }, void 0)] }), void 0);
};
