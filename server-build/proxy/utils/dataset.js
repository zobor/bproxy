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
    updateDataSet: ()=>updateDataSet,
    default: ()=>_default
});
const _path = /*#__PURE__*/ _interopRequireDefault(require("path"));
const _logger = /*#__PURE__*/ _interopRequireDefault(require("../logger"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// 临时数据结构
const dataset = {
    platform: 'bash',
    prevConfigPath: '',
    currentConfigPath: '',
    ready: false
};
const getDefaultRulesList = (port)=>[
        // {
        //   regx: 'https://bproxy.dev/socket.io.min.js',
        //   file: `${path.resolve(__dirname, '../../web/libs/socket.io.min.js')}`,
        // },
        {
            regx: 'https://bproxy.dev/inspect.js',
            file: `${_path.default.resolve(__dirname, '../../utils/inspect.umd.js')}`
        },
        {
            regx: /https?:\/\/bproxy\.io/,
            redirect: `https://localhost:${port || 8888}`,
            responseHeaders: {
                'access-control-allow-origin': '*',
                'access-control-allow-credentials': 'true',
                'access-control-allow-headers': '*'
            }
        }, 
    ];
const updateDataSet = (key, value)=>{
    if (dataset.ready) {
        _logger.default.info(`{updateDataSet}{${key}}:`, value);
    }
    dataset[key] = value;
    if (key === 'config') {
        var ref;
        const config = dataset.config;
        // 内置的 https cdn
        if (Array.isArray(dataset === null || dataset === void 0 ? void 0 : (ref = dataset.config) === null || ref === void 0 ? void 0 : ref.https)) {
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
const _default = dataset;
