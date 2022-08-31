// ver1 > ver2 => 1
// ver1 < ver2 => -1
// ver1 = ver2 => 0
export function checkVersion(version1: string, version2: string, config = { splitor: '.' }) {
  if (!version1 || !version2) {
    throw new Error('params error');
  }

  let ver1 = String(version1).split(config.splitor);
  let ver2 = String(version2).split(config.splitor);
  const len1 = ver1.length;
  const len2 = ver2.length;

  const longLen = len1 > len2 ? len1 : len2;

  if (len1 > len2) {
    const zeroArr = new Array(len1 - len2).fill(0);
    ver2 = [...ver2, ...zeroArr];
  } else {
    const zeroArr = new Array(len2 - len1).fill(0);
    ver1 = [...ver1, ...zeroArr];
  }

  // compare

  for (let index = 0; index < longLen; index++) {
    if (parseInt(ver1[index], 10) > parseInt(ver2[index], 10)) {
      return 1;
    }

    if (parseInt(ver1[index], 10) < parseInt(ver2[index], 10)) {
      return -1;
    }
  }

  return 0;
}
