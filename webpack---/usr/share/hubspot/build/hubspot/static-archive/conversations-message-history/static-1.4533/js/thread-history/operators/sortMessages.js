'use es6';

import sortBy from 'transmute/sortBy';
import updateIn from 'transmute/updateIn';
import {
    MESSAGE_RESULTS
} from '../constants/keyPaths';
import {
    getTimestamp
} from '../../common-message-format/operators/commonMessageFormatGetters';
/**
 * Sort MessageRecords in a ThreadHistory
 *
 * @param {ThreadHistory} threadHistory
 * @returns {ThreadHistory}
 */

export const sortMessages = threadHistory => updateIn(MESSAGE_RESULTS, sortBy(getTimestamp), threadHistory);