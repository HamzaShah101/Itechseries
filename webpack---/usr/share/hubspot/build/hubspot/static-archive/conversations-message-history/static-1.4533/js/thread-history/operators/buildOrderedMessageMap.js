'use es6';

import {
    Iterable,
    OrderedMap
} from 'immutable';
import invariant from 'react-utils/invariant';
import {
    getId
} from '../../common-message-format/operators/commonMessageFormatGetters';
import {
    buildMessageFromType
} from './buildMessageFromType';
/**
 * Construct an OrderedMap<string, MessageModel> from Array<Message Objects>
 *
 * @param {Iterable} messages Message objects returned by the history API
 */

export const buildOrderedMessageMap = (messages = []) => {
    invariant(Iterable.isIterable(messages) || Array.isArray(messages), 'Expected messages to be iterable not a `%s`', typeof messages);
    return messages.reduce((acc, messageObject) => {
        const message = buildMessageFromType(messageObject);
        const key = getId(message);
        return acc.set(key, message);
    }, OrderedMap());
};