export declare const defaultWindowSize: {
    width: number;
    height: number;
};
export declare function showErrorDialog(text: string): Promise<void>;
export declare function showConfirmDialog(title: string, text: string, buttons: string[], callbacks: Function[]): Promise<void>;
export declare function openNewWindow({ url, width, height, }: {
    url: string;
    width?: number;
    height?: number;
}): string | undefined;
export declare function openAndPreviewTextFile({ url, width, height }: {
    url: any;
    width: any;
    height: any;
}): any;
export declare function showUpgradeDialog({ url, changeLog }: {
    url?: string;
    changeLog: string[];
}): void;
export declare function showHomePage(url?: string): void;
export declare function showSelectPathDialog(): Promise<unknown>;
