export interface Rule {
  regx: RegExp | string | Function;
  host?: string;
  file?: string;
  path?: string;
  response?: Function | string;
  redirect?: string;
  redirectTarget?: string;
  proxy?: string;
  showLog?: boolean;
  download?: boolean;
  responseHeaders?: {
    [key: string]: any;
  };
  requestHeaders?: {
    [key: string]: any;
  };
  statusCode?: number;
  filepath?: string;
  OPTIONS2POST?: boolean;
}
