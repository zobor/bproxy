(() => {

window.console.$log = window.console.log;
window.console.$warn = window.console.warn;
window.console.$error = window.console.error;

const log = (data, type) => {
  const body = JSON.stringify({ logData: data, type });
  const len = Array.isArray(data) ? data.length : 1;
  fetch(`https://log.bproxy.dev/${len}/${body.length}`, {
    method: "POST",
    body,
  });
};

window.console.log = (...args) => {
  window.console.$log.apply(window.console, args);
  log(args, "log");
}
window.console.warn = (...args) => {
  window.console.$warn.apply(window.console, args);
  log(args, "warn");
}
window.console.error = (...args) => {
  window.console.$error.apply(window.console, args);
  log(args, "error");
}


})();
