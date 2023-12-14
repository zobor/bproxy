import { message } from '../components/UI';

export const copy = (text: string) => {
  const invokeCopy = (textToCopy: string) => {
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = textToCopy;
    tempTextArea.style.cssText = `position: absolute; top: -9999px; left: -9999px;`;
    document.body.appendChild(tempTextArea);

    tempTextArea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextArea);
  }
  invokeCopy(text);
};

// 点击复制文本
export const copyText = (e, text) => {
  copy(text);
  message.success('已复制');
};
