'use es6';

import {
    createMetricsFactory
} from 'metrics-js';
export const Metrics = createMetricsFactory('conversations-visitor-ui');
export const trackPageViewMetric = () => {
    Metrics.counter('page-view').increment();
};