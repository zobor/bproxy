export const parseURL = (url) => {
  let a: any = document.createElement('a');
  a.href = url;
  const res = {
    hostname: a.hostname,
    path: a.pathname,
    protocol: a.protocol.replace(':', ''),
    query: a.search.replace('?' ,''),
    origin: a.origin,
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
  try {
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split("=");
      const key = decodeURIComponent(pair[0]);
      if (!key && pair.length > 1) {
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
  } catch(err) {}
  return queryString;
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
