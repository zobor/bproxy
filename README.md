<div style="text-align:center;">
<img src="https://sta-op.douyucdn.cn/front-publish/fed-ci-static-bed-online/icon.a0775e14.ico" />
</div>

# bproxy

bproxy 一款代理工具，为前端开发带来乐趣

## bproxy的核心功能
- `抓包`：http、https、ws、wss
- `https过滤`：自定义需要抓包的https白名单
- `代理webSocket`
- `修改响应内容`：指向本地文件、指向本地目录、指向本地http服务、自定义响应头。
- `HTTPS证书`：自动安装https证书
- `HOST`：一个域名可以配置多个host
- `弱网模拟`：弱网模拟支持自定义延时配置
- `Chrome开发者工具`：远程调试

## 官网
http://www.bproxy.cn

## 安装
### 命令行工具
```
npm i bproxy -g
```

### app
支持 Windows & MacOS

下载地址：http://www.bproxy.cn

## 如何配置
配置文件 `bproxy.config.js`

```js
module.exports = {
  port: 8888, // 本地代理服务器的端口
  https: true, // 开启所有的https都抓包
  // 代理规则列表
  rules: [
    {
      // url是匹配什么什么请求
      url: 'https?://m.v.qq.com/tvp/',
      // target是配置请求如何响应，返回字符串内容
      target: 'hello world',
    }
  ]
}
```

## 其他配置
### 线上资源代理到本地
把服务端目录代理到本地目录
```js
{
  url: 'https://google.com/static/**',
  target: '/path/to/your/folder'
}
```
把服务端文件代理到本地文件
```js
{
  url: 'https://google.com/static/a.js',
  target: '/path/to/your/folder/a.js'
}
```
把服务端url代理到local server
```js
{
  url: 'https://baidu.com/pages/demo',
  target: 'http://127.0.0.1:3000',
}
```
### 自定义请求头和响应头
```js
{
  url: 'https://google.com/user',
  responseHeaders: {
    "Access-Control-Allow-Origin": "https://qq.com",
    "Access-Control-Allow-Credentials": "true",
  },
  requestHeaders: {
    "cache-control": "no-store",
  },
}
```

### 配HOST
```js
// 同一个域名下，不同的接口，可以配置不同的host
{
  url: 'https://google.com/api/user',
  target: '127.0.0.1',
}

{
  url: 'https://google.com/api/login',
  target: '192.168.0.1',
}
```

### 模拟请求异常
请求http状态码`502`
```js
{
  url: 'https://google.com/user',
  target: 502,
}
```

### 弱网
2s 后返回
```js
{
  url: 'https://google.com/user',
  delay: 2000, // 2000ms
}
```

### 设置代理
```js
{
  url: 'https://google.com',
  proxy: 'http://127.0.0.1:1080',
}
```

### 调试页面
```js
{
  url: 'http://m.v.qq.com/tvp',
  debug: true,
}
```
