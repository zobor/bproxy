"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.requestJac = exports.isLocal = void 0;
const fs = __importStar(require("fs"));
const isLocal = (url) => {
    return !(url.startsWith('http') || url.startsWith('https')) && !url.includes('/socket.io/');
};
exports.isLocal = isLocal;
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bproxy</title>
</head>
<body>
<style>
.btn {display: inline-flex;align-items: center;padding: 5px 10px; background: blue; color: #fff; justify-content: center; font-size: 16px; text-decoration: none; border-radius: 5px; margin: 0 10px;}
</style>
<a class="btn" href="/install">安装证书</a>
<a class="btn" href="/inspect">日志</a>
</body>
</html>
`;
const inspectResponse = (req, res) => {
    const urlMap = {
        '/inspect': './dist/index.html',
    };
    const filepath = (urlMap[req.url] || req.url).replace(/^\//, './');
    try {
        if (!fs.existsSync(filepath)) {
            throw 404;
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
        res.end('404');
    }
};
const requestJac = (req, res, certConfig) => {
    switch (req.url) {
        case '/':
            res.end(html);
            break;
        case '/install':
            try {
                const readStream = fs.createReadStream(certConfig.certPath);
                res.writeHead(200, {
                    'content-type': 'application/x-x509-ca-cert; charset=utf-8',
                });
                readStream.pipe(res);
            }
            catch (err) {
                res.writeHead(404, {});
                res.end('404');
            }
            break;
        default:
            if (req.url.startsWith('/dist') || req.url.startsWith('/inspect')) {
                inspectResponse(req, res);
                return;
            }
            res.end('404');
            break;
    }
};
exports.requestJac = requestJac;
