/// <reference types="react" />
declare type contextData = {
    [key: string]: any;
};
declare type actionData = {
    [key: string]: any;
};
export declare const Ctx: import("react").Context<contextData>;
export declare const defaultState: {
    showDetail: boolean;
    detailActiveTab: string;
    requestId: string;
    proxySwitch: boolean;
    filterType: string;
    filterString: string;
    ready: boolean;
    disableCache: boolean;
    clean: () => void;
};
export declare const reducer: (state: {
    showDetail: boolean;
    detailActiveTab: string;
    requestId: string;
    proxySwitch: boolean;
    filterType: string;
    filterString: string;
    ready: boolean;
    disableCache: boolean;
    clean: () => void;
} | undefined, action: actionData) => any;
export {};
