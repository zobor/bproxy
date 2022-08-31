import ChannelManager from './ChannelManager';
export declare let wss: any;
export declare const channelManager: ChannelManager;
export declare const wsApi: (ws: any) => void;
export declare const emit: (type: string, msg: any) => void;
export declare const ioInit: (server: any) => void;
export declare const ioRequest: (params: BproxyHTTP.InvokeRequestParams) => void;
export declare const onConfigFileChange: () => void;
export declare const onDebuggerClientChange: () => void;
