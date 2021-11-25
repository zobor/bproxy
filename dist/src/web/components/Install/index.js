"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const qrcode_1 = __importDefault(require("qrcode"));
const socket_1 = require("../../modules/socket");
require("./index.scss");
const help = `
MacOS 安装证书：
bproxy -i

`;
exports.default = () => {
    const $canvas = (0, react_1.useRef)(null);
    const [href, setHref] = (0, react_1.useState)('');
    const render = (txt) => {
        qrcode_1.default.toCanvas($canvas.current, txt, { width: 300 });
    };
    (0, react_1.useEffect)(() => {
        (0, socket_1.bridgeInvoke)({
            api: "getLocalProxyPort",
        }).then((port) => {
            (0, socket_1.bridgeInvoke)({
                api: "getLocalIp",
            }).then((list) => {
                console.log(list);
                const ips = Array.isArray(list) ? list : [];
                const [ip] = ips.filter((item) => item !== "127.0.0.1");
                if (ip) {
                    const url = `http://${ip}:${port}/install`;
                    render(url);
                    setHref(url);
                }
            });
        });
    }, []);
    return (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "install-modal" }, { children: [(0, jsx_runtime_1.jsx)("h2", { children: "\u624B\u673A\u626B\u7801\uFF0C\u53EF\u4EE5\u5B89\u88C5\u8BC1\u4E66" }, void 0), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "tip-text" }, { children: "\u8BF7\u4FDD\u6301\u624B\u673A\u8DDFPC\u5728\u4E00\u4E2A\u5C40\u57DF\u7F51\u5185" }), void 0), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "url" }, { children: href }), void 0), (0, jsx_runtime_1.jsx)("canvas", { ref: $canvas }, void 0), (0, jsx_runtime_1.jsx)("pre", { children: (0, jsx_runtime_1.jsx)("code", { children: help }, void 0) }, void 0), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("a", Object.assign({ href: href }, { children: "\u70B9\u51FB\u4E0B\u8F7D\u8BC1\u4E66" }), void 0) }, void 0)] }), void 0);
};
