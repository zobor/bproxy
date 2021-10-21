export interface RequestHeaders {
  [key: string]: string;
}

export interface RequestOptions {
  method: string;
  url: string;
  headers: RequestHeaders;
  body: Buffer | null;
  encoding?: string | null;
  strictSSL?: boolean;
  rejectUnauthorized?: boolean;
  followRedirect?: boolean;
}
