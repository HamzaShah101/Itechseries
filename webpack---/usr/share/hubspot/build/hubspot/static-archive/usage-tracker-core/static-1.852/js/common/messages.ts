import { prettyPrint, getObjectKeys } from './helpers';
/*
 * Note - this interface is intended only to
 * encapsulate debug log + error message formatting.
 */

const createLog = (type, name, message) => `
usage-tracker ${type}: "${name}"
----------------------------------------
${message}
`;

export const debugLog = (name, {
  eventKey,
  eventName,
  eventNamespace
}) => {
  const eventType = `[${prettyPrint(eventNamespace)}] ${prettyPrint(eventName)}`;
  const messages = {
    eventKey,
    eventType
  };
  return createLog('debug log', name, getObjectKeys(messages).reduce((accumulator, key) => {
    const value = messages[key];

    if (typeof value === 'string') {
      accumulator += `${key}: ${value}\n`;
    } else if (typeof value === 'object') {
      accumulator += `${key}: ${JSON.stringify(value, null, 2)}\n`;
    } else {
      accumulator += `${key}: ${typeof value}\n`;
    }

    return accumulator;
  }, ''));
};
export const genericWarning = message => new Error(`[usage-tracker warning] ${message} (This error does not break tracking or the execution thread.)`);
export const genericError = message => new Error(`[usage-tracker error] ${message} (This error breaks the execution thread.)`);
export const configError = message => new Error(`[usage-tracker config error] ${message} (This error breaks the execution thread.)`);
export const eventError = message => new Error(`[usage-tracker event error] ${message} (This error breaks tracking, but not the execution thread.)`);