const fs = require('fs-extra');
const chokidar = require('chokidar');
const message = require('./msg');
const baseConfig = require('./config');
const _ = require('./common/util');

let config;

function showUpdateLogs(list) {
  const arr = [];
  list.forEach((item, idx) => {
    arr.push(`${idx}: ${item.regx}`);
  });
}

function parseConfig(configFile) {
  let conf = {};
  try {
    conf = require(configFile);
  } catch (e) {
    _.error(`[require config]: ${JSON.stringify(e)}`);
  }
  const Hostrules = [];
  const filter = [];
  const hash = {};
  if (!conf.host) return conf;
  conf.host.split(/\n\r?/).forEach((it) => {
    const item = it.replace(/^#.*/, '');
    if (!item) return;
    const arr = item.split(/\s+/);
    if (arr.length !== 2) return;
    Hostrules.push({
      regx: new RegExp(`^https?://${arr[1]}`),
      host: arr[0],
    });
  });
  conf.rules = conf.rules.concat(conf.rules, Hostrules);
  conf.rules.forEach((item) => {
    if (!item.regx) return;
    const key = item.regx.toString();
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

function watchConfigFileOnChange(configFile) {
  const watcher = chokidar.watch(configFile, {
    ignored: /[/\\]\./,
    persistent: true,
  });
  const loadConfig = function loadConfig() {
    delete require.cache[require.resolve(configFile)];
    config = parseConfig(configFile);
    config = { ...baseConfig, ...config };
    message.emit('config:ready', config);
  };
  watcher.on('change', () => {
    loadConfig();
    _.info(`${_.color.green.bold('bproxy.config.js changed')}: ${_.color.underline(configFile)}`);
  })
    .on('ready', () => {
      loadConfig();
    });
}

message.on('config-file-found', (fp) => {
  const filepath = fp || baseConfig.CONFIG_PATH;
  fs.ensureFile(filepath).then(() => {
    watchConfigFileOnChange(filepath);
  })
    .catch(() => {
      process.exit();
    });
});


module.exports = {
  setting: config,
};
