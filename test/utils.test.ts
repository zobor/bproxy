import { createHttpHeader, url2regx, utils } from '../src/proxy/utils/utils';

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
});
