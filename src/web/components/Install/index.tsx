import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Button, Card, Col, Row } from '../UI';
import { getLocalIP, getProxyPort } from '../../modules/bridge';

import './index.scss';

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
    getProxyPort().then((port) => {
      getLocalIP().then((list) => {
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
        <Card title="Windows电脑端下载证书" bordered={false}>
          {href ? <div className="url">{href}</div> : null}
          {href ? <div><Button type="primary" shape="round" onClick={() => window.open(href)}>下载证书</Button></div> : null}
        </Card>
      </Col>
      <Col span={8}>
        <Card title="手机端安装证书" bordered={false}>
          <div className="tip-text">请保持手机跟电脑在一个局域网内</div>
          <canvas ref={$canvas} />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="MacOS端安装证书" bordered={false}>
          <pre><code>{help}</code></pre>
        </Card>
      </Col>
    </Row>
  </div>
}
