import query from 'licia/query';
import Socket from 'licia/Socket';
import chobitsu from 'chobitsu';

function rand(min: number, max: number) {
    return parseInt(`${Math.random() * (max - min + 1) + min}`, 10);
};
function randomId(len = 12) {
    const base = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const max = base.length - 1;
    return Array(len).fill(0).map((_, idx) => base[rand(idx === 0 ? 10 : 0, max)]).join('');
};

function fullUrl(href: string) {
  const link = document.createElement('a');
  link.href = href;

  return link.protocol + '//' + link.host + link.pathname + link.search + link.hash;
}

function getFavicon() {
  let favicon = location.origin + '/favicon.ico';

  const $link = Array.from(document.querySelectorAll('link'));
  $link.map(function (item: HTMLElement) {
    if (item.getAttribute('rel')?.includes('icon')) {
      const href = item.getAttribute('href');
      if (href) favicon = fullUrl(href);
    }
  });

  return favicon;
}

// 初始化
const storeKey = 'bproxy-pageid-key';
const ua = navigator.userAgent.toLowerCase();
const isChrome = ua.includes('chrome/');
const ip = (window as any).BPROXY_SERVER_IP;
const wsServer = ip && window.location.protocol === 'http:' && !isChrome ? `ws://${ip}:8888` : 'wss://bproxy.io';

let isInit = false;
let id = localStorage.getItem(storeKey);
if (!id) {
  id = randomId(8);
  localStorage.setItem(storeKey, id);
}

const ws = new Socket(
  `${wsServer}/target/${id}?${query.stringify({
    url: location.href,
    title: document.title,
    favicon: getFavicon(),
    ua: navigator.userAgent,
  })}`
);

ws.on('open', () => {
  isInit = true;
  ws.on('message', event => {
    chobitsu.sendRawMessage(event.data);
  });
});

chobitsu.setOnMessage((message: string) => {
  if (!isInit) return;
  ws.send(message);
});
