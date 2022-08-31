export declare const getNetworkServices: () => string[];
export declare const getActiveNetwork: () => string[];
export declare const setNetworkProxyStatus: ({ deviceName, status }: {
    deviceName: string;
    status: 'off' | 'on';
}) => void;
export declare const setActiveNetworkProxyStatus: (status: 'off' | 'on') => void;
export declare const setNetworkProxy: ({ deviceName, host, port }: {
    deviceName: string;
    host: string;
    port: string;
}) => void;
export declare const setActiveNetworkProxy: ({ host, port }: {
    host: string;
    port: string;
}) => void;
export declare const getNetworkHttpProxyInfo: (deviceName: string) => any;
export declare const getNetworkHttpsProxyInfo: (deviceName: string) => any;
export declare const getActiveNetworkProxyInfo: () => any;
export declare const getActiveNetworkProxyStatus: () => {};
