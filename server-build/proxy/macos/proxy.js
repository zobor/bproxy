"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getNetworkServices: ()=>getNetworkServices,
    getActiveNetwork: ()=>getActiveNetwork,
    setNetworkProxyStatus: ()=>setNetworkProxyStatus,
    setActiveNetworkProxyStatus: ()=>setActiveNetworkProxyStatus,
    setNetworkProxy: ()=>setNetworkProxy,
    setActiveNetworkProxy: ()=>setActiveNetworkProxy,
    getNetworkHttpProxyInfo: ()=>getNetworkHttpProxyInfo,
    getNetworkHttpsProxyInfo: ()=>getNetworkHttpsProxyInfo,
    getActiveNetworkProxyInfo: ()=>getActiveNetworkProxyInfo,
    getActiveNetworkProxyStatus: ()=>getActiveNetworkProxyStatus
});
const _childProcess = require("child_process");
const getNetworkServices = ()=>{
    const txt = (0, _childProcess.spawnSync)('networksetup', [
        '-listallnetworkservices'
    ]).stdout.toString();
    return txt.split('\n').filter((item)=>!item.includes('that a network service') && !!item);
};
const getActiveNetwork = ()=>{
    const list = [];
    getNetworkServices().map((deviceName)=>{
        const txt = (0, _childProcess.spawnSync)('networksetup', [
            '-getinfo',
            deviceName
        ]).stdout.toString();
        if (/IP\saddress:\s\d+/.test(txt)) {
            list.push(deviceName);
        }
    });
    return list;
};
const setNetworkProxyStatus = ({ deviceName , status  })=>{
    (0, _childProcess.spawnSync)('networksetup', [
        '-setwebproxystate',
        deviceName,
        status
    ]);
    (0, _childProcess.spawnSync)('networksetup', [
        '-setsecurewebproxystate',
        deviceName,
        status
    ]);
};
const setActiveNetworkProxyStatus = (status)=>{
    const list = getActiveNetwork();
    list.map((deviceName)=>{
        setNetworkProxyStatus({
            deviceName,
            status
        });
    });
};
const setNetworkProxy = ({ deviceName , host , port  })=>{
    (0, _childProcess.spawnSync)('networksetup', [
        '-setautoproxystate',
        deviceName,
        'off'
    ]);
    (0, _childProcess.spawnSync)('networksetup', [
        '-setwebproxy',
        deviceName,
        host,
        port
    ]);
    (0, _childProcess.spawnSync)('networksetup', [
        '-setsecurewebproxy',
        deviceName,
        host,
        port
    ]);
    setActiveNetworkProxyStatus('on');
};
const setActiveNetworkProxy = ({ host , port  })=>{
    const list = getActiveNetwork();
    list.map((deviceName)=>{
        (0, _childProcess.spawnSync)('networksetup', [
            '-setautoproxystate',
            deviceName,
            'off'
        ]);
        setNetworkProxy({
            deviceName,
            host,
            port
        });
        setActiveNetworkProxyStatus('on');
    });
};
const getNetworkHttpProxyInfo = (deviceName)=>{
    return Object.fromEntries((0, _childProcess.spawnSync)('networksetup', [
        '-getwebproxy',
        deviceName
    ]).stdout.toString().split('\n').filter((item)=>!!item).map((item)=>{
        return item.split(': ');
    }));
};
const getNetworkHttpsProxyInfo = (deviceName)=>{
    return Object.fromEntries((0, _childProcess.spawnSync)('networksetup', [
        '-getsecurewebproxy',
        deviceName
    ]).stdout.toString().split('\n').filter((item)=>!!item).map((item)=>{
        return item.split(': ');
    }));
};
const getActiveNetworkProxyInfo = ()=>{
    const list = getActiveNetwork();
    const result = {};
    list.map((deviceName)=>{
        const http = getNetworkHttpProxyInfo(deviceName);
        const https = getNetworkHttpsProxyInfo(deviceName);
        result[deviceName] = {
            http,
            https
        };
    });
    return result;
};
const getActiveNetworkProxyStatus = ()=>{
    const data = getActiveNetworkProxyInfo();
    const result = {};
    Object.keys(data).map((deviceName)=>{
        const { http , https  } = data[deviceName];
        const enable = (http === null || http === void 0 ? void 0 : http.Enabled) === 'Yes' && (https === null || https === void 0 ? void 0 : https.Enabled) === 'Yes' && !!(http === null || http === void 0 ? void 0 : http.Server) && !!(https === null || https === void 0 ? void 0 : https.Server) && !!(https === null || https === void 0 ? void 0 : https.Port) && !!(http === null || http === void 0 ? void 0 : http.Port);
        result[deviceName] = enable;
    });
    return result;
};
