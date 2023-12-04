import { isString } from 'lodash';

export const guid = (len = 36) => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.slice(0, len).replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const uuid = (len = 12) => {
  return Buffer.from(guid()).toString('base64').replace(/[/=+]/g, '').slice(0, len);
};

export const isNeedTransformString2RegExp = (str: string) => {
  if (!str) return false;
  return /[.*^$()/?]/.test(str);
};

export const url2regx = (url: string): RegExp => {
  const newUrl = url
    .replace(/\./g, '\\.')
    .replace(/\//g, '/')
    .replace(/\\/g, '\\')
    .replace(/\?/g, '\\?')
    .replace(/\*{2,}/g, '(\\S+)')
    .replace(/\*/g, '([^\\/]+)');
  return new RegExp(newUrl);
};

export const getRegxLastMatchGroup = () => {
  return RegExp.lastParen;
};

export function stringToBytes(str: string): Int8Array {
  const out = new Int8Array(str.length);
  for (let i = 0; i < str.length; ++i) out[i] = str.charCodeAt(i);

  return out;
}

export function delay(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
}

export function safeDecodeUrl(url: string) {
  try {
    return decodeURIComponent(url);
  } catch (err) {
    return url;
  }
}

export function encodeUnicode(str) {
  const res: any = [];
  for (let i = 0; i < str.length; i++) {
    res[i] = ('00' + str.charCodeAt(i).toString(16)).slice(-4);
  }
  return '\\u' + res.join('\\u');
}

export function parseJSON(str: any) {
  if (isString(str)) {
    try {
      return JSON.parse(str);
    } catch (err) {
      return {};
    }
  }
  return {};
}
