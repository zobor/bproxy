import { formatSeconds } from '../src/proxy/utils/format';

describe('format.ts', () => {
  it('formatSeconds', () => {
    expect(formatSeconds(500)).toEqual('500ms');
    expect(formatSeconds(1340)).toEqual('1.3s');
    expect(formatSeconds(1350)).toEqual('1.4s');
  });
});
