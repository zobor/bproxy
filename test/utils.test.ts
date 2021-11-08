import { createHttpHeader, isHttpsHostRegMatch, url2regx, utils, log, compareVersion } from '../src/proxy/utils/utils';

describe('utils.ts', () => {
  it('utils.guid', () => {
    const guid = utils.guid();
    expect(guid.length === 36).toBeTruthy();
    expect(guid.includes('-'));
  });
  it('utils.uuid', () => {
    const uuid = utils.uuid();
    expect(uuid.length === 12).toBeTruthy();
  });

  it('createHttpHeader', () => {
    const rs = createHttpHeader('http 2.0', {
      'content-type': 'application/json',
    });
    expect(rs.includes('content-type: application/json')).toBeTruthy();
  });

  it('url2regx', () => {
    const regx = url2regx('https://google.com/*');
    expect(regx.test('https://google.com/abc.js')).toBeTruthy();
  });
  it('url2regx', () => {
    const regx = url2regx('https://google.com/**');
    expect(regx.test('https://google.com/x/y/z/abc.js')).toBeTruthy();
  });
  it('url2regx', () => {
    const regx = url2regx('https://google.com/x/a.js');
    const target = /https:\/\/google.com\/x\/a.js/;

    expect(regx.toString() === target.toString()).toBeTruthy();
  });
  it('isHttpsHostRegMatch', () => {
    const list = ['google.com:443', 'baidu.com:443'];
    expect(isHttpsHostRegMatch(list, 'baidu.com:443')).toBeTruthy();
  });

  it('log', () => {
    log.info('123');
    log.info(123);
    log.warn({ name: "123" });
    log.error({ name: "123" });
  });

  it('compareVersion', () => {
    expect(compareVersion('1.0.0', '1.0.0')).toEqual(0);
    expect(compareVersion('1.0.1', '1.0.0')).toEqual(1);
    expect(compareVersion('1.1.0', '1.0.10')).toEqual(1);
    expect(compareVersion('5.1.1', '5.0.100')).toEqual(1);
  });
});
