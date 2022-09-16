import React, { useEffect, useState } from 'react';
import defaultIcon from '../../assets/icon-image.svg';
import useWerine from '../../hooks/useWeinre';
import { getDebugTargets } from '../../modules/bridge';
import { onDebuggerClientChange, onDebuggerClientChangeUnmount } from '../../modules/socket';
import { highlight } from '../../modules/util';
import { Button } from '../UI';
import './index.scss';

const EmptyTips = () => {
  const txt = `\t{
    url: 'm.v.qq.com/tvp/$',
    debug: true
  }`;
  useEffect(() => {
    highlight();
  }, []);
  return (<div className="empty-sockets">
    <div className="title">没有调试页面建立连接</div>
    <div>（示例）设置页面代理规则：</div>
      <pre className="prettyprint lang-json">
        <code>{txt}</code>
      </pre>
  </div>);
};

const IconImage = ({ src }) => {
  const [url, setUrl] = useState<string>(src);
  const onError = () => {
    setUrl(defaultIcon);
  };

  useEffect(() => {
    setUrl(src);
  }, [src]);

  return <img src={url} alt="" onError={onError} />
};

export default () => {
  const { clients } = useWerine();
  const openNewPage = (id: string) => {
    const url = `http://localhost:8888/chrome-dev-tools/?ws=127.0.0.1:8888/client/inspect?target=${id}`;
    window.open(url);
  };


  return <div className="dialog-page-debug">
    {Object.keys(clients).length === 0 ? <EmptyTips /> : null}
    <ul>
    {Object.keys(clients).map((id: string) => <li key={id}>
      <div className="dialog-page-debug-group">
        <div className="img">
          <IconImage src={clients[id]?.favicon} />
        </div>
        <div className="content">
          <div className="contentTitle">{clients[id].title}</div>
          <div className="contentUrl">{clients[id].url}</div>
        </div>
        <Button shape="round" type="primary" onClick={openNewPage.bind(null, id)}>调试</Button>
      </div>
      <div className="ua">{clients[id].ua}</div>
    </li>)}
    </ul>
  </div>
};
