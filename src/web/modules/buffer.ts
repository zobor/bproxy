import * as pako from 'pako';
import { BrotliDecode } from '../modules/brDecode';

export function isBuffer<T>(v: T): boolean {
  return Object.prototype.toString.call(v) === '[object Uint8Array]' || Object.prototype.toString.call(v) === '[object ArrayBuffer]';
}

export function bytesToString(bytes: any): string{
  return String.fromCharCode.apply(null, new Int32Array(bytes) as any);
}

export function stringToBytes(str: string): Int8Array {
  const out = new Int8Array(str.length);
  for (let i = 0; i < str.length; ++i) out[i] = str.charCodeAt(i);

  return out;
}

export function textDecode(buf: Buffer): string{
  const decode = new TextDecoder();

  return decode.decode(buf);
}

export function buffer2string(buffer: Buffer, encoding: string): string{
  if (!isBuffer(buffer)) {
    return '';
  }
  let data = '';
  try {
    if (encoding?.includes('gzip')) {
      data = pako.ungzip(new Uint8Array(buffer), {to: "string"});
    } else if (encoding === 'br') {
      const u8 = BrotliDecode(new Uint8Array(buffer));
      data = textDecode(u8);
    } else {
      data = String.fromCharCode.apply(null, new Uint8Array(buffer) as any);
    }
  } catch(err) {
    console.error('[error]buffer2string:', err);
  }

  return data;
};

