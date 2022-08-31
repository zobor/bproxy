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
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseByHost = void 0;
const config_1 = require("./../config");
const utils_1 = require("../utils/utils");
const request_1 = require("./request");
function responseByHost(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { req, res, postBodyData, delayTime, matcherResult, responseHeaders, config, } = params;
        if (delayTime) {
            yield (0, utils_1.delay)(delayTime);
        }
        const requestOptions = {
            hostname: matcherResult.rule.host,
        };
        responseHeaders[`${config_1.bproxyPrefixHeader}-host`] = matcherResult.rule.host;
        return (0, request_1.responseByRequest)(req, res, requestOptions, responseHeaders, matcherResult, config, postBodyData);
    });
}
exports.responseByHost = responseByHost;
