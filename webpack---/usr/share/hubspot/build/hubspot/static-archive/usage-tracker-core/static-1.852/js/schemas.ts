import * as schema from './common/schema';
import * as messages from './common/messages';
import { safeGetOrDefault } from './common/helpers';
export const eventClasses = ['activation', 'creation', 'error', 'exposure', 'funnel', 'interaction', 'none', 'signup', 'usage', 'view', 'warning'];
export const eventPropertyTypes = ['boolean', 'string', 'number', 'array'];

/*
 *  Schema for createClient() function args
 */
const clientDependenciesSchemaRules = schema.Rules({
  clientName: {
    types: ['string'],
    default: 'custom'
  },
  getDebug: {
    types: ['function']
  },
  getEmail: {
    types: ['function']
  },
  getHubId: {
    types: ['function']
  },
  getHstc: {
    types: ['function']
  },
  getLang: {
    types: ['function']
  },
  getCurrentHref: {
    types: ['function'],
    default: () => safeGetOrDefault(['window', 'location', 'href'], '')
  },
  getReferrer: {
    types: ['function'],
    default: () => safeGetOrDefault(['document', 'referrer'], '')
  },
  getUserAgent: {
    types: ['function'],
    default: () => safeGetOrDefault(['navigator', 'userAgent'], '')
  },
  getNetworkType: {
    types: ['function'],
    default: () => safeGetOrDefault(['navigator', 'connection', 'effectiveType'], '')
  },
  getNetworkSpeed: {
    types: ['function'],
    default: () => safeGetOrDefault(['navigator', 'connection', 'downlink'], '')
  },
  getScreenWidth: {
    types: ['function'],
    default: () => safeGetOrDefault(['screen', 'width'], '')
  },
  getScreenHeight: {
    types: ['function'],
    default: () => safeGetOrDefault(['screen', 'height'], '')
  },
  getWindowWidth: {
    types: ['function'],
    default: () => safeGetOrDefault(['window', 'innerWidth'], '')
  },
  getWindowHeight: {
    types: ['function'],
    default: () => safeGetOrDefault(['window', 'innerHeight'], '')
  },
  getDeployableName: {
    types: ['function'],
    default: () => safeGetOrDefault(['window', 'hubspot', 'bender', 'currentProject'], '')
  },
  getDeployableVersion: {
    types: ['function'],
    default: () => safeGetOrDefault(['window', 'hubspot', 'bender', 'currentProjectVersion'], '')
  },
  getTempStorage: {
    types: ['function']
  },
  setTempStorage: {
    types: ['function']
  },
  logMessage: {
    types: ['function'],
    default: msg => {
      if (typeof safeGetOrDefault(['console', 'log'], '') === 'function') {
        console.log(msg);
      }
    }
  },
  logWarning: {
    types: ['function'],
    default: msg => {
      if (typeof safeGetOrDefault(['console', 'warn'], '') === 'function') {
        console.warn(msg);
      }
    }
  },
  logError: {
    types: ['function'],
    default: err => {
      if (typeof safeGetOrDefault(['console', 'error'], '') === 'function') {
        console.error(err);
      }
    }
  },
  reportError: {
    types: ['function']
  },
  send: {
    types: ['function']
  }
});
export const clientDependenciesSchema = schema.create('client dependency', messages.configError, clientDependenciesSchemaRules);
/*
 *  Schema for createTracker() function args
 */

const trackerConfigSchemaRules = schema.Rules({
  allowUnauthed: {
    types: ['boolean'],
    default: false
  },
  bypassPool: {
    types: ['boolean'],
    default: false
  },
  debug: {
    types: ['boolean', 'function']
  },
  events: {
    types: ['object']
  },
  isBeforeUnload: {
    types: ['boolean'],
    default: false
  },
  isExternalHost: {
    types: ['boolean'],
    default: false
  },
  lastKnownEventProperties: {
    types: ['array'],
    default: []
  },
  onError: {
    types: ['function']
  },
  onScheduled: {
    types: ['function'],
    default: () => {}
  },
  preserveTrackerProperties: {
    types: ['boolean'],
    default: true
  },
  preserveTrackerEvents: {
    types: ['boolean'],
    default: false
  },
  properties: {
    types: ['object'],
    default: {}
  }
}); // For this schema we don't use `schema.infer` because we have a mixed
// amount of optional and required properties that don't match well.
// For a future version we should refactor the schema.infer to handle properly
// The conditional that comes from the `overrides`

export const trackerConfigSchema = schema.create('config option', messages.configError, trackerConfigSchemaRules);
/*
 *  Schema for tracker properties
 */

const trackerPropertiesSchemaRules = schema.Rules({
  email: {
    types: ['string', 'function', 'object']
  },
  hubId: {
    types: ['number', 'function', 'object']
  },
  hstc: {
    types: ['string', 'function', 'object']
  },
  lang: {
    types: ['string', 'function', 'object']
  }
}); // This type differs from the `trackerPropertiesSchema` because these properties (`email`, `hubId`, `hstc`, `lang`)
// are added when the config is parsed on `parseConfig` within `tracker.ts`

export const trackerPropertiesSchema = schema.create('tracker properties', messages.configError, trackerPropertiesSchemaRules, false);
/*
 *  Schema for events.yaml definitions
 */

const eventDefinitionSchemaRules = schema.Rules({
  name: {
    types: ['string']
  },
  namespace: {
    types: ['string'],
    default: ''
  },
  class: {
    types: ['string'],
    oneOf: eventClasses
  },
  version: {
    types: ['string'],
    default: 'v1'
  },
  properties: {
    types: ['object'],
    default: {}
  }
});
export const eventDefinitionSchema = schema.create('event property', messages.configError, eventDefinitionSchemaRules);
/*
 *  Schema for events.yaml event properties
 */

const eventPropertySchemaRules = schema.Rules({
  type: {
    types: ['string', 'array'],
    oneOf: eventPropertyTypes
  },
  isOptional: {
    types: ['boolean'],
    default: false
  }
});
export const eventPropertySchema = schema.create('event property', messages.configError, eventPropertySchemaRules);