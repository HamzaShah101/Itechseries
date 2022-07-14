import * as schemas from './schemas';
import * as eventPoolInterface from './eventPool';
import * as eventInterface from './event';
import * as dictionaryInterface from './dictionary';
import * as identifiersInterface from './identifiers';
import * as loggersInterface from './loggers';
import * as metaPropertiesInterface from './metaProperties';
import * as trackerInterface from './tracker';
import * as storageKeys from './storageKeys';
export const createClient = (dependencies = {}) => {
  /*
   * Step 1: Normalize & validate client dependencies
   */
  const parsedDependencies = schemas.clientDependenciesSchema.normalize(dependencies);
  schemas.clientDependenciesSchema.validate(parsedDependencies, '"createClient"', err => {
    /* Rethrow to break execution thread */
    throw err;
  });
  /*
   * Step 2: Build the client with those dependencies
   */

  const {
    clientName,
    getDebug,
    getEmail,
    getHubId,
    getHstc,
    getLang,
    getCurrentHref,
    getReferrer,
    getUserAgent,
    getNetworkType,
    getNetworkSpeed,
    getScreenWidth,
    getScreenHeight,
    getWindowWidth,
    getWindowHeight,
    getDeployableName,
    getDeployableVersion,
    getTempStorage,
    logMessage,
    logWarning,
    logError,
    reportError,
    send,
    setTempStorage
  } = parsedDependencies;
  const eventPool = eventPoolInterface.createEventPool({
    getTempStorage,
    setTempStorage
  });

  const sendToNetwork = ({
    identifiers,
    isBeforeUnload = false,
    isExternalHost = false
  }, events) => {
    const isAuthed = !!(identifiers.raw.email && identifiers.raw.hubId);
    let query = `clientSendTimestamp=${Date.now()}`;

    if (isExternalHost) {
      query = `${query}&dil=true`;
    }

    send({
      events,
      isBeforeUnload,
      isAuthed,
      query
    });
  };

  const flushPoolAndSendToNetwork = ({
    identifiers
  }) => {
    const events = eventPool.flush();

    if (events && events.length) {
      sendToNetwork({
        identifiers
      }, events);
    }
  };

  const sendToPool = ({
    identifiers
  }, event) => {
    if (!eventPool.getIsInitialized()) {
      eventPool.initialize({
        normalizeEvent: (...eventToNormalize) => eventInterface.normalizeIdentifiers(identifiers, ...eventToNormalize)
      });
    }

    eventPool.push(event);
    eventPoolInterface.scheduleFlush(() => flushPoolAndSendToNetwork({
      identifiers
    }));
  };

  const getShouldRecordEvents = () => getTempStorage(storageKeys.recorderEnabled) === 'true';

  const safeRecordToStorage = (storageKey, data, limit) => {
    try {
      const records = JSON.parse(getTempStorage(storageKey) || JSON.stringify([]));

      if (limit && records.length >= limit) {
        records.shift();
      }

      records.push(data);
      setTempStorage(storageKey, JSON.stringify(records));
    } catch (err) {
      /* NOOP */
    }
  };

  const getMetaProperties = args => metaPropertiesInterface.getMetaProperties({
    clientName,
    getCurrentHref,
    getReferrer,
    getUserAgent,
    getNetworkType,
    getNetworkSpeed,
    getScreenWidth,
    getScreenHeight,
    getWindowWidth,
    getWindowHeight,
    getDeployableName,
    getDeployableVersion,
    getTempStorage,
    setTempStorage
  }, args);

  const scheduleEvent = ({
    bypassPool,
    isBeforeUnload,
    isExternalHost
  }, identifiers, eventKey = '', event = {}) => {
    const shouldPool = !bypassPool && !isBeforeUnload;

    if (shouldPool) {
      sendToPool({
        identifiers
      }, event);
    } else {
      sendToNetwork({
        identifiers,
        isBeforeUnload,
        isExternalHost
      }, [event]);
    }

    if (getShouldRecordEvents()) {
      safeRecordToStorage(storageKeys.recordedEventKeys, eventKey, 1000);
      safeRecordToStorage(storageKeys.recordedEvents, event, 25);
    }
  };

  return {
    createTracker: config => trackerInterface.createLockedTracker({
      createIdentifiers: identifiersInterface.createIdentifiers,
      createEventPayload: eventInterface.createEventPayload,
      createDictionary: dictionaryInterface.createDictionary,
      dictionaryLookup: dictionaryInterface.dictionaryLookup,
      getMetaProperties,
      getDebug,
      getEmail,
      getHubId,
      getHstc,
      getLang,
      logError,
      logDebug: loggersInterface.createDebugLogger(logMessage),
      logUnexpectedProperties: loggersInterface.createUnexpectedPropertiesLogger(logWarning),
      reportError,
      scheduleEvent
    }, config)
  };
};