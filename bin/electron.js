const { app, BrowserWindow } = require('electron');
const bproxy = require('../server-build/proxy').default;
const { updateDataSet } = require('../server-build/proxy/dataset');
const { initElectronApi } = require('../server-build/proxy/api/index');

updateDataSet('platform', 'app');

let win;

initElectronApi();

async function createWindow() {
  // 创建浏览器窗口。
  await bproxy.start();
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
    },
    titleBarStyle: 'hidden',
    frame: false,
  });

  // win.maximize();
  win.webContents.session.setProxy({
    model: 'direct',
  });

  if (process.env.NODE_ENV === 'dev') {
    win.loadURL('http://127.0.0.1:8889');
    // 打开开发者工具
    win.webContents.openDevTools();
  } else {
    win.loadURL('http://127.0.0.1:8888');
  }

  // 在窗口加载完成后执行的代码
  win.webContents.on('did-finish-load', () => {
    // 添加自定义区域以支持拖动窗口
    const dragRegion = document.getElementById('drag-region');

    dragRegion.addEventListener('mousedown', (event) => {
      // 当鼠标按下时，开始捕获窗口移动事件
      mainWindow.webContents.executeJavaScript(`
        document.getElementById('drag-region').style.cursor = '-webkit-grabbing';
      `);
      mainWindow.webContents.beginFrameSubscription('mousemove', (event) => {
        // 当鼠标移动时，更新窗口的位置
        mainWindow.setPosition(event.screenX, event.screenY);
      });

      document.addEventListener('mouseup', () => {
        // 当鼠标松开时，停止捕获窗口移动事件
        mainWindow.webContents.executeJavaScript(`
          document.getElementById('drag-region').style.cursor = '-webkit-grab';
        `);
        mainWindow.webContents.endFrameSubscription();
      });
    });
  });

  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    win = null;
  });
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
