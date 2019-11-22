import IPattern from './pattern';
import { IRule } from './rule';

export interface IHttpMiddleWare {
  proxy(req: any, res: any, rules:Array<IRule>): Promise<number>;
  getPOSTBody(req: any): Promise<Buffer>;
  proxyLocalFile(filepath: string, res: any): void;
  proxyByRequest(req, res, options, resOptions): Promise<number>;
}