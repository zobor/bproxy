import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { getServerIp } from '../../modules/socket';

export default () => {
  const $canvas = useRef<HTMLCanvasElement>(null);
  const [href, setHref] = useState<string>('');
  const render = (txt: string) => {
    QRCode.toCanvas($canvas.current, txt, { width: 300});
  };

  useEffect(() => {
    // console.log(QRCode.toDataURL);
    getServerIp().then((list) => {
      const ips = Array.isArray(list) ? list : [];
      const [ip] = ips.filter((item: string) => item !== '127.0.0.1');
      if (ip) {
        const url = `http://${ip}:8888/install`;
        render(url);
        setHref(url);
      }
    });
  }, []);
  return <div style={{ textAlign: 'center' }}>
    <canvas ref={$canvas} />
    <div><a href={href}>点击下载证书</a></div>
  </div>
}
