
class httpMiddleware {
  constructor() {}

  proxy(req) {
    let promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('');
      }, 600);
    });
    return promise;
  }
}

module.exports = new httpMiddleware();