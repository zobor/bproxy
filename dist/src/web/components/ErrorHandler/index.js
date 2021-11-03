"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_error_boundary_1 = require("react-error-boundary");
require("./index.scss");
function ErrorFallback(props) {
    const { error } = props;
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ role: "alert" }, { children: [(0, jsx_runtime_1.jsx)("h4", { children: "\u51FA\u9519\u4E86\uFF01" }, void 0), (0, jsx_runtime_1.jsx)("pre", { children: error.message }, void 0), error.stack ? (0, jsx_runtime_1.jsx)("pre", { children: error.stack }, void 0) : null] }), void 0));
}
const ErrorHandler = (props) => ((0, jsx_runtime_1.jsx)(react_error_boundary_1.ErrorBoundary, Object.assign({ FallbackComponent: ErrorFallback, onReset: () => { } }, { children: props.children }), void 0));
exports.default = ErrorHandler;
