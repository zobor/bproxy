"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducer = exports.defaultState = exports.Ctx = void 0;
const react_1 = require("react");
exports.Ctx = (0, react_1.createContext)({});
exports.defaultState = {
    showDetail: false,
    detailActiveTab: 'custom',
    requestId: '',
    proxySwitch: true,
    filterType: 'url',
    filterString: '',
    ready: false,
    disableCache: false,
    clean: () => { },
};
const reducer = (state = exports.defaultState, action) => {
    const actionMap = {};
    Object.keys(state).forEach((key) => {
        let fn = key.slice(0, 1).toUpperCase() + key.slice(1);
        fn = `set${fn}`;
        if (!actionMap[fn]) {
            actionMap[fn] = () => (Object.assign(Object.assign({}, state), { [key]: action[key] }));
        }
    });
    return actionMap[action.type] ? actionMap[action.type]() : state;
};
exports.reducer = reducer;
