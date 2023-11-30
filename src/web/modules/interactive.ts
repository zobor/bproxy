const win: any = window;

export const getClipboardData = () => {
  return new Promise((resolve, reject) => {
    navigator.clipboard
      ?.readText()
      .then((text) => {
        resolve(text);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const setInputValue = (el, value) => {
  (Object as any).getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, value);
  el.dispatchEvent(new Event('input', { bubbles: true }));
};

export const openUrl = (url: string): void => {
  window.open(url);
};
