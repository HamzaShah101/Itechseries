'use es6';

import {
    createSelector
} from 'reselect';
import filter from 'transmute/filter';
import {
    isStarted
} from '../operators/isStarted';
import {
    getThreadList
} from './getThreadList';
export const getOpenThreads = createSelector([getThreadList], filter(isStarted));