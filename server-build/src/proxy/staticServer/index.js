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
exports.staticServer = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const webPageHTML_1 = require("./webPageHTML");
const webPublic = 'web-build';
const webBaseUrl = '/web';
function calcCharRepeatCount(str, c) {
    let count = 0;
    str.split('').map(item => {
        if (item === c) {
            count += 1;
        }
    });
    return count;
}
const inspectResponse = (req, res) => {
    const isTemplageRequest = (req.url.startsWith(webBaseUrl) && calcCharRepeatCount(req.url, '/') === 2) ||
        req.url === webBaseUrl;
    const filepath = isTemplageRequest
        ? path.resolve(__dirname, `../../../../${webPublic}/index.html`)
        : path.resolve(__dirname, req.url.replace(/^\/web\//, `../../../../${webPublic}/`));
    try {
        if (!fs.existsSync(filepath)) {
            throw new Error(`file not found: ${filepath}`);
        }
        const readStream = fs.createReadStream(filepath);
        const headers = {};
        if (filepath.includes('.html')) {
            headers['content-type'] = 'text/html; charset=utf-8';
        }
        else if (filepath.includes('.js')) {
            headers['content-type'] = 'text/javascript; charset=utf-8';
        }
        else if (filepath.includes('.css')) {
            headers['content-type'] = 'text/css; charset=utf-8';
        }
        else if (filepath.includes('.svg')) {
            headers['content-type'] = 'image/svg+xml';
        }
        res.writeHead(200, headers);
        readStream.pipe(res);
    }
    catch (err) {
        res.writeHead(404, {});
        res.end(`404\n${filepath}`);
    }
};
const responseChromeDev = (req, res) => {
    const headers = {};
    let { url } = req;
    url = url.replace(/\?\S+/, '');
    let chromeRoot = path.resolve(__dirname, '../../../chrome-dev-tools/');
    if (!fs.existsSync(chromeRoot)) {
        chromeRoot = path.resolve(__dirname, '../../../../chrome-dev-tools/');
        if (!fs.existsSync(chromeRoot)) {
            process.exit(0);
        }
    }
    if (url === '/chrome-dev-tools/') {
        const file = fs.createReadStream(path.resolve(chromeRoot, 'devtools_app.html'));
        file.pipe(res);
        headers['content-type'] = 'text/html; charset=utf-8';
        res.writeHead(200, headers);
        return;
    }
    const filename = url.replace('/chrome-dev-tools/', '');
    if (filename.includes('.js')) {
        headers['content-type'] = 'text/javascript; charset=utf-8';
    }
    else if (filename.includes('.css')) {
        headers['content-type'] = 'text/css; charset=utf-8';
    }
    else if (filename.includes('.svg')) {
        headers['content-type'] = 'image/svg+xml';
    }
    const file = fs.createReadStream(path.resolve(chromeRoot, filename));
    file.pipe(res);
    res.writeHead(200, headers);
};
const staticServer = (req, res, certConfig) => {
    if (req.url.startsWith('/chrome-dev-tools')) {
        return responseChromeDev(req, res);
    }
    switch (req.url) {
        case '/':
            res.end(webPageHTML_1.webPageHTML);
            break;
        case '/install':
            try {
                const readStream = fs.createReadStream(certConfig.certPath);
                res.writeHead(200, {
                    'content-type': 'application/x-x509-ca-cert; charset=utf-8',
                    'Content-Disposition': 'attachment;filename=bproxy.ca.cer',
                });
                readStream.pipe(res);
            }
            catch (err) {
                res.writeHead(404, {});
                res.end('404');
            }
            break;
        default:
            if (req.url.startsWith('/web') || req.url.startsWith(webBaseUrl)) {
                inspectResponse(req, res);
                return;
            }
            res.end('404');
            break;
    }
};
exports.staticServer = staticServer;
