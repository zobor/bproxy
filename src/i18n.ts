import dataset from './dataset';
import ILocalLanguage from '../types/i18n';

const { language } = dataset;
const lang = {
  CERT_EXIST: {
    en: '',
    'zh-cn': '证书已存在，不需要再创建了!'
  },
  CREATE_CERT_SUC: {
    en: '',
    'zh-cn': '证书创建成功',
  },
  CREATE_CERT_FAIL: {
    en: '',
    'zh-cn': '证书创建失败～',
  },
  TRUST_CERT_PWD: {
    en: '',
    'zh-cn': '信任证书，你需要可能需要输入计算机密码授权',
  },
  CERT_INSTALL_SUC: {
    en: '',
    'zh-cn': '证书安装成功',
  },
  CERT_INSTALL_FAIL: {
    en: '',
    'zh-cn': '证书安装失败',
  },
  INSTALL_TIPS: {
    en: 'auto instal certificate only support macOS\ndouble click bproxy.ca.crt to install',
    'zh-cn': '自动安装证书目前只支持MacOS系统，其他系统请双击证书安装！',
  },
  START_LOCAL_SVR_SUC: {
    en: '',
    'zh-cn': '本地代理服务器启动成功',
  },
  ERROR_CONFIG_PATH: {
    en: '',
    'zh-cn': '配置文件路径不能为空，你可以使用 . 来代表当前目录',
  },
};

const langLocal: ILocalLanguage = {};
Object.keys(lang).forEach((key) => {
  langLocal[key] = lang[key][language];
});

export default langLocal;
