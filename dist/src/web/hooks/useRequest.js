"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const socket_1 = require("../modules/socket");
const util_1 = require("../modules/util");
const limit = 300;
exports.default = (proxySwitch, filterType, filterString) => {
    const [list, setList] = (0, react_1.useState)([]);
    const clean = () => {
        setList([]);
    };
    (0, react_1.useEffect)(() => {
        (0, socket_1.onRequest)((req) => {
            if (!proxySwitch) {
                return;
            }
            setList((pre) => {
                var _a, _b;
                const list = (0, util_1.filterRequestList)(pre, { filterType, filterString });
                const history = list.find((item) => item.custom.requestId === req.requestId);
                const index = list.findIndex(item => { var _a; return ((_a = item === null || item === void 0 ? void 0 : item.custom) === null || _a === void 0 ? void 0 : _a.requestId) === req.requestId; });
                if (history) {
                    history.requestEndTime = Date.now();
                    history.requestStartTime && (history.time = history.requestEndTime - history.requestStartTime);
                    if (req.responseHeaders) {
                        history.responseHeaders = req.responseHeaders;
                    }
                    if (req.responseBody && req.responseBody.byteLength) {
                        if (((_a = history === null || history === void 0 ? void 0 : history.custom) === null || _a === void 0 ? void 0 : _a.method) === "ws" ||
                            ((_b = history === null || history === void 0 ? void 0 : history.custom) === null || _b === void 0 ? void 0 : _b.method) === "wss") {
                            if (Array.isArray(history.responseBody)) {
                                history.responseBody.push(req.responseBody);
                            }
                            else {
                                history.responseBody && (history.responseBody = [req.responseBody]);
                            }
                        }
                        else {
                            history.responseBody = req.responseBody;
                        }
                    }
                    if (req.statusCode) {
                        history.custom = history.custom || {};
                        history.custom.statusCode = req.statusCode || 0;
                    }
                    pre[index] = history;
                    return [...list];
                }
                const item = (0, util_1.parseRequest)(req);
                const data = {
                    matched: !!req.matched,
                    requestStartTime: Date.now(),
                    custom: {
                        requestId: item.requestId,
                        url: item.url,
                        method: req.method,
                        protocol: item.protocol,
                        host: item.host,
                        path: item.path,
                        origin: item.origin,
                    },
                    requestHeaders: item.requestHeaders,
                    requestParams: item.requestParams || {},
                };
                if (req.statusCode && data.custom) {
                    data.custom.statusCode = req.statusCode;
                }
                if (req.requestBody) {
                    if (req.requestHeaders &&
                        req.requestHeaders["content-type"] ===
                            "application/x-www-form-urlencoded") {
                        const postData = (0, util_1.arrayBuf2string)(req.requestBody);
                        data.postData = (0, util_1.parseQueryString)(postData);
                        data.postData.$$type = "formData";
                    }
                    else if (req.requestHeaders &&
                        req.requestHeaders["content-type"] &&
                        req.requestHeaders["content-type"].includes("application/json")) {
                        const postData = (0, util_1.arrayBuf2string)(req.requestBody);
                        if (postData) {
                            try {
                                data.postData = JSON.parse(postData);
                                data.postData && (data.postData.$$type = "json");
                            }
                            catch (err) {
                                console.error("[error] post data parse fail", err);
                            }
                        }
                    }
                }
                if ((0, util_1.filterRequestItem)(data, { filterType, filterString })) {
                    const newList = pre.concat([data]);
                    if (pre.length > limit) {
                        return newList.slice(newList.length - limit);
                    }
                    return newList;
                }
                return pre;
            });
        });
    }, [proxySwitch, filterString, filterType]);
    return {
        list,
        clean,
    };
};
