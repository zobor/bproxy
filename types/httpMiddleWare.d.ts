import IPattern from './pattern';

export default interface IHttpMiddleWare {
  pattern: IPattern;
  proxy(req: any, res: any): void;
  before(req: any, res: any): IPattern;
}