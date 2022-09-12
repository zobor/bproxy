"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "staticServer", {
    enumerable: true,
    get: ()=>staticServer
});
const _fs = /*#__PURE__*/ _interopRequireWildcard(require("fs"));
const _path = /*#__PURE__*/ _interopRequireWildcard(require("path"));
const _config = require("../config");
const _webPageHTML = require("./webPageHTML");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const webPublic = 'web-build';
const webBaseUrl = '/web';
function calcCharRepeatCount(str, c) {
    let count = 0;
    str.split('').map((item)=>{
        if (item === c) {
            count += 1;
        }
    });
    return count;
}
const inspectResponse = (req, res)=>{
    const isTemplageRequest = req.url.startsWith(webBaseUrl) && calcCharRepeatCount(req.url, '/') === 2 || req.url === webBaseUrl;
    const filepath = isTemplageRequest ? _path.resolve(__dirname, `${_config.webRelativePath}${webPublic}/index.html`) : _path.resolve(__dirname, req.url.replace(/^\/web\//, `${_config.webRelativePath}${webPublic}/`));
    try {
        if (!_fs.existsSync(filepath)) {
            throw new Error(`file not found: ${filepath}`);
        }
        const readStream = _fs.createReadStream(filepath);
        const headers = {};
        if (filepath.includes('.html')) {
            headers['content-type'] = 'text/html; charset=utf-8';
        } else if (filepath.includes('.js')) {
            headers['content-type'] = 'text/javascript; charset=utf-8';
        } else if (filepath.includes('.css')) {
            headers['content-type'] = 'text/css; charset=utf-8';
        } else if (filepath.includes('.svg')) {
            headers['content-type'] = 'image/svg+xml';
        }
        res.writeHead(200, headers);
        readStream.pipe(res);
    } catch (err) {
        res.writeHead(404, {});
        res.end(`404\n${filepath}`);
    }
};
const responseChromeDev = (req, res)=>{
    const headers = {};
    let { url  } = req;
    url = url.replace(/\?\S+/, '');
    let chromeRoot = _path.resolve(__dirname, '../../../chrome-dev-tools/');
    if (!_fs.existsSync(chromeRoot)) {
        chromeRoot = _path.resolve(__dirname, '../../../../chrome-dev-tools/');
        if (!_fs.existsSync(chromeRoot)) {
            process.exit(0);
        }
    }
    if (url === '/chrome-dev-tools/') {
        const file = _fs.createReadStream(_path.resolve(chromeRoot, 'devtools_app.html'));
        file.pipe(res);
        headers['content-type'] = 'text/html; charset=utf-8';
        res.writeHead(200, headers);
        return;
    }
    const filename = url.replace('/chrome-dev-tools/', '');
    if (filename.includes('.js')) {
        headers['content-type'] = 'text/javascript; charset=utf-8';
    } else if (filename.includes('.css')) {
        headers['content-type'] = 'text/css; charset=utf-8';
    } else if (filename.includes('.svg')) {
        headers['content-type'] = 'image/svg+xml';
    }
    const file1 = _fs.createReadStream(_path.resolve(chromeRoot, filename));
    file1.pipe(res);
    res.writeHead(200, headers);
};
const staticServer = (req, res, certConfig)=>{
    if (req.url.startsWith('/chrome-dev-tools')) {
        return responseChromeDev(req, res);
    }
    switch(req.url){
        case '/':
            res.end(_webPageHTML.webPageHTML);
            break;
        case '/install':
            try {
                const readStream = _fs.createReadStream(certConfig.certPath);
                res.writeHead(200, {
                    'content-type': 'application/x-x509-ca-cert; charset=utf-8',
                    'Content-Disposition': 'attachment;filename=bproxy.ca.cer'
                });
                readStream.pipe(res);
            } catch (err) {
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
