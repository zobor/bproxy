import { Rule } from './rule';

export interface Certificate {
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

export interface Config {
  port: number;
  configFile: string;
  downloadPath: string;
  https: Array<string>;
  sslAll: boolean;
  host: Array<string>;
  rules: Array<Rule>;
  certificate: Certificate;
}
