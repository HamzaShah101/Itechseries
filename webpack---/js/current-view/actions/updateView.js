'use es6';

import invariant from 'react-utils/invariant';
import {
    createAction
} from 'flux-actions';
import {
    UPDATE_VIEW
} from '../constants/actionTypes';
import {
    THREAD_LIST,
    THREAD_VIEW,
    KNOWLEDGE_BASE
} from '../constants/views';
export const updateViewAction = createAction(UPDATE_VIEW, view => ({
    view
}));
export const updateView = view => dispatch => {
    invariant([THREAD_LIST, THREAD_VIEW, KNOWLEDGE_BASE].indexOf(view) > -1, '`updateView` expected to be called with a valid `view` argument, but received "%s"', view);
    dispatch(updateViewAction(view));
};