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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseByRedirect = void 0;
const url = __importStar(require("url"));
const config_1 = require("../config");
const utils_1 = require("../utils/utils");
const request_1 = require("./request");
function responseByRedirect(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { req, res, postBodyData, delayTime, matcherResult, responseHeaders, config } = params;
        req.requestOriginUrl = req.url;
        req.url = matcherResult.rule.redirectTarget || matcherResult.rule.redirect;
        const httpsURL = req.httpsURL || req.requestOriginUrl;
        const redirectUrlParam = url.parse(req.url);
        if (redirectUrlParam.host && req.headers) {
            req.headers.host = redirectUrlParam.host;
        }
        const requestOption = {
            headers: matcherResult.rule.requestHeaders || {},
        };
        responseHeaders[`${config_1.bproxyPrefixHeader}-redirect`] = req.url;
        responseHeaders[`${config_1.bproxyPrefixHeader}-redirect-origin-url`] = httpsURL || '';
        if (delayTime) {
            yield (0, utils_1.delay)(delayTime);
        }
        return (0, request_1.responseByRequest)(req, res, requestOption, responseHeaders, matcherResult, config, postBodyData);
    });
}
exports.responseByRedirect = responseByRedirect;
