const net = require('net');
const url = require('url');
const colors = require('colors');
class httpsMiddleware {
  constructor() {}

  proxy(req, socket, head) {
    return new Promise((resolve, reject) => {
      let httpsParams = url.parse('https://' + req.url);
      this.connect(req, socket, head, httpsParams.hostname, httpsParams.port);
    });
  }

  connect(req, socket, head, hostname, port) {
    let socketAgent = net.connect(port, hostname, () => {
      console.log(colors.blue(`[connect ok] ${hostname}:${port}`));
      let agent = "bproxy Agent";
      socket.write(`HTTP/1.1 200 Connection Established\r\n Proxy-agent: ${agent}\r\n\r\n`);
      socketAgent.write(head);
      socketAgent.pipe(socket);
      socket.pipe(socketAgent);
    });
    socketAgent.on('data', buffer => {});
    socketAgent.on('error', e => {
      console.log(colors.red(e));
    });
  }

}

module.exports = new httpsMiddleware();