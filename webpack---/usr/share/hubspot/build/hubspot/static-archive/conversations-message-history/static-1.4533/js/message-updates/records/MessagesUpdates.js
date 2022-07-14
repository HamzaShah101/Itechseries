'use es6';

import {
    Map as ImmutableMap,
    Record
} from 'immutable';
import {
    MESSAGES_UPDATED
} from '../constants/messageTypes';
import {
    buildUpdates
} from '../operators/buildUpdates';
/**
 * A message that indicates that a CMF has been updated
 *
 * @param {Object} auditParams one of five types of audit with id: SYSTEM_TEST, SYSTEM_MIGRATION, MANUAL, BOT_HANDOFF, INTEGRATOR_AUDIT to indicate the source of this update
 * @param {String} auditParams.id id of either the Bot or the
 * @param {Map} updates a map of message id to updates
 * @param {Map} updates.messageId map of an update of Status and/or messageDeleteStatus
 *
 **/

export default class MessagesUpdates extends Record({
    '@type': MESSAGES_UPDATED,
    auditParams: ImmutableMap(),
    updates: ImmutableMap()
}, 'MessagesUpdates') {
    constructor(properties = {}) {
        super({
            updates: buildUpdates(properties),
            auditParams: ImmutableMap(properties.audit)
        });
    }

}