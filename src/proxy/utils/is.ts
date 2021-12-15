export const isInspectContentType = (headers): boolean => {
  if (!headers || (!headers['content-type'] && !headers.accept)) {
    return false;
  }
  const contentType = headers['content-type'] || '';
  const { accept  ='' } = headers;

  return (
    contentType.includes("json") ||
    contentType.includes("x-www-form-urlencoded") ||
    contentType.includes("javascript") ||
    contentType.includes("text/") ||
    contentType.includes("xml") ||
    accept.includes("text/")
  );
};

export const isError = (v) => Object.prototype.toString.call(v) === '[object Error]';

export const isFunction = (v) => Object.prototype.toString.call(v) === '[object Function]';

export const isArray = (v) => Object.prototype.toString.call(v) === '[object Array]';

export const isFile = (v) => Object.prototype.toString.call(v) === '[object File]';

export const isObject = (v) => Object.prototype.toString.call(v) === '[object Object]';

export const isPlainObject = (v) => isObject(v) && Object.keys(v).length === 0;

export const isImage = (v) => Object.prototype.toString.call(v) === '[object HTMLImageElement]';

export const isRegExp = (v) => Object.prototype.toString.call(v) === '[object RegExp]';

export const isPromise = (v) => Object.prototype.toString.call(v) === '[object Promise]';
