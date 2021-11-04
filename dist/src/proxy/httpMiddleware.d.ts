/// <reference types="node" />
import MatcherResult, { ProxyConfig } from '../types/proxy';
export declare const httpMiddleware: {
    responseByText(text: string, res: any): void;
    proxy(req: any, res: any, config: ProxyConfig): Promise<number>;
    proxyByRequest(req: any, res: any, requestOption: any, responseOptions: any, matcherResult?: MatcherResult | undefined): Promise<number>;
    getPostBody(req: any): Promise<Buffer>;
    proxyLocalFile(filepath: string, res: any, resHeaders?: any): void;
};
