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
const lodash_1 = require("lodash");
class LocalServer {
    static start(port, configPath) {
        const { config = {}, configPath: confPath = '' } = this.loadUserConfig(configPath, settings_1.default);
        if (lodash_1.isEmpty(config) || lodash_1.isEmpty(confPath)) {
            return;
        }
        let appConfig = config;
        fs.watchFile(confPath, { interval: 1000 }, (e) => {
            common_1.cm.info(`${i18n_1.default.CONFIG_FILE_UPDATE}: ${confPath}`);
            try {
                delete require.cache[require.resolve(confPath)];
                appConfig = require(confPath);
            }
            catch (err) { }
        });
        const server = new http.Server();
        httpsMiddleware_1.default.beforeStart();
        server.listen(appConfig.port, () => {
            server.on('request', (req, res) => {
                httpMiddleware_1.httpMiddleware.proxy(req, res, appConfig);
            });
            server.on('connect', (req, socket, head) => {
                httpsMiddleware_1.default.proxy(req, socket, head, appConfig);
            });
        });
        common_1.cm.info(`${i18n_1.default.START_LOCAL_SVR_SUC}: http://127.0.0.1:${appConfig.port}`);
    }
    static loadUserConfig(configPath, defaultSettings) {
        let mixConfig, userConfigPath;
        const res = {};
        if (_.isBoolean(configPath) || _.isUndefined(configPath)) {
            userConfigPath = '.';
        }
        if (userConfigPath || _.isString(configPath)) {
            const confPath = path.resolve(userConfigPath || configPath, 'bproxy.conf.js');
            if (!fs.existsSync(confPath)) {
                console.log('当前目录下没有找到bproxy.conf.js, 是否立即自动创建？');
                return res;
            }
            else {
                try {
                    const userConfig = require(confPath);
                    mixConfig = Object.assign(Object.assign({}, settings_1.default), userConfig);
                    res.configPath = confPath;
                    res.config = mixConfig;
                }
                catch (err) { }
            }
        }
        return res;
    }
}
exports.default = LocalServer;
