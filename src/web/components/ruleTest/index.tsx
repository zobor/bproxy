import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { bridgeInvoke } from '../../modules/socket';
import JSONFormat from '../../libs/jsonFormat';
import { Input, Modal } from '../UI';
import './index.scss';
import { getClipboardData, setInputValue } from '../../modules/util';
import { isString } from '../../modules/_';

const invoke = async(url: string) => {
  const rs = await bridgeInvoke({
    api: 'test',
    params: url,
  });
  return rs;
}

export default () => {
  const [result, setResult] = useState('');
  const $input = useRef<any>(null);
  const onEnterPress = async(e: any) => {
    if(e.keyCode === 13 && e.target.value) {
      const rs = await invoke(e.target.value.trim());
      try {
        setResult(JSONFormat(rs));
      } catch(err) {}
    }
  };

  useEffect(() => {
    getClipboardData().then(rs => {
      if (isString(rs) && rs.indexOf('http') === 0) {
        Modal.confirm({
          title: '我猜，你是不是要粘贴剪切板里的URL？',
          content: `URL: ${rs}`,
          width: 600,
          onOk() {
            if ($input.current) {
              setInputValue($input.current.input, rs);
            }
          }
        });
      }
    });
  }, []);

  return <div className="test-page">
    <Input ref={$input} placeholder="请输入要检测的URL地址，按回车确认" onKeyDown={onEnterPress} />
    {result ? <pre className={classNames({
      'scrollbar-style': true,
      matched: /"matched":\strue/.test(result),
    })}><code>{result}</code></pre> : null}
  </div>
}
function userRef(arg0: null) {
  throw new Error('Function not implemented.');
}

