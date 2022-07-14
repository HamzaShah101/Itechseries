'use es6';

import {
    createAction
} from 'flux-actions';
import {
    UPDATE_IS_FIRST_VISITOR_SESSION
} from '../constants/ActionTypes';
export const updateIsFirstVisitorSession = createAction(UPDATE_IS_FIRST_VISITOR_SESSION, isFirstVisitorSession => ({
    isFirstVisitorSession
}));