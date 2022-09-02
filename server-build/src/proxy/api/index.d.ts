export declare const getElectronApi: () => any;
export declare const isApp: () => boolean;
export declare const isBash: () => boolean;
export declare function showError(text: string): Promise<any>;
export declare function previewTextFile(appInfoLogFilePath: string): Promise<any>;
export declare function showBproxyHome(): Promise<any>;
export declare function showSelectPath(): Promise<any>;
export declare function showUpgrade(data: {
    version: string;
    changeLog: string[];
}): Promise<any>;
