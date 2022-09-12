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
    IS_REG_URL: ()=>IS_REG_URL,
    LOCAL_STORAGE_SHOE_INSTALL_CERT: ()=>LOCAL_STORAGE_SHOE_INSTALL_CERT
});
const IS_REG_URL = /(https?|wss?):\/\//;
const LOCAL_STORAGE_SHOE_INSTALL_CERT = 'bproxy-tips-install-cert';
