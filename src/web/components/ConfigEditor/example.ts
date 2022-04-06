export const example = `
const config = {
  // 代理服务器端口号
  port: 8888,

  // 开启https代理白名单，不在白名单内的不能抓包看请求详情
  // https = true, 抓取全部的 https 请求
  https: [
    'v.qq.com:443'
  ],

  // 禁止缓存
  disableCache: true,

  // 代理规则列表
  rules: [
    // 将线上流量转向本地 devServer
    {
      url: 'https://www.google.com/index.html',
      target: 'http://localhost:3000/',
    },

    // 文件名通配 https://www.google.com/abc --> http://localhost:3000/abc
    {
      url: 'https://www.google.com/*',
      target: 'http://localhost:3000/',
    },

    // 文件路径通配 https://www.google.com/a/b/c --> http://localhost:3000/a/b/c
    {
      url: 'https://www.google.com/**',
      target: 'http://localhost:3000/',
    },

    // 去掉 url hash
    {
      // expample: https://sta-op.douyucdn.cn/front-publish/shark-apm-master/shark-apm.2fe1c95.js
      url: 'https://sta-op.douyucdn.cn/front-publish/shark-apm-master/*',
      target: 'http://localhost:3000/',
      rewrite: (path) => path.replace(/\.\w{7}\.js/, '.js'),
    },

    // 将流量转向指定 IP (配置HOST)
    {
      url: 'https://www.google.com',
      target: '127.0.0.1',
    }

    // 添加跨域头
    {
      url: 'https://www.google.com/**',
      responseHeaders: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,Accept,X-Requested-With',
      },
    },

    // 线上流量指向本地文件
    // https://www.google.com/a/b/c.html --> /path/to/a/b/c.html
    {
      url: 'https://www.google.com/**',
      target: '/path/to/',
    },

    // 部分请求走第三方代理，比如google
    {
      url: "(google|stackoverflow|github)\.",
      proxy: "http://127.0.0.1:4780",
    },

    // 使用 chrome-dev-tools 远程调试
    {
      url: 'm.v.qq.com/tvp/',
      debug: true
    },

    // 使用 vconsole 远程调试
    {
      url: 'm.v.qq.com/tvp/',
      debug: 'vconsole'
    },

    // 模拟弱网
    {
      url: 'm.v.qq.com/tvp',
      delay: 2000,
    },

    // 模拟错误
    {
      url: 'm.v.qq.com/tvp',
      target: 502,
    },
  ],
};

module.exports = config;
`;
