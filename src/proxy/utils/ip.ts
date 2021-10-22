import * as os from 'os';

export const getLocalIpAddress = () => {
  const ifaces = os.networkInterfaces();
  const Ips: any = [];
  for (const dev in ifaces) {
    (ifaces[dev] || []).forEach((details) => {
      if (details.family === "IPv4") {
        Ips.push(details.address);
      }
    });
  }
  return Ips;
};
