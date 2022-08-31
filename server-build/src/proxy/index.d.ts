export default class LocalServer {
    static beforeStart(): Promise<void>;
    static checkUpgrade(): Promise<void>;
    static checkDefaultConfigAndCreateOne(): Promise<boolean>;
    static checkPWDConfig(): Promise<void>;
    static checkAppLastTimeConfig(): Promise<void>;
    static start(): Promise<void>;
    static enableBproxySystemProxy(port: number): Promise<void>;
    static disableBproxySystemProxy(): Promise<unknown>;
    static errorCatch(): Promise<void>;
    static afterCloseNodeJsProcess(): Promise<void>;
}
