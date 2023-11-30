import React, { useEffect, useState } from 'react';
import { GUIDE_QA_SAFARI_NO_DEBUG, GUIDE_QA_SAFARI_NO_DEBUG_TIPS } from '../../../utils/constant';
import useWerine from '../../hooks/useWeinre';
import { Button } from '../UI';
import Icon from '../../components/Icon';
import './index.scss';
import { copyText } from '../../modules/copy';

const EmptyTips = () => {
  const txt = `\t{
    url: 'm.v.qq.com/tvp/$',
    debug: true
  }`;
  return (
    <div className="empty-sockets">
      <div className="title">没有调试页面建立连接</div>
      <div className="subTitle">（示例）设置页面代理规则：</div>
      <pre className="prettyprint lang-json linenums">
        <code>{txt}</code>
      </pre>
      <div className="subTitle">或者手动在页面插入如下脚本：</div>
      <pre
        onClick={(e: any) => copyText(e, e.currentTarget.innerText)}
        className="copyHTML prettyprint lang-html linenums"
        style={{ padding: 10 }}
      >
        &lt;script src="https://www.bproxy.dev/static/dist/inspect.iife.js"&gt;&lt;/script&gt;
      </pre>
      <div className="flexCenter helpTips">
        <a href={GUIDE_QA_SAFARI_NO_DEBUG} target="_blank;" className="flexCenter">
          <Icon type="help" />
          {GUIDE_QA_SAFARI_NO_DEBUG_TIPS}
        </a>
      </div>
    </div>
  );
};

const HighlightUA = ({ ua }: any) => {
  const regx = /(windows|mac\sos|Mobile|iPhone|iPad|Android|douyu)/gi;
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: ua.replace(regx, (a, b) => {
          return ` <span style="color: #fff;background: red;border-radius: 5px;padding: 2px 4px;">${a}</span>`;
        }),
      }}
    />
  );

  // return ua;
};

const IconImage = ({ src }) => {
  const [url, setUrl] = useState<string>(src);
  const onError = () => {
    setUrl('');
  };

  useEffect(() => {
    setUrl(src);
  }, [src]);

  return <img src={url} alt="" onError={onError} />;
};

export default () => {
  const { clients } = useWerine();
  const openNewPage = (id: string) => {
    const url = `http://localhost:8888/static/chrome-dev-tools/?ws=127.0.0.1:8888/client/inspect?target=${id}`;
    window.open(url);
  };

  return (
    <div className="dialog-page-debug">
      {Object.keys(clients).length === 0 ? <EmptyTips /> : null}
      <ul>
        {Object.keys(clients).map((id: string) => (
          <li key={id}>
            <div className="dialog-page-debug-group">
              <div className="img">
                <IconImage src={clients[id]?.favicon} />
              </div>
              <div className="content">
                <div className="contentTitle">{clients[id].title}</div>
                <div className="contentUrl">{clients[id].url}</div>
              </div>
              <Button shape="round" type="primary" onClick={openNewPage.bind(null, id)}>
                调试
              </Button>
            </div>
            <div className="ua">
              <HighlightUA ua={clients[id].ua} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
