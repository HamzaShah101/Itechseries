'use es6';

import {
    createSelector
} from 'reselect';
import {
    getIsEmbeddedInProduct
} from '../../query-params/getIsEmbeddedInProduct';
import {
    getWidgetUiState
} from '../../selectors/getWidgetUiState';
import {
    getIsFirstVisitorSession
} from '../../visitor-identity/selectors/getIsFirstVisitorSession';
export const getShouldFetchInitialVisitorThreads = createSelector([getIsFirstVisitorSession, getWidgetUiState], isFirstVisitorSession => {
    const isEmbeddedInProduct = getIsEmbeddedInProduct();
    return Boolean(!isFirstVisitorSession || isEmbeddedInProduct);
});