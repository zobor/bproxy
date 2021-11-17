export function getFileTypeFromSuffix(filepath) {
  const ma = /\w+\.(\w+)$/g.exec(filepath)
  if (ma && ma.length === 2) {
    return ma[1].toLocaleLowerCase();
  }
  return '';
}

export function getResponseContentType(suffix) {
  const mp = {
    'js': 'text/javascript; charset=UTF-8',
    'json': 'application/json; charset=UTF-8',
    'css': 'text/css; charset=utf-8',
    'svg': 'image/svg+xml',
    'png': 'image/png',
    'jpg': 'image/jpg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'avif': 'image/ivaf',
    'webp': 'image/webp',
    'bmp': 'image/bmp',
    'mp4': 'video/mp4',
    'mp3': 'audio/mp3',
    'ttf': 'font/ttf',
    'woff2': 'font/woff2',
  };

  return mp[suffix];
}
