import { ProxyCertificateCreateResponse, ProxyCertificateInstallResponse } from '../types/proxy';
declare class Certificate {
    createCAForInstall(commonName: string): ProxyCertificateCreateResponse;
    install(caPath?: string): ProxyCertificateInstallResponse;
    init(): ProxyCertificateInstallResponse;
    createFakeCertificateByDomain(caCert: any, caKey: any, domain: any): ProxyCertificateCreateResponse;
}
export default Certificate;
