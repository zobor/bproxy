"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeDecodeUrl = exports.delay = exports.runShellCode = exports.hookConsoleLog = exports.stringToBytes = exports.compareVersion = exports.versionString2Number = exports.isHttpsHostRegMatch = exports.url2regx = exports.isNeedTransformString2RegExp = exports.createHttpHeader = exports.utils = void 0;
const child_process_1 = require("child_process");
const ip_1 = require("./ip");
exports.utils = {
    guid: (len = 36) => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.slice(0, len).replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    uuid: (len = 12) => {
        return Buffer.from(exports.utils.guid())
            .toString('base64')
            .replace(/[/=+]/g, '').slice(0, len);
    },
};
const createHttpHeader = (line, headers) => {
    return (Object.keys(headers)
        .reduce(function (head, key) {
        const value = headers[key];
        if (!Array.isArray(value)) {
            head.push(key + ": " + value);
            return head;
        }
        for (let i = 0; i < value.length; i++) {
            head.push(key + ": " + value[i]);
        }
        return head;
    }, [line])
        .join("\r\n") + "\r\n\r\n");
};
exports.createHttpHeader = createHttpHeader;
const isNeedTransformString2RegExp = (str) => {
    if (!str)
        return false;
    return /[.*^$()/]/.test(str);
};
exports.isNeedTransformString2RegExp = isNeedTransformString2RegExp;
const url2regx = (url) => {
    const newUrl = url
        .replace(/\./g, '\\.')
        .replace(/\//g, '\/')
        .replace(/\*{2,}/g, '(\\S+)')
        .replace(/\*/g, '([^\\/]+)');
    return new RegExp(newUrl);
};
exports.url2regx = url2regx;
const isHttpsHostRegMatch = (httpsList, hostname) => {
    let rs;
    for (let i = 0, len = httpsList.length; i < len; i++) {
        if (rs) {
            break;
        }
        const httpsItem = httpsList[i];
        if (typeof httpsItem === 'string') {
            rs = httpsItem === hostname;
        }
        else {
            rs = httpsItem.test(hostname.replace(':443'));
        }
    }
    return rs;
};
exports.isHttpsHostRegMatch = isHttpsHostRegMatch;
const versionString2Number = (version) => version.split('.').reduce((pre, cur, index) => {
    return pre + Number(cur) * (100 ** (3 - index));
}, 0);
exports.versionString2Number = versionString2Number;
const compareVersion = (v1, v2) => {
    const n1 = (0, exports.versionString2Number)(v1);
    const n2 = (0, exports.versionString2Number)(v2);
    return n1 === n2 ? 0 : n1 > n2 ? 1 : 0;
};
exports.compareVersion = compareVersion;
function stringToBytes(str) {
    const out = new Int8Array(str.length);
    for (let i = 0; i < str.length; ++i)
        out[i] = str.charCodeAt(i);
    return out;
}
exports.stringToBytes = stringToBytes;
function hookConsoleLog(html, debug) {
    if (!html) {
        return html;
    }
    let replacement = '';
    const [ip] = (0, ip_1.getLocalIpAddress)();
    if (debug === 'vconsole') {
        replacement = `
      <script type="text/javascript" src="https://cdn.bootcdn.net/ajax/libs/vConsole/3.9.1/vconsole.min.js"></script>
      <script type="text/javascript">
      try{
        window.addEventListener('load', () => new window.VConsole());
      }catch(err){}
      </script>
    `;
    }
    else if (debug) {
        replacement = `
      <script>window.BPROXY_SERVER_IP='${ip}';</script>
      <script defer="defer" type="text/javascript" src="https://bproxy.dev/inspect.js"></script>
    `;
    }
    const res = html
        .replace(/<meta[^"]*http-equiv="Content-Security-Policy"[^\>]*>/i, "")
        .replace("</head>", `${replacement}</head>`);
    return res;
}
exports.hookConsoleLog = hookConsoleLog;
function runShellCode(shell, callback, onerror = (error) => { }, onend = () => { }) {
    if (!shell) {
        return;
    }
    const params = shell.split(' ');
    const cmd = params.shift();
    const sh = (0, child_process_1.spawn)(cmd, params);
    if (callback) {
        sh.stdout.on('data', callback);
        sh.stderr.on('data', onerror);
        sh.on('close', onend);
    }
}
exports.runShellCode = runShellCode;
function delay(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
}
exports.delay = delay;
function safeDecodeUrl(url) {
    try {
        return decodeURIComponent(url);
    }
    catch (err) {
        return url;
    }
}
exports.safeDecodeUrl = safeDecodeUrl;
