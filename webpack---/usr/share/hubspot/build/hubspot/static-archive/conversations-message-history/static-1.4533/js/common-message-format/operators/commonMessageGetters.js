'use es6';

import {
    List
} from 'immutable';
import curry from 'transmute/curry';
import get from 'transmute/get';
import getIn from 'transmute/getIn';
import pipe from 'transmute/pipe';
import {
    ATTACHMENTS,
    CHANNEL_INSTANCE_ID,
    GENERIC_CHANNEL_ID,
    INTEGRATION_ID,
    ID,
    RECIPIENTS,
    SENDERS,
    RECIPIENT_FIELD,
    DELIVERY_IDENTIFIER,
    DELIVERY_IDENTIFIER_TYPE,
    SENDER_DELIVERY_IDENTIFIER_TYPE,
    DELIVERY_IDENTIFIER_VALUE,
    SENDER_DELIVERY_IDENTIFIER_VALUE,
    SENDER_FIELD,
    ACTOR_ID,
    MESSAGE_DIRECTION
} from '../constants/keyPaths';
import {
    HS_EMAIL_ADDRESS
} from '../constants/deliveryIdentifierTypes';
import getSenderActorType from './getSenderActorType';
import {
    EMAIL,
    SYSTEM
} from '../constants/legacySenderTypes';
import {
    FILES,
    EMAIL_METADATA
} from '../constants/attachmentTypes';
import {
    getGenericChannelIdFromSource
} from './getGenericChannelSourceConversion';
import {
    getStatusSource
} from './commonMessageFormatGetters';
/**
 * The modern home of common message operators as we
 * look to get off of ./commonMessageFormatGetters, which
 * has a lot of edge-casing and checks introduced during
 * record migrations.
 */

export const getId = getIn(ID);
export const getChannelInstanceId = getIn(CHANNEL_INSTANCE_ID);
export const getGenericChannelId = getIn(GENERIC_CHANNEL_ID);
export const getIntegrationId = getIn(INTEGRATION_ID);
export const getRecipients = getIn(RECIPIENTS);
export const getSenders = getIn(SENDERS);
export const getRecipientField = getIn(RECIPIENT_FIELD);
export const getSenderField = getIn(SENDER_FIELD);
export const getDeliveryIdentifier = getIn(DELIVERY_IDENTIFIER);
export const getDeliveryIdentifierType = getIn(DELIVERY_IDENTIFIER_TYPE);
export const getDeliveryIdentifierValue = getIn(DELIVERY_IDENTIFIER_VALUE);
export const getActorId = getIn(ACTOR_ID);
export const getSenderDeliveryIdentifierType = getIn(SENDER_DELIVERY_IDENTIFIER_TYPE);
export const getSenderDeliveryIdentifierValue = getIn(SENDER_DELIVERY_IDENTIFIER_VALUE);
export const getMessageDirection = getIn(MESSAGE_DIRECTION);
export const getDeliveryIdentifierFromChannelType = (deliveryIdentifiers, deliveryIdentifierType) => {
    return deliveryIdentifiers.reduce((acc, deliveryIdentifier) => {
        if (getDeliveryIdentifierType(deliveryIdentifier) === deliveryIdentifierType) {
            return acc.push(getDeliveryIdentifierValue(deliveryIdentifier));
        }

        return acc;
    }, List());
};
export const getDeliveryIdentifiers = (recipients, deliveryIdentifierType) => {
    return recipients.reduce((acc, recipient) => {
        return acc.push(...getDeliveryIdentifierFromChannelType(getDeliveryIdentifier(recipient), deliveryIdentifierType));
    }, List());
};
export const getFilteredRecipientsByField = (commonMessage, fieldType) => {
    return getRecipients(commonMessage).filter(recipient => getRecipientField(recipient) === fieldType);
};
export const getFilteredSendersByField = (commonMessage, fieldType) => {
    const senders = getSenders(commonMessage);
    return senders && senders.filter(recipient => getSenderField(recipient) === fieldType) || List();
};
export const getRecipientsForField = curry((fieldType, deliveryIdentifierType, message) => {
    const recipients = getFilteredRecipientsByField(message, fieldType);
    return getDeliveryIdentifiers(recipients, deliveryIdentifierType);
});
export const getSendersForField = curry((fieldType, deliveryIdentifierType, message) => {
    const senders = getFilteredSendersByField(message, fieldType);

    if (senders.size) {
        const firstSender = senders.first();
        return getSenderDeliveryIdentifierType(firstSender) === deliveryIdentifierType ? getSenderDeliveryIdentifierValue(firstSender) : '';
    }

    return '';
});
export const getActorInfo = sender => {
    const actorId = getActorId(sender) || '';
    const actorInfo = actorId.split('-');

    if (actorInfo.length >= 2) {
        const [prefix, ...rest] = actorInfo;
        return [prefix, rest.join('-')];
    }

    return [null, null];
};
export const getSenderType = sender => {
    const [actorType] = getActorInfo(sender);
    return getSenderActorType(actorType);
};
export const getSenderId = sender => {
    const [, actorId] = getActorInfo(sender);
    const parsed = parseInt(actorId, 10);
    return !isNaN(parsed) ? parsed : actorId;
};
export const getSenderIdFromMessage = message => {
    const senders = getSenders(message) || List();
    const foundSender = senders.find(sender => {
        // ignoring EMAIL because when provided FROM and ORIGINAL_FROM we want to get sender which has
        // vid in its actorId. Ignoring SYSTEM to follow old selector pattern
        const senderType = getSenderType(sender);
        return senderType !== EMAIL && senderType !== SYSTEM;
    });
    return foundSender && getSenderId(foundSender) || null;
};
export const getSenderTypeFromMessage = message => {
    const senders = getSenders(message) || List();
    const foundSender = senders.find(sender => {
        // Ignoring EMAIL for now because it is a new type of actor and does not break existing code
        return getSenderType(sender) !== EMAIL;
    });
    return foundSender && getSenderType(foundSender) || null;
};
export const getTORecipients = getRecipientsForField('TO', HS_EMAIL_ADDRESS);
export const getCCRecipients = getRecipientsForField('CC', HS_EMAIL_ADDRESS);
export const getBCCRecipients = getRecipientsForField('BCC', HS_EMAIL_ADDRESS);
/* Returns the value of first delivery identifier for all recipients (e.g. emailAddresses of all recipients) */

export const getAllRecipientsDeliveryIdentifiers = pipe(getRecipients, recipients => {
    const deliveryIdentifier = recipients.reduce((accumulator, recipient) => {
        const deliveryIdentifierValue = recipient.getIn([...DELIVERY_IDENTIFIER, 0, ...DELIVERY_IDENTIFIER_VALUE]);
        return deliveryIdentifierValue && !Number.isInteger(deliveryIdentifierValue) ? accumulator.push(deliveryIdentifierValue) : accumulator;
    }, List());
    return deliveryIdentifier;
});
export const getFromSender = getSendersForField('FROM', HS_EMAIL_ADDRESS);
export const getOriginalFromSender = getSendersForField('ORIGINAL_FROM', HS_EMAIL_ADDRESS);
/* Attachments */

export const getAttachments = getIn(ATTACHMENTS);
export const getAttachmentWithType = curry((attachmentType, commonMessage) => {
    const attachments = getAttachments(commonMessage);

    if (attachments) {
        return attachments.find(attachmentObject => Boolean(attachmentObject && get('@type', attachmentObject) === attachmentType));
    }

    return undefined;
}); // Shorthand for known attachments

export const getEmailMetadataAttachment = getAttachmentWithType(EMAIL_METADATA);
export const getFileAttachments = getAttachmentWithType(FILES);
export const getGenericChannelIdForMessage = message => getGenericChannelId(message) || getGenericChannelIdFromSource(getStatusSource(message));