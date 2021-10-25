<p align="center">
  <img src="https://zobor.github.io/666/assets/favicon.svg" />
</p>

B Proxy 是一个简单的前端代理工具，为提高效率而生。
--------



## 安装

可以选择安装全局命令行指令，多个项目共用一个代理工具。

```bash
npm install bproxy -g

or 

yarn add bproxy -g
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

创建一个配置文件`bproxy.conf.js`

```js
const config = {
  https: false,
  sslAll: true,
  port: 8888,
  host: [],
  rules: [{
    regx: 'http://baidu.com/**',
    response: 'test',
  }],
};
```

完成配置，即可启动代理

```sh
bproxy -s
```

```te
[INFO] 本地代理服务器启动成功: http://127.0.0.1:8888
[INFO] 本地代理服务器启动成功: http://192.168.0.104:8888
```

测试一下

```bash
curl -x http://127.0.0.1:8888 http://baidu.com/bproxy
// output
test
```

## 核心功能

## https证书

bproxy集成了证书管理部件，简单安装证书即可使用https协议。

```
bproxy -i
```

## 静态资源服务器

把一个网站的静态全部代理到本地文件

```js
config.rules.push({
  regx: 'https://douyu.com/static/**',
  path: '/path/to/your/folder'
});
```

## 解决浏览器跨域
通过修改请求的响应头来解决前端请求的跨域问题。
```js
config.rules.push({
  regx: 'https://v.douyu.com/user',
  responseHeaders: {
    "Access-Control-Allow-Origin": "https://douyu.com",
    "Access-Control-Allow-Credentials": "true",
  }
});
```

## 对部分请求设置host
```js
config.rules.push({
  regx: 'https://v.douyu.com/user',
  host: '127.0.0.1',
});
```

## 对部分请求设置代理
```js
config.rules.push({
  regx: 'https://v.douyu.com/user',
  proxy: '127.0.0.1',
});
```

## 抓包视图

![](https://sta-op-test.douyucdn.cn/front-publish/fed-ci-weekly-develop/QCeIlXAKpPhC4LLQKPabe7X4lyPnvDnI-1635128176637.png)

![](https://sta-op-test.douyucdn.cn/front-publish/fed-ci-weekly-develop/kiDVmQVax5y7lVR9U0w4W5ELUU4TQjs8-1635128256557.png)
