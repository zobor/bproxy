import Rule from './rule'
import IHttpMiddleWare from '../types/httpMiddleWare';
import IPattern from '../types/pattern';

export default<IHttpMiddleWare> {
  proxy(req: any, res: any): void{
    this.pattern = this.before(req, res);
  },

  before(req: any, res: any): IPattern{
    console.log(req.url);
    return {
      delay: 0,
    };
  }
}