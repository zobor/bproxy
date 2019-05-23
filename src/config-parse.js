const message = require('./msg')
const fs = require('fs-extra')
const chokidar = require('chokidar')
const baseConfig = require('./config')
const _ = require('./common/util');


let config
message.on('config-file-found', (filepath)=>{
  filepath = filepath || baseConfig.CONFIG_PATH;
  fs.ensureFile(filepath).then(() => {
    watchConfigFileOnChange(filepath)
  })
  .catch(() => {
    process.exit()
  });
})

function watchConfigFileOnChange(configFile){
  let watcher = chokidar.watch(configFile, {
    ignored: /[\/\\]\./,
    persistent: true
  })
  let loadConfig = function(){
    delete require.cache[require.resolve(configFile)]
    config = parseConfig(configFile)
    config = Object.assign({}, baseConfig, config)
    message.emit('config:ready', config)
  }
  watcher.on('change', function() {
    loadConfig();
    _.info(`${_.color.green.bold('bproxy.config.js changed')}: ${_.color.underline(configFile)}`)
  })
  .on('ready', function() {
    loadConfig()
  })
}

function parseConfig(configFile){
  var conf = {}
  var isError = false
  try{
    conf = require(configFile)
  } catch(e){
    _.error(`[require config]: ${JSON.stringify(e)}`)
    isError = true
  }
  let Hostrules = []
  let filter = []
  let hash = {}
  if (!conf.host) return conf
  conf.host.split(/\n\r?/).map((item)=>{
    item = item.replace(/^#.*/,'')
    if (!item) return
    let arr = item.split(/\s+/)
    if (arr.length!=2) return
    Hostrules.push({
      regx: new RegExp(`^https?://${arr[1]}`),
      host: arr[0]
    })
  })
  conf.rules = conf.rules.concat(conf.rules, Hostrules)
  conf.rules.map((item)=>{
    if (!item.regx) return
    let key = item.regx.toString()
    if (hash[key]) {
      return
    }
    filter.push(item)
    hash[key] = 1
  })
  conf.rules = filter
  showUpdateLogs(conf.rules)
  return conf;
}

function showUpdateLogs(list){
  var arr = []
  list.map((item,idx)=>{
    arr.push(idx + ": " + item.regx)
  })
}


module.exports = {
  setting: config
}