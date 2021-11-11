import * as qs from 'qs';
import { FilterParams, HttpRequestRequest } from '../../types/web';
export declare const parseURL: (url: any) => {
    hostname: string;
    path: string;
    protocol: string;
    query: string;
    origin: string;
};
export declare const arrayBuf2string: (buf: any) => string;
export declare const parseQueryString: (query: string) => qs.ParsedQs;
export declare const parseRequest: (req: any) => any;
export declare const filterRequestItem: (request: HttpRequestRequest, filter: FilterParams) => boolean | undefined;
export declare const filterRequestList: (list: HttpRequestRequest[], filter: FilterParams) => HttpRequestRequest[];
