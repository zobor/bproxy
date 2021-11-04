"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHttpsHostRegMatch = exports.url2regx = exports.createHttpHeader = exports.utils = exports.log = void 0;
const chalk_1 = __importDefault(require("chalk"));
const { log: terminalLog } = console;
function logLevel(level) {
    return (target, key, descriptor) => {
        descriptor.value = function (message) {
            target.printf(message, level);
        };
    };
}
class Logger {
    printf(message, level) {
        const info = level === 'info' ? chalk_1.default.green('[INFO]') :
            (level === 'error' ? chalk_1.default.redBright('[ERROR]') :
                (level === 'debug' ? chalk_1.default.gray('[DEBUG]') :
                    (level === 'warn' ? chalk_1.default.yellowBright('[WARN]') : '')));
        const msg = typeof message === 'object' ?
            JSON.stringify(message) : message;
        terminalLog(`${info} ${chalk_1.default.hex('#ccc')(msg)}`);
    }
    info(msg) { }
    error(msg) { }
    debug(msg) { }
    warn(msg) { }
}
__decorate([
    logLevel('info'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Logger.prototype, "info", null);
__decorate([
    logLevel('error'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Logger.prototype, "error", null);
__decorate([
    logLevel('debug'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Logger.prototype, "debug", null);
__decorate([
    logLevel('warn'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Logger.prototype, "warn", null);
;
exports.log = new Logger();
exports.utils = {
    guid: (len = 36) => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.slice(0, len).replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    uuid: (len = 12) => {
        return Buffer.from(exports.utils.guid())
            .toString('base64')
            .replace(/[/=+]/g, '').slice(0, len);
    },
};
const createHttpHeader = (line, headers) => {
    return (Object.keys(headers)
        .reduce(function (head, key) {
        const value = headers[key];
        if (!Array.isArray(value)) {
            head.push(key + ": " + value);
            return head;
        }
        for (let i = 0; i < value.length; i++) {
            head.push(key + ": " + value[i]);
        }
        return head;
    }, [line])
        .join("\r\n") + "\r\n\r\n");
};
exports.createHttpHeader = createHttpHeader;
const url2regx = (url) => {
    const newUrl = url
        .replace(/\./g, '\.')
        .replace(/\//g, '\/')
        .replace(/\*{2,}/g, '(\\S+)')
        .replace(/\*/g, '([^\\/]+)');
    return new RegExp(newUrl);
};
exports.url2regx = url2regx;
const isHttpsHostRegMatch = (httpsList, hostname) => {
    let rs;
    for (let i = 0, len = httpsList.length; i < len; i++) {
        if (rs) {
            break;
        }
        const httpsItem = httpsList[i];
        if (typeof httpsItem === 'string') {
            rs = httpsItem === hostname;
        }
        else {
            rs = httpsItem.test(hostname.replace(':443'));
        }
    }
    return rs;
};
exports.isHttpsHostRegMatch = isHttpsHostRegMatch;
