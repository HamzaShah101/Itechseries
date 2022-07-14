'use es6';

import Url from 'hubspot.urlinator.Url';
export const getUrlForMessage = () => {
    const url = window.location !== window.parent.location ? document.referrer : document.origin;
    const parsedUrl = new Url(url);
    return parsedUrl.hostplus;
};