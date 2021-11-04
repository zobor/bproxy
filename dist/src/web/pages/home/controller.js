"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const icons_1 = require("@ant-design/icons");
const modal_1 = __importDefault(require("antd/es/modal"));
const ruleTest_1 = __importDefault(require("../../components/ruleTest"));
require("antd/es/modal/style/css");
require("./controller.scss");
const useBool_1 = __importDefault(require("../../hooks/useBool"));
const ctx_1 = require("../../ctx");
const classnames_1 = __importDefault(require("classnames"));
const Filter_1 = __importDefault(require("../../components/Filter"));
const Install_1 = __importDefault(require("../../components/Install"));
const RuleTestModal = ({ visible, onClose }) => {
    return ((0, jsx_runtime_1.jsx)(modal_1.default, Object.assign({ title: "\u5339\u914D\u89C4\u5219\u6821\u9A8C", onCancel: onClose, visible: visible, footer: null, width: 1000 }, { children: (0, jsx_runtime_1.jsx)(ruleTest_1.default, {}, void 0) }), void 0));
};
const FilterModal = ({ visible, onClose }) => {
    return ((0, jsx_runtime_1.jsx)(modal_1.default, Object.assign({ onCancel: onClose, visible: visible, width: 1000, footer: null, title: "\u8FC7\u6EE4HTTP\u65E5\u5FD7" }, { children: (0, jsx_runtime_1.jsx)(Filter_1.default, {}, void 0) }), void 0));
};
const InstallModal = ({ visible, onClose }) => {
    return (0, jsx_runtime_1.jsx)(modal_1.default, Object.assign({ onCancel: onClose, visible: visible, width: 1000, footer: null, title: "\u5B89\u88C5HTTPS\u8BC1\u4E66" }, { children: (0, jsx_runtime_1.jsx)(Install_1.default, {}, void 0) }), void 0);
};
const Controller = () => {
    const { state, dispatch } = (0, react_1.useContext)(ctx_1.Ctx);
    const { proxySwitch, clean, disableCache, filterString } = state;
    const { state: isShowRuleTest, toggle: toggleShowRuleTest } = (0, useBool_1.default)(false);
    const { state: isShowFilter, toggle: toggleShowFilter } = (0, useBool_1.default)(false);
    const { state: isShowInstall, toggle: toggleShowInstall } = (0, useBool_1.default)(false);
    const toggleSwitch = (0, react_1.useCallback)(() => {
        dispatch({ type: "setProxySwitch", proxySwitch: !proxySwitch });
    }, [proxySwitch]);
    const onClean = () => {
        if (clean) {
            clean();
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "controller" }, { children: [(0, jsx_runtime_1.jsxs)("div", Object.assign({ onClick: toggleSwitch, className: (0, classnames_1.default)({
                    disabled: !proxySwitch,
                }) }, { children: [(0, jsx_runtime_1.jsx)(icons_1.PlayCircleOutlined, {}, void 0), (0, jsx_runtime_1.jsx)("span", { children: "\u65E5\u5FD7\u5F00\u5173" }, void 0)] }), void 0), (0, jsx_runtime_1.jsxs)("div", Object.assign({ onClick: onClean }, { children: [(0, jsx_runtime_1.jsx)(icons_1.ClearOutlined, {}, void 0), (0, jsx_runtime_1.jsx)("span", { children: "\u6E05\u7406\u65E5\u5FD7" }, void 0)] }), void 0), (0, jsx_runtime_1.jsxs)("div", Object.assign({ onClick: toggleShowInstall }, { children: [(0, jsx_runtime_1.jsx)(icons_1.WifiOutlined, {}, void 0), (0, jsx_runtime_1.jsx)("span", { children: "Wi-Fi\u8BC1\u4E66" }, void 0)] }), void 0), (0, jsx_runtime_1.jsxs)("div", Object.assign({ onClick: toggleShowRuleTest }, { children: [(0, jsx_runtime_1.jsx)(icons_1.BugOutlined, {}, void 0), (0, jsx_runtime_1.jsx)("span", { children: "\u4EE3\u7406\u89C4\u5219" }, void 0)] }), void 0), (0, jsx_runtime_1.jsxs)("div", Object.assign({ onClick: toggleShowFilter, className: (0, classnames_1.default)({
                    disabled: !filterString,
                }) }, { children: [(0, jsx_runtime_1.jsx)(icons_1.FilterOutlined, {}, void 0), (0, jsx_runtime_1.jsx)("span", { children: "\u8FC7\u6EE4\u89C4\u5219" }, void 0)] }), void 0), (0, jsx_runtime_1.jsx)(RuleTestModal, { onClose: toggleShowRuleTest, visible: isShowRuleTest }, void 0), (0, jsx_runtime_1.jsx)(FilterModal, { onClose: toggleShowFilter, visible: isShowFilter }, void 0), (0, jsx_runtime_1.jsx)(InstallModal, { onClose: toggleShowInstall, visible: isShowInstall }, void 0)] }), void 0));
};
exports.default = Controller;
