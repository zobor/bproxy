import React, { useEffect, useRef, useState } from 'react';
import { getClipboardData } from '../../modules/interactive';
import './index.scss';

const defaultTxt = '剪切板内容监听中...';

export default function SyncClipboard() {
  const [txt, setTxt] = useState(defaultTxt);
  const $history = useRef('');
  const getData = () => {
    getClipboardData()
      .then(async (rs) => {
        if (typeof rs === 'string' && $history.current !== rs) {
          $history.current = rs;
          const result = await (
            await fetch('https://www.bproxy.dev/api/syncClipboard', {
              method: 'post',
              body: JSON.stringify({
                type: 'syncClipboard',
                payload: rs,
              }),
            })
          ).json();

          if (result?.error === 0) {
            setTxt('内容发送成功!');
            setTimeout(() => {
              setTxt(defaultTxt);
            }, 2000);
          }
        }
      })
      .catch((err) => {
        // console.error(err);
      });
  };
  useEffect(() => {
    setInterval(() => {
      getData();
    }, 1000);
    getData();
  }, []);
  return (
    <div className="SyncClipboard">
      <h1 className="showText" tabIndex={1} onClick={getData}>
        {txt}
      </h1>
      <div>点击上一行，保持绿色说明功能正常</div>
      <div>请允许当前页面获取剪切板的内容，否则功能不可用</div>
    </div>
  );
}
