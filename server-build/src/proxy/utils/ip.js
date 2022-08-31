"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalIpAddress = void 0;
const os = __importStar(require("os"));
let ip = null;
const getLocalIpAddress = () => {
    if (ip) {
        return [ip];
    }
    const ifaces = os.networkInterfaces();
    const Ips = [];
    for (const dev in ifaces) {
        (ifaces[dev] || []).forEach((details) => {
            if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
                Ips.push(details.address);
            }
        });
    }
    if (Ips.length) {
        ip = Ips[0];
    }
    return Ips;
};
exports.getLocalIpAddress = getLocalIpAddress;
