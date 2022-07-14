import publicTrackingClient from './client';
import * as typeHelper from './helpers/typeHelper';
const DEFAULT_OPTS = {
  allowUnauthed: true,
  isExternalHost: true,
  // As `events` is a required property from the TrackerConfig we define it here
  // but as a `undefined` value, so once the validation of TrackerConfig is done
  // it will throw an exception for not having the `events` property supplied.
  // as `undefined` will be interpreted as the value not being provided.
  events: undefined
};
export const createTracker = options => {
  if (!options || typeof options !== 'object') {
    options = DEFAULT_OPTS;
  }

  typeHelper.getObjectKeys(DEFAULT_OPTS).forEach(key => {
    const value = DEFAULT_OPTS[key];

    if (typeof options[key] === 'undefined') {
      // The intersection between DEFAULT_OPTS and `options` is not type compatible
      // And to avoid some complicated TypeScript hacks, we just set the type of `value` as `any`
      options[key] = value;
    }
  });
  return publicTrackingClient.createTracker(options);
};