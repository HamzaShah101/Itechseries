'use es6';

import {
    fromJS,
    List
} from 'immutable';
import compose from 'transmute/compose';
import reduce from 'transmute/reduce';
import Status from '../../common-message-format/records/Status';
import {
    generateUuid
} from '../../util/generateUuid';
import {
    generateUniqueClientTimestamp
} from '../../util/timestamps';
import {
    ATTACHMENT_TYPE_ID,
    MENTIONS,
    FILES
} from '../constants/attachmentTypes';
import CommentMessage from '../records/CommentMessage';
import {
    getId,
    getStatus,
    getTimestamp
} from './commentMessageGetters';
import {
    setAttachments,
    setId,
    setStatus,
    setTimestamp
} from './commentMessageSetters';
import {
    buildSenders
} from '../../common-message-format/operators/buildSenders';
import {
    setGenericChannelId,
    setSenders
} from '../../common-message-format/operators/commonMessageSetters';
import {
    COMMENTS_GENERIC_CHANNEL_ID
} from '../../common-message-format/constants/genericChannelIds';
export const buildCommentMessage = (attrs = {}) => {
    const status = Status(getStatus(attrs));
    const {
        attachments = [],
            senders = []
    } = attrs;
    const attachmentsList = reduce(List(), (attachmentList, attachment) => {
        const attachmentType = attachment[ATTACHMENT_TYPE_ID];
        return attachmentType === MENTIONS || attachmentType === FILES ? attachmentList.push(fromJS(attachment)) : attachmentList;
    }, attachments);
    const id = getId(attrs) || generateUuid();
    const timestamp = getTimestamp(attrs) || generateUniqueClientTimestamp('buildCommentMessage-timestamp');
    const sendersList = buildSenders(senders);
    return compose(setId(id), setStatus(status), setAttachments(attachmentsList), setTimestamp(timestamp), setSenders(sendersList), setGenericChannelId(COMMENTS_GENERIC_CHANNEL_ID))(CommentMessage(fromJS(attrs)));
};