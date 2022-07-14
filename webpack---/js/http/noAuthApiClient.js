'use es6';

import noAuthHttp from 'conversations-http/clients/noAuthApiClient';
import applyDefaults from './applyDefaults';
const noAuthApiClient = {
    post: (url, data) => applyDefaults(noAuthHttp.post, url, data),
    put: (url, data) => applyDefaults(noAuthHttp.put, url, data),
    get: (url, data) => applyDefaults(noAuthHttp.get, url, data),
    getWithResponse: (url, data) => applyDefaults(noAuthHttp.getWithResponse, url, data),
    delete: (url, data) => applyDefaults(noAuthHttp.delete, url, data)
};
export default noAuthApiClient;