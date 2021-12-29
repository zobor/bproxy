import { useCallback, useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import './index.scss';
import { bridgeInvoke, onConfigFileChange } from '../../modules/socket';
import { Button, message } from '../UI';

export default (props) => {
  const [code, setCode] = useState<string>('');
  const loadConfig = () => bridgeInvoke({
    api: 'getConfigFileContent',
  }).then(rs => {
    setCode(rs as string);
  });
  useEffect(() => {
    loadConfig();
    onConfigFileChange(loadConfig);
  }, []);
  const onSave = useCallback(() => {
    bridgeInvoke({
      api: 'setConfigFileContent',
      params: {
        data: code,
      },
    }).then(rs => {
      if (rs && props.onCancel) {
        message.success('配置文件修改成功');
        setTimeout(() => props.onCancel(), 300);
      }
    });
  }, [code]);

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

    return () => {
      document.body.removeEventListener('keydown', onPressSave);
    }
  }, [onSave]);
  return <div className='dialog-logs'>
    <CodeMirror
      value={code}
      theme="dark"
      extensions={[javascript()]}
      onChange={(value, viewUpdate) => {
        setCode(value);
      }}
    />
    <Button onClick={onSave} type="primary" shape="round">保存</Button>
  </div>
};
