import _ from 'lodash';
import * as qs from 'qs';
import { FilterParams, HttpRequestRequest } from '../../types/web';
import { take, takeRight } from './_';

export const parseURL = (url) => {
  const a: HTMLAnchorElement = document.createElement('a');
  a.href = url;
  const res = {
    hostname: a.hostname,
    path: a.pathname,
    protocol: a.protocol.replace(':', ''),
    query: a.search.replace('?' ,''),
    origin: a.origin,
  };
  return res;
}

export const arrayBuf2string = (buf: any) => {
  if (typeof buf === 'string') {
    return buf;
  }
  const enc = new TextDecoder('utf-8');

  return enc.decode(buf);
}

export const parseQueryString = (query: string) => {
  if (!query) {
    return {};
  }
  return qs.parse(query);
}

export const parseRequest = (req: any) => {
  const { hostname, path, protocol, query, origin } = parseURL(req.url);
  const params = parseQueryString(query);

  return Object.assign(req, {
    host: hostname,
    path,
    protocol,
    origin,
    requestParams: params,
  });
};

export const filterRequestItem = (
  request: HttpRequestRequest,
  filter: FilterParams
) => {
  const { filterString, filterType, filterContentType } = filter;
  if (!filterString && filterContentType === 'all') {
    return true;
  }
  if (filterString) {
    switch (filterType) {
      case "url":
        return request?.custom?.url?.includes(filterString);
      case "path":
        return request?.custom?.path?.includes(filterString);
      case "host":
        return request?.custom?.host?.includes(filterString);
      default:
        break;
    }
  }
  if (filterContentType) {
    const contentType = _.get(request, 'responseHeaders["content-type"]');
    if (filterContentType === 'image') {
      return contentType.includes(filterContentType) || contentType.includes('icon');
    }
    return contentType && contentType.includes(filterContentType);
  }

  return false;
};

export const filterRequestList = (list: HttpRequestRequest[], filter: FilterParams) => list.filter((item: HttpRequestRequest) => filterRequestItem(item, filter));


export const rand = (min, max) => {
    return parseInt(Math.random() * (max - min + 1) + min, 10);
};
export const getRandStr = (len = 12) => {
    const base = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const max = base.length - 1;
    return Array(len).fill(0).map((_, idx) => base[rand(idx === 0 ? 10 : 0, max)]).join('');
};

export const htmlEscape = (str) => {
  if (str?.replace) {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  return str;
};

export const formatFileSize = (str) => {
  if (!str || !/^\d+$/.test(str)) {
    return '-';
  }
  const num = Number(str);
  if (num > 1024 * 1024) {
    return `${parseInt((num / 1024 / 1024 * 10).toString(), 10) / 10}M`;
  } else if (num > 1024) {
    return `${parseInt((num / 1024 * 10).toString(), 10) / 10}K`;
  }
  return `${num}B`;
};

export const shorthand = (str, leftLength = 20, max = 40) => {
  if (typeof str === 'string' && str.length > max) {
    const arr = str.split("");
    const arr1 = take(arr, leftLength);
    const arr2 = takeRight(arr, leftLength);

    return `${arr1.join("")}...${arr2.join("")}`;
  }
  return str;
};

export const showResponseType = (type) => {
  if (!type) return "-";
  const txt = type
    .replace(/^\w+\//, "")
    .replace(/;\s?\S+/, "")
    .slice(0, 25);

  return shorthand(txt, 4, 10);
};

export const findUrlHasImageType = (url) => {
  return /\.(png|jpg|webp|gif)/i.test(url);
};

export const findLinkFromString = (str) => {
  if (!(str && str.replace)) {
    return str;
  }
  const cls = (url) => findUrlHasImageType(url) ? 'json-viewer-link' : '';
  return htmlEscape(str)
    .replace(/"(https?:\/\/[^"]+)"/g, (a,b) => {
      const $cls = cls(b);
      if ($cls) {
        return `"<a class="${$cls}" href='${b}' target="_blank">${b}<img src="${b}" /></a>"`.replace(/\n/g, '');
      }
      return `"<a href='${b}' target="_blank">${b}</a>"`;
    });
};

export const formatWsSymbol = (str) => {
  let data = {
    dir: '',
    message: '',
  };

  try {
    data = JSON.parse(str);
  } catch(err) {}


  return data;
  // const down = 'down';
  // const up = 'up';
  // const WIDE_CHAR_REG = /^[^{^<]+/;
  // const wideChars = str.match(WIDE_CHAR_REG);
  // let dir = '';
  // if (wideChars && wideChars.length) {
  //   const wideChar = wideChars[0];
  //   const list = wideChar.split('').map(i => i.codePointAt(0));
  //   if (list && list.length && list[1] === 126) {
  //     dir = down;
  //   } else {
  //     dir = up;
  //   }
  // }
  // return {
  //   className: dir,
  //   // content: str.replace(WIDE_CHAR_REG, ''),
  //   content: str,
  // };
}

export const isLikeJson = (str) => {
  if (typeof str === 'string') {
    return /^\{[\S\s]+\}$/.test(str.trim()) || /^\[[\S\s]+\]$/.test(str.trim());
  }

  return false;
};

export const highlight = () => {
  (window as any)?.PR?.prettyPrint();
};

export const objectToUrlQueryString = (obj) => {
  return Object.keys(obj).map(key => `${key}=${obj[key]}`).join('&');
};
