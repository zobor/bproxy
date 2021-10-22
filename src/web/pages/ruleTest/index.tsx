import { useState } from 'react';
import { testRule } from '../../modules/socket';
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
        const jsonString = JSON.stringify(rs);
        setResult(jsonString);
      } catch(err) {}
    }
  };

  return <div className="test-page">
    <input type="text" onKeyDown={onEnterPress} />
    <pre><code>{result}</code></pre>
  </div>
}
