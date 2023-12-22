import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getConfigContent, setConfigContent } from '../../modules/bridge';
import { onConfigFileChange } from '../../modules/socket';
import { Button, message } from '../UI';
import Editor from './editor';
import EditorToolbar from './EditorToolbar';
import Example from './example';
import './index.scss';

export default (props) => {
  const [code, setCode] = useState<string>('');
  const loadConfig = () =>
    getConfigContent().then((rs) => {
      setCode(rs as string);
    });

  const $getValue = useRef<any>(null);
  useEffect(() => {
    loadConfig();
    onConfigFileChange(loadConfig);
  }, []);
  const onSave = useCallback(() => {
    const v = $getValue.current();
    setConfigContent(v).then((rs) => {
      if (rs && props.onCancel) {
        message.warn('配置文件已修改');
        setTimeout(() => props.onCancel(), 300);
      }
    });
  }, []);

  useEffect(() => {
    const onPressSave = (e) => {
      const ctrl = e.metaKey || e.ctrlKey;
      // command + s
      const isCtrlAndS = ctrl && e.keyCode === 83;
      if (isCtrlAndS) {
        onSave();

        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };
    document.body.addEventListener('keydown', onPressSave);

    return () => {
      document.body.removeEventListener('keydown', onPressSave);
    };
  }, [onSave]);

  return (
    <div className="dialog-editor">
      <div className="config-wrap">
        <div className="left">
          <Editor ref={$getValue} code={code} />
          <EditorToolbar />
        </div>
        <div className="right">
          <h2>配置文件示例</h2>
          <Example />
        </div>
      </div>
      <Button className="save-btn" onClick={onSave} type="primary" shape="round">
        保存
      </Button>
    </div>
  );
};
