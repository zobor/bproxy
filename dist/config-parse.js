const msg = require('./msg');
const fs = require('fs-extra');
const chokidar = require('chokidar');
const console = require('./console');

let config;
msg.on('config-file-found', filepath => {
  fs.ensureFile(filepath).then(() => {
    watchConfigFileOnChange(filepath);
  }).catch(err => {
    console.error(err);
    process.exit();
  });
});

function watchConfigFileOnChange(configFile) {
  let watcher = chokidar.watch(configFile, {
    ignored: /[\/\\]\./,
    persistent: true
  });
  let loadConfig = function () {
    delete require.cache[require.resolve(configFile)];
    config = parseConfig(configFile);
  };
  watcher.on('change', function () {
    loadConfig();
  }).on('ready', function () {
    loadConfig();
  });
}

function parseConfig(configFile) {
  var conf = {};
  var isError = false;
  try {
    conf = require(configFile);
  } catch (e) {
    console.error(e.stack);
    isError = true;
  }
  let Hostrules = [];
  let filter = [];
  let hash = {};
  if (!conf.host) return conf;
  conf.host.split(/\n\r?/).map(item => {
    item = item.replace(/^#.*/, '');
    if (!item) return;
    let arr = item.split(/\s+/);
    if (arr.length != 2) return;
    Hostrules.push({
      regx: new RegExp(`^https?://${arr[1]}`),
      host: arr[0]
    });
  });
  conf.rules = conf.rules.concat(conf.rules, Hostrules);
  conf.rules.map(item => {
    if (!item.regx) return;
    let key = item.regx.toString();
    if (hash[key]) {
      return;
    }
    filter.push(item);
    hash[key] = 1;
  });
  conf.rules = filter;
  showUpdateLogs(conf.rules);
  return conf;
}

function showUpdateLogs(list) {
  var arr = [];
  list.map((item, idx) => {
    arr.push(idx + ": " + item.regx);
  });
  console.info('[config load success]');
  console.info('[rule list]');
  console.log(arr.join('\n'));
}

function getConfig() {
  return config;
}

module.exports = {
  getConfig: getConfig
};