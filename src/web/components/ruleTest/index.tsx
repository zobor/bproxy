import { useState } from 'react';
import Input from 'antd/es/input';
import { bridgeInvoke } from '../../modules/socket';
import JSONFormat from '../../libs/jsonFormat';
import 'antd/es/input/style/css';
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
      try {
        setResult(JSONFormat(rs, null, 2, 100));
      } catch(err) {}
    }
  };

  return <div className="test-page">
    <h2>检测目标URL是否跟你的rule匹配</h2>
    <Input placeholder="请输入要检测的URL地址，按回车确认" onKeyDown={onEnterPress} />
    {result ? <pre><code>{result}</code></pre> : null}
  </div>
}
