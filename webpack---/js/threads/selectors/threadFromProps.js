'use es6';

import get from 'transmute/get';
export const threadFromProps = (state, props = {}) => get('thread', props);