import { useState } from 'react';
import Input from 'antd/es/input';
import { testRule } from '../../modules/socket';
import JSONFormat from '../../libs/jsonFormat';
import 'antd/es/input/style/css';
import './index.scss';

const invoke = async(url: string) => {
  const rs = await testRule(url);
  return rs;
}

export default () => {
  const [result, setResult] = useState('');
  const onEnterPress = async(e: any) => {
    if(e.keyCode === 13 && e.target.value) {
      const rs = await invoke(e.target.value.trim());
      try {
        setResult(JSONFormat(rs, null, 2, 100));
      } catch(err) {}
    }
  };

  return <div className="test-page">
    <Input onKeyDown={onEnterPress} />
    <pre><code>{result}</code></pre>
  </div>
}
