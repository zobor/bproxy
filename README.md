# bproxy

a free web debugging tool for devolper

----

```
$$> bproxy

  Usage: bproxy [options]


  Options:

    -V, --version         output the version number
    -s ,--start           start bproxy
    -c, --config [value]  specifies the profile path
    -p, --port [value]    specify the app port
    -i, --install         install bproxy certificate
    -h, --help            output usage information
```

### Install

```
npm install bproxy -g
```

or

```
yarn global add bproxy
```


### example bproxy.config.js

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

#### response header rewrite
```js
{
  regx: /cgi\?callback=/,
  file: '/path/to/file/cgi.json',
  responseHeaders:{
    'Allow-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true'
  }
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

### response diy
```js
{
  regx: '.html',
  response: function(url, resHeaders, response, request){
    url = 'http://test.m.v.qq.com/tvp/'
    request.get(url, function(error, res, body){
      response.writeHead(200,Object.assign(res.headers, resHeaders))
      response.end(body)
    })
  }
}
```

#### https support
```js
{
  regx: /https?:\/\/v.qq.com\//,
  host: '0.0.0.0'
}
```

install certificate

```
sudo bproxy --install
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


### config.options
```
* regx {String|RegExp|Function} => match request url
* status {Number}               => response http status code
* file {String}                 => local file path
* path {String}                 => local files path
* jsonp {String}                => local json file path
* callbackParameter {String}    => jsonp callback parameter
* host {String}                 => request host
* responseHeaders {Object}      => response headers
* delay {Number}                => response delay
* redirection {String}          => redirect to other url
* response {Function}           => diy your response data
```

### example for combo

`url` http://vm.gtimg.cn/c/=/tencentvideo_v1/script/txv.core.js,/tencentvideo/script/fansadmin/menu.js
```js
var fs = require('fs')
var menuJs = fs.readFileSync('/local/path/to/.dev/menu.js','utf-8')

var rules = [
  {
    regx: '/tencentvideo_v1/script/txv.core.js,/tencentvideo/script/fansadmin/menu.js',
    response: function(url, resHeader, response, request){
      response.writeHeader(200, Object.assign({}, resHeader));
      request.get('http://vm.gtimg.cn/tencentvideo_v1/script/txv.core.js', function(error, resp, body){
        response.end(body + '\n' + menuJs)
      })
    }
  }
]

module.exports = {
  host: '',
  rules: rules
}
```