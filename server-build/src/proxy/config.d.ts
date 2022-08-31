export declare const appConfigFileName = "bproxy.config.js";
export declare const appDataPath: string;
export declare const appConfigFilePath: string;
export declare const appErrorLogFilePath: string;
export declare const appInfoLogFilePath: string;
export declare const appTempPath: string | undefined;
declare const config: BproxyConfig.Config;
export default config;
export declare const certificate: {
    filename: string;
    keyFileName: string;
    name: string;
    organizationName: string;
    OU: string;
    countryName: string;
    provinceName: string;
    localityName: string;
    keySize: number;
    getDefaultCABasePath(): string;
    getDefaultCACertPath(): string;
    getDefaultCAKeyPath(): string;
};
export declare const configTemplate: Partial<BproxyConfig.Config>;
export declare const configTemplateString: string;
export declare const configModuleTemplate: string;
export declare const env: {
    bash: boolean;
};
export declare const bproxyPrefixHeader = "x-bproxy";
