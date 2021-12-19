import { useCallback, useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { remoteInvoke } from '../../modules/socket';
import { Button } from '../UI';

export default (props) => {
  const [code, setCode] = useState<string>('document.URL');

  useEffect(() => {

  }, []);
  const onSave = useCallback(() => {
    remoteInvoke(code).then(rs => {
      console.log(rs);
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
