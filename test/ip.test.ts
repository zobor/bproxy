import { getLocalIpAddress } from '../src/proxy/utils/ip';

describe('ip.ts', () => {
  it('getLocalIpAddress', () => {
    const ips = getLocalIpAddress();
    expect(Array.isArray(ips)).toBeTruthy();
  });
});
