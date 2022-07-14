import { configError, genericError } from './common/messages';
import { defaults, omit, shallowCopy, resolveAsyncProperties, getObjectKeys, pick } from './common/helpers';
import { trackerConfigSchema, trackerPropertiesSchema } from './schemas';

const getDefinition = (config, eventKey, eventProperties) => {
  const {
    events,
    logError,
    onError,
    dictionaryLookup: dictionaryLookupFunc
  } = config;

  try {
    return dictionaryLookupFunc(events, eventKey, eventProperties);
  } catch (err) {
    const stringifiedProperties = JSON.stringify(eventProperties);

    if (typeof onError === 'function') {
      onError(err, {
        extra: {
          eventProperties: stringifiedProperties
        }
      });
    }

    logError(err);
    return null;
  }
};

const getIdentifiers = (config, event) => {
  const {
    createIdentifiers: createIdentifiersFunc,
    allowUnauthed,
    isExternalHost,
    logError,
    onError
  } = config;
  const {
    email,
    userId,
    hubId,
    hstc,
    device_id: deviceId,
    hasDeviceIdOverride
  } = event;

  try {
    return createIdentifiersFunc({
      email,
      userId,
      hubId,
      hstc,
      deviceId: hasDeviceIdOverride ? deviceId : null
    }, {
      allowUnauthed,
      isExternalHost
    });
  } catch (err) {
    if (typeof onError === 'function') {
      onError(err);
    }

    logError(err);
    return null;
  }
};

const createEvent = (config, definition, identifiers, eventProperties) => {
  const {
    createEventPayload: createEventPayloadFunc,
    logError,
    onError
  } = config;

  try {
    return createEventPayloadFunc(definition, eventProperties, identifiers);
  } catch (err) {
    if (typeof onError === 'function') {
      onError(err);
    }

    logError(err);
    return null;
  }
};

const onScheduled = (config, eventKey, event, expectedPropertiesKeys, receivedPropertiesKeys) => {
  const debug = typeof config.debug === 'function' ? config.debug() : config.debug;

  if (typeof config.onScheduled === 'function') {
    config.onScheduled(eventKey);
  }

  try {
    if (debug) {
      config.logDebug(eventKey, event);
    }

    config.logUnexpectedProperties(eventKey, expectedPropertiesKeys, receivedPropertiesKeys);
  } catch (err) {
    /* NoOp */
  }
};

const trackEvent = (config, eventKey, mergedProperties, eventPropertiesKeys) => {
  const definition = getDefinition(config, eventKey, mergedProperties);
  if (!definition) return false;
  const identifiers = getIdentifiers(config, mergedProperties);
  if (!identifiers) return false;
  delete mergedProperties.hasDeviceIdOverride;
  const event = createEvent(config, definition, identifiers, mergedProperties);
  if (!event) return false;
  config.scheduleEvent(config, identifiers, eventKey, event);
  onScheduled(config, eventKey, event, getObjectKeys(definition.properties), eventPropertiesKeys);
  return true;
};

const parseConfig = (trackerDependencies, config) => {
  if (!config || typeof config !== 'object') {
    throw configError(`Invalid argument. The "createTracker" function requires to be passed a config argument of type "object". Received type "${typeof config}".`);
  }
  /*
   *  Apply defualts to schemas.
   *  Defaults such as onError are not known until runtime.
   */


  const trackerConfigSchemaWithDefaults = trackerConfigSchema.mutate(schema => {
    schema.debug.default = trackerDependencies.getDebug;
    schema.onError.default = trackerDependencies.reportError;
    return schema;
  });
  const trackerPropertiesSchemaWithDefaults = trackerPropertiesSchema.mutate(schema => {
    schema.email.default = trackerDependencies.getEmail;
    schema.hubId.default = trackerDependencies.getHubId;
    schema.hstc.default = trackerDependencies.getHstc;
    schema.lang.default = trackerDependencies.getLang;
    return schema;
  });
  /*
   *  Normalize & validate tracker config + properties.
   */

  const parsedConfig = trackerConfigSchemaWithDefaults.normalize(config);
  trackerConfigSchemaWithDefaults.validate(parsedConfig, '"createTracker"'); // We set them to `Record<string, JsonValue>` since the actual parsed tracker properties
  // Contains `trackerPropertiesSchemaWithDefaults` + all the passed properties from the `config`

  const parsedTrackerProperties = trackerPropertiesSchemaWithDefaults.normalize(parsedConfig.properties || {});
  trackerPropertiesSchemaWithDefaults.validate(parsedTrackerProperties, '"createTracker"');
  const dictionary = trackerDependencies.createDictionary( // Since the events from parsedConfig.events "might be unknown"
  // We want to ensure that they are known before we try to use them.
  parsedConfig.events, '"createTracker"');
  return Object.assign({
    events: dictionary,
    properties: parsedTrackerProperties
  }, omit(parsedConfig, ['events', 'properties']), {}, trackerDependencies);
};

export const createLockedTracker = (trackerDependencies, config = {}) => {
  const parsedConfig = parseConfig(trackerDependencies, config);
  const lastKnownPropertyCache = {};
  let properties = Object.assign({}, parsedConfig.properties);
  /*
   *  Syncs lastKnownEventProperties each
   *  time an event is tracked with eventProperties.
   */

  const lastKnownPropertyCacheSync = eventProperties => {
    const lastKnownEventProperties = parsedConfig.lastKnownEventProperties;

    if (lastKnownEventProperties && lastKnownEventProperties.length) {
      lastKnownEventProperties.forEach(key => {
        let value = eventProperties[key];

        if (value !== undefined) {
          lastKnownPropertyCache[key] = value;
        } else {
          value = lastKnownPropertyCache[key];
        }

        if (value && value !== properties[key]) {
          properties[key] = value;
        }
      });
    }
  };

  return {
    clone: (overrides = {}) => {
      if (!overrides || typeof overrides !== 'object') {
        throw genericError(`Invalid argument. The "clone" method requires to be passed a valid tracker config of type "object". Received type "${typeof overrides}".`);
      } // There are some typing issues in making TS understand that keyof Dependencies[] is part of
      // keyof TrackerConfig[] so we assign the type as []
      // Also we cannot convert the TrackerConfigSchema


      const mergedConfig = omit(defaults(overrides, parsedConfig), getObjectKeys(trackerDependencies)); // Get only the default properties

      const supportedProperties = pick(properties, trackerPropertiesSchema.getKeys()); // Get only the non-default properties

      const arbitraryProperties = omit(properties, getObjectKeys(supportedProperties));
      mergedConfig.properties = defaults(overrides.properties || {}, supportedProperties); // If we want to preserve the tracker properties we also copy the non-default properties

      if (mergedConfig.preserveTrackerProperties) {
        mergedConfig.properties = defaults(mergedConfig.properties, arbitraryProperties);
      }

      if (mergedConfig.preserveTrackerEvents) {
        mergedConfig.events = defaults( // The type of the events from the `overrides` is `unknown` since it comes from `events.yaml`
        // For that we override the type here letting TypeScript know it is guaranteed to be a Record<string, any>
        // In the future we could make a workaround where the type for creating a tracker.events is `unknown`
        mergedConfig.events || {}, parsedConfig.events);
      }

      return createLockedTracker(trackerDependencies, mergedConfig);
    },
    getConfig: () => {
      const debug = typeof parsedConfig.debug === 'function' ? parsedConfig.debug() : parsedConfig.debug;

      if (debug) {
        return Object.assign({}, omit(parsedConfig, ['properties']), {
          properties
        });
      }

      throw genericError(`Invalid call. This method should only be used when 'debug: true'. Please do not use this in production.`);
    },
    setProperties: (newProperties = {}) => {
      if (!newProperties || typeof newProperties !== 'object') {
        throw genericError(`Invalid argument. The "setProperties" method requires to be passed a properties argument of type "object". Received type "${typeof newProperties}".`);
      }

      getObjectKeys(newProperties).forEach(key => {
        const value = newProperties[key];
        properties[key] = value;
      });
    },
    track: (eventKey, eventProperties = {}) => {
      if (!eventKey || typeof eventKey !== 'string') {
        throw genericError(`Invalid argument. The "track" method requires to be passed an eventKey of type "string". Received type "${typeof eventKey}".`);
      }

      if (!eventProperties || typeof eventProperties !== 'object') {
        throw genericError(`Invalid argument. The "track" method requires the 2nd arg to be passed eventProperties of type "object". Received type "${typeof eventProperties}".`);
      }

      const eventPropertiesKeys = getObjectKeys(eventProperties);
      const eventPropertiesCopy = Object.assign({}, eventProperties, {
        eventKey
      }); // The deviceId property is only a string and not a number or boolean
      // It might also be null or undefined

      const deviceIdOverride = eventPropertiesCopy.deviceId || properties.deviceId;
      const metaProperties = shallowCopy(parsedConfig.getMetaProperties({
        deviceIdOverride
      }));
      resolveAsyncProperties(properties, resolved => {
        properties = defaults(resolved, properties);
        const arbitraryProperties = defaults(eventPropertiesCopy, // We tell TypeScript that properties here are resolved
        shallowCopy(properties));
        const mergedProperties = defaults(arbitraryProperties, metaProperties);
        lastKnownPropertyCacheSync(mergedProperties);
        trackEvent(parsedConfig, eventKey, mergedProperties, eventPropertiesKeys);
      }, parsedConfig.onError);
    }
  };
};