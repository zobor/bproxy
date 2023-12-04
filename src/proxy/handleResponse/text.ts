import { Readable } from 'stream';

export const responseText = (text: any, res?: any) => {
  const s = new Readable();
  s.push(text);
  s.push(null);
  if (res) {
    s.pipe(res);
  }

  return s;
};
