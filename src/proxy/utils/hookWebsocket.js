(() => {

const protocol = location.protocol === 'https:' ? 'wss://' : 'ws://';
const $socket = io(`${protocol}bproxy.io/`, {
  transports: ['websocket'],
});


$socket.on('transferCode', ({code, id}) => {
  try {
    const shell = code && code.includes('return ') ? code : `return ${code}`;
    const fn = new Function(shell);
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