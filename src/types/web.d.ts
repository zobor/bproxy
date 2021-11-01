export interface HttpRequestRequest {
  requestStartTime?: number;
  requestEndTime?: number;
  time?: number;
  responseHeaders?: {
    [key: string]: any;
  };
  requestHeaders?: {
    [key: string]: any;
  };
  responseBody?: Buffer | Int8Array | Uint8Array;
  custom?: {
    statusCode?: number;
    requestId: string;
    url?: string;
    method?: string;
    protocol?: 'http'|'https'|'ws'|'wss';
    host?: string;
    path?: string;
    origin?: string;
  };
  requestParams?: {
    [key: string]: any;
  };
  postData?: {
    [key: string]: any;
    $$type?: string;
  };
}

export interface FilterParams {
  filterType: string;
  filterString: string;
}
