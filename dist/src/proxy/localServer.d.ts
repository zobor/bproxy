import { ProxyConfig } from '../types/proxy';
export default class LocalServer {
    static start(port: number, configPath: string): Promise<void>;
    static loadUserConfig(configPath: string, defaultSettings: ProxyConfig): Promise<{
        configPath?: string;
        config?: ProxyConfig;
    }>;
}
