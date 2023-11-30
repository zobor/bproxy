import * as os from 'os';

let ip = null;

export const getLocalIpAddress = () => {
  if (ip) {
    return [ip];
  }
  const ifaces = os.networkInterfaces();
  const Ips: any = [];
  for (const dev in ifaces) {
    (ifaces[dev] || []).forEach((details) => {
      if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
        Ips.push(details.address);
      }
    });
  }
  if (Ips.length) {
    ip = Ips[0];
  }
  return Ips;
};

export function isIp(str) {
  return /^((([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\.){3}([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]))$/.test(str);
}

export function isHttpsWithIp(str) {
  if (!str) return false;
  const [ip, port] = str.split(':');
  if (ip && port === '443') {
    return isIp(ip);
  }
  return false;
}
