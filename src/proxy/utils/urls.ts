const url = require('url');

export function getUrlParams(urlString: string) {
  const params = {};
  const parsedUrl = url.parse(urlString, true);
  const query = parsedUrl.query;
  for (const key in query) {
    if (Object.hasOwn(query, key)) {
      params[key] = query[key];
    }
  }
  return params;
}
