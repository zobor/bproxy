export const parseURL = (url) => {
  let a: any = document.createElement('a');
  a.href = url;
  const res = {
    hostname: a.hostname,
    path: a.pathname,
    protocol: a.protocol.replace(':', ''),
    query: a.search.replace('?' ,''),
  };
  a = null;
  return res;
}

export const arrayBuf2string = (buf: any) => {
  const enc = new TextDecoder('utf-8');

  return enc.decode(buf);
}

export const parseQueryString = (query: string) => {
  const vars = query.split("&");
  const queryString: any = {};
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    const key = decodeURIComponent(pair[0]);
    if (!key) {
      continue;
    }
    const value = decodeURIComponent(pair[1]);
    if (typeof queryString[key] === "undefined") {
      queryString[key] = decodeURIComponent(value);
    } else if (typeof queryString[key] === "string") {
      const arr = [queryString[key], decodeURIComponent(value)];
      queryString[key] = arr;
    } else {
      queryString[key].push(decodeURIComponent(value));
    }
  }
  return queryString;
}

export const parseRequest = (req: any) => {
  const { hostname, path, protocol, query } = parseURL(req.url);
  const params = parseQueryString(query);

  return Object.assign(req, {
    host: hostname,
    path,
    protocol,
    requestParams: params,
  });
};
