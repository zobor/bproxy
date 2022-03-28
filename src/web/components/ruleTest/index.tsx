import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import JSONFormat from '../../libs/jsonFormat';
import { ruleTestInvoke } from '../../modules/bridge';
import { getClipboardData, setInputValue } from '../../modules/interactive';
import { isString } from '../../modules/_';
import { Input, message } from '../UI';
import './index.scss';



export default () => {
  const [result, setResult] = useState('');
  const $input = useRef<any>(null);
  const onEnterPress = async (e: any) => {
    if (e.keyCode === 13 && e.target.value) {
      const v = e.target.value.trim();
      if (!/https?:\/\//.test(v)) {
        message.warn('请输入有效的url地址');
        return;
      }
      const rs = await ruleTestInvoke(v);
      try {
        setResult(JSONFormat(rs));
      } catch (err) {}
    }
  };

  useEffect(() => {
    getClipboardData().then((rs) => {
      if (isString(rs) && rs.indexOf('http') === 0 && $input.current) {
        setInputValue($input.current.input, rs);
        onEnterPress({keyCode: 13, target: { value: rs}});
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    $input.current?.input?.focus();
  }, []);

  return (
    <div className="test-page">
      <Input
        ref={$input}
        placeholder="请输入要检测的URL地址，按回车确认"
        onKeyDown={onEnterPress}
      />
      {result ? (
        <pre
          className={classNames({
            'scrollbar-style': true,
            matched: /"matched":\strue/.test(result),
          })}
        >
          <code>{result}</code>
        </pre>
      ) : null}
    </div>
  );
};
