import React, { useEffect, useRef, useState } from 'react';
import ReactJson from 'react-json-view';
import { IS_REG_URL } from '../../../utils/constant';
import { ruleTestInvoke } from '../../modules/bridge';
import { getClipboardData, setInputValue } from '../../modules/interactive';
import { isString } from '../../modules/lodash';
import { Input, message } from '../UI';
import './index.scss';
import pageConfig from '../../pageConfig';

export default () => {
  const [result, setResult] = useState({});
  const $input = useRef<any>(null);
  const onEnterPress = async (e: any) => {
    if (e.keyCode === 13 && e.target.value) {
      const v = e.target.value.trim();
      if (!IS_REG_URL.test(v)) {
        message.warn('请输入有效的url地址');
        return;
      }
      const rs: any = await ruleTestInvoke(v);
      try {
        setResult(rs);
      } catch (err) {}
    }
  };

  useEffect(() => {
    getClipboardData()
      .then((rs) => {
        if (isString(rs) && rs.indexOf('http') === 0 && $input.current) {
          setInputValue($input.current.input, rs);
          onEnterPress({ keyCode: 13, target: { value: rs } });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    $input.current?.input?.focus();
  }, []);

  return (
    <div className="test-page">
      <Input ref={$input} placeholder="请输入要检测的URL地址，按回车确认" onKeyDown={onEnterPress} />
      {result ? <ReactJson src={result} {...(pageConfig as any)} /> : null}
    </div>
  );
};
