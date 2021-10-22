export interface ProxyRule {
  regx: RegExp | string | Function;
  host?: string;
  file?: string;
  path?: string;
  response?: Function | string;
  redirect?: string;
  redirectTarget?: string;
  proxy?: string;
  showLog?: boolean;
  download?: boolean;
  responseHeaders?: {
    [key: string]: any;
  };
  requestHeaders?: {
    [key: string]: any;
  };
  statusCode?: number;
  filepath?: string;
  OPTIONS2POST?: boolean;
}

export interface ProxyDataSet {
  configPath?: string;
}

export interface ProxyCertificateConfig {
  filename: string;
  keyFileName: string;
  name: string;
  organizationName: string;
  OU: string;
  countryName: string;
  provinceName: string;
  localityName: string;
  keySize: number;
  getDefaultCABasePath: Function;
  getDefaultCACertPath: Function;
  getDefaultCAKeyPath: Function;
}

export interface ProxyCertificateValidity {
  notBefore: Date;
  notAfter: Date;
}

export interface ProxyCertificateKey {
  publicKey: string;
  privateKey: string;
}

export interface ProxyCertificateInstallResponse {
  caCertPath: string;
  caKeyPath: string;
  create: boolean;
}

export interface ProxyCertificate {
  publicKey: string;
  serialNumber: string;
  validity: ProxyCertificateValidity;
  setSubject: Function;
  setIssuer: Function;
  setExtensions: Function;
  sign: Function;
}

export interface ProxyCertificateCreateResponse {
  key: string;
  cert: ProxyCertificate;
}

export interface ProxyConfig {
  port: number;
  configFile: string;
  downloadPath: string;
  https: string[];
  sslAll: boolean;
  host: string[];
  rules: ProxyRule[];
  certificate: ProxyCertificateConfig;
}


export default interface ProxyPattern {
  delay?: number;
  matched?: boolean;
  filepath?: string;
  matchedRule?: ProxyRule;
  disableHttpRequest?: boolean;
  responseHeaders?: {
    [key: string]: any;
  };
}
