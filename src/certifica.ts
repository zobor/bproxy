import * as forge from 'node-forge';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import settings from './settings';
import { ICertificate, ICertificateKey, ICertificateCreateRes, ICertificateInstallRes } from '../types/certificate';

const { pki } = forge;
const config = settings.certificate;
const dataset = {
  get cert(): ICertificate {
    return pki.createCertificate();
  },
  get keys(): ICertificateKey {
    return pki.rsa.generateKeyPair(settings.certificate.keySize);
  },
};
const keys = pki.rsa.generateKeyPair(config.keySize);

class Certificate {
  // 创建安装使用的本地证书
  createCAForInstall(commonName: string): ICertificateCreateRes {
    const { cert, keys} = dataset;
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
      value: config.countryName,
    }, {
      shortName: 'ST',
      value: config.provinceName,
    }, {
      name: 'localityName',
      value: config.localityName,
    }, {
      name: 'organizationName',
      value: config.organizationName,
    }, {
      shortName: 'OU',
      value: config.OU,
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

  install(caPath?: string): ICertificateInstallRes {
    const basePath = caPath || config.getDefaultCABasePath();
    const caCertPath = path.resolve(basePath, config.filename);
    const caKeyPath = path.resolve(basePath, config.keyFileName);

    try {
      fs.accessSync(caCertPath, fs.constants.R_OK);
      fs.accessSync(caKeyPath, fs.constants.R_OK);

      // has exist
      return {
        caCertPath,
        caKeyPath,
        create: false,
      };
    } catch (e) {
      const caObj = this.createCAForInstall(config.filename);

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
      create: true,
    };
  }

  init(): ICertificateInstallRes {
    const basePath = config.getDefaultCABasePath();
    const caCertPath = path.resolve(basePath, config.filename);
    const caKeyPath = path.resolve(basePath, config.keyFileName);

    try {
      fs.accessSync(caCertPath, fs.constants.R_OK);
      fs.accessSync(caKeyPath, fs.constants.R_OK);
      return {
        caCertPath,
        caKeyPath,
        create: false,
      };
    } catch (e) {
      const caObj = this.createCAForInstall(settings.certificate.name);
      const certPem = pki.certificateToPem(caObj.cert);
      const keyPem = pki.privateKeyToPem(caObj.key);

      mkdirp.sync(path.dirname(caCertPath));
      fs.writeFileSync(caCertPath, certPem);
      fs.writeFileSync(caKeyPath, keyPem);
    }
    return {
      caCertPath,
      caKeyPath,
      create: true,
    };

  }

  createFakeCertificateByDomain(caCert, caKey, domain):ICertificateCreateRes {
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
      value: config.countryName,
    }, {
      shortName: 'ST',
      value: config.provinceName,
    }, {
      name: 'localityName',
      value: config.localityName,
    }, {
      name: 'organizationName',
      value: config.organizationName,
    }, {
      shortName: 'OU',
      value: config.OU,
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

    return {
      key: keys.privateKey,
      cert,
    };
  
  }
}

export default Certificate;
