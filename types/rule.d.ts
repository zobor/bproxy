export interface IRule {
  regx: RegExp | string | Function;
  host?: string;
  file?: string;
  path?: string;
  response?: Function | string;
  redirect?: string;
  proxy?: string;
  showLog?: boolean;
  download?: boolean;
  responseHeaders?: any;
  requestHeaders?: any;
  statusCode?: number;
  filepath?: string;
  OPTIONS2POST?: boolean;
}
