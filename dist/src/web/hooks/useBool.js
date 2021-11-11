"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
exports.default = (defaultState) => {
    const [state, setState] = (0, react_1.useState)(defaultState || false);
    const toggle = () => {
        setState(pre => !pre);
    };
    const ok = () => {
        setState(true);
    };
    const no = () => {
        setState(false);
    };
    return { toggle, state, ok, no };
};
