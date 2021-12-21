import { useCallback, useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { remoteInvoke } from '../../modules/socket';
import { Button, message } from '../UI';
import './index.scss';

const isBaseJsDataType = (obj) => {
  return typeof obj === 'number' || typeof obj === 'string' || typeof obj === 'boolean';
}

export default () => {
  const [code, setCode] = useState<string>('document.URL');
  const [logs, setLogs] = useState<string[]>([]);

  const onSave = useCallback(() => {
    remoteInvoke(code).then((rs: any) => {
      console.log(rs);
      let newValue = '';
      try {
        if (isBaseJsDataType(rs)) {
          newValue = rs.toString();
        } else {
          newValue = JSON.stringify(rs);
        }
        setLogs((pre) => {
          return [...pre, newValue];
        });
      } catch(err) {}
    }).catch((error: any) => {
      message.error(error?.message);
    });
  }, [code]);
  const onClear = () => {
    setLogs([]);
  };
  return <div className='dialog-code-runner'>
    <CodeMirror
      value={code}
      theme="dark"
      extensions={[javascript()]}
      onChange={(value, viewUpdate) => {
        setCode(value);
      }}
    />
    <Button onClick={onSave} type="primary" shape="round">执行</Button>
    <Button onClick={onClear} type="primary" shape="round">Clear</Button>
    <ul className="logs">
      {logs.map(log => <li key={log}>{log}</li>)}
    </ul>
  </div>
};
