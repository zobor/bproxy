import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

import { bridgeInvoke } from '../../modules/socket';
import './index.scss';
import { Card, Col, Row } from '../UI';

const help = `
MacOS 安装证书：
bproxy -i

`;

export default () => {
  const $canvas = useRef<HTMLCanvasElement>(null);
  const [href, setHref] = useState<string>('');
  const render = (txt: string) => {
    QRCode.toCanvas($canvas.current, txt, { width: 200});
  };

  useEffect(() => {
    bridgeInvoke({
      api: "getLocalProxyPort",
    }).then((port) => {
      bridgeInvoke({
        api: "getLocalIp",
      }).then((list) => {
        const ips = Array.isArray(list) ? list : [];
        const [ip] = ips.filter((item: string) => item !== "127.0.0.1");
        if (ip) {
          const url = `http://${ip}:${port}/install`;
          render(url);
          setHref(url);
        }
      });
    });
  }, []);
  return <div className="install-modal">
    <Row gutter={16}>
      <Col span={8}>
        <Card title="手机扫码安装证书" bordered={false}>
          <div className="tip-text">请保持手机跟PC在一个局域网内</div>
          <canvas ref={$canvas} />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="PC下载证书" bordered={false}>
          {href ? <div className="url">{href}</div> : null}
          {href ? <div><a href={href}>点击下载证书</a></div> : null}
        </Card>
      </Col>
      <Col span={8}>
        <Card title="MacOS安装证书" bordered={false}>
          <pre><code>{help}</code></pre>
        </Card>
      </Col>
    </Row>
  </div>
}
