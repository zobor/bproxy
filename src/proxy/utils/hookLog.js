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
    headers: {
      'content-type': 'application/json; charset=utf-8',
    }
  });
};

window.console.log = (...args) => log(args, "log");
window.console.warn = (...args) => log(args, "warn");
window.console.error = (...args) => log(args, "error");

window.$bproxyFlag = 'hooklog';


})();
