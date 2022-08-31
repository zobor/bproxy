import { getRuntimePlatform, showBproxyLog } from '../modules/bridge';

// 查看日志文件
export function showLogFile() {
  getRuntimePlatform().then((rs: any) => {
    const isApp = rs === 'app';

    if (isApp) {
      showBproxyLog();
    } else {
      window.open('/web/LogViewer');
    }
  })
}
