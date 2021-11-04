const { setConfig } = require('./dist/src/proxy/index');
const ssr = 'http://127.0.0.1:4780';

const config = {
  https: [],
  sslAll: true,
  port: 8888,
  host: [],
  rules: [],
};

config.rules.push({
  regx: 'github.*',
  proxy: ssr,
});

config.rules.push({
  regx: 'cloudflare',
  proxy: ssr,
});

config.rules.push({
  regx: 'google',
  proxy: ssr,
});
config.rules.push({
  regx: 'chrome.',
  proxy: ssr,
});
config.rules.push({
  regx: 'youtube',
  proxy: ssr,
});

// config.rules.push({
//   regx: 'https://douyu.com/a',
//   file: './mock/activity_health_check3.json',
//   responseHeaders: {
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Credentials": "true",
//     "content-type": "application/json;charset=UTF-8",
//   },
// })
// config.rules.push({
//   regx: 'https://douyu.com/b',
//   file: './mock/confirm_probolem.json',
//   responseHeaders: {
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Credentials": "true",
//     "access-control-allow-methods": "GET, POST, OPTIONS",
//     "access-control-allow-headers": "Content-Type",
//     "content-type": "application/json;charset=UTF-8",
//   },
// });
// config.rules.push({
//   regx: 'https://douyu.com/c',
//   file: './mock/submit-online.json',
//   responseHeaders: {
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Credentials": "true",
//     "access-control-allow-methods": "GET, POST, OPTIONS",
//     "access-control-allow-headers": "Content-Type",
//     "content-type": "application/json;charset=UTF-8",
//   },
// });


// config.rules.push({
//   regx: 'live_player-live/**',
//   redirect: 'http://localhost:3001/',
//   rewrite: (v) => v.replace(/(_\w{7})?\.(js|json|css)$/, '.$2'),
// });

// config.rules.push({
//   regx: 'live_player-master/**',
//   redirect: 'http://localhost:3001/',
//   rewrite: (v) => v.replace(/(_\w{7})?\.(js|json|css)$/, '.$2'),
// });
config.rules.push({
  regx: 'msg-dev.dz11.com/**',
  statusCode: 500,
});
config.rules.push({
  regx: 'yubadev.dz11.com',
  statusCode: 500,
});
// config.rules.push({
//   regx: '/wgapi/vodnc/center/publish/liveCutPreview',
//   file: './mock/livecut.json'
// });
config.rules.push({
  regx: '/center/publish/liveCutPublish',
  file: './mock/livesubmit.json',
});
// config.rules.push({
//   regx: 'getTopicList',
//   statusCode: 404,
// });
// config.rules.push({
//   regx: 'wgapi/vod/center/getLiveCutVodList',
//   file: './mock/getLiveCutVodList.json'
// });

// config.rules.push({
//   regx: '*.(png|svg|jpeg|jpg|gif|webp)',
//   statusCode: 404,
// });

config.rules.push({
  regx: 'https://live.dz11.com/member/walletcenter/index',
  file: './mock/wallet-center.html',
});

module.exports = setConfig(config);
