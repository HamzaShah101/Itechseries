import enviro from 'enviro';
import noAuthApiClient from 'hub-http/clients/noAuthApiClient';
import { getFullUrl } from 'hubspot-url-utils';
import { createClient } from 'usage-tracker-core';
import { debugKey } from 'usage-tracker-core/storageKeys';
import { getHstc } from './helpers/cookieHelper';
import { defaultLanguage } from './helpers/langHelper';
import sendBeacon from './helpers/sendBeacon';
import reportError from './helpers/reportError';
import * as tempStorage from './containers/tempStorage';
import * as typeHelper from './helpers/typeHelper';
import * as browserHelper from './helpers/browserHelper';
const origin = getFullUrl('api');
const path = '/usage-logging/v1/log/hublytics-multi/no-auth';
const isLocal = !enviro.deployed();
const isQa = enviro.getShort() === 'qa';

const reportNetworkError = err => reportError(err, {
  fingerprint: ['usage-tracker-js', 'network']
});

const getDebug = () => Boolean(enviro.debug(debugKey));

const attemptToGetTrackerHstc = () => {
  return new Promise(resolve => {
    let interval;
    let timeout;
    interval = setInterval(() => {
      const hstc = getHstc();

      if (hstc) {
        clearTimeout(timeout);
        clearInterval(interval);
        resolve(hstc);
      }
    }, 100);
    timeout = setTimeout(() => {
      if (!getHstc()) {
        clearInterval(interval);

        if (enviro.debug(debugKey) && console && typeof console.warn === 'function') {
          console.warn('Could not get tracker hstc after 8 seconds');
        }

        resolve(null);
      }
    }, 8000);
  });
};

const publicTrackingClient = createClient({
  clientName: 'public',
  getDebug,
  getEmail: () => null,
  getHubId: () => null,
  getHstc: attemptToGetTrackerHstc,
  getLang: () => defaultLanguage,
  getTempStorage: tempStorage.get,
  setTempStorage: tempStorage.set,
  logError: err => {
    if (getDebug()) {
      console.error(err);
    }
  },
  logWarning: warning => {
    if (isLocal || isQa || getDebug()) {
      console.warn(warning);
    }
  },
  reportError,
  send: ({
    events,
    query,
    isBeforeUnload
  }) => {
    const endpoint = `${origin}${path}?${query}`;
    const data = events;

    const sendXhr = () => {
      const promise = noAuthApiClient.post(endpoint, {
        data
      }).catch(reportNetworkError);

      if (typeHelper.promiseHasDone(promise)) {
        promise.done();
      }
    };

    if (isBeforeUnload && browserHelper.hasBeaconSupport()) {
      sendBeacon(endpoint, data, sendXhr);
    } else {
      sendXhr();
    }
  }
});
export default publicTrackingClient;