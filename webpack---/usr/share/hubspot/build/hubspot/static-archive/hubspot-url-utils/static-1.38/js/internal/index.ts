"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHubletPostfix = getHubletPostfix;
exports.getSubDomain = getSubDomain;
exports.getDomain = getDomain;
exports.getEnvPostfix = getEnvPostfix;
exports.getDomainPrefix = getDomainPrefix;
exports.getHubletDomainPostfix = getHubletDomainPostfix;
exports.getTld = getTld;

var _enviro = _interopRequireDefault(require("enviro"));

var Hublets = _interopRequireWildcard(require("../hublets"));

function getHubletPostfix(overrideConfig) {
  const hasHubletOverride = overrideConfig && overrideConfig.hubletOverride;
  const hubletToUse = hasHubletOverride ? overrideConfig.hubletOverride : _enviro.default.getHublet();

  if (hubletToUse === Hublets.na1) {
    return '';
  }

  return `-${hubletToUse}`;
}

function getSubDomain(prefix, overrideConfig) {
  const hasHubletPostfixxOverride = overrideConfig && overrideConfig.hubletPostfixLocation && overrideConfig.hubletPostfixLocation === 'domain';

  if (hasHubletPostfixxOverride) {
    return prefix;
  }

  return `${prefix}${getHubletPostfix(overrideConfig)}`;
}

function getDomain(overrideConfig) {
  const domainPrefix = getDomainPrefix(overrideConfig);
  const envPostfix = getEnvPostfix(overrideConfig);
  const hubletDomainPostfix = getHubletDomainPostfix(overrideConfig);
  return `${domainPrefix}${envPostfix}${hubletDomainPostfix}`;
}

function getEnvPostfix(overrideConfig) {
  const hasEnvOverride = overrideConfig && overrideConfig.envOverride;
  const envToUse = hasEnvOverride ? overrideConfig.envOverride : _enviro.default.getShort();

  if (envToUse === 'qa') {
    return 'qa';
  }

  return '';
}

function getDomainPrefix(overrideConfig) {
  const hasDomainOverride = overrideConfig && overrideConfig.domainOverride;

  if (hasDomainOverride) {
    return overrideConfig.domainOverride;
  }

  return 'hubspot';
}

function getHubletDomainPostfix(overrideConfig) {
  const hasHubletPostfixxOverride = overrideConfig && overrideConfig.hubletPostfixLocation && overrideConfig.hubletPostfixLocation === 'domain';

  if (!hasHubletPostfixxOverride) {
    return '';
  }

  return getHubletPostfix(overrideConfig);
}

function getTld(overrideConfig) {
  const hasTldOverride = overrideConfig && overrideConfig.tldOverride;

  if (hasTldOverride) {
    return overrideConfig.tldOverride;
  }

  return 'com';
}