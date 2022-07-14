import { createMetricsFactory } from 'metrics-js';
export const PageLoadMetrics = createMetricsFactory('page-load', {
  library: 'react-rhumb'
});