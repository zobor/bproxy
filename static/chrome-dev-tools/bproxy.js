import * as Root from './root/root.js';

const connectUrl = Root.Runtime.Runtime.queryParam('ws');
let timer;

function listenChanges() {
  if (!connectUrl) {
    return;
  }
  const ws = new WebSocket(`ws://${connectUrl}`);

  ws.addEventListener('open', () => {
    if (timer) {
      clearInterval(timer);
      window.location.reload();
    }
  });
  setTimeout(() => {
    ws.close();
  }, 200);
}

if (connectUrl) {
  const ws = new WebSocket(`ws://${connectUrl}`);

  ws.addEventListener('close', () => {
    timer = setInterval(listenChanges, 50);
  });

  ws.addEventListener('open', () => {
    if (timer) {
      clearInterval(timer);
    }
  });
}
