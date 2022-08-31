export declare function disableSystemProxy(): Promise<unknown>;
export declare function enableSystemProxy(): Promise<unknown>;
export declare function setSystemProxy({ hostname, port, }: {
    hostname?: string;
    port?: string;
}): Promise<unknown>;
export declare function getSystemProxyStatus({ address, port, }: {
    address?: string;
    port?: string;
}): Promise<unknown>;
