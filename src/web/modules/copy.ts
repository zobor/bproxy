const win: any = window;
export default (target, text) => {
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
