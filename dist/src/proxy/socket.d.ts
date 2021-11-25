import { InvokeRequestParams } from '../types/proxy';
export declare const io: (server: any) => void;
export declare const emit: (type: string, msg: any) => void;
export declare const ioRequest: (params: InvokeRequestParams) => void;
