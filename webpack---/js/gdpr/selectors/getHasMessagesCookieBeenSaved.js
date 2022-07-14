'use es6';

import {
    createSelector
} from 'reselect';
import {
    getIsFirstVisitorSession
} from '../../visitor-identity/operators/getIsFirstVisitorSession';
import {
    getVisitorIdentity
} from '../../visitor-identity/selectors/getVisitorIdentity';
export const getHasMessagesCookieBeenSaved = createSelector([getVisitorIdentity], visitorIdentity => !getIsFirstVisitorSession(visitorIdentity));