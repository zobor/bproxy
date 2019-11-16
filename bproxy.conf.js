module.exports = {
  port: 8889,
  rules: [
    {
      regx: 'http://m.baidu.com',
      response: (response) => {
        response.end('hello, bproxy!');
      }
    }
  ]
};