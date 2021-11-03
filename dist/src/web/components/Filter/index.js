"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const form_1 = __importDefault(require("antd/es/form"));
const input_1 = __importDefault(require("antd/es/input"));
const radio_1 = __importDefault(require("antd/es/radio"));
require("antd/es/radio/style/css");
require("antd/es/input/style/css");
require("antd/es/form/style/css");
const react_1 = require("react");
const ctx_1 = require("../../ctx");
const typesList = ["host", "path", "url"];
exports.default = () => {
    const { state, dispatch } = (0, react_1.useContext)(ctx_1.Ctx);
    const { filterType, filterString } = state;
    const setType = (val) => {
        dispatch({ type: 'setFilterType', filterType: val });
    };
    const setFilter = (val) => {
        dispatch({ type: 'setFilterString', filterString: val });
    };
    const onTextChange = (e) => {
        setFilter(e.target.value.trim());
    };
    return (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)(form_1.default, { children: [(0, jsx_runtime_1.jsx)(form_1.default.Item, Object.assign({ label: "\u8FC7\u6EE4\u65B9\u5F0F" }, { children: (0, jsx_runtime_1.jsx)(radio_1.default.Group, Object.assign({ value: filterType, onChange: e => setType(e.target.value) }, { children: typesList.map((type) => (0, jsx_runtime_1.jsx)(radio_1.default.Button, Object.assign({ value: type }, { children: type }), `filter-type-${type}`)) }), void 0) }), void 0), (0, jsx_runtime_1.jsx)(form_1.default.Item, Object.assign({ label: "\u8FC7\u6EE4\u503C" }, { children: (0, jsx_runtime_1.jsx)(input_1.default, { allowClear: true, value: filterString, onChange: onTextChange }, void 0) }), void 0)] }, void 0) }, void 0);
};
