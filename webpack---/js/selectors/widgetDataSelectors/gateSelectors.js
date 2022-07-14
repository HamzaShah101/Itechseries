'use es6';

import get from 'transmute/get';
import {
    createSelector
} from 'reselect';
import {
    getGates
} from './getGates';
import {
    PERSISTED_AUTOMATED_MESSAGES,
    WORKER_EXPERIMENT
} from '../../constants/GatesConstants';
export const isUngatedForPersistedMessages = createSelector([getGates], gates => Boolean(get(PERSISTED_AUTOMATED_MESSAGES, gates)));
export const isUngatedForWorkerExperiment = createSelector([getGates], gates => Boolean(get(WORKER_EXPERIMENT, gates)));