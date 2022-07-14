'use es6';

import {
    createAction
} from 'flux-actions';
import * as ActionTypes from '../../constants/VisitorActionTypes';
export const networkOnline = createAction(ActionTypes.NETWORK_ONLINE);