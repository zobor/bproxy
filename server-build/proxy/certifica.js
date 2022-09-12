"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>_default
});
const _net = /*#__PURE__*/ _interopRequireWildcard(require("net"));
const _nodeForge = /*#__PURE__*/ _interopRequireWildcard(require("node-forge"));
const _fs = /*#__PURE__*/ _interopRequireWildcard(require("fs"));
const _path = /*#__PURE__*/ _interopRequireWildcard(require("path"));
const _mkdirp = /*#__PURE__*/ _interopRequireWildcard(require("mkdirp"));
const _crypto = /*#__PURE__*/ _interopRequireWildcard(require("crypto"));
const _config = require("./config");
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
const { pki  } = _nodeForge;
const ONE_DAY = 1000 * 60 * 60 * 24;
const MIN_DATE = ONE_DAY * 20;
const RANDOM_SERIAL = '.' + Date.now() + '.' + Math.floor(Math.random() * 10000);
let ROOT_KEY;
let ROOT_CRT;
let keys;
var curIndex = 0;
function getIndex() {
    ++curIndex;
    if (curIndex < 10) {
        return '0' + curIndex;
    }
    if (curIndex > 99) {
        curIndex = 0;
        return '00';
    }
    return curIndex;
}
function getSN(hostname) {
    const serialNumber = _crypto.createHash('sha1').update(hostname + RANDOM_SERIAL, 'binary').digest('hex') + getIndex();
    return serialNumber;
}
class Certificate {
    // 创建安装使用的本地证书
    createCAForInstall(commonName) {
        const cert = this.createCert(keys.publicKey);
        const attrs = [
            {
                name: 'commonName',
                value: commonName
            },
            {
                name: 'countryName',
                value: _config.certificate.countryName
            },
            {
                shortName: 'ST',
                value: _config.certificate.provinceName
            },
            {
                name: 'localityName',
                value: _config.certificate.localityName
            },
            {
                name: 'organizationName',
                value: _config.certificate.organizationName
            },
            {
                shortName: 'OU',
                value: _config.certificate.OU
            }, 
        ];
        cert.setSubject(attrs);
        cert.setIssuer(attrs);
        cert.setExtensions([
            {
                name: 'basicConstraints',
                cA: true
            },
            {
                name: 'keyUsage',
                keyCertSign: true,
                digitalSignature: true,
                nonRepudiation: true,
                keyEncipherment: true,
                dataEncipherment: true
            },
            {
                name: 'extKeyUsage',
                serverAuth: true,
                clientAuth: true,
                codeSigning: true,
                emailProtection: true,
                timeStamping: true
            },
            {
                name: 'nsCertType',
                client: true,
                server: true,
                email: true,
                objsign: true,
                sslCA: true,
                emailCA: true,
                objCA: true
            }, 
        ]);
        cert.sign(keys.privateKey, _nodeForge.md.sha256.create());
        return {
            key: keys.privateKey,
            cert
        };
    }
    // 写入证书
    create(caPath) {
        this.init();
        const basePath = caPath || _config.certificate.getDefaultCABasePath();
        const caCertPath = _path.resolve(basePath, _config.certificate.filename);
        const caKeyPath = _path.resolve(basePath, _config.certificate.keyFileName);
        try {
            _fs.accessSync(caCertPath, _fs.constants.R_OK);
            _fs.accessSync(caKeyPath, _fs.constants.R_OK);
            // has exist
            return {
                caCertPath,
                caKeyPath,
                create: true
            };
        } catch (e) {
            const caObj = this.createCAForInstall(_config.certificate.filename);
            const caCert = caObj.cert;
            const cakey = caObj.key;
            const certPem = pki.certificateToPem(caCert);
            const keyPem = pki.privateKeyToPem(cakey);
            _mkdirp.sync(_path.dirname(caCertPath));
            _fs.writeFileSync(caCertPath, certPem);
            _fs.writeFileSync(caKeyPath, keyPem);
        }
        return {
            caCertPath,
            caKeyPath,
            create: false
        };
    }
    // 启动bproxy，初始化证书
    init() {
        if (_fs.existsSync(_config.certificate.getDefaultCACertPath())) {
            // 不影响启动速度，延迟创建keys
            setTimeout(()=>{
                keys = pki.rsa.generateKeyPair(_config.certificate.keySize);
            }, 1000);
        } else {
            keys = pki.rsa.generateKeyPair(_config.certificate.keySize);
        }
        const basePath = _config.certificate.getDefaultCABasePath();
        const caCertPath = _path.resolve(basePath, _config.certificate.filename);
        const caKeyPath = _path.resolve(basePath, _config.certificate.keyFileName);
        const res = {
            caCertPath,
            caKeyPath,
            create: true
        };
        // 证书创建一次即可
        if (_fs.existsSync(caCertPath) && _fs.existsSync(caKeyPath)) {
            ROOT_CRT = _fs.readFileSync(caCertPath);
            ROOT_KEY = _fs.readFileSync(caKeyPath);
            ROOT_CRT = pki.certificateFromPem(ROOT_CRT);
            ROOT_KEY = pki.privateKeyFromPem(ROOT_KEY);
            return res;
        }
        try {
            _fs.accessSync(caCertPath, _fs.constants.R_OK);
            _fs.accessSync(caKeyPath, _fs.constants.R_OK);
            return {
                caCertPath,
                caKeyPath,
                create: false
            };
        } catch (e) {
            const caObj = this.createCAForInstall(_config.certificate.name);
            const certPem = pki.certificateToPem(caObj.cert);
            const keyPem = pki.privateKeyToPem(caObj.key);
            _mkdirp.sync(_path.dirname(caCertPath));
            _fs.writeFileSync(caCertPath, certPem);
            _fs.writeFileSync(caKeyPath, keyPem);
            ROOT_CRT = caObj.cert;
            ROOT_KEY = caObj.key;
        }
        return res;
    }
    createCert(publicKey, serialNumber, isShortPeriod) {
        const cert = pki.createCertificate();
        cert.publicKey = publicKey;
        cert.serialNumber = serialNumber || '01';
        const curDate = new Date();
        const curYear = curDate.getFullYear();
        if (isShortPeriod) {
            cert.validity.notBefore = new Date(curDate.getTime() - MIN_DATE);
        } else {
            cert.validity.notBefore = new Date();
            cert.validity.notBefore.setFullYear(curYear - 1);
        }
        cert.validity.notAfter = new Date();
        cert.validity.notAfter.setFullYear(curYear + (isShortPeriod ? 1 : 10));
        return cert;
    }
    // 创建https虚拟证书
    createFakeCertificateByDomain(domain) {
        if (this.fakeCertifaceCache[domain]) {
            return this.fakeCertifaceCache[domain];
        }
        const cert = this.createCert(pki.setRsaPublicKey(ROOT_KEY.n, ROOT_KEY.e), getSN(domain), true);
        cert.setSubject([
            {
                name: 'commonName',
                value: domain
            }
        ]);
        cert.setIssuer(ROOT_CRT.subject.attributes);
        cert.setExtensions([
            {
                name: 'subjectAltName',
                altNames: [
                    _net.isIP(domain) ? {
                        type: 7,
                        ip: domain
                    } : {
                        type: 2,
                        value: domain
                    }
                ]
            }
        ]);
        cert.sign(ROOT_KEY, _nodeForge.md.sha256.create());
        this.fakeCertifaceCache[domain] = {
            keyPem: pki.privateKeyToPem(ROOT_KEY),
            certPem: pki.certificateToPem(cert)
        };
        return this.fakeCertifaceCache[domain];
    }
    constructor(){
        // 临时证书缓存
        this.fakeCertifaceCache = {};
    }
}
const _default = Certificate;
