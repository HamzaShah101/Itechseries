'use es6';

import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import {
    Record,
    OrderedMap,
    Map as ImmutableMap
} from 'immutable';
import {
    buildOrderedMessageMap
} from '../operators/buildOrderedMessageMap';
export default class ThreadHistoryMessages extends Record({
    results: OrderedMap(),
    hasMore: false,
    offset: ImmutableMap()
}, 'ThreadHistoryMessages') {
    constructor(properties = {}) {
        const {
            results
        } = properties,
        remainingProperties = _objectWithoutPropertiesLoose(properties, ["results"]);

        super(Object.assign({}, remainingProperties, {
            results: buildOrderedMessageMap(results)
        }));
    }

}