'use strict'
var forge = require('node-forge')
var pki = forge.pki
var fs = require('fs')
var path = require('path')
var config = require('./cert')
var _ = require('lodash')
var mkdirp = require('mkdirp')
var colors = require('colors')

var utils = exports

var createCA = function(CN) {

    var keys = pki.rsa.generateKeyPair(1024)
    var cert = pki.createCertificate()
    cert.publicKey = keys.publicKey
    cert.serialNumber = new Date().getTime() + ''
    cert.validity.notBefore = new Date()
    cert.validity.notBefore.setFullYear(cert.validity.notBefore.getFullYear() - 5)
    cert.validity.notAfter = new Date()
    cert.validity.notAfter.setFullYear(cert.validity.notAfter.getFullYear() + 20)
    var attrs = [{
        name: 'commonName',
        value: CN
    }, {
        name: 'countryName',
        value: config.countryName
    }, {
        shortName: 'ST',
        value: config.provinceName
    }, {
        name: 'localityName',
        value: config.localityName
    }, {
        name: 'organizationName',
        value: config.organizationName
    }, {
        shortName: 'OU',
        value: config.OU
    }]
    cert.setSubject(attrs)
    cert.setIssuer(attrs)
    cert.setExtensions([{
        name: 'basicConstraints',
        critical: true,
        cA: true
    }, {
        name: 'keyUsage',
        critical: true,
        keyCertSign: true
    }, {
        name: 'subjectKeyIdentifier'
    }])

    // self-sign certificate
    cert.sign(keys.privateKey, forge.md.sha256.create())

    return {
        key: keys.privateKey,
        cert: cert
    }
}

var init = function() {
    var basePath = arguments.length <= 0 || arguments[0] === undefined ? config.getDefaultCABasePath() : arguments[0]


    var caCertPath = path.resolve(basePath, config.caCertFileName)
    var caKeyPath = path.resolve(basePath, config.caKeyFileName)

    try {
        fs.accessSync(caCertPath, fs.F_OK)
        fs.accessSync(caKeyPath, fs.F_OK)

        // has exist
        return {
            caCertPath: caCertPath,
            caKeyPath: caKeyPath,
            create: false
        }
    } catch (e) {

        var caObj = createCA(config.caName)

        var caCert = caObj.cert
        var cakey = caObj.key

        var certPem = pki.certificateToPem(caCert)
        var keyPem = pki.privateKeyToPem(cakey)

        mkdirp.sync(path.dirname(caCertPath))
        fs.writeFileSync(caCertPath, certPem)
        fs.writeFileSync(caKeyPath, keyPem)
    }
    return {
        caCertPath: caCertPath,
        caKeyPath: caKeyPath,
        create: true
    }
}

var covertNodeCertToForgeCert = function(originCertificate) {
    var obj = forge.asn1.fromDer(originCertificate.raw.toString('binary'))
    return forge.pki.certificateFromAsn1(obj)
}

var createFakeCertificateByDomain = function(caKey, caCert, domain) {
    var keys = pki.rsa.generateKeyPair(1024)
    var cert = pki.createCertificate()
    cert.publicKey = keys.publicKey

    cert.serialNumber = new Date().getTime() + ''
    cert.validity.notBefore = new Date()
    cert.validity.notBefore.setFullYear(cert.validity.notBefore.getFullYear() - 1)
    cert.validity.notAfter = new Date()
    cert.validity.notAfter.setFullYear(cert.validity.notAfter.getFullYear() + 1)
    var attrs = [{
        name: 'commonName',
        value: domain
    }, {
        name: 'countryName',
        value: config.countryName
    }, {
        shortName: 'ST',
        value: config.provinceName
    }, {
        name: 'localityName',
        value: config.localityName
    }, {
        name: 'organizationName',
        value: config.organizationName
    }, {
        shortName: 'OU',
        value: config.OU
    }]

    cert.setIssuer(caCert.subject.attributes)
    cert.setSubject(attrs)

    cert.setExtensions([{
        name: 'basicConstraints',
        critical: true,
        cA: false
    }, {
        name: 'keyUsage',
        critical: true,
        digitalSignature: true,
        contentCommitment: true,
        keyEncipherment: true,
        dataEncipherment: true,
        keyAgreement: true,
        keyCertSign: true,
        cRLSign: true,
        encipherOnly: true,
        decipherOnly: true
    }, {
        name: 'subjectAltName',
        altNames: [{
            type: 2,
            value: domain
        }]
    }, {
        name: 'subjectKeyIdentifier'
    }, {
        name: 'extKeyUsage',
        serverAuth: true,
        clientAuth: true,
        codeSigning: true,
        emailProtection: true,
        timeStamping: true
    }, {
        name: 'authorityKeyIdentifier'
    }])
    cert.sign(caKey, forge.md.sha256.create())

    return {
        key: keys.privateKey,
        cert: cert
    }
}

var createFakeCertificateByCA = function(caKey, caCert, originCertificate) {
    var certificate = covertNodeCertToForgeCert(originCertificate)

    var keys = pki.rsa.generateKeyPair(1024)
    var cert = pki.createCertificate()
    cert.publicKey = keys.publicKey

    cert.serialNumber = certificate.serialNumber
    cert.validity.notBefore = new Date()
    cert.validity.notBefore.setFullYear(cert.validity.notBefore.getFullYear() - 1)
    cert.validity.notAfter = new Date()
    cert.validity.notAfter.setFullYear(cert.validity.notAfter.getFullYear() + 1)

    cert.setSubject(certificate.subject.attributes)
    cert.setIssuer(caCert.subject.attributes)

    certificate.subjectaltname && (cert.subjectaltname = certificate.subjectaltname)

    var subjectAltName = _.find(certificate.extensions, {
        name: 'subjectAltName'
    })
    cert.setExtensions([{
        name: 'basicConstraints',
        critical: true,
        cA: false
    }, {
        name: 'keyUsage',
        critical: true,
        digitalSignature: true,
        contentCommitment: true,
        keyEncipherment: true,
        dataEncipherment: true,
        keyAgreement: true,
        keyCertSign: true,
        cRLSign: true,
        encipherOnly: true,
        decipherOnly: true
    }, {
        name: 'subjectAltName',
        altNames: subjectAltName.altNames
    }, {
        name: 'subjectKeyIdentifier'
    }, {
        name: 'extKeyUsage',
        serverAuth: true,
        clientAuth: true,
        codeSigning: true,
        emailProtection: true,
        timeStamping: true
    }, {
        name: 'authorityKeyIdentifier'
    }])
    cert.sign(caKey, forge.md.sha256.create())

    return {
        key: keys.privateKey,
        cert: cert
    }
}

module.exports = {
    init: init,
    createFakeCertificateByDomain: createFakeCertificateByDomain,
    createFakeCertificateByCA: createFakeCertificateByCA
}