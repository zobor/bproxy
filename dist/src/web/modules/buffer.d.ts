/// <reference types="node" />
export declare function isBuffer<T>(v: T): boolean;
export declare function bytesToString(bytes: any): string;
export declare function stringToBytes(str: string): Int8Array;
export declare function textDecode(buf: Int8Array | Buffer): string;
export declare function buffer2string(buffer: Buffer, encoding: string): string;
