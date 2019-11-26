import { IRule } from './rule';

export interface ICertificate {
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

export interface IConfig {
  port: number;
  configFile: string;
  downloadPath: string;
  https: Array<string>;
  sslAll: boolean;
  host: Array<string>;
  rules: Array<IRule>;
  certificate: ICertificate;
}