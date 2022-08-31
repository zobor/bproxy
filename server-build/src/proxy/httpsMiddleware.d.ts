interface CertConfig {
    certPath: string;
}
interface WebOthers {
    originHost?: string;
    originPort?: number;
    fakeServer?: any;
}
declare const _default: {
    beforeStart(): CertConfig;
    proxy(req: any, socket: any, head: any): void;
    web(socket: any, head: any, hostname: any, port: any, req: any, others?: WebOthers): void;
    startLocalHttpsServer(hostname: any, config: BproxyConfig.Config, req: any, socket: any, head: any, port: any): Promise<{
        port: number;
        fakeServer: any;
    }>;
};
export default _default;
