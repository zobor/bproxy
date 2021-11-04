# bproxy 配置文件

## 默认配置
```
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

| Key        | type        | Default                             | description                                |
| ---------- | ----------- | ----------------------------------- | ------------------------------------------ |
| port       | number      | 8888                                | 代理服务端口                               |
| configFile | string      | process.cwd() + '/bproxy.config.js' | 配置文件地址                               |
| https      | string[]    | []                                  | 抓取https请求白白名单                      |
| sslAll     | boolean     | true                                | 是否抓取全部https请求，优先级高于https配置 |
| host       | string[]    | []                                  | host配置                                   |
| rules      | ProxyRule[] | []                                  | 代理规则列表                               |
|

## rules

| key             | type                     | example                                                      | description              |
| --------------- | ------------------------ | ------------------------------------------------------------ | ------------------------ |
| regx            | string\|RegExp\|function | string: 'google.com'<br />RegExp: /google\.com/<br />function: (url) => url.includes('google.com') | 匹配请求地址             |
| host            | string                   | '127.0.0.1'                                                  | 域名的host配置           |
| file            | string                   | /root/config/a.js                                            | 请求代理到本地文件地址   |
| path            | string                   | /root/config/                                                | 请求代理到本地目录       |
| response        | string\|function         | string:'hello proxy\n'<br />function:(response, request, httpRequestSdk, rules) => response.end('hello bproxy\n') | 请求相应规则             |
| redirect        | string                   | 'https://google.com/'                                        |                          |
| rewrite         | function                 | (path) => path.replace('js', 'assets/js')                    | 路径重写                 |
| proxy           | string                   | 'http://127.0.0.1:1080'                                      | 代理服务器地址           |
| statusCode      | number                   | 200                                                          | 请求相应http status code |
| responseHeaders | {}                       | {'Access-Control-Allow-Credentials': true}                   | 自定义http响应头         |
| requestHeaders  | {}                       | {"cache-control": "no-store"}                                | 自定义http请求头         |

