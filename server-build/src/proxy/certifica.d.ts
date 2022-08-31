declare class Certificate {
    createCAForInstall(commonName: string): BproxyConfig.ProxyCertificateCreateResponse;
    create(caPath?: string): BproxyConfig.ProxyCertificateInstallResponse;
    init(): BproxyConfig.ProxyCertificateInstallResponse;
    fakeCertifaceCache: Record<string, {
        key: string;
        cert: any;
    }>;
    createFakeCertificateByDomain(caCert: any, caKey: any, domain: any): BproxyConfig.ProxyCertificateCreateResponse;
}
export default Certificate;
