import query from 'licia/query';
import randomId from 'licia/randomId';
import safeStorage from 'licia/safeStorage';
import $ from 'licia/$';
import contain from 'licia/contain';
import Socket from 'licia/Socket';
import chobitsu from 'chobitsu';

const sessionStore = safeStorage('session');

function fullUrl(href: string) {
  const link = document.createElement('a');
  link.href = href;

  return link.protocol + '//' + link.host + link.pathname + link.search + link.hash;
}

function getFavicon() {
  let favicon = location.origin + '/favicon.ico';

  const $link = $('link');
  $link.each(function (this: HTMLElement) {
    if (contain(this.getAttribute('rel') || '', 'icon')) {
      const href = this.getAttribute('href');
      if (href) favicon = fullUrl(href);
    }
  });

  return favicon;
}

let isInit = false;

let id = sessionStore.getItem('chii-id');
if (!id) {
  id = randomId(6);
  sessionStore.setItem('chii-id', id);
}

const ws = new Socket(
  `wss://bproxy.io/target/${id}?${query.stringify({
    url: location.href,
    title: document.title,
    favicon: getFavicon(),
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
