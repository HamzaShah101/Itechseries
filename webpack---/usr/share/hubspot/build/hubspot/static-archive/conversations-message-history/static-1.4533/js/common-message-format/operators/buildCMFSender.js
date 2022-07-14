'use es6';

import invariant from 'react-utils/invariant';
import * as legacySenderTypes from '../constants/legacySenderTypes';
import {
    getActorFromSenderType
} from './senderActorMapping';
import Sender from '../records/Sender';
const legacySenderTypesArray = Object.keys(legacySenderTypes);
export const buildCMFSender = ({
    senderType = null,
    senderId = null,
    senderField = null,
    deliveryIdentifier = null
}) => {
    invariant(legacySenderTypesArray.includes(senderType) || senderType === null, `Invalid sender type. Should be one of ${legacySenderTypesArray.join(' | ')}. Received %s`, senderType);
    const actorType = getActorFromSenderType(senderType);
    return Sender({
        actorId: actorType && senderId ? `${actorType}-${senderId}` : '',
        senderField,
        deliveryIdentifier
    });
};