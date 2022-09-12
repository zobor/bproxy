/* eslint-disable @typescript-eslint/no-unused-vars */ "use strict";
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
    utils: ()=>utils,
    createHttpHeader: ()=>createHttpHeader,
    isNeedTransformString2RegExp: ()=>isNeedTransformString2RegExp,
    url2regx: ()=>url2regx,
    isHttpsHostRegMatch: ()=>isHttpsHostRegMatch,
    versionString2Number: ()=>versionString2Number,
    compareVersion: ()=>compareVersion,
    stringToBytes: ()=>stringToBytes,
    hookConsoleLog: ()=>hookConsoleLog,
    runShellCode: ()=>runShellCode,
    delay: ()=>delay,
    safeDecodeUrl: ()=>safeDecodeUrl
});
const _childProcess = require("child_process");
const _ip = require("./ip");
const utils = {
    guid: (len = 36)=>{
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.slice(0, len).replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : r & 0x3 | 0x8;
            return v.toString(16);
        });
    },
    uuid: (len = 12)=>{
        return Buffer.from(utils.guid()).toString('base64').replace(/[/=+]/g, '').slice(0, len);
    }
};
const createHttpHeader = (line, headers)=>{
    return Object.keys(headers).reduce(function(head, key) {
        const value = headers[key];
        if (!Array.isArray(value)) {
            head.push(key + ": " + value);
            return head;
        }
        for(let i = 0; i < value.length; i++){
            head.push(key + ": " + value[i]);
        }
        return head;
    }, [
        line
    ]).join("\r\n") + "\r\n\r\n";
};
const isNeedTransformString2RegExp = (str)=>{
    if (!str) return false;
    return /[.*^$()/]/.test(str);
};
const url2regx = (url)=>{
    const newUrl = url.replace(/\./g, '\\.').replace(/\//g, '\/').replace(/\*{2,}/g, '(\\S+)').replace(/\*/g, '([^\\/]+)');
    return new RegExp(newUrl);
};
const isHttpsHostRegMatch = (httpsList, hostname)=>{
    let rs;
    for(let i = 0, len = httpsList.length; i < len; i++){
        if (rs) {
            break;
        }
        const httpsItem = httpsList[i];
        if (typeof httpsItem === 'string') {
            rs = httpsItem === hostname;
        } else {
            rs = httpsItem.test(hostname.replace(':443'));
        }
    }
    return rs;
};
const versionString2Number = (version)=>version.split('.').reduce((pre, cur, index)=>{
        return pre + Number(cur) * 100 ** (3 - index);
    }, 0);
const compareVersion = (v1, v2)=>{
    const n1 = versionString2Number(v1);
    const n2 = versionString2Number(v2);
    return n1 === n2 ? 0 : n1 > n2 ? 1 : 0;
};
function stringToBytes(str) {
    const out = new Int8Array(str.length);
    for(let i = 0; i < str.length; ++i)out[i] = str.charCodeAt(i);
    return out;
}
function hookConsoleLog(html, debug) {
    if (!html) {
        return html;
    }
    let replacement = '';
    const [ip] = (0, _ip.getLocalIpAddress)();
    if (debug === 'vconsole') {
        replacement = `
      <script type="text/javascript" src="https://cdn.bootcdn.net/ajax/libs/vConsole/3.9.1/vconsole.min.js"></script>
      <script type="text/javascript">
      try{
        window.addEventListener('load', () => new window.VConsole());
      }catch(err){}
      </script>
    `;
    } else if (debug) {
        replacement = `
      <script>window.BPROXY_SERVER_IP='${ip}';</script>
      <script defer="defer" type="text/javascript" src="https://bproxy.dev/inspect.js"></script>
    `;
    }
    const res = html.replace(/<meta[^"]*http-equiv="Content-Security-Policy"[^\>]*>/i, "").replace("</head>", `${replacement}</head>`);
    return res;
}
function runShellCode(shell, callback, onerror = (error)=>{}, onend = ()=>{}) {
    if (!shell) {
        return;
    }
    const params = shell.split(' ');
    const cmd = params.shift();
    const sh = (0, _childProcess.spawn)(cmd, params);
    if (callback) {
        sh.stdout.on('data', callback);
        sh.stderr.on('data', onerror);
        sh.on('close', onend);
    }
}
function delay(time) {
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve(true);
        }, time);
    });
}
function safeDecodeUrl(url) {
    try {
        return decodeURIComponent(url);
    } catch (err) {
        return url;
    }
}
