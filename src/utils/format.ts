import { isPlainObject } from 'lodash';

export const formatSeconds = (sec: number): string => {
  if (sec > 1000) {
    return (sec / 1000).toFixed(1) + 's';
  }

  return `${sec}ms`;
};

export function parseFormData(str) {
  if (isPlainObject(str)) {
    return Object.keys(str).map((label) => [label, str[label]]);
  }
  const arr = str
    .replace(/\r/g, '')
    .split(/-{10,}\w+/)
    .map((item: any) =>
      item
        .split('; ')
        .filter((item: string) => !!item.replace(/\n+/g, ''))
        .map((item: string) => item.split(/\n+/).filter((item) => item.length)),
    )
    .filter((item: any) => item.length);

  const formItems: any[] = [];
  arr.forEach((item: any[]) => {
    if (item.length === 2) {
      const [key, value] = item[1];
      const label = key.replace(/name="([^"]+)"/, '$1');
      formItems.push([label, value]);
    } else if (item.length >= 3) {
      const [key] = item[1];
      const label = key.replace(/name="([^"]+)"/, '$1');
      formItems.push([label, '二进制文件']);
    }
  });

  return formItems;
}

export function parseJsonData(str: string) {
  const data: any[] = [];
  str.split('&').forEach((item) => {
    const arr = item.split('=');
    if (arr.length === 2) {
      data.push(arr);
    }
  });

  return data;
}

// https://shark2.douyucdn.cn/front-publish/live-peace-handbook-master/assets/index.bbf9bd48.css
// 格式化URL里面的文件名部分： index.bbf9bd48.css
export function formatUrlPathOfFileName(str: string) {
  if (!str || typeof str !== 'string') {
    return [];
  }
  const list = str.split('/');
  const filename = list.pop();

  const parts = [list.join('/') + '/', filename];

  return parts;
}

export function dayjs(dateValue) {
  const date = new Date(dateValue);

  const format = function (formatString) {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');
    const millisecond = date.getMilliseconds().toString().padStart(3, '0');
    const formatMap = {
      YYYY: year,
      YY: year.slice(-2),
      MM: month,
      M: parseInt(month).toString(),
      DD: day,
      D: parseInt(day).toString(),
      HH: hour,
      H: parseInt(hour).toString(),
      mm: minute,
      m: parseInt(minute).toString(),
      ss: second,
      s: parseInt(second).toString(),
      SSS: millisecond,
      A: +hour >= 12 ? 'PM' : 'AM', // 12小时制
    };
    const regex = Object.keys(formatMap).join('|');
    return formatString.replace(new RegExp(regex, 'g'), function (matched) {
      return formatMap[matched] || matched;
    });
  };

  return {
    format: format,
  };
}
