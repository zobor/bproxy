import { matcher } from '../src/proxy/matcher';
import { ProxyRule } from '../src/types/proxy';

describe('matcher', () => {
  it('regx is string with *', () => {
    const rs = matcher([
      {
        regx: 'https://google.com/*',
        redirect: 'http://localhost/',
      }
    ], 'https://google.com/a.js');
    expect(rs.matched).toBeTruthy();
    expect(rs?.rule?.redirectTarget).toEqual('http://localhost/a.js');
  });
  it('regx is string with * / redirect', () => {
    const rs = matcher([
      {
        regx: 'https://google.com/*',
        redirect: 'http://localhost/',
        rewrite: (path: string) => path.replace('_efg', ''),
      }
    ], 'https://google.com/abc_efg.js');
    expect(rs.matched).toBeTruthy();
    expect(rs?.rule?.redirectTarget).toEqual('http://localhost/abc.js');
  });
  it('regx is string with * / path', () => {
    const rs = matcher([
      {
        regx: 'https://google.com/*$',
        redirect: 'http://localhost/',
      }
    ], 'https://google.com/x/y/z/a.js');
    expect(rs.matched).toBeFalsy();
  });
  it('regx is string with **', () => {
    const rs = matcher([
      {
        regx: 'https://google.com/**',
        redirect: 'http://localhost/',
      }
    ], 'https://google.com/a.js');
    expect(rs.matched).toBeTruthy();
  });
  it('regx is RegExp', () => {
    const rs = matcher([
      {
        regx: /(\w+\.js)$/,
        redirect: 'http://localhost/',
      }
    ], 'https://google.com/a.js');
    expect(rs.matched).toBeTruthy();
    expect(rs?.rule?.redirectTarget).toEqual('http://localhost/a.js');
  });
  it('regx is string', () => {
    const rs = matcher([
      {
        regx: 'abc.js',
        redirect: 'http://localhost/',
      }
    ], 'https://google.com/abc.js');
    expect(rs.matched).toBeTruthy();
  });
  it('regx is function', () => {
    const rs = matcher([
      {
        regx: (url: string) => /(\w+\.js)$/.test(url),
        redirect: 'http://localhost/',
        rewrite: (path: string) => path.replace('bc', ''),
      }
    ], 'https://google.com/abc.js');
    expect(rs.matched).toBeTruthy();
    expect(rs?.filepath).toEqual('a.js');
  });
  it('regx is function', () => {
    const rs = matcher([
      {
        redirect: 'http://localhost/',
      } as ProxyRule
    ], 'https://google.com/abc.js');
    expect(rs.matched).toBeFalsy();
  });
})
