import * as forge from 'node-forge';
import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import {certificate} from './config';

const { pki } = forge;
let keys;

class Certificate {
  // 创建安装使用的本地证书
  createCAForInstall(commonName: string): BproxyConfig.ProxyCertificateCreateResponse {
    const cert: any = pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = `${new Date().getTime()}`;
    cert.validity.notBefore = new Date();
    cert.validity.notBefore.setFullYear(cert.validity.notBefore.getFullYear() - 5);
    cert.validity.notAfter = new Date();
    // 证书有效期20年
    cert.validity.notAfter.setFullYear(cert.validity.notAfter.getFullYear() + 20);
    const attrs = [{
      name: 'commonName',
      value: commonName,
    }, {
      name: 'countryName',
      value: certificate.countryName,
    }, {
      shortName: 'ST',
      value: certificate.provinceName,
    }, {
      name: 'localityName',
      value: certificate.localityName,
    }, {
      name: 'organizationName',
      value: certificate.organizationName,
    }, {
      shortName: 'OU',
      value: certificate.OU,
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
    // 不影响启动速度，延迟创建keys
    setTimeout(() => {
      keys = pki.rsa.generateKeyPair(certificate.keySize);
    }, 1000);
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
  fakeCertifaceCache: Record<string, {key: string; cert: any}> = {};

  // 创建https虚拟证书
  createFakeCertificateByDomain(caCert, caKey, domain): BproxyConfig.ProxyCertificateCreateResponse {
    if (this.fakeCertifaceCache[domain]) {
      return this.fakeCertifaceCache[domain];
    }
    const cert: any = pki.createCertificate();
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
      value: certificate.countryName,
    }, {
      shortName: 'ST',
      value: certificate.provinceName,
    }, {
      name: 'localityName',
      value: certificate.localityName,
    }, {
      name: 'organizationName',
      value: certificate.organizationName,
    }, {
      shortName: 'OU',
      value: certificate.OU,
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

export default Certificate;
