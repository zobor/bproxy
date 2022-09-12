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
    wss: ()=>wss,
    channelManager: ()=>channelManager,
    wsApi: ()=>wsApi,
    emit: ()=>emit,
    ioInit: ()=>ioInit,
    ioRequest: ()=>ioRequest,
    onConfigFileChange: ()=>onConfigFileChange,
    onDebuggerClientChange: ()=>onDebuggerClientChange
});
const _jsBridge = /*#__PURE__*/ _interopRequireWildcard(require("../jsBridge"));
const _ws = require("ws");
const _channelManager = /*#__PURE__*/ _interopRequireDefault(require("./ChannelManager"));
const _logger = /*#__PURE__*/ _interopRequireDefault(require("../logger"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
let wss;
const channelManager = new _channelManager.default();
let instances = [];
async function bridgeApi(type, method, params, uuid, ws) {
    if (method && _jsBridge[method]) {
        _logger.default.info(`桥接调用[${method}]`, params);
        const rs = await _jsBridge[method](params);
        ws.send(JSON.stringify({
            type,
            method,
            payload: rs,
            uuid
        }));
        if (![
            'getLogContent'
        ].includes(method)) {
            _logger.default.info(`桥接调用的结果[${method}]`, rs);
        }
    }
}
const wsApi = (ws)=>{
    instances.push(ws);
    ws.onmessage = (e)=>{
        const wsData = JSON.parse(e.data);
        const { type , method , payload , uuid  } = wsData;
        switch(type){
            case 'bridge':
                bridgeApi(type, method, payload, uuid, ws);
                break;
            case 'syncMessage':
                ws.send(JSON.stringify(e.data));
                break;
            default:
                break;
        }
    };
    ws.onclose = (ws)=>{
        instances = instances.filter((ins)=>ins !== ws);
    };
};
const emit = (type, msg)=>{
    instances.forEach((ws)=>ws.send(JSON.stringify({
            type,
            payload: msg
        })));
};
const ioInit = (server)=>{
    wss = new _ws.WebSocket.Server({
        noServer: server ? true : false
    });
    wss.on('connection', (ws)=>{
        const { type  } = ws;
        if (type === 'client') {
            const { id , target  } = ws;
            channelManager.createClient(id, ws, target);
        } else if (type === 'target') {
            const { id: id1 , pageURL , title , favicon , ua  } = ws;
            channelManager.createTarget(id1, ws, pageURL, title, favicon, ua);
        }
    });
};
const ioRequest = (params)=>{
    emit('request', params);
};
const onConfigFileChange = ()=>{
    emit('onConfigFileChange', {});
};
const onDebuggerClientChange = ()=>{
    emit('onDebuggerClientChange', {});
};
channelManager.on('target_changed', ()=>{
    onDebuggerClientChange();
});
