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
