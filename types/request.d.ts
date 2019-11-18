export interface IRequestHeaders {
  [key: string]: string;
}

export interface IRequestOptions {
  method: string;
  url: string;
  headers: IRequestHeaders;
  body: Buffer | null;
}