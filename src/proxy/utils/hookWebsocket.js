(() => {

const protocol = 'wss://';
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

window.console.$log = window.console.log;
window.console.$warn = window.console.warn;
window.console.$error = window.console.error;


const log = (data, type) => {
  $socket.emit('syncRemotePageLogs', {
    data: Array.isArray(data) && data.length === 1 ? data[0] : data,
    type,
    time: Date.now(),
  });
};

window.console.log = (...args) => log.call(log, args, "log");
window.console.warn = (...args) => log.call(log, args, "warn");
window.console.error = (...args) => log.call(log, args, "error");

window.addEventListener('error', error => {
  log([error], 'error');
});

})();
