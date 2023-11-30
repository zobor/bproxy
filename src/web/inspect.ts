import chobitsu from 'chobitsu';

function rand(min: number, max: number) {
  return parseInt(`${Math.random() * (max - min + 1) + min}`, 10);
}

function randomId(len = 12) {
  const base = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const max = base.length - 1;
  return Array(len)
    .fill(0)
    .map((_, idx) => base[rand(idx === 0 ? 10 : 0, max)])
    .join('');
}

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

function log(msg) {
  console.log(`%c [bproxy]: ${msg}`, 'background: #222; color: #bada55');
}

function diyInit() {
  setTimeout(() => {
    if (!isInit || true) {
      log(`UA：${navigator.userAgent}`);
      log(`屏幕宽度：${window.innerWidth}px`);
      log(`屏幕高度：${window.innerHeight}px`);
      log(`devicePixelRatio：${window.devicePixelRatio}`);
      log(`IP: ${(window as any).BPROXY_SERVER_IP}`);
    }
  }, 1000);
}

function urlStringify(obj: Record<string, any>) {
  return Object.keys(obj)
    .map((key) => {
      return `${key}=${encodeURIComponent(obj[key])}`;
    })
    .join('&');
}

// 初始化
const storeKey = 'bproxy-pageid-key';
const ua = navigator.userAgent.toLowerCase();
const isChrome = ua.includes('chrome/');
const ip = (window as any).BPROXY_SERVER_IP;
const wsServer = ip && window.location.protocol === 'http:' && !isChrome ? `ws://${ip}:8888` : 'wss://bproxy.dev';

let isInit = false;
let id = localStorage.getItem(storeKey);
if (!id) {
  id = randomId(8);
  localStorage.setItem(storeKey, id);
}

const ws = new WebSocket(
  `${wsServer}/target/${id}?${urlStringify({
    url: location.href,
    title: document.title,
    favicon: getFavicon(),
    ua: navigator.userAgent,
  })}`,
);

ws.onopen = () => {
  diyInit();
  isInit = true;

  ws.onmessage = (event) => {
    chobitsu.sendRawMessage(event.data);
  };
};

chobitsu.setOnMessage((message: string) => {
  if (!isInit) return;
  ws.send(message);
});
