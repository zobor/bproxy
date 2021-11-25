"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ctx_1 = require("../../ctx");
const buffer_1 = require("../../modules/buffer");
const jsonFormat_1 = __importDefault(require("../../libs/jsonFormat"));
require("./detail.scss");
const classnames_1 = __importDefault(require("classnames"));
const tooltip_1 = __importDefault(require("antd/es/tooltip"));
const tabList = [
    {
        label: "概览",
        value: "custom",
    },
    {
        label: "请求头",
        value: "requestHeaders",
    },
    {
        label: "请求参数",
        value: "requestParams",
    },
    {
        label: "POST参数",
        value: "postData",
    },
    {
        label: "响应头",
        value: "responseHeaders",
    },
    {
        label: "响应内容",
        value: "responseBody",
    },
];
const CookiesView = (props) => {
    const { cookies } = props;
    if (!(cookies && cookies.length)) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)("table", Object.assign({ className: "data-table" }, { children: [(0, jsx_runtime_1.jsx)("caption", { children: "Cookies" }, void 0), (0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", Object.assign({ style: { width: "20%" } }, { children: "key" }), void 0), (0, jsx_runtime_1.jsx)("td", { children: "value" }, void 0)] }, void 0) }, void 0), (0, jsx_runtime_1.jsx)("tbody", { children: cookies.map((str) => {
                    const arr = str.replace(/^(\w+)=/, "$1 ").split(" ");
                    return arr && arr.length === 2 ? ((0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", { children: arr[0] }, void 0), (0, jsx_runtime_1.jsx)("td", { children: decodeURIComponent(arr[1]) }, void 0)] }, `${arr[0]}-${arr[1]}`)) : null;
                }) }, void 0)] }), void 0));
};
const Detail = (props) => {
    var _a;
    const { state, dispatch } = (0, react_1.useContext)(ctx_1.Ctx);
    const [showBody, setShowBody] = (0, react_1.useState)("");
    const { detail = {} } = props;
    const { showDetail, detailActiveTab } = state;
    const { custom = {} } = detail || {};
    (0, react_1.useEffect)(() => {
        setShowBody("处理中...");
        detail &&
            setTimeout(() => {
                var _a, _b;
                if (detail.responseHeaders &&
                    ((_a = detail.responseHeaders["content-type"]) === null || _a === void 0 ? void 0 : _a.includes("image/"))) {
                    const body = ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "image-preview-box" }, { children: (0, jsx_runtime_1.jsx)("img", { className: "image-preview", src: (_b = detail === null || detail === void 0 ? void 0 : detail.custom) === null || _b === void 0 ? void 0 : _b.url }, void 0) }), void 0));
                    setShowBody(body);
                }
                else {
                    if (detail.custom.method === "ws") {
                        const body = detail.responseBody.map((item, idx) => ((0, jsx_runtime_1.jsx)("div", { children: (0, buffer_1.buffer2string)(item, "") }, `${detail.custom.requestId}-ws-body-${idx}`)));
                        setShowBody(body);
                    }
                    else {
                        let body = (0, buffer_1.buffer2string)(detail.responseBody, detail.responseHeaders &&
                            detail.responseHeaders["content-encoding"]);
                        if (detail === null || detail === void 0 ? void 0 : detail.responseHeaders["content-type"].includes("json")) {
                            try {
                                body = JSON.parse(body);
                                body = (0, jsonFormat_1.default)(body, null, 2, 100);
                            }
                            catch (err) { }
                        }
                        setShowBody(body);
                    }
                }
            }, 300);
    }, [detailActiveTab, detail]);
    const cookies = detailActiveTab === "requestHeaders" && ((_a = detail === null || detail === void 0 ? void 0 : detail.requestHeaders) === null || _a === void 0 ? void 0 : _a.cookie)
        ? detail.requestHeaders.cookie.split("; ")
        : [];
    (0, react_1.useEffect)(() => {
        if (!showDetail) {
            setShowBody("");
        }
    }, [showDetail]);
    const onClose = () => {
        dispatch({ type: "setShowDetail", showDetail: false });
    };
    const onTabChange = (tabValue) => {
        dispatch({ type: "setDetailActiveTab", detailActiveTab: tabValue });
    };
    const openUrl = (url) => {
        window.open(url);
    };
    if (!showDetail) {
        return null;
    }
    console.log(detail);
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: `detail ${showDetail ? "open" : ""}` }, { children: [(0, jsx_runtime_1.jsx)("div", { className: "mask", onClick: onClose }, void 0), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "content" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "url", onClick: openUrl.bind(null, custom.url) }, { children: custom ? ((0, jsx_runtime_1.jsxs)(tooltip_1.default, Object.assign({ title: custom.url }, { children: [custom.statusCode || "Pendding", " ", custom.method, " ", custom.origin, custom.path] }), void 0)) : ("") }), void 0), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "tabs" }, { children: (0, jsx_runtime_1.jsx)("ul", { children: custom &&
                                tabList.map((tab) => {
                                    if ((custom === null || custom === void 0 ? void 0 : custom.method) === "GET" && tab.value === "postData") {
                                        return null;
                                    }
                                    return ((0, jsx_runtime_1.jsx)("li", Object.assign({ onClick: onTabChange.bind(null, tab.value), className: `${detailActiveTab === tab.value ? "active" : ""}` }, { children: tab.label }), tab.value));
                                }) }, void 0) }), void 0), detail && detailActiveTab !== "responseBody" ? ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: (0, classnames_1.default)({
                            "form scrollbar-style": true,
                            [detail[detailActiveTab] && detail[detailActiveTab].$$type]: detail &&
                                detail[detailActiveTab] &&
                                !!detail[detailActiveTab].$$type,
                        }) }, { children: [detail[detailActiveTab]
                                ? Object.keys(detail[detailActiveTab])
                                    .filter((key) => key !== "$$type")
                                    .map((key) => ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "form-item" }, { children: [(0, jsx_runtime_1.jsxs)("label", { children: [key, ":"] }, void 0), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "form-item-value" }, { children: typeof detail[detailActiveTab][key] === "object"
                                                ? JSON.stringify(detail[detailActiveTab][key])
                                                : detail[detailActiveTab][key] }), void 0)] }), key)))
                                : null, (0, jsx_runtime_1.jsx)(CookiesView, { cookies: cookies }, void 0)] }), void 0)) : (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "body-panel scrollbar-style" }, { children: showBody || "不支持预览" }), void 0)] }), void 0)] }), void 0));
};
exports.default = Detail;
