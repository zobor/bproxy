const httpMiddleware = require('./http-middleware')
const configApi = require('./config-parse')
const util = require('./common/util')


var app = require('http').createServer(function(){})
var io = require('socket.io')(app)
app.listen(9000)
var socket
io.on('connection', function(skt) {
  socket = skt
})

function proxy(req, res){
  if (!req.__sid__) req.__sid__ = util.newGuid()
  let httpProxy = new httpMiddleware({configApi: configApi})
  let pattern = httpProxy.init(req, res)

  // (socket && typeof socket.emit==='function') && socket.emit('request', {
  //   sid: req.__sid__,
  //   url: req.url,
  //   reqHeaders: req.headers,
  //   query: httpProxy.dataset.query
  // })
  let start = function(){
    httpProxy.proxy(socket)
    .catch((error)=>{
      res.end(error)
    })
    .then((responseStream)=>{
      responseStream.pipe(res)
      httpProxy = null
      pattern = null
    })
  }
  let delay = (pattern && pattern.rule && pattern.rule.delay) ||
    (httpProxy.config && httpProxy.config.delay)
  if (delay) {
    setTimeout(start, delay)
  }else{
    start()
  }
}

module.exports = proxy