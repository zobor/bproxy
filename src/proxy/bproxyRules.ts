import path from 'path';
import fs from 'fs';
import { rootPath } from './config';
import URL from 'url';
import * as webApi from './api/webApi';
import { getLocalIpAddress } from './utils/ip';

const [ip] = getLocalIpAddress();

export const getDefaultRulesList = () => [
  // apis
  {
    regx: 'https://www.bproxy.dev/api/*',
    response: (args: any) => {
      const { request, response } = args;
      const [, , pathname] = URL.parse(request.url).path?.split('/') || ['', '', ''];

      if (pathname && webApi[pathname]) {
        webApi[pathname](args);
      } else {
        response.writeHead(404, {});
        response.end();
      }
    },
  },
  // web page
  {
    regx: 'https://www.bproxy.dev/web/SyncClipboard',
    response() {
      const html = fs.readFileSync(`${path.resolve(rootPath, './web-build/index.html')}`, 'utf-8');
      const res = html.replaceAll('http://127.0.0.1:8888/', 'https://www.bproxy.dev/');
      return {
        data: res,
        headers: {
          'content-type': 'text/html; charset=utf-8',
        },
      };
    },
  },
  {
    regx: 'https://www.bproxy.dev/**',
    redirect: `http://${ip}:8888/`,
  },
];
