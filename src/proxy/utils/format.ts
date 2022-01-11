export const formatSeconds = (sec: number): string => {
  if (sec > 1000) {
    return (sec / 1000).toFixed(1) + 's';
  }

  return `${sec}ms`;
};


export function parseFormData(str) {
  const arr = str.replace(/\r/g, '').split(/-{10,}\w+/).map((item) =>
    item
      .split('; ')
      .filter((item) => !!item.replace(/\n+/g, ''))
      .map((item) => item.split(/\n+/).filter((item) => item.length))
  ).filter(item => item.length);

  const formItems = {};
  arr.forEach(item => {
    if (item.length === 2) {
      const [key, value] = item[1];
      const label = key.replace(/name="([^"]+)"/, '$1');
      formItems[label] = value;
    } else if (item.length >= 3) {
      const [key] = item[1];
      const label = key.replace(/name="([^"]+)"/, '$1');
      formItems[label] = '二进制文件';
    }
  });

  return formItems;
}

export function parseJsonData(str) {
  const data = {};
  str.split('&').forEach(item => {
    const arr = item.split('=');
    if (arr.length === 2) {
      const [key, value] = arr;
      data[key] = value;
    }
  });

  return data;
}