const $socket = io('ws://bproxy.io/', {
  transports: ['websocket'],
});


$socket.on('transferCode', ({code, id}) => {
  // const AsyncFn = Object.getPrototypeOf(async function () {}).constructor;
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
