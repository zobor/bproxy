<p align="center">
  <img src="https://zobor.github.io/666/assets/favicon.svg" />
</p>

B Proxy 是一个代理工具，为提高效率而生。
--------



## 安装

可以选择安装全局命令行指令，多个项目共用一个代理工具。也可以在项目中单独使用。

```bash
npm i bproxy -g
```

## 使用

```sh
>$ bproxy
```

```bash
Usage: bproxy [options]

Options:
  -V, --version         output the version number
  -s ,--start           Start bproxy
  -c, --config [value]  Specifies the profile path
  -p, --port [value]    Specify the app port
  -i, --install         Install bproxy certificate(OSX)
  -x, --proxy [value]   Turn on/off system proxy
  -t, --test [value]    test url match or not
  -h, --help            output usage information
```

创建一个配置文件`bproxy.config.js`

```js
const { setConfig } = require('bproxy');
module.exports = setConfig({
  https: false,
  sslAll: true,
  port: 8888,
  host: [],
  rules: [{
    regx: 'http://baidu.com/**',
    response: 'test',
  }],
});
```

完成配置。**启动代理**

```sh
bproxy -s
```

```te
[INFO] 本地代理服务器启动成功: http://127.0.0.1:8888
```

测试一下

```bash
curl -x http://127.0.0.1:8888 http://baidu.com/bproxy
// output
test
```

## 核心功能

### https证书

bproxy集成了证书管理部件，简单安装证书即可使用https协议。

```
bproxy -i
```

### 静态资源服务器

把一个网站的静态资源全部代理到本地

```js
// map folder
config.rules.push({
  regx: 'https://douyu.com/static/**',
  path: '/path/to/your/folder'
});

// map file
config.rules.push({
  regx: 'https://douyu.com/static/a.js',
  path: '/path/to/your/folder/a.js'
});
```

### 请求重定向
```js
config.rules.push({
  regx: 'https://baidu.com',
  redirect: 'https://google.com',
});
```

### 自定义请求头和响应头
通过修改请求的响应头来解决前端请求的跨域问题。
```js
config.rules.push({
  regx: 'https://v.douyu.com/user',
  responseHeaders: {
    "Access-Control-Allow-Origin": "https://douyu.com",
    "Access-Control-Allow-Credentials": "true",
  },
  requestHeaders: {
    "cache-control": "no-store",
  },
});
```

### 对部分请求设置host
```js
config.rules.push({
  regx: 'https://v.douyu.com/user',
  host: '127.0.0.1',
});
```

### 模拟http请求异常
```js
config.rules.push({
  regx: 'https://v.douyu.com/user',
  statusCode: 502,
});
```

### 模拟http请求弱网
```js
config.rules.push({
  regx: 'https://v.douyu.com/user',
  delay: 2000, // 2000ms
});
```

### 对部分请求设置代理
```js
config.rules.push({
  regx: 'https://google.com',
  proxy: 'http://127.0.0.1:1080',
});
```

### 抓包视图

![](https://sta-op.douyucdn.cn/butterfly-java/2021/11/04/9647ad27b97ba02ee68d9ef85c705228.png)

![](https://sta-op-test.douyucdn.cn/front-publish/fed-ci-weekly-develop/kiDVmQVax5y7lVR9U0w4W5ELUU4TQjs8-1635128256557.png)

### 配置概览
```ts

interface ProxyRule {
  regx: RegExp | string | MatchRegxFunction;
  host?: string;
  file?: string;
  path?: string;
  response?: (params: ResponseCallbackParams) => void | string;
  redirect?: string;
  redirectTarget?: string;
  rewrite?: (path: string) => string;
  proxy?: string;
  responseHeaders?: {
    [key: string]: any;
  };
  requestHeaders?: {
    [key: string]: any;
  };
  statusCode?: number;
  filepath?: string;
  OPTIONS2POST?: boolean;
}

interface ProxyConfig {
  port: number;
  configFile: string;
  downloadPath?: string;
  https?: string[];
  sslAll?: boolean;
  host?: string[];
  rules: ProxyRule[];
}
```

更多配置：[https://github.com/zobor/bproxy/blob/master/bproxy.config.md](https://github.com/zobor/bproxy/blob/master/bproxy.config.md)

历史版本：[https://github.com/zobor/bproxy/blob/master/changelog.md](https://github.com/zobor/bproxy/blob/master/changelog.md)

