import copy from 'copy-to-clipboard';
import { message } from '../components/UI';

// 点击复制文本
export const copyText = (e, text) => {
  copy(text);
  message.success('已复制');
};
