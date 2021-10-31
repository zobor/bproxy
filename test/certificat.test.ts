import * as fs from 'fs';
import * as forge from "node-forge";
import Certificate from '../src/proxy/certifica';

const { pki } = forge;

describe('Certificate', () => {
  const certificate = new Certificate();
  it('Certificate', () => {
    let error;
    try {
      const {caCertPath, caKeyPath} = certificate.install();
      const { key } = certificate.createCAForInstall('bproxy');
      expect(Object.keys(key).length > 0).toBeTruthy();
      const certData = fs.readFileSync(caCertPath);
      const certKeyData = fs.readFileSync(caKeyPath);
      const localCertificate = pki.certificateFromPem(certData);
      const localCertificateKey = pki.privateKeyFromPem(certKeyData);
      const { key: certKey} = certificate.createFakeCertificateByDomain(localCertificate, localCertificateKey, 'www.google.com');
      expect(Object.keys(certKey).length > 0).toBeTruthy();
    } catch(err) {
      error = err;
    }

    expect(error === undefined).toBeTruthy();
  });
});
