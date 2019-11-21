module.exports = {
  port: 8888,
  rules: [
    {
      regx: 'http://m.baidu.com',
      response: (response) => {
        response.end('hello, bproxy!');
      }
    },
    {
      regx: 'https://g.alicdn.com/fusion-platform/sketch-markup/app.js',
      file: '/Users/zobor/work/sketch-markup/build/app2.js',
    },
  ],
  ssl: [],
};
