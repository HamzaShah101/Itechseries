'use es6';

import {
    HS_EMAIL_ADDRESS,
    HS_CONTACT_ID
} from '../constants/deliveryIdentifierTypes';
import {
    getAddressFromEmailAddressRecord
} from './commonReplyMetadataGetters';
import Recipient from '../records/Recipient';
import {
    List,
    fromJS
} from 'immutable';
import curry from 'transmute/curry';
export const buildEmailRecipientWithField = curry((recipientField, listOfAddresses) => {
    return listOfAddresses.map(recipient => {
        const address = getAddressFromEmailAddressRecord(recipient);
        return Recipient({
            actorId: `E-${address}`,
            recipientField,
            deliveryIdentifier: fromJS([{
                type: HS_EMAIL_ADDRESS,
                value: address
            }])
        });
    });
});
export const buildTORecipients = buildEmailRecipientWithField('TO');
export const buildCCRecipients = buildEmailRecipientWithField('CC');
export const buildBCCRecipients = buildEmailRecipientWithField('BCC');
export const buildInitialEmailRecipients = ({
    to,
    cc,
    bcc
}) => {
    return buildTORecipients(to).concat(buildCCRecipients(cc), buildBCCRecipients(bcc));
};
export const buildContactRecipients = ({
    type,
    value,
    vid
}) => {
    return List([Recipient({
        actorId: `V-${vid}`,
        deliveryIdentifier: fromJS([{
            type: type || HS_CONTACT_ID,
            value: value || vid
        }])
    })]);
};