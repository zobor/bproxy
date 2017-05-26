const request = require('request')
const extend = require('extend')
const msg = require('./msg')
const RulePattern = require('./rule-pattern')
const console = require('./console')
const url = require('url')

class HttpMiddleware extends RulePattern{
  constructor(options={}){
    super()
    this.config = {}
    if (options.configApi && options.configApi.getConfig){
      this.config = options.configApi.getConfig()
    }
    this.dataset = {
      responseHeaders: {},
      httpStatus: 200
    }
  }

  init(req, res){
    this.dataset.req = req
    this.dataset.res = res
    this.options = {
      url: req.url,
      method: req.method,
      headers: extend({}, req.headers)
    }
    try{
      this.rulesPattern()
    }catch(e){
      console.error(e)
    }
    return this.pattern||{}
  }

  proxy(){
    return new Promise((resolve, reject)=>{
      this.$resolve = resolve
      try{
        if (this.options && this.options.method.toLowerCase()==='post') {
          let postForm = []
          this.dataset.req.on('data', (chunk)=>{
            postForm.push(chunk)
          })
          this.dataset.req.on('end', () =>{
            this.options.form = postForm.join('')
            this.onParamsReady();
          })
        }else{
          this.onParamsReady()
        }
      }catch(e){
        console.error(e)
      }
    })
  }

  onParamsReady(){
    if (this.pattern && this.pattern.disableHttpRequest) {
      try{
        this.readLocalData()
      }catch(e){
        console.error(e)
      }
    }else{
      this.request()
    }
  }

  request(){
    this.options = this.options || {}
    this.options.headers = this.options.headers || {}

    // global config settings
    if (this.config.proxy) {
      this.options.proxy = this.config.proxy
    }
    if (this.config.requestHeaders) {
      extend(this.options.headers, this.config.requestHeaders)
    }

    // rule apply to request options
    if (this.pattern && this.pattern.matched) {
      // rule.host
      if (this.pattern.rule.host) {
        this.options.hostname = this.pattern.rule.host
      }
      // rule.proxy
      if (this.pattern.rule.proxy) {
        this.options.proxy = this.pattern.rule.proxy
      }
      // rule.redirection
      if (this.pattern.rule.redirection) {
        this.options.url = this.pattern.rule.redirection
        let parseParams = url.parse(this.options.url)
        if (parseParams.host) {
          this.options.headers.host = parseParams.host
        }
      }
      if (this.pattern.rule.responseHeaders && typeof this.pattern.rule.responseHeaders==='object') {
        extend(this.dataset.responseHeaders,this.pattern.rule.responseHeaders)
      }
    }
    // delete this.options.headers['cache-control']
    // delete this.options.headers['if-modified-since']
    // delete this.options.headers['if-none-match']
    // delete this.options.headers['accept-encoding']
    let httpRequest = request(this.options, (err,response, body)=>{})
    .on('response', (response)=>{
      extend(response.headers, this.dataset.responseHeaders)
    })
    .on('data', (chunk)=>{})
    this.$resolve(httpRequest)
  }
}

module.exports = HttpMiddleware