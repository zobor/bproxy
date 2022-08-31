"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDataSet = void 0;
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("../logger"));
const dataset = {
    platform: 'bash',
    prevConfigPath: '',
    currentConfigPath: '',
};
const getDefaultRulesList = (port) => [
    {
        regx: "https://bproxy.dev/socket.io.min.js",
        file: `${path_1.default.resolve(__dirname, "../../web/libs/socket.io.min.js")}`,
    },
    {
        regx: "https://bproxy.dev/inspect.js",
        file: `${path_1.default.resolve(__dirname, "../../web/libs/inspect.umd.js")}`,
    },
    {
        regx: /https?:\/\/bproxy\.io/,
        redirect: `https://localhost:${port || 8888}`,
        responseHeaders: {
            "access-control-allow-origin": "*",
            "access-control-allow-credentials": "true",
            "access-control-allow-headers": "*",
        },
    },
];
const updateDataSet = (key, value) => {
    var _a;
    logger_1.default.info(`{updateDataSet}{${key}}:`, value);
    dataset[key] = value;
    if (key === 'config') {
        const config = dataset.config;
        if (Array.isArray((_a = dataset === null || dataset === void 0 ? void 0 : dataset.config) === null || _a === void 0 ? void 0 : _a.https)) {
            config.https = dataset.config.https.concat([
                'bproxy.dev:443',
                'bproxy.io:443',
            ]);
        }
        config.rules = [
            ...getDefaultRulesList(config.port),
            ...config.rules
        ];
        dataset.config = config;
    }
};
exports.updateDataSet = updateDataSet;
exports.default = dataset;
