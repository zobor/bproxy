<p align="center">
  <img src="https://sta-op.douyucdn.cn/front-publish/fed-ci-static-bed-online/icons8-synchronize.5a5f7c5e.svg" />
  <h1 align="center">bproxy</h1>
  <h3 align="center">bproxy是一款网络代理工具，方便自定义网络请求的响应规则</h3>
</p>


核心功能如下：
1. <font color="#9ff">抓包</font>：http & https & ws & wss
1. <font color="#9ff">https过滤</font>：自定义需要抓包的https白名单
1. <font color="#9ff">ws桢解析</font>：代理webSocket
1. <font color="#9ff">修改响应</font>：修改响应内容：指向本地文件、指向本地目录、指向本地http服务、自定义响应头。
1. <font color="#9ff">HTTPS 证书</font>：自动安装https证书
1. <font color="#9ff">HOST</font>：一个域名可以配置多个host
1. <font color="#9ff">弱网模拟</font>：弱网模拟支持自定义延时配置
1. <font color="#9ff">Chrome开发者工具</font>：远程调试：查看日志，发送JavaScript指令


## 安装

推荐全局安装
```bash
npm i bproxy -g
```


## 使用

```bash
bproxy -s

[INFO] ✔ HTTPS & WebSocket 服务启动成功
[INFO] ✔ bproxy[5.1.1] 启动成功✨
[INFO] ♨️  操作面板地址：http://127.0.0.1:8888
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
  url: 'https://google.com/static/**',
  target: '/path/to/your/folder'
});

// map file
config.rules.push({
  url: 'https://google.com/static/a.js',
  target: '/path/to/your/folder/a.js'
});
```

### 请求重定向
```js
config.rules.push({
  url: 'https://baidu.com',
  target: 'https://google.com',
});
```

### 自定义请求头和响应头
通过修改请求的响应头来解决前端请求的跨域问题。
```js
config.rules.push({
  url: 'https://google.com/user',
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
  url: 'https://google.com/user',
  target: '127.0.0.1',
});
```

### 模拟http请求异常
```js
config.rules.push({
  url: 'https://google.com/user',
  target: 502,
});
```

### 模拟http请求弱网
```js
config.rules.push({
  url: 'https://google.com/user',
  delay: 2000, // 2000ms
});
```

### 对部分请求设置代理
```js
config.rules.push({
  url: 'https://google.com',
  proxy: 'http://127.0.0.1:1080',
});
```

### 更多
- [更多配置](https://github.com/zobor/bproxy/blob/master/bproxy.config.md)
- [历史版本](https://github.com/zobor/bproxy/blob/master/changelog.md)

