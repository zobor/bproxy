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
  const { filterString, filterType } = filter;
  if (!filterString) {
    return true;
  }
  switch (filterType) {
    case "url":
      return request?.custom?.url?.includes(filterString);
    case "path":
      return request?.custom?.path?.includes(filterString);
    case "host":
      return request?.custom?.host?.includes(filterString);
    default:
      return false;
  }
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

export const shorthand = (str, len = 20, max = 40) => {
  if (str.length > max) {
    const arr = str.split("");
    const arr1 = take(arr, len);
    const arr2 = takeRight(arr, len);

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

export const findLinkFromString = (str) => {
  if (!(str && str.replace)) {
    return str;
  }
  return htmlEscape(str)
    .replace(/"(https?:\/\/[^"]+)"/g, `"<a href='$1' target="_blank">$1</a>"`);
};

export const formatWsSymbol = (str) => {
  const down = ' ↓ ';
  const up = ' ↑ ';
  return str.replace(/�~�/g, down).replace(/�~�/g, down).replace(/�~/g, down).replace(/�~\u000\d�/g, down).replace(/�n/g, up);
}

export const isLikeJson = (str) => {
  if (str) {
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
