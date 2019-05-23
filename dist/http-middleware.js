const request = require('request');

const RulePattern = require('./rule-pattern');

const url = require('url');

const querystring = require('querystring');

const _ = require('./common/util');

class HttpMiddleware extends RulePattern {
  constructor(options = {}) {
    super();
    this.config = {};

    if (options.config) {
      this.config = options.config;
    }

    this.dataset = {
      responseHeaders: {},
      httpStatus: 200
    };
  }

  init(req, res) {
    this.dataset.req = req;
    this.dataset.res = res;
    let urlParam = url.parse(this.dataset.req.url);
    let param = querystring.parse(urlParam.query);
    this.dataset.query = param;
    const shouldUseHTTP = this.config.forceHTTPList && this.config.forceHTTPList.length && this.config.forceHTTPList.indexOf(urlParam.hostname) > -1;
    this.options = {
      url: shouldUseHTTP ? req.url : this.dataset.req.httpsURL || req.url,
      method: req.method,
      headers: Object.assign({}, req.headers)
    };
    this.rulesPattern();
    return this.pattern || {};
  }

  proxy(socketio) {
    this.dataset.socketio = socketio;
    return new Promise((resolve, reject) => {
      this.$resolve = resolve;
      this.$reject = reject;

      if (this.options && this.options.method.toLowerCase() === 'post') {
        let body = [];
        this.dataset.req.on('data', chunk => {
          body.push(chunk);
        });
        this.dataset.req.on('end', () => {
          this.options.body = Buffer.concat(body);
          this.onParamsReady();
        });
        this.dataset.req.on('error', err => {
          _.error(`[req error]: ${JSON.stringify(err)}`);
        });
      } else {
        this.onParamsReady();
      }
    });
  }

  onParamsReady() {
    if (this.pattern && this.pattern.disableHttpRequest) {
      this.readLocalData();
    } else {
      this.request();
    }
  }

  request() {
    this.options = this.options || {};
    this.options.headers = this.options.headers || {}; // global config settings

    if (this.config.proxy) {
      this.options.proxy = this.config.proxy;
    }

    if (this.config.requestHeaders) {
      Object.assign(this.options.headers, this.config.requestHeaders);
    } // rule apply to request options


    if (this.pattern && this.pattern.matched) {
      // rule.host
      if (this.pattern.rule.host) {
        this.options.hostname = this.pattern.rule.host;
      } // rule.proxy


      if (this.pattern.rule.proxy) {
        this.options.proxy = this.pattern.rule.proxy;
      }

      if (this.pattern.rule.useHttps && this.dataset.req.httpsURL) {
        this.options.url = this.dataset.req.httpsURL;
      } // rule.redirection


      if (this.pattern.rule.redirection) {
        this.options.url = this.pattern.rule.redirection;

        if (this.pattern.filepath) {
          this.options.url = `${this.options.url}/${this.pattern.filepath}`;
        }

        let parseParams = url.parse(this.options.url);

        if (parseParams.host) {
          this.options.headers.host = parseParams.host;
        }
      }

      if (this.pattern.rule.responseHeaders && typeof this.pattern.rule.responseHeaders === 'object') {
        Object.assign(this.dataset.responseHeaders, this.pattern.rule.responseHeaders);
      }
    }

    delete this.options.headers['cache-control'];
    delete this.options.headers['if-modified-since'];
    delete this.options.headers['if-none-match'];
    delete this.options.headers['accept-encoding'];
    request(this.options, (err, response = {}, body = '') => {
      Object.assign(response.headers, this.dataset.responseHeaders); // _.debug(`[${response.statusCode}]: ${this.options.url}`);

      if (err) {
        _.error(`httpRequest: ${JSON.stringify(err)}`);
      }

      if (this.dataset.socketio && this.dataset.socketio.emit) {
        this.dataset.socketio.emit('response', {
          sid: this.dataset.req.__sid__,
          resHeaders: response.headers,
          body: body
        });
      }

      this.$resolve({
        body,
        headers: response.headers,
        statusCode: response.statusCode
      });
    });
  }

}

module.exports = HttpMiddleware;