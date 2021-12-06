import { useState } from 'react';

import { bridgeInvoke } from '../../modules/socket';
import JSONFormat from '../../libs/jsonFormat';
import { Input } from '../UI';
import './index.scss';

const invoke = async(url: string) => {
  const rs = await bridgeInvoke({
    api: 'test',
    params: url,
  });
  return rs;
}

export default () => {
  const [result, setResult] = useState('');
  const onEnterPress = async(e: any) => {
    if(e.keyCode === 13 && e.target.value) {
      const rs = await invoke(e.target.value.trim());
      console.log(rs);
      try {
        setResult(JSONFormat(rs));
      } catch(err) {}
    }
  };

  return <div className="test-page">
    <Input placeholder="请输入要检测的URL地址，按回车确认" onKeyDown={onEnterPress} />
    {result ? <pre><code>{result}</code></pre> : null}
  </div>
}
