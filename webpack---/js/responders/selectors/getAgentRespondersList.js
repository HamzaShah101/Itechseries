'use es6';

import {
    createSelector
} from 'reselect';
import {
    getAllAgentResponders
} from './getAllAgentResponders';
export const getAgentRespondersList = createSelector([getAllAgentResponders], agentRespondersMap => agentRespondersMap.toList());