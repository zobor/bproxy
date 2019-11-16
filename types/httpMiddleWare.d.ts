import IPattern from './pattern';
import IRule from './rule';

export default interface IHttpMiddleWare {
  pattern: IPattern;
  proxy(req: any, res: any, rules:Array<IRule>): void;
  before(req: any, res: any): IPattern;
}