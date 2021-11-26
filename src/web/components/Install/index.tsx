import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { bridgeInvoke } from '../../modules/socket';
import './index.scss';

const help = `
MacOS 安装证书：
bproxy -i

`;

export default () => {
  const $canvas = useRef<HTMLCanvasElement>(null);
  const [href, setHref] = useState<string>('');
  const render = (txt: string) => {
    QRCode.toCanvas($canvas.current, txt, { width: 300});
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
    <h2>手机扫码，可以安装证书</h2>
    <div className="tip-text">请保持手机跟PC在一个局域网内</div>
    <div className="url">{href}</div>
    <canvas ref={$canvas} />
    <pre><code>{help}</code></pre>
    <div><a href={href}>点击下载证书</a></div>
  </div>
}
