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
    formatSeconds: ()=>formatSeconds,
    parseFormData: ()=>parseFormData,
    parseJsonData: ()=>parseJsonData
});
const formatSeconds = (sec)=>{
    if (sec > 1000) {
        return (sec / 1000).toFixed(1) + 's';
    }
    return `${sec}ms`;
};
function parseFormData(str) {
    const arr = str.replace(/\r/g, '').split(/-{10,}\w+/).map((item)=>item.split('; ').filter((item)=>!!item.replace(/\n+/g, '')).map((item)=>item.split(/\n+/).filter((item)=>item.length))).filter((item)=>item.length);
    const formItems = [];
    arr.forEach((item)=>{
        if (item.length === 2) {
            const [key, value] = item[1];
            const label = key.replace(/name="([^"]+)"/, '$1');
            formItems.push([
                label,
                value
            ]);
        } else if (item.length >= 3) {
            const [key1] = item[1];
            const label1 = key1.replace(/name="([^"]+)"/, '$1');
            formItems.push([
                label1,
                '二进制文件'
            ]);
        }
    });
    return formItems;
}
function parseJsonData(str) {
    const data = [];
    str.split('&').forEach((item)=>{
        const arr = item.split('=');
        if (arr.length === 2) {
            data.push(arr);
        }
    });
    return data;
}
