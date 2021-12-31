import path from 'path';
import { ProxyDataSet } from "../../types/proxy";

const dataset: ProxyDataSet = {} as any;

const getDefaultRulesList = (port: number) => [
  {
    regx: "https://bproxy.dev/socket.io.min.js",
    file: `${path.resolve(__dirname, "../../web/libs/socket.io.min.js")}`,
  },
  {
    regx: "https://bproxy.io",
    redirect: `https://localhost:${port || 8888}`,
    responseHeaders: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
    },
  },
  {
    regx: "http://bproxy.io",
    redirect: `http://localhost:${port || 8888}`,
    responseHeaders: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
    },
  },
  {
    regx: 'https://log.bproxy.dev',
    redirect: `http://localhost:${port || 8888}`,
    responseHeaders: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Headers": "*",
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
    config.rules = getDefaultRulesList(config.port).concat(config.rules);

    dataset.config = config;
  }

};