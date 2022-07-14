import { prettyPrint } from './common/helpers';
import { debugLog, genericWarning } from './common/messages';
export const createUnexpectedPropertiesLogger = logWarning => {
  const cache = {};
  return (eventKey, expectedPropertiesKeys, receivedPropertiesKeys) => {
    const cacheKey = `${eventKey}:::${receivedPropertiesKeys.join('-')}`;
    const prettifiedKeys = expectedPropertiesKeys.map(prettyPrint);

    if (!cache[cacheKey]) {
      cache[cacheKey] = true;
      const unexpectedProperties = receivedPropertiesKeys.filter(key => prettifiedKeys.indexOf(prettyPrint(key.toString())) === -1);

      if (unexpectedProperties.length) {
        logWarning(genericWarning(`Event ${eventKey} was tracked with unexpected properties [${unexpectedProperties.join(', ')}]. Future releases of usage-tracker-js will not track unexpected properties. Add these properties to their events.yaml definition(s) to avoid disruption.`));
      }
    }
  };
};
export const createDebugLogger = logMessage => (eventKey, event) => {
  logMessage(debugLog('event scheduled to be sent', {
    eventKey: `"${eventKey}"`,
    eventName: event.what_event,
    eventNamespace: event.where_app
  }));
  const prettifiedPayload = JSON.parse(JSON.stringify(event));
  prettifiedPayload.what_extra_json = JSON.parse(prettifiedPayload.what_extra_json);
  logMessage(prettifiedPayload);
};