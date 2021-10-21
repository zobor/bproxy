export interface CertificateValidity {
  notBefore: Date;
  notAfter: Date;
}

export interface Certificate {
  publicKey: string;
  serialNumber: string;
  validity: CertificateValidity;
  setSubject: Function;
  setIssuer: Function;
  setExtensions: Function;
  sign: Function;
}

export interface CertificateKey {
  publicKey: string;
  privateKey: string;
}

export interface CertificateCreateRes {
  key: string;
  cert: Certificate;
}

export interface CertificateInstallRes {
  caCertPath: string;
  caKeyPath: string;
  create: boolean;
}
