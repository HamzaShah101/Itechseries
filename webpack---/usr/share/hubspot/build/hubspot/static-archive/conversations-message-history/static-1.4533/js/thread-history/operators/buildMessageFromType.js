'use es6';

import CrmObjectWorkflowEmailSent from '../../crm-object-workflow-email-sent/records/CrmObjectWorkflowEmailSent';
import {
    buildCommentMessage
} from '../../comment-message/operators/buildCommentMessage';
import {
    buildCommonMessage
} from '../../common-message-format/operators/buildCommonMessage';
import ContextUpdateMessage from '../../context-update/records/ContextUpdateMessage';
import CrmObjectLifecycleUpdate from '../../crm-object-lifecycle-update/records/CrmObjectLifecycleUpdate';
import {
    buildInitialMessage
} from '../../initial-message/operators/buildInitialMessage';
import {
    getType
} from '../../common-message-format/operators/commonMessageFormatGetters';
import {
    THREAD_COMMENT
} from '../../comment-message/constants/messageTypes';
import {
    INITIAL_MESSAGE
} from '../../initial-message/constants/messageType';
import {
    COMMON_MESSAGE
} from '../../common-message-format/constants/messageTypes';
import {
    CRM_OBJECT_WORKFLOW_EMAIL_SENT
} from '../../crm-object-workflow-email-sent/constants/messageTypes';
import {
    CONTEXT_UPDATE
} from '../../context-update/constants/messageTypes';
import {
    CRM_OBJECT_LIFECYCLE_UPDATE
} from '../../crm-object-lifecycle-update/constants/messageTypes';
import {
    THREAD_INBOX_UPDATED
} from '../../inbox-update-message/constants/messageTypes';
import {
    EMAIL_CAPTURE_PROMPT
} from '../../email-capture-prompt/constants/messageTypes';
import InboxUpdateMessage from '../../inbox-update-message/records/InboxUpdateMessage';
import EmailCapturePromptMessage from '../../email-capture-prompt/records/EmailCapturePromptMessage';
import {
    EMAIL_CAPTURE_RESPONSE
} from '../../email-capture-response/constants/messageTypes';
import EmailCaptureResponseMessage from '../../email-capture-response/records/EmailCaptureResponseMessage';
import OfficeHoursMessage from '../../office-hours-message/records/OfficeHoursMessage';
import TypicalResponseTimeMessage from '../../typical-response-time/records/TypicalResponseTimeMessage';
import {
    OFFICE_HOURS
} from '../../office-hours-message/constants/messageTypes';
import {
    TYPICAL_RESPONSE_TIME
} from '../../typical-response-time/constants/messageTypes';
import FilteredChangeMessage from '../../filtered-change-message/records/FilteredChangeMessage';
import {
    FILTERED_CHANGE
} from '../../filtered-change-message/constants/messageTypes';
import ThreadStatusUpdateMessage from '../../thread-status-update/records/ThreadStatusUpdateMessage';
import {
    THREAD_STATUS_UPDATE
} from '../../thread-status-update/constants/messageTypes';
import {
    TYPING
} from '../../typing-indicator/constants/messageTypes';
import TypingIndicatorMessage from '../../typing-indicator/records/TypingIndicatorMessage';
import AssignmentUpdateMessage from '../../assignment-update-message/records/AssignmentUpdateMessage';
import {
    ASSIGNMENT_UPDATE
} from '../../assignment-update-message/constants/messageTypes';
import {
    FEEDBACK_SURVEY
} from '../../feedback-survey-message/constants/messageTypes';
import FeedbackSurveyMessage from '../../feedback-survey-message/records/FeedbackSurveyMessage';
import {
    FEEDBACK_SUBMISSION
} from '../../feedback-submission/constants/messageTypes';
import FeedbackSubmissionMessage from '../../feedback-submission/records/FeedbackSubmissionMessage';
import {
    CHAT_TRANSCRIPT_SENT
} from '../../transcript-submission/constants/messageTypes';
import TranscriptSubmissionMessage from '../../transcript-submission/records/TranscriptSubmissionMessage';
import {
    TICKET_CREATION_FAILURE
} from '../../ticket-creation-failure/constants/messageTypes';
import TicketCreationFailureMessage from '../../ticket-creation-failure/records/TicketCreationFailureMessage';
const messageTypeBuildersMap = {
    [ASSIGNMENT_UPDATE]: messageObject => new AssignmentUpdateMessage(messageObject),
    [COMMON_MESSAGE]: buildCommonMessage,
    [INITIAL_MESSAGE]: buildInitialMessage,
    [CRM_OBJECT_LIFECYCLE_UPDATE]: messageObject => new CrmObjectLifecycleUpdate(messageObject),
    [CRM_OBJECT_WORKFLOW_EMAIL_SENT]: messageObject => new CrmObjectWorkflowEmailSent(messageObject),
    [THREAD_COMMENT]: buildCommentMessage,
    [CONTEXT_UPDATE]: messageObject => new ContextUpdateMessage(messageObject),
    [THREAD_INBOX_UPDATED]: messageObject => new InboxUpdateMessage(messageObject),
    [EMAIL_CAPTURE_PROMPT]: messageObject => new EmailCapturePromptMessage(messageObject),
    [EMAIL_CAPTURE_RESPONSE]: messageObject => new EmailCaptureResponseMessage(messageObject),
    [OFFICE_HOURS]: messageObject => new OfficeHoursMessage(messageObject),
    [TYPICAL_RESPONSE_TIME]: messageObject => new TypicalResponseTimeMessage(messageObject),
    [FILTERED_CHANGE]: messageObject => new FilteredChangeMessage(messageObject),
    [THREAD_STATUS_UPDATE]: messageObject => new ThreadStatusUpdateMessage(messageObject),
    [TYPING]: messageObject => new TypingIndicatorMessage(messageObject),
    [FEEDBACK_SURVEY]: messageObject => new FeedbackSurveyMessage(messageObject),
    [FEEDBACK_SUBMISSION]: messageObject => new FeedbackSubmissionMessage(messageObject),
    [CHAT_TRANSCRIPT_SENT]: messageObject => new TranscriptSubmissionMessage(messageObject),
    [TICKET_CREATION_FAILURE]: messageObject => new TicketCreationFailureMessage(messageObject)
};
export const buildMessageFromType = message => {
    const builder = messageTypeBuildersMap[getType(message)];

    if (builder) {
        return builder(message);
    }

    return message;
};