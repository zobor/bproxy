export const isLikeJson = (str) => {
  if (typeof str === 'string') {
    return /^\{[\S\s]+\}$/.test(str.trim()) || /^\[[\S\s]+\]$/.test(str.trim());
  }

  return false;
};

export function getFileTypeFromSuffix(filepath: string) {
  const ma = /[^\/^\\^.]+\.(\w+)$/gi.exec(filepath);
  if (ma && ma.length >= 2) {
    return ma[1].toLocaleLowerCase();
  }
  return '';
}

export function getResponseContentType(suffix: string) {
  const mp = {
    js: 'text/javascript; charset=UTF-8',
    json: 'application/json; charset=UTF-8',
    css: 'text/css; charset=utf-8',
    scss: 'text/css; charset=utf-8',
    svg: 'image/svg+xml',
    png: 'image/png',
    jpg: 'image/jpg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    avif: 'image/ivaf',
    webp: 'image/webp',
    bmp: 'image/bmp',
    mp4: 'video/mp4',
    mp3: 'audio/mp3',
    ttf: 'font/ttf',
    woff2: 'font/woff2',
  };

  return mp[suffix];
}

export const isHttpsHostRegMatch = (httpsList, hostname): boolean => {
  let rs;
  for (let i = 0, len = httpsList.length; i < len; i++) {
    if (rs) {
      break;
    }
    const httpsItem = httpsList[i];
    if (typeof httpsItem === 'string') {
      rs = httpsItem === hostname;
    } else {
      rs = httpsItem.test(hostname.replace(':443'));
    }
  }
  return rs;
};
