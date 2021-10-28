import dataset from '../src/proxy/utils/dataset';

describe('dataset.ts', () => {
  it('dataset {}', () => {
    dataset.configPath = '/a';
    expect(!!dataset.configPath).toBeTruthy();
  });
  it('dataset {}', () => {
    dataset.configPath = '/b';
    expect(dataset.configPath).toEqual('/b');
  });
});
