declare class Logger {
    printf(message: string, level: string): void;
    info(msg: any): void;
    error(msg: any): void;
    debug(msg: any): void;
    warn(msg: any): void;
}
export declare const log: Logger;
export declare const utils: {
    guid: (len?: number) => string;
    uuid: (len?: number) => string;
};
export declare const createHttpHeader: (line: any, headers: any) => string;
export declare const url2regx: (url: string) => RegExp;
export declare const isHttpsHostRegMatch: (httpsList: any, hostname: any) => boolean;
export {};
