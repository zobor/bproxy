import IPattern from './pattern';
import { IRule } from './rule';
import { IConfig } from './config';

export interface IHttpMiddleWare {
  proxy(req: any, res: any, config: IConfig): Promise<number>;
  getPOSTBody(req: any): Promise<Buffer>;
  proxyLocalFile(filepath: string, res: any): void;
  proxyByRequest(req, res, options, resOptions): Promise<number>;
}