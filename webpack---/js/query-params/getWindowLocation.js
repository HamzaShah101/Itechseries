'use es6';

import Url from 'hubspot.urlinator.Url';
export const getWindowLocation = () => new Url(window.location.href);