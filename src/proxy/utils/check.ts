export const isLikeJson = (str) => {
  if (typeof str === 'string') {
    return /^\{[\S\s]+\}$/.test(str.trim()) || /^\[[\S\s]+\]$/.test(str.trim());
  }

  return false;
};
