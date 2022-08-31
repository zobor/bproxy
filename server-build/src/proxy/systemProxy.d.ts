export declare function isMac(): boolean;
export declare function setSystemProxyOn(): void;
export declare function setSystemProxyOff(): void | Promise<unknown>;
export declare function configSystemProxy({ host, port, }: {
    host?: string;
    port?: string;
}): void;
export declare function checkSystemProxy({ host, port, }: {
    host?: string;
    port?: string;
}): Promise<unknown>;
export declare function autoInstallCertificate(): Promise<unknown>;
