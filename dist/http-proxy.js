const httpMiddleware = require('./http-middleware');
const configApi = require('./config-parse');

function proxy(req, res) {
  // if (!req.__sid__) req.__sid__ = util.newGuid()
  let httpProxy = new httpMiddleware({ configApi: configApi });
  let pattern = httpProxy.init(req, res);
  let start = function () {
    httpProxy.proxy().catch(error => {
      res.end(error);
    }).then(responseStream => {
      responseStream.pipe(res);
      httpProxy = null;
    });
  };
  let delay = pattern && pattern.rule && pattern.rule.delay || httpProxy.config && httpProxy.config.delay;
  if (delay) {
    setTimeout(start, delay);
  } else {
    start();
  }
}

module.exports = proxy;