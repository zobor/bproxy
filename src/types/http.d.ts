namespace BproxyHTTP {
  interface InvokeRequestParams {
    matched?: boolean;
    url?: string;
    method?: string;
    requestHeaders?: object;
    requestId: string;
    requestBody?: string;
    responseHeaders?: object;
    responseBody?: Buffer | Int8Array | Uint8Array | string;
    statusCode?: number;
    ip?: string;
  }

  interface WebInvokeParams {
    type: string;
    params: { [key: string]: any };
    id: string;
  }

  interface RequestHeaders {
    [key: string]: string;
  }
}
