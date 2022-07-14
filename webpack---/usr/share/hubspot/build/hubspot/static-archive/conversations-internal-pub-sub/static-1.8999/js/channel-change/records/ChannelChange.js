'use es6';

import {
    Record,
    Map as ImmutableMap
} from 'immutable';
export const CHANNEL_CHANGE = 'CHANNEL_CHANGE';
const ChannelChangeRecord = Record({
    '@type': CHANNEL_CHANGE,
    oldChannel: ImmutableMap(),
    newChannel: ImmutableMap(),
    id: null,
    timestamp: null
}, 'ChannelChange');
export class ChannelChange extends ChannelChangeRecord {
    constructor(props) {
        super(Object.assign({}, props, {
            oldChannel: ImmutableMap(props.oldChannel),
            newChannel: ImmutableMap(props.newChannel),
            '@type': CHANNEL_CHANGE
        }));
    }

}