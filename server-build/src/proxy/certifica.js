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
const forge = __importStar(require("node-forge"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const mkdirp = __importStar(require("mkdirp"));
const config_1 = require("./config");
const { pki } = forge;
let keys;
class Certificate {
    constructor() {
        this.fakeCertifaceCache = {};
    }
    createCAForInstall(commonName) {
        const cert = pki.createCertificate();
        cert.publicKey = keys.publicKey;
        cert.serialNumber = `${new Date().getTime()}`;
        cert.validity.notBefore = new Date();
        cert.validity.notBefore.setFullYear(cert.validity.notBefore.getFullYear() - 5);
        cert.validity.notAfter = new Date();
        cert.validity.notAfter.setFullYear(cert.validity.notAfter.getFullYear() + 20);
        const attrs = [{
                name: 'commonName',
                value: commonName,
            }, {
                name: 'countryName',
                value: config_1.certificate.countryName,
            }, {
                shortName: 'ST',
                value: config_1.certificate.provinceName,
            }, {
                name: 'localityName',
                value: config_1.certificate.localityName,
            }, {
                name: 'organizationName',
                value: config_1.certificate.organizationName,
            }, {
                shortName: 'OU',
                value: config_1.certificate.OU,
            }];
        cert.setSubject(attrs);
        cert.setIssuer(attrs);
        cert.setExtensions([{
                name: 'basicConstraints',
                critical: true,
                cA: true,
            }, {
                name: 'keyUsage',
                critical: true,
                keyCertSign: true,
            }, {
                name: 'subjectKeyIdentifier',
            }]);
        cert.sign(keys.privateKey, forge.md.sha256.create());
        return {
            key: keys.privateKey,
            cert,
        };
    }
    create(caPath) {
        this.init();
        const basePath = caPath || config_1.certificate.getDefaultCABasePath();
        const caCertPath = path.resolve(basePath, config_1.certificate.filename);
        const caKeyPath = path.resolve(basePath, config_1.certificate.keyFileName);
        try {
            fs.accessSync(caCertPath, fs.constants.R_OK);
            fs.accessSync(caKeyPath, fs.constants.R_OK);
            return {
                caCertPath,
                caKeyPath,
                create: true,
            };
        }
        catch (e) {
            const caObj = this.createCAForInstall(config_1.certificate.filename);
            const caCert = caObj.cert;
            const cakey = caObj.key;
            const certPem = pki.certificateToPem(caCert);
            const keyPem = pki.privateKeyToPem(cakey);
            mkdirp.sync(path.dirname(caCertPath));
            fs.writeFileSync(caCertPath, certPem);
            fs.writeFileSync(caKeyPath, keyPem);
        }
        return {
            caCertPath,
            caKeyPath,
            create: false,
        };
    }
    init() {
        setTimeout(() => {
            keys = pki.rsa.generateKeyPair(config_1.certificate.keySize);
        }, 1000);
        const basePath = config_1.certificate.getDefaultCABasePath();
        const caCertPath = path.resolve(basePath, config_1.certificate.filename);
        const caKeyPath = path.resolve(basePath, config_1.certificate.keyFileName);
        const res = {
            caCertPath,
            caKeyPath,
            create: true,
        };
        if (fs.existsSync(caCertPath) && fs.existsSync(caKeyPath)) {
            return res;
        }
        try {
            fs.accessSync(caCertPath, fs.constants.R_OK);
            fs.accessSync(caKeyPath, fs.constants.R_OK);
            return {
                caCertPath,
                caKeyPath,
                create: false,
            };
        }
        catch (e) {
            const caObj = this.createCAForInstall(config_1.certificate.name);
            const certPem = pki.certificateToPem(caObj.cert);
            const keyPem = pki.privateKeyToPem(caObj.key);
            mkdirp.sync(path.dirname(caCertPath));
            fs.writeFileSync(caCertPath, certPem);
            fs.writeFileSync(caKeyPath, keyPem);
        }
        return res;
    }
    createFakeCertificateByDomain(caCert, caKey, domain) {
        if (this.fakeCertifaceCache[domain]) {
            return this.fakeCertifaceCache[domain];
        }
        const cert = pki.createCertificate();
        cert.publicKey = keys.publicKey;
        cert.serialNumber = `${new Date().getTime()}`;
        cert.validity.notBefore = new Date();
        cert.validity.notBefore.setFullYear(cert.validity.notBefore.getFullYear() - 1);
        cert.validity.notAfter = new Date();
        cert.validity.notAfter.setFullYear(cert.validity.notAfter.getFullYear() + 1);
        const attrs = [{
                name: 'commonName',
                value: domain,
            }, {
                name: 'countryName',
                value: config_1.certificate.countryName,
            }, {
                shortName: 'ST',
                value: config_1.certificate.provinceName,
            }, {
                name: 'localityName',
                value: config_1.certificate.localityName,
            }, {
                name: 'organizationName',
                value: config_1.certificate.organizationName,
            }, {
                shortName: 'OU',
                value: config_1.certificate.OU,
            }];
        cert.setIssuer(caCert.subject.attributes);
        cert.setSubject(attrs);
        cert.setExtensions([{
                name: 'basicConstraints',
                critical: true,
                cA: false,
            }, {
                name: 'keyUsage',
                critical: true,
                digitalSignature: true,
                contentCommitment: true,
                keyEncipherment: true,
                dataEncipherment: true,
                keyAgreement: true,
                keyCertSign: true,
                cRLSign: true,
                encipherOnly: true,
                decipherOnly: true,
            }, {
                name: 'subjectAltName',
                altNames: [{
                        type: 2,
                        value: domain,
                    }],
            }, {
                name: 'subjectKeyIdentifier',
            }, {
                name: 'extKeyUsage',
                serverAuth: true,
                clientAuth: true,
                codeSigning: true,
                emailProtection: true,
                timeStamping: true,
            }, {
                name: 'authorityKeyIdentifier',
            }]);
        cert.sign(caKey, forge.md.sha256.create());
        this.fakeCertifaceCache[domain] = {
            key: keys.privateKey,
            cert,
        };
        return this.fakeCertifaceCache[domain];
    }
}
exports.default = Certificate;
