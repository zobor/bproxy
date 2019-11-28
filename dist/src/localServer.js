"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const _ = require("lodash");
const path = require("path");
const fs = require("fs");
const settings_1 = require("./settings");
const httpMiddleware_1 = require("./httpMiddleware");
const httpsMiddleware_1 = require("./httpsMiddleware");
const common_1 = require("./common");
const i18n_1 = require("./i18n");
class LocalServer {
    static start(port, configPath) {
        const mixConfig = this.loadUserConfig(configPath, settings_1.default);
        if (typeof mixConfig === 'boolean') {
            return;
        }
        const server = new http.Server();
        server.listen(mixConfig.port, () => {
            server.on('request', (req, res) => {
                httpMiddleware_1.httpMiddleware.proxy(req, res, mixConfig);
            });
            server.on('connect', (req, socket, head) => {
                httpsMiddleware_1.default.proxy(req, socket, head, mixConfig);
            });
        });
        common_1.cm.info(`${i18n_1.default.START_LOCAL_SVR_SUC}: http://127.0.0.1:${mixConfig.port}`);
    }
    static loadUserConfig(configPath, defaultSettings) {
        let mixConfig, userConfigPath;
        if (_.isBoolean(configPath) || _.isUndefined(configPath)) {
            userConfigPath = '.';
        }
        if (userConfigPath || _.isString(configPath)) {
            const confPath = path.resolve(userConfigPath || configPath, 'bproxy.conf.js');
            if (!fs.existsSync(confPath)) {
                console.log('当前目录下没有找到bproxy.conf.js, 是否立即自动创建？');
                return false;
            }
            else {
                const userConfig = require(confPath);
                mixConfig = Object.assign(Object.assign({}, settings_1.default), userConfig);
            }
        }
        return mixConfig;
    }
}
exports.default = LocalServer;
