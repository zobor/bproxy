import * as net from 'net';
import * as forge from 'node-forge';
import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import { certificate } from './config';

const { pki } = forge;
const ONE_DAY = 1000 * 60 * 60 * 24;
let keys;

class Certificate {
  // 创建安装使用的本地证书
  createCAForInstall(
    commonName: string
  ): BproxyConfig.ProxyCertificateCreateResponse {
    const cert: any = pki.createCertificate();
    const currentDate = new Date();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = `${currentDate.getTime()}`;
    cert.validity.notBefore = new Date(currentDate.getTime() - ONE_DAY * 20);
    cert.validity.notAfter = currentDate;
    // 证书有效期10年
    cert.validity.notAfter.setFullYear(
      cert.validity.notAfter.getFullYear() + 10
    );
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
    }
    return res;
  }

  // 临时证书缓存
  fakeCertifaceCache: Record<string, { key: string; cert: any }> = {};

  // 创建https虚拟证书
  createFakeCertificateByDomain(
    caCert,
    caKey,
    domain
  ): BproxyConfig.ProxyCertificateCreateResponse {
    if (this.fakeCertifaceCache[domain]) {
      return this.fakeCertifaceCache[domain];
    }
    const cert: any = pki.createCertificate();
    cert.publicKey = keys.publicKey;
    const currentDate = new Date();

    cert.serialNumber = `${new Date().getTime()}`;
    cert.validity.notBefore = new Date(currentDate.getTime() - ONE_DAY * 20);
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notAfter.getFullYear() + 1);
    const attrs = [
      {
        name: 'commonName',
        value: domain,
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

    cert.setIssuer(caCert.subject.attributes);
    cert.setSubject(attrs);

    cert.setExtensions([
      {
        name: 'basicConstraints',
        cA: false,
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
        name: 'subjectAltName',
        altNames: [
          net.isIP(domain)
            ? {
                type: 7,
                value: domain,
              }
            : {
                type: 2,
                value: domain,
              },
        ],
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
    cert.sign(caKey, forge.md.sha256.create());

    this.fakeCertifaceCache[domain] = {
      key: keys.privateKey,
      cert,
    };

    return this.fakeCertifaceCache[domain];
  }
}

export default Certificate;
