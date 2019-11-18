import * as request from 'request';
import { IHttpMiddleWare } from '../types/httpMiddleWare';
import { IRule } from '../types/rule';
import { rulesPattern } from './rule';
import { IRequestOptions } from '../types/request';

export default<IHttpMiddleWare> {
  async proxy(req: any, res: any, rules: Array<IRule>): Promise<number>{
    const pattern = rulesPattern(rules, req.url);
    if (pattern.matched) {
      return new Promise((resolve) => {

      });
    } else {
      return new Promise( async(resolve) => {
        const rHeaders = {...req.headers};
        const options:IRequestOptions = {
          url: req.url,
          method: req.method,
          headers: rHeaders,
          body: null,
          encoding: null,
          strictSSL: false,
          rejectUnauthorized: false,
        };
        if (req.method.toLowerCase() === 'post') {
          options.body = await this.getPOSTBody(req);
        }
        request(options, (err, resp, body) => {
          if (err) {
            console.error(err);
            res.end(err);
            return;
          }
          res.writeHead(resp.statusCode, resp.headers);
          res.write(body);
          res.end();
        });
      });
    }
  },

  getPOSTBody(req: any): Promise<Buffer> {
    return new Promise((resolve) => {
      const body:Array<Buffer> = [];
      req.on('adta', (chunk: Buffer) => {
        body.push(chunk);
      });
      req.on('end', () => {
        resolve(Buffer.concat(body));
      });
      req.on('error', (err) => {
        // todo
        console.log(err);
      });
    });
  }
}