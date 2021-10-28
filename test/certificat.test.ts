import Certificate from '../src/proxy/certifica';

describe('Certificate', () => {
  const certificate = new Certificate();
  it('Certificate', () => {
    let error;
    try {
      certificate.install();
      const { key } = certificate.createCAForInstall('bproxy');
      expect(Object.keys(key).length > 0).toBeTruthy();
    } catch(err) {
      error = err;
    }

    expect(error === undefined).toBeTruthy();
  });
});
