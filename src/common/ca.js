'use strict';

const forge = require('node-forge');

const { pki } = forge;
const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const mkdirp = require('mkdirp');
const config = require('./cert');

const SEC_SIZE = 2048;
const keys = pki.rsa.generateKeyPair(SEC_SIZE);
const cert = pki.createCertificate();

const createCA = function createCA(CN) {
  //const keys = pki.rsa.generateKeyPair(SEC_SIZE);
  //const cert = pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = `${new Date().getTime()}`;
  cert.validity.notBefore = new Date();
  cert.validity.notBefore.setFullYear(cert.validity.notBefore.getFullYear() - 5);
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notAfter.getFullYear() + 20);
  const attrs = [{
    name: 'commonName',
    value: CN,
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

  // self-sign certificate
  cert.sign(keys.privateKey, forge.md.sha256.create());

  return {
    key: keys.privateKey,
    cert,
  };
};

const init = function init() {
  /* eslint prefer-rest-params: 0 */
  const basePath = arguments.length <= 0
    || arguments[0] === undefined
    ? config.getDefaultCABasePath() : arguments[0];


  const caCertPath = path.resolve(basePath, config.caCertFileName);
  const caKeyPath = path.resolve(basePath, config.caKeyFileName);

  try {
    fs.accessSync(caCertPath, fs.F_OK);
    fs.accessSync(caKeyPath, fs.F_OK);

    // has exist
    return {
      caCertPath,
      caKeyPath,
      create: false,
    };
  } catch (e) {
    const caObj = createCA(config.caName);

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
};

const covertNodeCertToForgeCert = function covertNodeCertToForgeCert(originCertificate) {
  const obj = forge.asn1.fromDer(originCertificate.raw.toString('binary'));
  let r;
  try {
    r = forge.pki.certificateFromAsn1(obj);
  } catch (err) {
    console.error(err);
  }
  return r;
};


const createFakeCertificateByDomain = function createFakeCertificateByDomain(
  caKey, caCert, domain,
) {
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
};

const createFakeCertificateByCA = function createFakeCertificateByCA(
  caKey, caCert, originCertificate,
) {
  const certificate = covertNodeCertToForgeCert(originCertificate);

  //const keys = pki.rsa.generateKeyPair(SEC_SIZE);
  //const cert = pki.createCertificate();
  cert.publicKey = keys.publicKey;

  cert.serialNumber = certificate.serialNumber;
  cert.validity.notBefore = new Date();
  cert.validity.notBefore.setFullYear(cert.validity.notBefore.getFullYear() - 1);
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notAfter.getFullYear() + 1);

  cert.setSubject(certificate.subject.attributes);
  cert.setIssuer(caCert.subject.attributes);

  if (certificate.subjectaltname) {
    cert.subjectaltname = certificate.subjectaltname;
  }

  const subjectAltName = _.find(certificate.extensions, {
    name: 'subjectAltName',
  });
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
    altNames: subjectAltName.altNames,
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
};

module.exports = {
  init,
  createFakeCertificateByDomain,
  createFakeCertificateByCA,
};
