import { ProxyConfig } from "../types/proxy";
interface CertConfig {
    certPath: string;
}
declare const _default: {
    beforeStart(): CertConfig;
    proxy(req: any, socket: any, head: any, config: ProxyConfig): void;
    web(socket: any, head: any, hostname: any, port: any, req: any): void;
    startLocalHttpsServer(hostname: any, config: ProxyConfig, req: any, socket: any, head: any, port: any): Promise<number>;
};
export default _default;
