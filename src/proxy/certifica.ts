import * as net from 'net';
import * as forge from 'node-forge';
import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import * as crypto from 'crypto';
import { certificate } from './config';

const { pki } = forge;
const ONE_DAY = 1000 * 60 * 60 * 24;
const MIN_DATE = ONE_DAY * 20;
const RANDOM_SERIAL = '.' + Date.now() + '.' + Math.floor(Math.random() * 10000);
let ROOT_KEY: any;
let ROOT_CRT: any;
let keys: any;

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

function getSN(hostname: string) {
  const serialNumber =
    crypto
      .createHash('sha1')
      .update(hostname + RANDOM_SERIAL, 'binary' as any)
      .digest('hex') +
    getIndex();

  return serialNumber;
}

class Certificate {
  // 创建安装使用的本地证书
  createCAForInstall(
    commonName: string
  ): any {
    const cert = this.createCert(keys.publicKey)
    const attrs = [
      {
        name: 'commonName',
        value: commonName,
      },
      {
        name: 'countryName',
        value: certificate.countryName,
      },
      {
        shortName: 'ST',
        value: certificate.provinceName,
      },
      {
        name: 'localityName',
        value: certificate.localityName,
      },
      {
        name: 'organizationName',
        value: certificate.organizationName,
      },
      {
        shortName: 'OU',
        value: certificate.OU,
      },
    ];
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    cert.setExtensions([
      {
        name: 'basicConstraints',
        cA: true,
      },
      {
        name: 'keyUsage',
        keyCertSign: true,
        digitalSignature: true,
        nonRepudiation: true,
        keyEncipherment: true,
        dataEncipherment: true,
      },
      {
        name: 'extKeyUsage',
        serverAuth: true,
        clientAuth: true,
        codeSigning: true,
        emailProtection: true,
        timeStamping: true,
      },
      {
        name: 'nsCertType',
        client: true,
        server: true,
        email: true,
        objsign: true,
        sslCA: true,
        emailCA: true,
        objCA: true,
      },
    ]);

    cert.sign(keys.privateKey, forge.md.sha256.create());

    return {
      key: keys.privateKey,
      cert,
    };
  }

  // 写入证书
  create(caPath?: string): BproxyConfig.ProxyCertificateInstallResponse {
    this.init();
    const basePath = caPath || certificate.getDefaultCABasePath();
    const caCertPath = path.resolve(basePath, certificate.filename);
    const caKeyPath = path.resolve(basePath, certificate.keyFileName);

    try {
      fs.accessSync(caCertPath, fs.constants.R_OK);
      fs.accessSync(caKeyPath, fs.constants.R_OK);

      // has exist
      return {
        caCertPath,
        caKeyPath,
        create: true,
      };
    } catch (e) {
      const caObj = this.createCAForInstall(certificate.filename);

      const caCert = caObj.cert;
      const cakey = caObj.key;

      const certPem = pki.certificateToPem(caCert as any);
      const keyPem = pki.privateKeyToPem(cakey as any);

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

  // 启动bproxy，初始化证书
  init(): BproxyConfig.ProxyCertificateInstallResponse {
    if (fs.existsSync(certificate.getDefaultCACertPath())) {
      // 不影响启动速度，延迟创建keys
      setTimeout(() => {
        keys = pki.rsa.generateKeyPair(certificate.keySize);
      }, 1000);
    } else {
      keys = pki.rsa.generateKeyPair(certificate.keySize);
    }
    const basePath = certificate.getDefaultCABasePath();
    const caCertPath = path.resolve(basePath, certificate.filename);
    const caKeyPath = path.resolve(basePath, certificate.keyFileName);
    const res: BproxyConfig.ProxyCertificateInstallResponse = {
      caCertPath,
      caKeyPath,
      create: true,
    };
    // 证书创建一次即可
    if (fs.existsSync(caCertPath) && fs.existsSync(caKeyPath)) {
      ROOT_CRT = fs.readFileSync(caCertPath);
      ROOT_KEY = fs.readFileSync(caKeyPath);
      ROOT_CRT = pki.certificateFromPem(ROOT_CRT);
      ROOT_KEY = pki.privateKeyFromPem(ROOT_KEY);
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
    } catch (e) {
      const caObj = this.createCAForInstall(certificate.name);
      const certPem = pki.certificateToPem(caObj.cert as any);
      const keyPem = pki.privateKeyToPem(caObj.key as any);

      mkdirp.sync(path.dirname(caCertPath));
      fs.writeFileSync(caCertPath, certPem);
      fs.writeFileSync(caKeyPath, keyPem);
      ROOT_CRT = caObj.cert;
      ROOT_KEY = caObj.key;
    }
    return res;
  }

  createCert(publicKey: string, serialNumber?: string, isShortPeriod?: boolean) {
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

  // 临时证书缓存
  fakeCertifaceCache: Record<string, { keyPem: any; certPem: any }> = {};

  // 创建https虚拟证书
  createFakeCertificateByDomain(domain: string): BproxyConfig.ProxyCertificateCreateResponse {
    if (this.fakeCertifaceCache[domain]) {
      return this.fakeCertifaceCache[domain];
    }
    const cert = this.createCert(
      pki.setRsaPublicKey(ROOT_KEY.n, ROOT_KEY.e),
      getSN(domain),
      true,
    );

    cert.setSubject([
      {
        name: 'commonName',
        value: domain,
      }
    ]);
    cert.setIssuer(ROOT_CRT.subject.attributes);
    cert.setExtensions([
      {
        name: 'subjectAltName',
        altNames: [
          net.isIP(domain)
            ? {
              type: 7,
              ip: domain
            }
            : {
              type: 2,
              value: domain
            }
        ]
      }
    ]);
    cert.sign(ROOT_KEY, forge.md.sha256.create());

    this.fakeCertifaceCache[domain] = {
      keyPem: pki.privateKeyToPem(ROOT_KEY),
      certPem: pki.certificateToPem(cert),
    };

    return this.fakeCertifaceCache[domain];
  }
}

export default Certificate;
