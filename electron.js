const { app, BrowserWindow } = require('electron');
const bproxy = require('./src/proxy').default;
const { checkUpgrade } = require('./src/proxy/utils/request');
const { showUpgradeDialog } = require('./src/proxy/api/electronApi');
const { updateDataSet } = require('./src/proxy/utils/dataset');

updateDataSet('platform', 'app');

let win;

async function createWindow() {
  // 创建浏览器窗口。
  await bproxy.start();
  win = new BrowserWindow({
    width: '100%',
    height: '100%',
    webPreferences: {
      nodeIntegration: false,
    },
  });

  // win.setMenu(null);
  win.maximize();

  if (process.env.NODE_ENV === 'dev') {
    win.loadURL('http://127.0.0.1:8889');
    // 打开开发者工具
    win.webContents.openDevTools();
  } else {
    win.loadURL('http://127.0.0.1:8888');
  }

  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    win = null;
  });

  // 版本更新检查
  checkUpgrade().then(data => {
    if (data && data.version) {
      showUpgradeDialog({ url: data.downloadURL, changeLog: data.changeLog});
    }
  })
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow);

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (win === null) {
    createWindow();
  }
});
