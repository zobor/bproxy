const request = require('request')
const extend = require('extend')
class httpMiddleware{
  constructor(){}

  proxy(req){
    return new Promise((resolve, reject)=>{
      this.options = {
        url: req.url,
        method: req.method,
        proxy: 'http://dev-proxy.oa.com:8080',
        headers: extend({}, req.headers)
      }
      if (this.options.method.toLowerCase()==='post') {
        let postForm = []
        req.on('data', (chunk)=>{
          postForm.push(chunk)
        })
        req.on('end', () =>{
          this.options.form = postForm.join('')
          this.request(resolve)
        })
      }else{
        this.request(resolve)
      }
    })
  }

  request(resolve){
    let httpRequest = request(this.options, (err,response, body)=>{})
    .on('data', (chunk)=>{})
    resolve(httpRequest)
  }
}

module.exports = new httpMiddleware()