/*
 * @Date: 2022-06-24 21:36:22
 * @LastEditors: 张恒 nodejs.js@gmail.com
 * @LastEditTime: 2022-08-15 15:45:02
 * @FilePath: /bp/src/web/components/ConfigEditor/index.tsx
 */
import React, { useCallback, useEffect, useState } from 'react';
import { getConfigContent, setConfigContent } from '../../modules/bridge';
import { onConfigFileChange } from '../../modules/socket';
import { highlight } from '../../modules/util';
import { Button, message } from '../UI';
import { example } from './example';
import './index.scss';

export default (props) => {
  const [code, setCode] = useState<string>('');
  const loadConfig = () => getConfigContent().then(rs => {
    setCode(rs as string);
  });
  useEffect(() => {
    loadConfig();
    onConfigFileChange(loadConfig);
  }, []);
  const onSave = useCallback(() => {
    setConfigContent(code).then(rs => {
      if (rs && props.onCancel) {
        message.success('配置文件修改成功');
        setTimeout(() => props.onCancel(), 300);
      }
    });
  }, [code]);
  const onInput = ({target}) => {
    setCode(target.value);
  };

  useEffect(() => {
    const onPressSave = (e) => {
      const ctrl = e.metaKey || e.ctrlKey;
      const isCtrlAndS = ctrl && e.keyCode === 83;
      if (isCtrlAndS) {
        onSave();

        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
    document.body.addEventListener('keydown', onPressSave);
    highlight();

    return () => {
      document.body.removeEventListener('keydown', onPressSave);
    }
  }, [onSave]);

  return <div className='dialog-logs'>
    <div className="config-wrap">
      <div className="left">
        <textarea className="scrollbar-style" value={code} onInput={onInput}></textarea>
      </div>
      <div className="right">
        <h2>配置文件示例：</h2>
          <code>
            <pre className="prettyprint lang-js">{example}</pre>
          </code>
      </div>
    </div>
    <Button className="save-btn" onClick={onSave} type="primary" shape="round">保存</Button>
  </div>
};
