"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installMacCertificate = exports.getComputerName = exports.getOsName = void 0;
const child_process_1 = require("child_process");
const os_1 = __importDefault(require("os"));
const config_1 = require("../config");
const getOsName = () => {
    return os_1.default.platform();
};
exports.getOsName = getOsName;
const getComputerName = () => {
    return os_1.default.hostname().replace(/\.\w+/g, '');
};
exports.getComputerName = getComputerName;
const installMacCertificate = () => __awaiter(void 0, void 0, void 0, function* () {
    const filepath = config_1.certificate === null || config_1.certificate === void 0 ? void 0 : config_1.certificate.getDefaultCACertPath();
    const bash = `security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ${filepath}`;
    if (config_1.env.bash && 0) {
        const rs = (0, child_process_1.spawnSync)('sudo', bash.split(' ')).stdout.toString();
        return rs;
    }
    else {
        return `sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ${filepath}`;
    }
});
exports.installMacCertificate = installMacCertificate;
