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
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = exports.cm = void 0;
const chalk_1 = require("chalk");
const { log } = console;
function logLevel(level) {
    return (target, key, descriptor) => {
        descriptor.value = function (message) {
            target.printf(message, level);
        };
    };
}
class Common {
    printf(message, level) {
        const info = level === 'info' ? chalk_1.default.green('[INFO]') :
            (level === 'error' ? chalk_1.default.redBright('[ERROR]') :
                (level === 'debug' ? chalk_1.default.gray('[DEBUG]') :
                    (level === 'warn' ? chalk_1.default.yellowBright('[WARN]') : '')));
        const msg = typeof message === 'object' ?
            JSON.stringify(message) : message;
        log(`${info} ${chalk_1.default.hex('#ccc')(msg)}`);
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
], Common.prototype, "info", null);
__decorate([
    logLevel('error'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Common.prototype, "error", null);
__decorate([
    logLevel('debug'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Common.prototype, "debug", null);
__decorate([
    logLevel('warn'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Common.prototype, "warn", null);
;
const cm = new Common();
exports.cm = cm;
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
