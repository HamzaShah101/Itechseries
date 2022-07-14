'use es6';

import Autolinker from 'autolinker';

const once = function once(func) {
    let alreadyCalled = false;
    let result;
    return function(...args) {
        if (!alreadyCalled) {
            result = func.apply(this, args);
            alreadyCalled = true;
        }

        return result;
    };
};

export default {
    get: once(() => {
        return new Autolinker({
            stripPrefix: false
        });
    }),
    getTwitter: once(() => {
        return new Autolinker({
            hashtag: 'twitter',
            mention: 'twitter',
            stripPrefix: false
        });
    })
};