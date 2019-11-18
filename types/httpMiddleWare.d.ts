import IPattern from './pattern';
import IRule from './rule';

export interface IHttpMiddleWare {
  pattern: IPattern;
  proxy(req: any, res: any, rules:Array<IRule>): Promise<number>;
  getPOSTBody(req: any): Promise<Buffer>;
}