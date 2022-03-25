<p align="center">
  <img src="https://zobor.github.io/666/assets/favicon.svg" />
</p>

bproxy 提高你的开发效率
--------

bproxy的核心功能有这些：
1. 抓包：http、https、ws、wss
1. 自定义需要抓包的https白名单
1. 代理webSocket
1. 修改响应内容：指向本地文件、指向本地目录、指向本地http服务。
1. 自动安装https证书
1. 自定义响应头：比如跨域问题
1. 一个域名可以配置多个host
1. 弱网模拟支持自定义延时配置
1. 远程调试：查看日志，发送JavaScript指令
1. 一键mock请求


## 安装

推荐全局安装
```bash
npm i bproxy -g
```


## 使用

### 命令行指令
```sh
bproxy

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

### 启动代理服务

```bash
bproxy -s

// output
[INFO] 代理启动成功: http://192.168.0.100:8888
[INFO] 请求日志查看: http://127.0.0.1:8888
[INFO] 更多配置用法: https://t.hk.uy/aAMp
```

curl测试一下

```bash
curl -x http://127.0.0.1:8888 http://google.com/bproxy
// output
test
```

### 浏览器端如何使用

要让你的浏览器请求走到代理服务，需要简单地配置系统网络代理。

Windows：更改代理设置 --> 使用代理服务器：打开 --> 地址：127.0.0.1 --> 端口：8888

MacOS：设置 --> 网络设置 --> 代理 -> https代理 --> http://127.0.0.1:8888

也可以给chrome浏览器安装一个插件（[SwitchyOmega](https://chrome.google.com/webstore/detail/proxy-switchyomega/padekgcemlokbadohgkifijomclgjgif)）。
配置如下：
|网址协议|代理协议|代理服务器|代理端口|
|---|---|---|---|
|默认|http|127.0.0.1|8888|

点击插件图标，选择proxy即可。

效果如下：
![](https://zobor.github.io/666/assets/bproxy-terminal.png)
![](https://zobor.github.io/666/assets/bproxy-browser.png)
![](https://zobor.github.io/666/assets/bproxy-detail.png)


### 项目中使用
安装到bproxy到项目
```bash
npm i bproxy -g
```
添加bproxy启动脚本
`package.json`
```json
{
  "scripts": {
      "proxy": "bproxy"
  }
}
```

启动代理：
```
// 安装证书
npm run proxy -i
// 启动代理
npm run proxy -s
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
  regx: 'https://google.com/static/**',
  path: '/path/to/your/folder'
});

// map file
config.rules.push({
  regx: 'https://google.com/static/a.js',
  file: '/path/to/your/folder/a.js'
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
  regx: 'https://google.com/user',
  responseHeaders: {
    "Access-Control-Allow-Origin": "https://qq.com",
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
  regx: 'https://google.com/user',
  host: '127.0.0.1',
});
```

### 模拟http请求异常
```js
config.rules.push({
  regx: 'https://google.com/user',
  statusCode: 502,
});
```

### 模拟http请求弱网
```js
config.rules.push({
  regx: 'https://google.com/user',
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

### 配置参数如下
```ts

// 代理规则
interface ProxyRule {
  // 请求url的匹配规则
  regx: RegExp | string | MatchRegxFunction;
  // 请求配置host ip
  host?: string;
  // 代理到本地的一个文件
  file?: string;、
  // 代理到本地的一个目录
  path?: string;
  // 自定义相应内容
  response?: (params: ResponseCallbackParams) => void | string;
  // 重定向到自定义的地址
  redirect?: string;
  // 自定义重定向的目标地址
  redirectTarget?: string;
  // 重定向的路由修改
  rewrite?: (path: string) => string;
  // 配置二级代理
  proxy?: string;
  // 自定义相应头
  responseHeaders?: {
    [key: string]: any;
  };
  // 自定义请求头
  requestHeaders?: {
    [key: string]: any;
  };
  // 自定义相应状态码
  statusCode?: number;
  // 自定义本地文件路径
  filepath?: string;
  // 模拟弱网请求，单位ms
  delay?: number;
  // 是否禁用缓存
  disableCache?: boolean;
  // 远程调试
  debug?: boolean | 'vconsole';
}

// 代理服务配置
interface ProxyConfig {
  port: number;
  configFile: string;
  downloadPath?: string;
  https?: string[];
  sslAll?: boolean;
  host?: string[];
  // 代理规则
  rules: ProxyRule[];
  delay?: number;
}
```

### 更多
- [更多配置](https://github.com/zobor/bproxy/blob/master/bproxy.config.md)
- [历史版本](https://github.com/zobor/bproxy/blob/master/changelog.md)

