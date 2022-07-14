import * as cookieHelper from '../helpers/cookieHelper';
import * as browserHelper from '../helpers/browserHelper';
const hasLocalStorage = browserHelper.hasLocalStorage();
export const get = (key = '') => {
  let value = '';

  if (hasLocalStorage) {
    try {
      value = window.localStorage.getItem(key) || '';
    } catch (err) {
      value = cookieHelper.get(key);
    }
  }

  return value;
};
export const set = (key = '', value = '') => {
  if (hasLocalStorage) {
    try {
      window.localStorage.setItem(key, value || '');
    } catch (err) {
      cookieHelper.set(key, value);
    }
  }

  return value;
};