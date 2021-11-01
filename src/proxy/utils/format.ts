export const formatSeconds = (sec: number): string => {
  if (sec > 1000) {
    return (sec / 1000).toFixed(1) + 's';
  }

  return `${sec}ms`;
};
