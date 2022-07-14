// Represents an object that contains Raven
// Just a generic type to represent a generic Record
const hasRaven = obj => {
  return typeof obj['Raven'] !== 'undefined' && typeof obj['Raven'].captureException === 'function' && typeof obj['Raven'].captureMessage === 'function';
};

const hasLocalStorage = () => {
  try {
    return typeof window === 'object' && Boolean(window.localStorage);
  } catch (err) {
    // window.localStorage might throw an exception if you're within an `iframe`
    // As the `window` will deny your access to the localStorage
    return false;
  }
};

const hasCookieAccess = () => {
  try {
    return typeof navigator === 'object' && navigator.cookieEnabled || typeof document === 'object' && Boolean(document.cookie);
  } catch (err) {
    // document.cookie might throw an exception if you're within an `iframe`
    // As the `document` will deny your access on the document cookie
    return false;
  }
};

const hasBeaconSupport = () => {
  return typeof navigator === 'object' && typeof navigator['sendBeacon'] === 'function';
};

export { hasRaven, hasLocalStorage, hasCookieAccess, hasBeaconSupport };