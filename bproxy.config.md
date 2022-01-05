# bproxy 配置文件

## 默认配置
```javascript
const config = {
  port: 8888,
  https: [],
  sslAll: true,
  host: [],
  rules: [{ regx: "baidu.com/bproxy", response: "hello bproxy\n" }],
};
module.exports = config;
```

## config

| Key          | type        | Default                             | description                                |
| ------------ | ----------- | ----------------------------------- | ------------------------------------------ |
| port         | number      | 8888                                | 代理服务端口                               |
| configFile   | string      | process.cwd() + '/bproxy.config.js' | 配置文件地址                               |
| https        | string[]    | []                                  | 抓取https请求白白名单                      |
| sslAll       | boolean     | true                                | 是否抓取全部https请求，优先级高于https配置。比较耗电脑性能，如果不需要抓全部的https请求，可以设置为false，然后通过https白名单控制要抓取的域名 |
| host         | string[]    | []                                  | host配置                                   |
| rules        | ProxyRule[] | []                                  | 代理规则列表                               |
| delay        | number      | 0                                   | 全局网络延迟                               |
| disableCache    | boolean                  | false                                                        | 是否禁用缓存           |

## rules

| key             | type                     | example                                                      | description            |
| --------------- | ------------------------ | ------------------------------------------------------------ | ---------------------- |
| regx            | string\|RegExp\|function | string: 'google.com'<br />RegExp: /google\.com/<br />function: (url) => url.includes('google.com') | 匹配请求地址           |
| host            | string                   | 127.0.0.1                                                  | 域名的host配置         |
| file            | string                   | /root/config/a.js                                            | 请求代理到本地文件地址 |
| path            | string                   | /root/config/                                                | 请求代理到本地目录     |
| response        | string\|function         | string:'hello proxy\n'<br />function:(response, request, httpRequestSdk, rules) => response.end('hello bproxy\n') | 请求相应规则           |
| redirect        | string                   | https://google.com/                                        |                        |
| rewrite         | function                 | (path) => path.replace('js', 'assets/js')                    | 路径重写               |
| proxy           | string                   | http://127.0.0.1:1080                                      | 代理服务器地址         |
| statusCode      | number                   | 200                                                          | 请求响应状态码         |
| responseHeaders | {}                       | {'Access-Control-Allow-Credentials': true}                   | 自定义http响应头       |
| requestHeaders  | {}                       | {"cache-control": "no-store"}                                | 自定义http请求头       |
| delay           | number                   | 1000                                                         | 1s                     |
| disableCache    | boolean                  | false                                                        | 是否禁用缓存           |
| debug    | boolean/string                  | false                                                        | 是否开启远程调试：true: 开启远程调试，劫持console输出的日志，注入websocket，调用js代码。。vconsole: 注入vconsole实例           |

