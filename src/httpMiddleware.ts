import IHttpMiddleWare from '../types/httpMiddleWare';
import IPattern from '../types/pattern';
import IRule from '../types/rule';
import { rulesPattern } from './rule';

export default<IHttpMiddleWare> {
  proxy(req: any, res: any, rules: Array<IRule>): void{
    const pattern = rulesPattern(rules, req.url);
    console.log(pattern);
  },

  before(req: any, res: any): IPattern{
    console.log(req.url);
    return {
      delay: 0,
      matched: false,
    };
  }
}