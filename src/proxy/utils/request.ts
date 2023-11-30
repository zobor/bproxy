import request from 'request';
import { Readable } from 'stream';
import multiparty from 'multiparty';
import * as URL from 'url';
import { version } from '.././../../package.json';
import { checkVersion } from '../../utils/version';
import { get, isPlainObject } from 'lodash';
import { parseJSON } from '../../utils/utils';

export const getEmptyStream = () => {
  const s = new Readable();
  s.push('');
  s.push(null);

  return s;
};

export const getPostBody = (req: any): Promise<[Buffer, string]> => {
  return new Promise((resolve) => {
    const json = {};
    let index = 0;
    const result: any = [undefined, undefined];

    const body: Array<Buffer> = [];
    const ok = () => {
      index += 1;
      if (index === 2) {
        resolve(result);
      }
    };
    req.on('data', (chunk: Buffer) => {
      body.push(chunk);
    });
    req.on('end', () => {
      if (body.length === 0) {
        result[0] = getEmptyStream();
      } else {
        result[0] = Buffer.concat(body);
      }
      ok();
    });
    if (get(req, 'headers["content-type"]')?.toLowerCase()?.includes('form')) {
      const form = new multiparty.Form();
      form.parse(req, function (err, fields, files) {
        if (isPlainObject(files) && isPlainObject(fields)) {
          Object.keys(fields).forEach(function (name) {
            json[name] = fields[name][0];
          });

          Object.keys(files).forEach(function (name) {
            json[name] = `二进制（${files[name][0].originalFilename}）`;
          });
          result[1] = json;
          ok();
        } else {
          result[1] = '';
          ok();
        }
      });
    } else {
      result[1] = '';
      ok();
    }
  });
};

export const getDalay = (rule?: BproxyConfig.Rule, config?: BproxyConfig.Config) => {
  return rule?.delay || config?.delay || 0;
};

export const checkUpgrade = () => {
  return new Promise((resolve) => {
    request.get('https://registry.npmmirror.com/bproxy', (err, response, body) => {
      if (body) {
        try {
          const versionData = parseJSON(body);
          const latestVersion = get(versionData, 'dist-tags.latest');
          if (checkVersion(version, latestVersion) < 0) {
            resolve({ version: latestVersion });
          } else {
            resolve(null);
          }
        } catch (err) {}
      }
    });
  });
};

export const isJsURL = (url: string, suffix = '.js') => {
  const params = URL.parse(url);

  return params.pathname?.endsWith(suffix);
};

export const checkIsStaticFile = (url) => {
  const params = URL.parse(url);

  return (
    params.pathname?.toLowerCase()?.endsWith('.js') ||
    params.pathname?.toLowerCase()?.endsWith('.css') ||
    params.pathname?.toLowerCase()?.endsWith('.map')
  );
};
