interface BridgeInvokeParams {
    api: string;
    params?: any;
}
export declare const bridgeInvoke: ({ api, params }: BridgeInvokeParams) => Promise<unknown>;
export declare const onRequest: (callback: any) => void;
export {};
