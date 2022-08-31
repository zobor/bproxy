export declare const utils: {
    guid: (len?: number) => string;
    uuid: (len?: number) => string;
};
export declare const createHttpHeader: (line: any, headers: any) => string;
export declare const isNeedTransformString2RegExp: (str: string) => boolean;
export declare const url2regx: (url: string) => RegExp;
export declare const isHttpsHostRegMatch: (httpsList: any, hostname: any) => boolean;
export declare const versionString2Number: (version: any) => number;
export declare const compareVersion: (v1: string, v2: string) => number;
export declare function stringToBytes(str: string): Int8Array;
export declare function hookConsoleLog(html: string, debug: boolean | string): string;
export declare function runShellCode(shell: any, callback?: any, onerror?: (error: any) => void, onend?: () => void): void;
export declare function delay(time: number): Promise<unknown>;
export declare function safeDecodeUrl(url: string): string;
