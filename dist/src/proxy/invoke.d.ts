export * from './system';
export declare const test: (url: string) => Promise<import("../types/proxy").default>;
export declare const getLocalIp: () => Promise<any>;
export declare const getLocalProxyPort: () => Promise<number | undefined>;
