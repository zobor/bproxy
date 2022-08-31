"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveNetworkProxyStatus = exports.getActiveNetworkProxyInfo = exports.getNetworkHttpsProxyInfo = exports.getNetworkHttpProxyInfo = exports.setActiveNetworkProxy = exports.setNetworkProxy = exports.setActiveNetworkProxyStatus = exports.setNetworkProxyStatus = exports.getActiveNetwork = exports.getNetworkServices = void 0;
const child_process_1 = require("child_process");
const getNetworkServices = () => {
    const txt = (0, child_process_1.spawnSync)('networksetup', ['-listallnetworkservices']).stdout.toString();
    return txt.split('\n').filter(item => !item.includes('that a network service') && !!item);
};
exports.getNetworkServices = getNetworkServices;
const getActiveNetwork = () => {
    const list = [];
    (0, exports.getNetworkServices)().map(deviceName => {
        const txt = (0, child_process_1.spawnSync)('networksetup', ['-getinfo', deviceName]).stdout.toString();
        if (/IP\saddress:\s\d+/.test(txt)) {
            list.push(deviceName);
        }
    });
    return list;
};
exports.getActiveNetwork = getActiveNetwork;
const setNetworkProxyStatus = ({ deviceName, status }) => {
    (0, child_process_1.spawnSync)('networksetup', ['-setwebproxystate', deviceName, status]);
    (0, child_process_1.spawnSync)('networksetup', ['-setsecurewebproxystate', deviceName, status]);
};
exports.setNetworkProxyStatus = setNetworkProxyStatus;
const setActiveNetworkProxyStatus = (status) => {
    const list = (0, exports.getActiveNetwork)();
    list.map(deviceName => {
        (0, exports.setNetworkProxyStatus)({ deviceName, status });
    });
};
exports.setActiveNetworkProxyStatus = setActiveNetworkProxyStatus;
const setNetworkProxy = ({ deviceName, host, port }) => {
    (0, child_process_1.spawnSync)('networksetup', ['-setautoproxystate', deviceName, 'off']);
    (0, child_process_1.spawnSync)('networksetup', ['-setwebproxy', deviceName, host, port]);
    (0, child_process_1.spawnSync)('networksetup', ['-setsecurewebproxy', deviceName, host, port]);
    (0, exports.setActiveNetworkProxyStatus)('on');
};
exports.setNetworkProxy = setNetworkProxy;
const setActiveNetworkProxy = ({ host, port }) => {
    const list = (0, exports.getActiveNetwork)();
    list.map(deviceName => {
        (0, child_process_1.spawnSync)('networksetup', ['-setautoproxystate', deviceName, 'off']);
        (0, exports.setNetworkProxy)({ deviceName, host, port });
        (0, exports.setActiveNetworkProxyStatus)('on');
    });
};
exports.setActiveNetworkProxy = setActiveNetworkProxy;
const getNetworkHttpProxyInfo = (deviceName) => {
    return Object.fromEntries((0, child_process_1.spawnSync)('networksetup', ['-getwebproxy', deviceName]).stdout.toString().split('\n').filter(item => !!item).map(item => {
        return item.split(': ');
    }));
};
exports.getNetworkHttpProxyInfo = getNetworkHttpProxyInfo;
const getNetworkHttpsProxyInfo = (deviceName) => {
    return Object.fromEntries((0, child_process_1.spawnSync)('networksetup', ['-getsecurewebproxy', deviceName]).stdout.toString().split('\n').filter(item => !!item).map(item => {
        return item.split(': ');
    }));
};
exports.getNetworkHttpsProxyInfo = getNetworkHttpsProxyInfo;
const getActiveNetworkProxyInfo = () => {
    const list = (0, exports.getActiveNetwork)();
    const result = {};
    list.map(deviceName => {
        const http = (0, exports.getNetworkHttpProxyInfo)(deviceName);
        const https = (0, exports.getNetworkHttpsProxyInfo)(deviceName);
        result[deviceName] = {
            http, https,
        };
    });
    return result;
};
exports.getActiveNetworkProxyInfo = getActiveNetworkProxyInfo;
const getActiveNetworkProxyStatus = () => {
    const data = (0, exports.getActiveNetworkProxyInfo)();
    const result = {};
    Object.keys(data).map(deviceName => {
        const { http, https } = data[deviceName];
        const enable = (http === null || http === void 0 ? void 0 : http.Enabled) === 'Yes' && (https === null || https === void 0 ? void 0 : https.Enabled) === 'Yes' && !!(http === null || http === void 0 ? void 0 : http.Server) && !!(https === null || https === void 0 ? void 0 : https.Server) && !!(https === null || https === void 0 ? void 0 : https.Port) && !!(http === null || http === void 0 ? void 0 : http.Port);
        result[deviceName] = enable;
    });
    return result;
};
exports.getActiveNetworkProxyStatus = getActiveNetworkProxyStatus;
