type regxFunction = (url: string) => boolean;

declare namespace BproxyConfig {
  interface Header {
    [key: string]: string | number | boolean | null;
  }
  interface Rule {
    regx?: RegExp | string | regxFunction;
    url?: string | RegExp | function;
    target?: number | string;
    delay?: number;
    disableCache?: boolean;
    debug?: true | 'vconsole';
    file?: string;
    path?: string;
    redirect?: string;
    rewrite?: (pathname: string) => string;
    redirectTarget?: string;
    filepath?: string;
    cors?: boolean;
    responseHeaders?: Header;
    requestHeaders?: Header;
    response?: any;
    statusCode?: number;
    proxy?: string;
    host?: string;
    excludeResponseHeaders?: string[];
    followRedirect?: boolean;
    getRegExp$N?: () => string | undefined | null;
  }
  interface Certificate {
    filename: string;
    keyFileName: string;
    name: string;
    organizationName: string;
    OU: string;
    countryName: string;
    provinceName: string;
    localityName: string;
    keySize: number;
    getDefaultCABasePath: () => string;
    getDefaultCACertPath: () => string;
    getDefaultCAKeyPath: () => string;
  }

  interface ProxyCertificate {
    publicKey: string;
    serialNumber: string;
    validity: ProxyCertificateValidity;
    setSubject: any;
    setIssuer: any;
    setExtensions: any;
    sign: any;
  }

  interface ProxyCertificateInstallResponse {
    caCertPath: string;
    caKeyPath: string;
    create: boolean;
  }

  interface ProxyCertificateKey {
    publicKey: string;
    privateKey: string;
  }

  interface ProxyCertificateValidity {
    notBefore: Date;
    notAfter: Date;
  }

  interface ProxyCertificateConfig {
    filename: string;
    keyFileName: string;
    name: string;
    organizationName: string;
    OU: string;
    countryName: string;
    provinceName: string;
    localityName: string;
    keySize: number;
    getDefaultCABasePath: () => string;
    getDefaultCACertPath: () => string;
    getDefaultCAKeyPath: () => string;
  }

  interface Config {
    // 是否是debug模式，debug 模式可以查看控制台日志
    debug?: boolean;
    // 端口
    port?: number;
    // 抓取https包的白名单
    https?: boolean | string[];
    // 是否解所有https包
    sslAll?: boolean;
    // 匹配规则
    rules: IRule[];
    // 是否禁用浏览器缓存
    disableCache?: boolean;
    // 延时相应
    delay?: number;
  }
  interface DataSet {
    // 上一次的配置文件目录
    prevConfigPath?: string;
    // 当前配置文件的目录
    currentConfigPath?: string;
    // 当前的配置
    config?: Config;
  }

  interface MatcherResult {
    delay?: number;
    matched?: boolean;
    filepath?: string;
    rule?: Rule;
    responseHeaders?: NormalObject;
  }

  interface RequestOptions {
    method: string;
    url: string;
    headers: RequestHeaders;
    body: Buffer | null;
    encoding?: string | null;
    strictSSL?: boolean;
    rejectUnauthorized?: boolean;
    followRedirect?: boolean;
    followAllRedirects?: boolean;
    http2?: boolean;
  }

  interface ProxyCertificateCreateResponse {
    keyPem: any;
    certPem: any;
  }
}
