export * from './macos/os';
export * from './systemProxy';
export declare const test: (url: string) => Promise<BproxyConfig.MatcherResult | {
    error: string;
    help?: undefined;
} | {
    error: string;
    help: string;
}>;
export declare const getLocalIp: () => Promise<any>;
export declare const getLocalProxyPort: () => Promise<number | undefined>;
export declare const getProxyConfig: () => Promise<BproxyConfig.Config>;
export declare const getConfigFile: () => string;
export declare const getConfigFileContent: () => string;
export declare const getVersion: () => string;
export declare const setConfigFileContent: (params: {
    data: string;
}) => boolean;
export declare const getDebugTargets: () => {};
export declare const selectFilePath: () => Promise<unknown>;
export declare const openLogFile: () => void;
export declare const openWebPage: () => void;
export declare const getRuntimePlatform: () => "bash" | "app";
export declare const setConfigFilePath: ({ filepath }: {
    filepath: string;
}) => void;
export declare const getLogContent: () => string;
export declare const clearLogConent: () => void;
