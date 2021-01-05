var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};

// src/i18n.ts
__export(exports, {
  default: () => i18n_default
});

// src/dataset.ts
var dataset = {
  debug: true,
  logLevel: "error",
  language: "zh-cn"
};

// src/i18n.ts
var {language} = dataset;
var lang = {
  CERT_EXIST: {
    en: "",
    "zh-cn": "\u8BC1\u4E66\u5DF2\u5B58\u5728\uFF0C\u4E0D\u9700\u8981\u518D\u521B\u5EFA\u4E86!"
  },
  CREATE_CERTING: {
    en: "",
    "zh-cn": "\u672C\u5730\u4EE3\u7406\u670D\u52A1https\u8BC1\u4E66\u521B\u5EFA\u4E2D\uFF0C\u8BF7\u7A0D\u540E"
  },
  CREATE_CERT_SUC: {
    en: "",
    "zh-cn": "\u8BC1\u4E66\u521B\u5EFA\u6210\u529F"
  },
  CREATE_CERT_FAIL: {
    en: "",
    "zh-cn": "\u8BC1\u4E66\u521B\u5EFA\u5931\u8D25\uFF5E"
  },
  TRUST_CERT_PWD: {
    en: "",
    "zh-cn": "\u4FE1\u4EFB\u8BC1\u4E66\uFF0C\u4F60\u9700\u8981\u53EF\u80FD\u9700\u8981\u8F93\u5165\u8BA1\u7B97\u673A\u5BC6\u7801\u6388\u6743"
  },
  CERT_INSTALL_SUC: {
    en: "",
    "zh-cn": "\u8BC1\u4E66\u5B89\u88C5\u6210\u529F"
  },
  CERT_INSTALL_FAIL: {
    en: "",
    "zh-cn": "\u8BC1\u4E66\u5B89\u88C5\u5931\u8D25"
  },
  INSTALL_TIPS: {
    en: "auto instal certificate only support macOS\ndouble click bproxy.ca.crt to install",
    "zh-cn": "\u81EA\u52A8\u5B89\u88C5\u8BC1\u4E66\u76EE\u524D\u53EA\u652F\u6301MacOS\u7CFB\u7EDF\uFF0C\u5176\u4ED6\u7CFB\u7EDF\u8BF7\u53CC\u51FB\u8BC1\u4E66\u5B89\u88C5\uFF01"
  },
  START_LOCAL_SVR_SUC: {
    en: "",
    "zh-cn": "\u672C\u5730\u4EE3\u7406\u670D\u52A1\u5668\u542F\u52A8\u6210\u529F"
  },
  ERROR_CONFIG_PATH: {
    en: "",
    "zh-cn": "\u914D\u7F6E\u6587\u4EF6\u8DEF\u5F84\u4E0D\u80FD\u4E3A\u7A7A\uFF0C\u4F60\u53EF\u4EE5\u4F7F\u7528 . \u6765\u4EE3\u8868\u5F53\u524D\u76EE\u5F55"
  },
  CONFIG_FILE_UPDATE: {
    en: "",
    "zh-cn": "\u914D\u7F6E\u6587\u4EF6\u5DF2\u66F4\u65B0"
  }
};
var langLocal = {};
Object.keys(lang).forEach((key) => {
  langLocal[key] = lang[key][language];
});
var i18n_default = langLocal;
