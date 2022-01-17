import path from 'path';
import { ProxyDataSet } from "../../types/proxy";

const dataset: ProxyDataSet = {} as any;

const getDefaultRulesList = (port: number, weinrePort) => [
  {
    regx: "https://bproxy.dev/socket.io.min.js",
    file: `${path.resolve(__dirname, "../../web/libs/socket.io.min.js")}`,
  },
  {
    regx: "https://bproxy.dev/weinre/target.js",
    redirect: `http://localhost:${weinrePort || 9527}/target/target-script-min.js#anonymous`,
  },
  {
    regx: "https://bproxy.dev/weinre/xhr/**",
    redirect: `http://localhost:${weinrePort || 9527}/`,
    responseHeaders: {
      "access-control-allow-origin": "*",
      "access-control-allow-credentials": "true",
      "access-control-allow-headers": "*",
    },
  },
  {
    regx: /https?:\/\/bproxy\.io/,
    redirect: `https://localhost:${port || 8888}`,
    responseHeaders: {
      "access-control-allow-origin": "*",
      "access-control-allow-credentials": "true",
      "access-control-allow-headers": "*",
    },
  },
];

export default dataset;

export const updateDataSet = (key, value) => {
  dataset[key] = value as any;

  if (key === 'config') {
    const config: any = dataset.config;
    const https = dataset?.config?.https || [];
    config.https = https.concat([
      'bproxy.dev:443',
      'bproxy.io:443',
    ]);
    config.rules = getDefaultRulesList(config.port, config?.weinre?.httpPort).concat(config.rules);

    dataset.config = config;
  }

};
