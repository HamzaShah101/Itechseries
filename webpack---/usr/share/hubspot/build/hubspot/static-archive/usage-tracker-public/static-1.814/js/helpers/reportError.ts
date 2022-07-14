import * as browserHelper from '../helpers/browserHelper';
export default ((err, extras = {}) => {
  if (typeof window !== 'undefined' && browserHelper.hasRaven(window)) {
    window.Raven.captureException(err, extras);
  }
});