import React, { useEffect, useState } from 'react';
import { Modal } from '../../components/UI/index';
import { UseSubject } from '../../hooks/useSubject';
import './index.scss';

export default function Shortcuts() {
  const [visible, setVisible] = useState<boolean>(false);
  const rx$ = UseSubject();

  useEffect(() => {
    const s$ = rx$.subscribe((e) => {
      if (e?.type === 'on-show-shortcut') {
        setVisible(true);
      }
    });

    return () => {
      s$.unsubscribe();
    };
  }, [rx$]);

  return (
    <Modal footer={null} visible={visible} width="90%" title="bproxy 快捷键" onCancel={() => setVisible(false)}>
      <ul className="shortcut-list">
        <li>
          <div>关闭弹窗</div>
          <div>ESC</div>
        </li>

        <li>
          <div>清空请求列表</div>
          <div>Option + X</div>
        </li>

        <li>
          <div>响应内容搜索</div>
          <div>/</div>
        </li>

        <li>
          <div>格式化配置</div>
          <div>Command + shift + F</div>
        </li>
      </ul>
    </Modal>
  );
}
