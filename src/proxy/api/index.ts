import logger from '../logger';
import dataset from '../utils/dataset';

let electronApi: any = null;
export const getElectronApi = () => {
  if (!electronApi) {
    electronApi = require('./electronApi');
  }

  return electronApi;
}

export const isApp = () => dataset.platform === 'app';

export const isBash = () => dataset.platform === 'bash';

export async function showError(text: string) {
  if (isApp()) {
    return electronApi?.showErrorDialog(text);
  }
  logger.error(text);
}


export async function previewTextFile(appInfoLogFilePath: string) {
  if (isApp()) {
    return electronApi?.openAndPreviewTextFile({ url: appInfoLogFilePath, width: 0, height: 0})
  }
}

export async function showBproxyHome() {
  if (isApp()) {
    return electronApi?.showHomePage();
  }
}


export async function showSelectPath() {
  if (isApp()) {
    return electronApi?.showSelectPathDialog();
  }
}

export async function showUpgrade(data: { version: string; changeLog: string[]}) {
  if (isApp()) {
    return electronApi?.showUpgradeDialog({ changeLog: data?.changeLog || []});
  }

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
}
