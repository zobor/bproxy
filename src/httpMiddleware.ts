import * as request from 'request';
import * as fs from 'fs';
import { Readable } from 'stream';
import { IHttpMiddleWare } from '../types/httpMiddleWare';
import { IRule } from '../types/rule';
import { rulesPattern } from './rule';
import { IRequestOptions } from '../types/request';

export default<IHttpMiddleWare> {
  async proxy(req: any, res: any, rules: Array<IRule>): Promise<number>{
    const pattern = rulesPattern(rules, req.httpsURL || req.url);
    if (pattern.matched) {
      return new Promise(() => {
        if (pattern.matchedRule.file) {
          this.proxyLocalFile(pattern.matchedRule.file, res);
        }
      });
    } else {
      return new Promise(async(resolve) => {
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
  },

  proxyLocalFile(filepath: string, res: any):void {
    try {
      fs.accessSync(filepath, fs.constants.R_OK);
      const readStream = fs.createReadStream(filepath);
      readStream.pipe(res);
    } catch(err) {
      const s = new Readable();
      s.push('Not Found or Not Acces');
      s.push(null);
      s.pipe(res);
      res.writeHead(404, {});
    }
  }
}