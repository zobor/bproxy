const colors = require('colors')

module.exports = {
  log: function(){
    console.log.apply(null, arguments)
  },
  error: function(){
    console.log(arguments[0])
    let args = []
    for(var i =0,len = arguments.length;i<len;i++) {
      args.push(typeof arguments[i]==='object' ? JSON.stringify(arguments[i]): arguments[i])
    }
    let log = colors.red(`[${new Date().toLocaleTimeString()}] ${args.join(' ')}`)
    console.log(log)
  },
  info: function(){
    let args = []
    for(var i =0,len = arguments.length;i<len;i++) {
      args.push(typeof arguments[i]==='object' ? JSON.stringify(arguments[i]): arguments[i])
    }
    let log = colors.blue(`[${new Date().toLocaleTimeString()}] ${args.join(' ')}`)
    console.log(log)
  }
}