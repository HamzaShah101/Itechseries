// @ts-expect-error ts-migrate(7016) // Module doesn't have TypeScript annotations
import { getCookie } from 'hub-http/helpers/cookies';
import { hstcKey } from 'usage-tracker-core/storageKeys';
import * as browserHelper from '../helpers/browserHelper';
const hasCookieAccess = browserHelper.hasCookieAccess(); // This represents two months in miliseconds

const defaultCookieExpiration = 60 * 24 * 60 * 60 * 1000;
export const get = key => {
  return hasCookieAccess ? getCookie(key, document.cookie) : null;
};
export const set = (key, value, expiresInMillis = defaultCookieExpiration) => {
  if (hasCookieAccess) {
    const currentTime = new Date();
    const expiryTime = new Date(currentTime.setTime(currentTime.getTime() + expiresInMillis)).toUTCString();
    document.cookie = `${key}=${value};expires=${expiryTime};path=/`;
  }
};
export function getHstc() {
  return get(hstcKey) || null;
}
export function getUtk() {
  let utk = get('hubspotutk');

  if (!utk) {
    utk = getHstc();

    if (utk) {
      utk = utk.split('.')[1];
    }
  }

  return utk || null;
}