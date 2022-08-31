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
exports.responseLocalPath = exports.responseLocalFile = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const socket_1 = require("../socket/socket");
const file_1 = require("../utils/file");
const utils_1 = require("../utils/utils");
const config_1 = require("./../config");
const text_1 = require("./text");
function responseByLocalFile(filepath, res, responseHeaders = {}, req) {
    try {
        fs.accessSync(filepath, fs.constants.R_OK);
        const readStream = fs.createReadStream(filepath);
        const suffix = (0, file_1.getFileTypeFromSuffix)(filepath);
        const fileContentType = (0, file_1.getResponseContentType)(suffix);
        if (fileContentType && !responseHeaders['content-type']) {
            responseHeaders['content-type'] = fileContentType;
        }
        res.writeHead(200, responseHeaders);
        let responseBody = '不支持预览';
        if (['json', 'js', 'css', 'html', 'svg'].includes(suffix)) {
            responseBody = fs.readFileSync(filepath, 'utf-8');
        }
        (0, socket_1.ioRequest)({
            method: req.method,
            requestId: req.$requestId,
            responseHeaders: Object.assign(Object.assign({}, responseHeaders), { [`${config_1.bproxyPrefixHeader}-file`]: filepath }),
            statusCode: 200,
            responseBody,
            url: req.httpsURL || req.requestOriginUrl || req.url,
        });
        readStream.pipe(res);
    }
    catch (err) {
        console.log(err);
        res.writeHead(404, {
            'content-type': 'text/html; charset=utf-8;'
        });
        (0, text_1.responseText)(`<div style="color:red;">404: Not Found or Not Access:
      (${filepath}).
      <br>Error: ${JSON.stringify(err)}
    </div>`, res);
        (0, socket_1.ioRequest)({
            method: req.method,
            requestId: req.$requestId,
            responseHeaders,
            statusCode: 404,
            url: req.httpsURL || req.requestOriginUrl || req.url,
        });
    }
}
function responseLocalFile(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { req, res, postBodyData, delayTime, matcherResult, responseHeaders, requestHeaders } = params;
        (0, socket_1.ioRequest)({
            matched: true,
            requestId: req.$requestId,
            url: req.httpsURL || req.requestOriginUrl || req.url,
            method: req.method,
            requestHeaders: requestHeaders,
            requestBody: postBodyData === null || postBodyData === void 0 ? void 0 : postBodyData.toString(),
        });
        if (delayTime) {
            yield (0, utils_1.delay)(delayTime);
        }
        const filepath = path.resolve(matcherResult.rule.file);
        responseByLocalFile((0, utils_1.safeDecodeUrl)(filepath), res, responseHeaders, req);
    });
}
exports.responseLocalFile = responseLocalFile;
function responseLocalPath(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { req, res, postBodyData, delayTime, matcherResult, responseHeaders, requestHeaders } = params;
        (0, socket_1.ioRequest)({
            matched: true,
            requestId: req.$requestId,
            url: req.httpsURL || req.requestOriginUrl || req.url,
            method: req.method,
            statusCode: matcherResult.rule.statusCode,
            requestHeaders: requestHeaders,
            requestBody: postBodyData === null || postBodyData === void 0 ? void 0 : postBodyData.toString(),
        });
        if (delayTime) {
            yield (0, utils_1.delay)(delayTime);
        }
        const filepath = path.resolve(matcherResult.rule.path, matcherResult.rule.filepath || '');
        responseByLocalFile((0, utils_1.safeDecodeUrl)(filepath), res, responseHeaders, req);
    });
}
exports.responseLocalPath = responseLocalPath;
