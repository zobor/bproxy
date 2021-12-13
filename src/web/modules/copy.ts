const win: any = window;
export default (target, text) => {
  target.addEventListener('copy', (e) => {
    e.preventDefault();
    if (e.clipboardData) {
      e.clipboardData.setData('text/plain', text);
    } else if (win.clipboardData) {
      win.clipboardData.setData('Text', text);
    }
  });
  document.execCommand('copy');
};
