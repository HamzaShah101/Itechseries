'use es6';

import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import {
    Record,
    Map as ImmutableMap
} from 'immutable';
import ThreadHistoryMessages from './ThreadHistoryMessages';
/**
 * Message History for a Thread
 *
 * @param {Object} properties The properties to build the ThreadHistory with
 * @param {Map} properties.messages
 * @param {Iterable} properties.messages.results An iterable list of messages
 * @param {Boolean} properties.messages.hasMore Whether a threadHistory has more messages to fetch
 * @param {Object} properties.messages.offset Contains pagination offset information
 * @param {Number} properties.messages.offset.timestamp
 * @param {Number} properties.messages.offset.ordinal
 * @param {Number} properties.visitorLastReadAtTimestamp
 * @param {Number} properties.numSoftDeletedMessages
 * @param {Map} properties.attachments A Map of all of the attachments for the viewable thread
 */

class ThreadHistory extends Record({
    messages: null,
    visitorLastReadAtTimestamp: 0,
    numSoftDeletedMessages: 0,
    attachments: ImmutableMap()
}, 'ThreadHistory') {
    constructor(properties = {}) {
        //properties.messages should be transformed and not leaked
        const {
            messages
        } = properties,
        remainingProperties = _objectWithoutPropertiesLoose(properties, ["messages"]);

        super(Object.assign({}, remainingProperties, {
            messages: new ThreadHistoryMessages(messages)
        }));
    }

}

export default ThreadHistory;