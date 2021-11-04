"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const ctx_1 = require("./ctx");
const ErrorHandler_1 = __importDefault(require("./components/ErrorHandler"));
require("./App.scss");
const keepAliveCache = {};
function LazyLoadComponent(Com, name) {
    const cacheKey = `${name}-router`;
    if (keepAliveCache[cacheKey]) {
        return keepAliveCache[cacheKey];
    }
    keepAliveCache[cacheKey] = react_1.default.memo((props) => ((0, jsx_runtime_1.jsx)(react_1.Suspense, Object.assign({ fallback: (0, jsx_runtime_1.jsx)("div", {}, void 0) }, { children: (0, jsx_runtime_1.jsx)(Com, Object.assign({}, props), void 0) }), void 0)));
    return keepAliveCache[cacheKey];
}
const routerList = [
    {
        name: 'Home',
        path: './pages/home',
        Component: (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./pages/home')))),
        routerPath: '/',
    },
];
exports.default = () => {
    const [state, dispatch] = (0, react_1.useReducer)(ctx_1.reducer, ctx_1.defaultState);
    const timer = (0, react_1.useRef)(0);
    (0, react_1.useEffect)(() => {
        const historyContext = window.localStorage.getItem('context-data');
        if (historyContext) {
            try {
                const data = JSON.parse(historyContext);
                Object.keys(data).forEach((key) => {
                    Promise.resolve().then(() => {
                        const fn = key.slice(0, 1).toUpperCase() + key.slice(1);
                        dispatch({
                            type: `set${fn}`,
                            [key]: data[key],
                        });
                    });
                });
            }
            catch (err) { }
        }
        dispatch({ type: "setReady", ready: true });
    }, []);
    (0, react_1.useEffect)(() => {
        if (state.ready) {
            if (timer.current) {
                clearTimeout(timer.current);
            }
            timer.current = setTimeout(() => {
                window.localStorage.setItem('context-data', JSON.stringify(state));
            }, 500);
        }
    }, [state]);
    return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "app", id: "app" }, { children: (0, jsx_runtime_1.jsx)(ctx_1.Ctx.Provider, Object.assign({ value: { state, dispatch } }, { children: (0, jsx_runtime_1.jsx)(ErrorHandler_1.default, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.HashRouter, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Switch, { children: routerList.map((routerConfig) => (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { exact: true, path: routerConfig.routerPath, component: LazyLoadComponent(routerConfig.Component, routerConfig.name) }, routerConfig.path)) }, void 0) }, void 0) }, void 0) }), void 0) }), void 0));
};
