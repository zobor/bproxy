import { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { remoteInvoke } from '../../modules/socket';
import { Button, message } from '../UI';
import { logs$ } from './watchLogs';
import { isObject } from '../../../proxy/utils/is';


import './index.scss';
import { shorthand } from '../../modules/util';
import { history$, onHistoryChange } from './watchHistory';

const isBaseJsDataType = (obj) => {
  return (
    typeof obj === 'number' ||
    typeof obj === 'string' ||
    typeof obj === 'boolean'
  );
};

const isBaseJavaScriptType = (obj: any) => ['string', 'number', 'boolean'].includes(typeof obj);

export default () => {
  const [code, setCode] = useState<string>('document.URL');
  const [logs, setLogs] = useState<string[]>([]);
  const [historyCode, setHistoryCode] = useState<string[]>([]);

  const onSave = useCallback(() => {
    remoteInvoke(code)
      .then((rs: any) => {
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
        } catch (err) {}
      })
      .catch((error: any) => {
        message.error(error?.message);
      });
    onHistoryChange(code);
  }, [code]);
  const onClear = () => {
    setLogs([]);
  };

  useEffect(() => {
    const logSubscribe = logs$.subscribe((data: any) => {
      setLogs((pre) => [...pre, data]);
    });

    const historySubscribe = history$.subscribe((data: string) => {
      setHistoryCode((pre) => {
        if (!pre.includes(data)) {
          return [...pre, data];
        }
        return pre;
      });
    });

    return () => {
      logSubscribe.unsubscribe();
      historySubscribe.unsubscribe();
    };
  }, []);
  
  return (
    <div className="dialog-code-runner">
      <div className="editor-box">
        <CodeMirror
          value={code}
          theme="dark"
          extensions={[javascript()]}
          onChange={(value, viewUpdate) => {
            setCode(value);
          }}
        />
        <Button onClick={onSave} type="primary" shape="round">
          执行
        </Button>
        <Button onClick={onClear} type="primary" shape="round">
          Clear
        </Button>
        <div className="history">
          <ul>
            {
              historyCode.map(item => <li onClick={() => setCode(item)}>{shorthand(item, 40)}</li>)
            }
          </ul>
        </div>
      </div>
      <div className="logs scrollbar-style">
        <ul>
          {logs.map((log: any) => {
            const isObj = isObject(log) && log.time && log.type;

            if (isObj) {
              return <li className={classNames({[log.type]: true})}>
                <span className="time">{moment(log.time).format('HH:mm:ss.SSS')}</span>
                <span> - </span>
                {isBaseJavaScriptType(log.data) ? log.data : JSON.stringify(log.data)}</li>
            }

            return <li>{log || '空'}</li>
          })}
        </ul>
      </div>
    </div>
  );
};
