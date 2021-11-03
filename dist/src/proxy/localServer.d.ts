import { ProxyConfig } from '../types/proxy';
export default class LocalServer {
    static start(port: number, configPath: string): void;
    static loadUserConfig(configPath: string, defaultSettings: ProxyConfig): {
        configPath?: string;
        config?: ProxyConfig;
    };
}
