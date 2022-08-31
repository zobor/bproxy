import { Readable } from 'stream';

export const responseText = (text: any, res) => {
  const s = new Readable();
  s.push(text);
  s.push(null);
  s.pipe(res);
};
