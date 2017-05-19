'use strict';

var path = require('path');

var config              = exports;
config.caCertFileName   = 'browser-proxy.ca.crt';
config.caKeyFileName    = 'browser-proxy.ca.key.pem';
config.caName           = 'browser-proxy-cert';
config.organizationName = 'zoborzhang';
config.OU               = 'http://zobor.me';
config.countryName      = 'CN';
config.provinceName     = 'GuangDong';
config.localityName     = 'ShenZhen';

config.getDefaultCABasePath = () => {
  const userHome = process.env.HOME || process.env.USERPROFILE;
  return path.resolve(userHome, './.AppData/browser-proxy');
};

config.getDefaultCACertPath = () => {
  return path.resolve(config.getDefaultCABasePath(), config.caCertFileName);
};

config.getDefaultCAKeyPath = () => {
  return path.resolve(config.getDefaultCABasePath(), config.caKeyFileName);
};