import { dialog, BrowserWindow } from 'electron';

// 默认窗口大小
export const defaultWindowSize = {
  width: 800,
  height: 550,
};

// 显示错误信息
export async function showErrorDialog(text: string) {
  if (!BrowserWindow) {
    return;
  }
  const win =
    BrowserWindow.getFocusedWindow() ||
    new BrowserWindow({
      width: defaultWindowSize.width,
      height: defaultWindowSize.height,
      webPreferences: {
        nodeIntegration: false,
      },
    });
  await dialog.showMessageBox(win, {
    message: 'bproxy error',
    detail: text,
    type: 'error',
  });
}

// 显示confirm 弹窗
export function showConfirmDialog(
  title: string,
  text: string,
  buttons: string[],
  callbacks: Function[]
) {
  return dialog
    .showMessageBox({
      message: title,
      detail: text,
      type: 'none',
      buttons,
    })
    .then(({ response }) => {
      if (callbacks && callbacks.length && callbacks[response]) {
        callbacks[response]();
      }
    });
}

// 新窗口打开URL
export function openNewWindow({
  url,
  width,
  height,
}: {
  url: string;
  width?: number;
  height?: number;
}) {
  if (!url) {
    return;
  }
  const win = new BrowserWindow({
    width: width || defaultWindowSize.width,
    height: height || defaultWindowSize.height,
  });
  win.loadURL(url);

  return url;
}

// 新窗口打开文本文件
export function openAndPreviewTextFile({ url, width, height }) {
  if (!url) {
    return;
  }
  const win = new BrowserWindow({
    width: width || defaultWindowSize.width,
    height: height || defaultWindowSize.height,
  });
  win.loadFile(url);

  return url;
}

// 显示升级提示弹窗
export function showUpgradeDialog({ url, changeLog = [] }: {url?: string; changeLog: string[]}) {
  showConfirmDialog(
    '可升级提示',
    `bproxy有新版本可以升级，请尽快升级, 更新内容如下: ${changeLog.join('。')}`,
    ['立即升级', '暂不升级'],
    [
      () => {
        openNewWindow({ url: url || 'http://www.bproxy.cn' });
      },
      () => {
        console.log('showUpgradeDialog', '用户取消了升级');
      },
    ]
  );
}

// 打开bproxy官网
export function showHomePage(url?: string) {
  openNewWindow({ url: url || 'http://www.bproxy.cn' });
}

// 显示选择目录的弹窗
export function showSelectPathDialog() {
  return new Promise((resolve) => {
    dialog
      .showOpenDialog({
        message: '请选择项目目录',
        properties: ['openDirectory'],
      })
      .then(function (response) {
        if (!response.canceled) {
          resolve(response.filePaths);
        } else {
          resolve(null);
        }
      });
  });
}
