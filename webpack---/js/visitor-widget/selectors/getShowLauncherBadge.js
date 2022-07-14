'use es6';

import {
    createSelector
} from 'reselect';
import {
    calculateUnseenThreadsCount
} from '../../threads/selectors/calculateUnseenThreadsCount';
import {
    getIsOpen
} from '../../selectors/getIsOpen';
export const getShowLauncherBadge = createSelector([getIsOpen, calculateUnseenThreadsCount], (isOpen, unseenThreadsCount) => {
    return Boolean(!isOpen && !!unseenThreadsCount);
});