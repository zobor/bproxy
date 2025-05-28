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
