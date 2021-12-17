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
        setTimeout(() => props.onCancel(), 1000);
      }
    });
  }, [code]);
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
