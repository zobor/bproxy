/// <reference types="node" />
export declare const getPostBody: (req: any) => Promise<Buffer>;
export declare const getDalay: (rule?: BproxyConfig.Rule, config?: BproxyConfig.Config) => number;
export declare const checkUpgrade: () => Promise<unknown>;
