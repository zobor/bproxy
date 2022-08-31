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
}

if (connectUrl) {
  const ws = new WebSocket(`ws://${connectUrl}`);

  ws.addEventListener('close', () => {
    timer = setInterval(listenChanges, 1000);
  });
  ws.addEventListener('open', () => {
    if (timer) {
      clearInterval(timer);
    }
  });
}
