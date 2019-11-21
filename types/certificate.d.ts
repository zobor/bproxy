export interface ICertificateValidity {
  notBefore: Date;
  notAfter: Date;
}

export interface ICertificate {
  publicKey: string;
  serialNumber: string;
  validity: ICertificateValidity;
  setSubject: Function;
  setIssuer: Function;
  setExtensions: Function;
  sign: Function;
}

export interface ICertificateKey {
  publicKey: string;
  privateKey: string;
}

export interface ICertificateCreateRes {
  key: string;
  cert: ICertificate;
}

export interface ICertificateInstallRes {
  caCertPath: string;
  caKeyPath: string;
  create: boolean;
}