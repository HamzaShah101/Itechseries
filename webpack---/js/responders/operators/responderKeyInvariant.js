'use es6';

import invariant from 'react-utils/invariant';
import {
    numberIdInvariant
} from 'conversations-async-data/indexed-async-data/invariants/numberIdInvariant';
import {
    getId,
    getType
} from './responderKeyGetters';
export const responderKeyInvariant = responderKey => {
    const id = getId(responderKey);
    const type = getType(responderKey);
    invariant(!!id, 'Responder ID must be set in the key map');
    numberIdInvariant(id);
    invariant(!!type, 'Responder type must be set in the key map');
};