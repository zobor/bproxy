# bproxy

A http proxy for developer

----

### Install

```
npm install bproxy -g
```


### bproxy.config.js

```js
var host = `
# 127.0.0.1 www.baidu.com
`

var rules = [
  // {
  //   regx: /^https?://.*.baidu.com/,
  //   status: '404'
  // }
]

module.exports = {
  host: host,
  rules: rules,
  disable_cache: true,
  disable_gzip: true
}
```

### rule usage

#### Set request url host
```js
{
  // regx test req.url
  regx: /^https?:\/\/v\.qq\.com/,
  // your test host ip
  host: '127.0.0.1'
}
```
#### Set request url proxy
```js
{
  // mp4 use your company proxy
  regx: /\.mp4/,
  proxy: 'http://proxyIP:proxyPort'
}
```

#### remote path map to local path
```js
{
  regx: /^https?:\/\/m.v.qq.com\/([^?]+)/,
  path: '/path/to/localpath/'
}
```

#### remote file map to local file
```js
{
  regx: /^http:\/\/www\.baidu\.com\/index\.html/,
  file: '/path/to/localfile.html'
}
```

#### jsonp
```js
{
  regx: /cgi\?callback=/,
  jsonp: '/path/to/localfile.json'
}
```


#### redirection
```js
{
  regx: /^http:\/\/www\.baidu\.com\/index\.html/,
  redirection: 'http://www.google.com/'
}
```

#### simulate http status
```js
{
  regx: /^http:\/\/www\.baidu\.com\/index\.html/,
  status: '404'
}
```

#### speed limit
```js
{
  regx: /^http:\/\/www\.baidu\.com\/index\.html/,
  // 1000ms delay
  delay: 1000
}
```

#### regx usage

regx can use follow type of data
* RegExp
* String
* Function


`{regx: /\.html/}` is equal to `RegExp.test(reg.url)`

`{regx: '.html'}` is equal to `req.url.indexOf(regx)>-1`

```js
{
  regx: function(url) {
    return url.indexOf('.html')>-1
  }
}
```
equal to `regx.call(null, req.url)`
