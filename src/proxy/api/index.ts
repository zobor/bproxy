import chalk from 'chalk';
import logger from '../logger';
import { isApp } from '../dataset';

let electronApi: any = null;
export const initElectronApi = () => {
  if (!electronApi) {
    electronApi = require('./electronApi');
  }

  return electronApi;
};

export async function showError(text: string) {
  if (isApp()) {
    return electronApi?.showErrorDialog(text);
  }
  logger.error(text);
}

export async function previewTextFile(appInfoLogFilePath: string) {
  if (isApp()) {
    return electronApi?.openAndPreviewTextFile({ url: appInfoLogFilePath, width: 0, height: 0 });
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

export async function showUpgrade(data: { version: string; changeLog: string[] }) {
  if (!(data && data.version)) {
    return;
  }
  if (isApp()) {
    return electronApi?.showUpgradeDialog({ changeLog: data?.changeLog || [] });
  }

  console.log(chalk.redBright('########################################'));
  console.log(chalk.redBright(`bproxy有新版本（${data.version}）可以升级，请尽快升级`));
  console.log(chalk.redBright('########################################'));
  process.exit();
}
