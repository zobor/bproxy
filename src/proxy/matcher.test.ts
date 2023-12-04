import { get } from 'lodash';
import preload from './configPreload';
import { matcher } from './matcher';

describe('matcher', () => {
  it('matcher without regx', async () => {
    const rs = matcher(
      (
        await preload({
          rules: [{}],
        } as any)
      ).rules,
      'https://v.qq.com/google',
    );
    expect(rs.matched).toBeFalsy();
  });
  // string
  it('matcher normal string url', async () => {
    const rs = matcher(
      (
        await preload({
          rules: [
            {
              url: 'google',
              target: '',
            },
          ],
        })
      ).rules,
      'https://v.qq.com/google',
    );
    expect(rs.matched).toBeTruthy();
    expect(rs.delay).toEqual(0);
    expect(get(rs, `responseHeaders['x-bproxy-matched']`)).toBeTruthy();
    expect(rs?.rule?.target).toEqual('');
  });

  // string like regx
  it('matcher regx like url', async () => {
    const rs = matcher(
      (
        await preload({
          rules: [
            {
              url: 'qq.com',
              target: '',
            },
          ],
        })
      ).rules,
      'https://v.qq.com',
    );
    expect(rs.matched).toBeTruthy();
    expect(rs.delay).toEqual(0);
    expect(get(rs, `responseHeaders['x-bproxy-matched']`)).toBeTruthy();
    expect(rs?.rule?.target).toEqual('');
  });

  it('matcher regx like url, with *', async () => {
    const rs = matcher(
      (
        await preload({
          rules: [
            {
              url: 'qq.com/*',
              target: '',
            },
          ],
        })
      ).rules,
      'https://v.qq.com/a.html',
    );
    expect(rs.matched).toBeTruthy();
    expect(rs.delay).toEqual(0);
    expect(get(rs, `responseHeaders['x-bproxy-matched']`)).toBeTruthy();
    expect(rs?.rule?.target).toEqual('');
  });

  it('matcher regx like url, with *, error case', async () => {
    const rs = matcher(
      (
        await preload({
          rules: [
            {
              url: 'qq.com/*',
              target: '',
            },
          ],
        })
      ).rules,
      'https://v.qq.com/a/b/c',
    );
    expect(rs.matched).toBeTruthy();
    expect(rs.delay).toEqual(0);
    expect(get(rs, `responseHeaders['x-bproxy-matched']`)).toBeTruthy();
    expect(rs?.rule?.target).toEqual('');
    console.log(rs);
  });

  // regx
  it('matcher regx type', async () => {
    const rs = matcher(
      (
        await preload({
          rules: [
            {
              url: /\/google\/(\S+)/,
              redirect: 'https://qq.com/google/',
            },
          ],
        })
      ).rules,
      'https://v.qq.com/abc/google/index.html',
    );
    expect(rs.matched).toBeTruthy();
    expect(rs.delay).toEqual(0);
    expect(get(rs, `responseHeaders['x-bproxy-matched']`)).toBeTruthy();
    expect(rs?.rule?.redirect).toEqual('https://qq.com/google/');
    expect(get(rs, 'rule.redirectTarget')).toEqual('https://qq.com/google/index.html');
  });

  it('matcher regx type error case', async () => {
    const rs = matcher(
      (
        await preload({
          rules: [
            {
              url: /\/google$/,
              target: '',
            },
          ],
        })
      ).rules,
      'https://v.qq.com/google/a.html',
    );
    expect(rs.matched).toBeFalsy();
    expect(rs.delay).toEqual(undefined);
    expect(get(rs, `responseHeaders['x-bproxy-matched']`)).toEqual(undefined);
    expect(rs.rule === undefined).toBeTruthy();
  });

  it('matcher regx function type', async () => {
    const rs = matcher(
      (
        await preload({
          rules: [
            {
              url: (url: string) => {
                return url.includes('/google2');
              },
              target: '',
            },
          ],
        })
      ).rules,
      'https://v.qq.com/google',
    );
    expect(rs.matched).toBeFalsy();
    expect(rs.delay).toEqual(undefined);
    expect(get(rs, `responseHeaders['x-bproxy-matched']`)).toEqual(undefined);
    expect(rs?.rule?.target).toEqual(undefined);
  });

  // string
});
