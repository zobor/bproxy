const win: any = window;

export const getClipboardData = () => {
  return new Promise((resolve, reject) => {
    navigator.clipboard
      .readText()
      .then((text) => {
        resolve(text);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const setInputValue = (el, value) => {
  (Object as any).getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(el, value);
  el.dispatchEvent(new Event('input', { bubbles: true }));
};

export const queryIpLocation = (ip: string) => {
  if (!ip) return;
  window.open(`https://www.ip138.com/iplookup.asp?ip=${ip}&action=2`);
};

export const openUrl = (url: string): void => {
  window.open(url);
};


export const copyTextOnClick = (target: HTMLElement, text: string) => {
  const copyText = (e) => {
    e.preventDefault();
    if (e.clipboardData) {
      e.clipboardData.setData('text/plain', text);
    } else if (win.clipboardData) {
      win.clipboardData.setData('Text', text);
    }
  };
  target.addEventListener('copy', copyText);
  document.execCommand('copy');
  target.removeEventListener('copy', copyText);
};
