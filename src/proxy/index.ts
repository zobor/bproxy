import * as fs from 'fs';
import * as http from 'http';
import { isEmpty } from 'lodash';
import * as url from 'url';
import * as packageJson from '../../package.json';
import { appConfigFilePath, appDataPath, configModuleTemplate } from './config';
import { showErrorDialog } from './electronApi';
import { updateConfigPathAndWatch } from './getUserConfig';
import httpMiddleware from './httpMiddleware';
import httpsMiddleware from './httpsMiddleware';
import logger from './logger';
import { ioInit, wsApi, wss } from './socket/socket';
import { staticServer } from './staticServer';
import { configSystemProxy, setSystemProxyOff } from './systemProxy';
import dataset from './utils/dataset';
import { isLocalServerRequest } from './utils/is';
import { checkUpgrade } from './utils/request';
import { delay, utils } from './utils/utils';

const pkg: any = packageJson;

export default class LocalServer {
  // 启动前的检查
  static async beforeStart() {
    logger.info('当前运行环境', dataset.platform);
    // 检查bproxy app默认的配置，不存在就创建一个
    await this.checkDefaultConfigAndCreateOne();

    // 检查bash环境的配置
    this.checkPWDConfig();

    // 检查 app 环境的配置
    this.checkAppLastTimeConfig();

    // 检查是否最新版本
    this.checkUpgrade();
  }

  static async checkUpgrade() {
    checkUpgrade().then((data: any) => {
      if (data && data.version) {
        console.log('\n');
        console.log('########################################');
        console.log(`bproxy有新版本（${data.version}）可以升级，请尽快升级`);
        console.log('更新内容如下：');
        console.log(
          data.changeLog.map((item: string) => `  ${item}`).join('\n')
        );
        console.log('########################################');
        console.log('\n');
      }
    });
  }

  // 检查配置默认配置文件
  static async checkDefaultConfigAndCreateOne() {
    if (!fs.existsSync(appConfigFilePath)) {
      fs.writeFileSync(appConfigFilePath, configModuleTemplate);
    }
    return true;
  }

  static async checkPWDConfig() {
    if (dataset.platform !== 'bash') {
      return;
    }
    // bash 环境使用当面目录承载配置
    updateConfigPathAndWatch({
      configPath: process.cwd(),
    });
  }

  static async checkAppLastTimeConfig() {
    if (dataset.platform !== 'app') {
      return;
    }
    const { prevConfigPath } = dataset;

    if (prevConfigPath) {
      // 使用上一次使用的配置文件路径
      updateConfigPathAndWatch({
        configPath: prevConfigPath,
      });
    } else {
      // 没有历史记录，使用上一次的
      updateConfigPathAndWatch({
        configPath: appDataPath,
      });
    }
  }

  static async start(): Promise<void> {
    await this.beforeStart();

    const { config } = dataset;
    if (isEmpty(config)) {
      logger.error('启动失败，找不到配置');
      await delay(1000);
      process.exit(0);
    }

    // 启动立即开启系统代理
    this.enableBproxySystemProxy(config.port || 8888);
    const server = new http.Server();
    const certConfig = httpsMiddleware.beforeStart();
    // websocket server
    ioInit(server);

    server.listen(config.port, () => {
      // http
      server.on('request', (req, res) => {
        if (isLocalServerRequest(req.url || '')) {
          if (req.url?.includes('/socket.io/')) {
            return;
          }
          staticServer(req, res, certConfig);
          return;
        }
        const $req: any = req;
        if (!$req.$requestId) {
          $req.$requestId = utils.guid();
        }
        httpMiddleware.proxy($req, res);
      });
      // https
      server.on('connect', (req, socket, head) => {
        // 重置URL到本地服务
        if (req.url === 'bproxy.io:80') {
          req.url = `localhost:${dataset.config.port}`;
        }
        const $req: any = req;
        if (!$req.$requestId) {
          $req.$requestId = utils.guid();
        }
        httpsMiddleware.proxy($req, socket, head);
      });
      // ws
      server.on('upgrade', (req, socket, head) => {
        const urlObj: any = url.parse(req.url, true);
        const pathname = urlObj.pathname.split('/');

        const type = pathname[1];
        const id = pathname[2];

        if (type === 'target' || type === 'client') {
          wss.handleUpgrade(req, socket, head, (ws: any) => {
            ws.type = type;
            ws.id = id;
            const q: any = urlObj.query;
            if (type === 'target') {
              ws.pageURL = q.url;
              ws.title = q.title;
              ws.favicon = q.favicon;
              ws.ua = q.ua;
            } else {
              ws.target = q.target;
            }
            wss.emit('connection', ws, req);
          });
        } else if (type === 'data') {
          wss.handleUpgrade(req, socket, head, (ws: any) => {
            wsApi(ws);
          });
        } else {
          socket.destroy();
        }
      });
    });
    logger.info(`✔ bproxy[${pkg.version}] 启动成功✨`);
    logger.info(`✔ 操作面板地址：${`http://127.0.0.1:${config.port}`}`);

    this.errorCatch();
  }

  static async enableBproxySystemProxy(port: number) {
    return configSystemProxy({ host: '127.0.0.1' });
  }

  static async disableBproxySystemProxy() {
    return setSystemProxyOff();
  }

  static async errorCatch() {
    process.on('uncaughtException', async (err) => {
      // 端口被占用，停止启动
      if (err?.message?.includes('address already in use')) {
        logger.error(`ERROR: 端口被占用，请检查bproxy是否已启动。`);
        await showErrorDialog('端口被占用，请检查bproxy是否已启动');
        process.exit();
      } else {
        logger.error(`uncaughtException: ${JSON.stringify(err.stack)}`);
      }
    });

    // process.stdin.resume();
    process.on('exit', this.afterCloseNodeJsProcess);
    process.on('SIGINT', this.afterCloseNodeJsProcess);
  }

  static async afterCloseNodeJsProcess() {
    logger.info('close bproxy');
    await LocalServer.disableBproxySystemProxy();
    await delay(100);
    process.exit(0);
  }
}
