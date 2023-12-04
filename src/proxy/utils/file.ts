import * as fs from 'fs';
import * as path from 'path';

// 判断是文件还是目录
export function checkStringIsFileOrPath(str: string, cwd?: string) {
  const fp = cwd ? path.resolve(cwd, str) : str;

  try {
    fs.accessSync(fp, fs.constants.R_OK);
  } catch (err) {
    return '';
  }

  const stat = fs.lstatSync(fp);

  if (stat.isFile()) {
    return 'file';
  }

  if (stat.isDirectory()) {
    return 'path';
  }

  return '';
}
