declare namespace Bproxy {
  interface HandleResponseParams {
    req: any;
    res: any;
    responseHeaders: NormalObject;
    requestHeaders: NormalObject;
    delayTime?: number;
    matcherResult: any;
    postBodyData: Buffer | undefined;
    config: BproxyConfig.Config;
  }

  interface DataSet {
    prevConfigPath: string;
    currentConfigPath: string;
    config: BproxyConfig.Config;
    platform: 'bash' | 'app';
  }
}
