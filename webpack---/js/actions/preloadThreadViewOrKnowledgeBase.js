'use es6';

import {
    getKnowledgeBaseEnabled
} from '../selectors/widgetDataSelectors/getKnowledgeBaseEnabled';
import {
    lazyWithPreload
} from '../utils/lazyWithPreload';
const ThreadView = lazyWithPreload(() =>
    import (
        /* webpackChunkName: "CurrentView-ThreadView" */
        '../components/ThreadView'));
const KnowledgeBaseContainer = lazyWithPreload(() =>
    import (
        /* webpackChunkName: "CurrentView-KnowledgeBaseContainer" */
        '../knowledge-base/components/KnowledgeBaseContainer'));
export const preloadThreadViewOrKnowledgeBase = () => (__dispatch, getState) => {
    if (getKnowledgeBaseEnabled(getState())) {
        KnowledgeBaseContainer.preload();
    } else {
        ThreadView.preload();
    }
};