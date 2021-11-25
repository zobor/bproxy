"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const switch_1 = __importDefault(require("antd/es/switch"));
const socket_1 = require("../../modules/socket");
require("antd/es/switch/style/css");
exports.default = () => {
    const [networks, setNetworks] = (0, react_1.useState)({});
    const [port, setport] = (0, react_1.useState)('');
    const onChange = (0, react_1.useCallback)((checked, deviceName) => {
        (0, socket_1.bridgeInvoke)({
            api: 'setNetworkProxyStatus',
            params: {
                deviceName,
                status: checked ? 'on' : 'off',
            },
        });
        setNetworks((pre) => (Object.assign(Object.assign({}, pre), { [deviceName]: checked })));
        if (checked) {
            (0, socket_1.bridgeInvoke)({
                api: 'setNetworkProxy',
                params: {
                    deviceName,
                    host: '127.0.0.1',
                    port,
                },
            });
        }
    }, [port]);
    (0, react_1.useEffect)(() => {
        (0, socket_1.bridgeInvoke)({
            api: 'getActiveNetworkProxyStatus',
        }).then(rs => {
            setNetworks(rs);
        });
        (0, socket_1.bridgeInvoke)({
            api: "getLocalProxyPort",
        }).then((portNumberString) => {
            setport(portNumberString);
        });
    }, []);
    return (0, jsx_runtime_1.jsx)("div", { children: Object.keys(networks).map(key => ((0, jsx_runtime_1.jsxs)("div", Object.assign({ style: { padding: '10px 0' } }, { children: [key, ": ", (0, jsx_runtime_1.jsx)(switch_1.default, { checkedChildren: "\u5F00\u542F", unCheckedChildren: "\u5173\u95ED", defaultChecked: true, checked: networks[key], onChange: (checked) => { onChange(checked, key); } }, void 0)] }), void 0))) }, void 0);
};
