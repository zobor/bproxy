# Bproxy

![](https://img.alicdn.com/tfs/TB1lFV6m1T2gK0jSZFvXXXnFXXa-219-159.png)

**Bproxy is a command line network agent tool base on NodeJS, Simplify development and testing!**

The original intention of bproxy design is to solve the problem of agent trouble, including various packet capture, package change, configuration host, modify response header or content.

----

```bash
$ bproxy
  Usage: bproxy [options]
  Options:
    -V, --version         output the version number
    -s ,--start           start bproxy
    -c, --config [value]  specifies the profile path
    -p, --port [value]    specify the app port
    -i, --install         install bproxy certificate
    -h, --help            output usage information
```
Here is a usage and feature preview.

![](https://img.alicdn.com/tfs/TB1tmYEnNz1gK0jSZSgXXavwpXa-597-295.png)

```
// config
{
  "regx": "https://www.baidu.com",
  "response": ({ response }) => response.end('hello, bproxy')
}

// curl test
curl -x http://127.0.0.1:8888 https://www.qq.com

// response
hello, bproxy
```

## Installation & Usage

```bash
npm install bproxy -g
```

or

```bash
yarn global add bproxy
```

### How To Use
```bash
$ bproxy -s
$ curl -x http://127.0.0.1:8888 https://www.qq.com
$ "hello, bproxy"
```

## Global Configuration
Global parameter configuration usage
```js
module.exports = {
  https: true,
  port: 8888,
  host: [],
  rules: [],
}
```
All supported global parameter configurations

|Parameter Name|Data Type|Default Value|Description|
|---|---|---|---|
|https|{boolean \| Array}|false|Whether to open https, or which one|
|sslAll|{boolean}|false|Enable All https request|
|port|{Number}|8888|App port|
|Hosts|{String \| Array}|[]|Hosts|
|rules|{Array}|[]|Matching rules|
|proxy|{String}|null|Network Proxy|
|delay|{Number}|0|http response delay|
|downloadPath|{String}|''|Download Path set|

## Rules Configuration
|Parameter Name|Data Type|Description|
|---|---|---|
|regx|{String \| RegExp \| Function}|Match rule for URL|
|host|{String}|Host of hostname|
|path|{String}|Local folder path|
|file|{String}|Local file|
|response|{String \| Function}|Http response|
|redirect|{String}|302|
|proxy|{String}|Network proxy|
|delay|{Number}|Network spped delay|
|showLog|{Boolean}|show request url log|
|download|{Boolean}|Auto download file by url|

## Configuration format and examples

This is an example for `bproxy.conf.js`
```js
module.exports = {
  rules: [
    {
      regx: "https://www.qq.com",
      "response": (response) => response.end('hello, bproxy'),
    },
    {
      regx: "*.qq.com",
      file: "/path/to/your/localFile",
    }
  ],
}
```

## What features are supported?
### Network request proxy to local
```js
module.exports = {
  rules: [
    {
      regx: "*.qq.com",
      file: "/path/to/your/localFile",
    }
  ],
}
```
```bash
$ curl -x http://127.0.0.1:8888 "https://www.qq.com"
```
### Network request redirects to other requests
```js
module.exports = {
  rules: [
    {
      regx: "https://y.qq.com",
      redirect: "https://music.qq.com",
    }
  ],
}
```
```bash
$ curl -x http://127.0.0.1:8888 "https://www.qq.com"
```
### Network request to configure network proxy
```js
module.exports = {
  rules: [
    {
      regx: "https://www.google.com",
      proxy: "http://127.0.0.1:1087",
    }
  ],
}
```
```bash
$ curl -x http://127.0.0.1:8888 "https://www.qq.com"
```
### Network request configuration host
```js
module.exports = {
  rules: [
    {
      regx: "https://v.qq.com",
      host: "127.0.0.1",
    }
  ],
}
```
```bash
$ sudo http-server -p 80
$ curl -x http://127.0.0.1:8888 "https://v.qq.com"
```
### Network request delay simulation
```js
module.exports = {
  rules: [
    {
      regx: "https://v.qq.com",
      delay: 5000,
    }
  ],
}
```
```bash
$ curl -x http://127.0.0.1:8888 "https://v.qq.com"
```
### Modify response headers
```js
module.exports = {
  rules: [
    {
      regx: "https://www.baidu.com",
      resHeaders: {
        "Allow-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
      },
    }
  ],
}
```
```bash
$ curl -x http://127.0.0.1:8888  -h "https://www.baidu.com"
```
### Custom return content
The res parameter can be a function, you can write any node code yourself.
```js
module.exports = {
  rules: [
    {
      regx: "https://v.qq.com",
      response({ url, resHeader, response, request }) {
        response.writeHeader(200, Object.assign({}, resHeader));
        request.get('https://www.baidu.com', (error, resp, body) => {
          response.end(body);
        },
      },
    }
  ],
}
```
```bash
$ curl -x http://127.0.0.1:8888 "https://v.qq.com"
```
### Custom match rule
The regx parameter support 3 formats
```js
module.exports = {
  rules: [
    {
      regx: "https://v.qq.com",
      "response": ({ response }) => response.end('hello, bproxy'),
    },
    {
      regx: "https://*.baidu.com",
      "response": ({ response }) => response.end('hello, bproxy'),
    },
    {
      regx: /\.jpg$/i,
      "response": ({ response }) => response.end('hello, bproxy'),
    }
  ],
}
```
```bash
$ curl -x http://127.0.0.1:8888 "https://v.qq.com"
```
### Https request to capture packets
Will only intercept requests from v.qq.com
```js
module.exports = {
  settings: {
    https: [
      {
        hostname: "v.qq.com",
        port: 443,
      }
    ]
  }
}
```
```js
// Disable ssl, Will not intercept requests for the https protocol
module.exports = {
  settings: {
    https: false,
  }
}

// Intercept requests for all https protocols
module.exports = {
  settings: {
    https: true,
  }
}
```
```bash
$ curl -x http://127.0.0.1:8888 "https://v.qq.com"
```
