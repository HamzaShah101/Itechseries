'use es6';

import {
    getData
} from 'conversations-async-data/async-data/operators/getters';
import {
    getEntries
} from 'conversations-async-data/indexed-async-data/operators/getters';
import {
    AGENT
} from 'conversations-message-history/common-message-format/constants/legacySenderTypes';
import {
    createSelector
} from 'reselect';
import filter from 'transmute/filter';
import map from 'transmute/map';
import pipe from 'transmute/pipe';
import {
    getType
} from '../operators/responderKeyGetters';
import {
    getResponders
} from './getResponders';
export const getAllAgentResponders = createSelector([getResponders], respondersAsyncData => {
    return pipe(getEntries, filter((__value, key) => getType(key) === AGENT), map(getData))(respondersAsyncData);
});