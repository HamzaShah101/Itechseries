'use es6';

import {
    getWidgetShellUUID
} from '../query-params/getWidgetShellUUID';
export const postMessageToParent = (type, data) => {
    return new Promise((resolve, reject) => {
        try {
            const uuid = getWidgetShellUUID();
            window.parent.postMessage(JSON.stringify({
                type,
                data,
                uuid
            }), '*');
            resolve({
                type,
                data
            });
        } catch (e) {
            reject(e);
        }
    });
};