import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from '@uiw/react-codemirror';
import { useCallback, useEffect, useState } from 'react';
import { getConfigContent, getConfigFilePath, setConfigContent } from '../../modules/bridge';
import { onConfigFileChange } from '../../modules/socket';
import { highlight } from '../../modules/util';
import { Button, message } from '../UI';
import { example } from './example';
import './index.scss';


export default (props) => {
  const [code, setCode] = useState<string>('');
  const [configFilePath, setConfigFilePath] = useState<string>('');
  const loadConfig = () => getConfigContent().then(rs => {
    setCode(rs as string);
  });
  const getConfigPath = () => {
    getConfigFilePath().then((rs) => {
      setConfigFilePath(rs as string);
    });
  };
  useEffect(() => {
    loadConfig();
    onConfigFileChange(loadConfig);
    getConfigPath();
  }, []);
  const onSave = useCallback(() => {
    setConfigContent(code).then(rs => {
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
    highlight();

    return () => {
      document.body.removeEventListener('keydown', onPressSave);
    }
  }, [onSave]);
  return <div className='dialog-logs'>
    <div className="config-path">
      配置文件地址：
      <span>{configFilePath}</span>
    </div>
    <div className="config-wrap">
      <div className="left">
        <CodeMirror
          value={code}
          theme="dark"
          extensions={[javascript()]}
          autoFocus
          onChange={(value, viewUpdate) => {
            setCode(value);
          }}
        />
      </div>
      <div className="right">
        <h2>配置文件示例：</h2>
          <code>
            <pre className="prettyprint lang-js">{example}</pre>
          </code>
      </div>
    </div>
    <Button onClick={onSave} type="primary" shape="round">保存</Button>
  </div>
};
