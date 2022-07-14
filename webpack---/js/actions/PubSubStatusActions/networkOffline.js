'use es6';

import {
    createAction
} from 'flux-actions';
import * as ActionTypes from '../../constants/VisitorActionTypes';
export const networkOffline = createAction(ActionTypes.NETWORK_OFFLINE);