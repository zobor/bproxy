import { certificate } from '../../config';

export const installMacCertificate = async () => {
  const filepath = certificate?.getDefaultCACertPath();

  return `sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ${filepath}`;
};
