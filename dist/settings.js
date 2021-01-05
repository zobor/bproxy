var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __exportStar = (target, module2, desc) => {
  __markAsModule(target);
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  if (module2 && module2.__esModule)
    return module2;
  return __exportStar(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", {value: module2, enumerable: true}), module2);
};

// src/settings.ts
__export(exports, {
  default: () => settings_default
});
var path = __toModule(require("path"));
var settings_default = {
  port: 8888,
  configFile: path.resolve(process.cwd(), "bproxy.conf.js"),
  downloadPath: "",
  https: [],
  sslAll: false,
  host: [],
  rules: [],
  certificate: {
    filename: "bproxy.ca.crt",
    keyFileName: "bproxy.ca.key.pem",
    name: "bproxy-cert",
    organizationName: "zoborzhang",
    OU: "https://github.com/zobor/bproxy",
    countryName: "CN",
    provinceName: "HuBei",
    localityName: "WuHan",
    keySize: 2048,
    getDefaultCABasePath() {
      const userHome = process.env.HOME || process.env.USERPROFILE || process.cwd();
      return path.resolve(userHome, "./.AppData/bproxy");
    },
    getDefaultCACertPath() {
      return path.resolve(this.getDefaultCABasePath(), this.filename);
    },
    getDefaultCAKeyPath() {
      return path.resolve(this.getDefaultCABasePath(), this.keyFileName);
    }
  }
};
