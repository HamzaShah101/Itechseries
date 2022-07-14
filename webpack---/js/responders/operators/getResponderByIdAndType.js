'use es6';

import {
    getEntry
} from 'conversations-async-data/indexed-async-data/operators/getters';
import {
    defaultMemoize
} from 'reselect';
import {
    buildResponderKey
} from './buildResponderKey';
export const getResponderByIdAndType = defaultMemoize(({
    responders,
    senderId,
    senderType
}) => {
    if (!senderId || !senderType) {
        return null;
    }

    const key = buildResponderKey({
        senderId,
        senderType
    });
    return getEntry(key, responders);
});