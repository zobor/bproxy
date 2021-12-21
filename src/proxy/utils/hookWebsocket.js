(() => {

const protocol = location.protocol === 'https:' ? 'wss://' : 'ws://';
const $socket = io(`${protocol}bproxy.io/`, {
  transports: ['websocket'],
});


$socket.on('transferCode', ({code, id}) => {
  try {
    const fn = new Function(`return ${code}`);
    const rs = fn();
    $socket.emit('transferCodeCallback', {
      data: rs,
      id,
    });
  } catch(err) {
    $socket.emit('transferCodeCallback', {
      error: err,
    });
  }
});

window.$bproxyFlag = 'hookWebSocket';

})();