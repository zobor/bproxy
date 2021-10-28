import config from "../src/proxy/config";

describe("config.ts", () => {
  it("config", () => {
    expect(Object.keys(config).length > 3).toBeTruthy();
  });

  it('config.certificate.getDefaultCABasePath', () => {
    const filepath = config.certificate?.getDefaultCABasePath();
    expect(filepath.length > 10).toBeTruthy();
  });

  it('config.certificate.getDefaultCACertPath', () => {
    const filepath = config.certificate?.getDefaultCACertPath();
    expect(filepath.length > 10).toBeTruthy();
  });

  it('config.certificate.getDefaultCAKeyPath', () => {
    const filepath = config.certificate?.getDefaultCAKeyPath();
    expect(filepath.length > 10).toBeTruthy();
  });
});
