'use es6';

import CommentMessage from '../../comment-message/records/CommentMessage';
import CommonMessage from '../../common-message-format/records/CommonMessage';
import ContextUpdateMessage from '../../context-update/records/ContextUpdateMessage';
import CrmObjectLifecycleUpdate from '../../crm-object-lifecycle-update/records/CrmObjectLifecycleUpdate';
import InitialMessage from '../../initial-message/records/InitialMessage';
import TypingIndicatorMessage from '../../typing-indicator/records/TypingIndicatorMessage';
import InboxUpdateMessage from '../../inbox-update-message/records/InboxUpdateMessage';
import EmailCapturePromptMessage from '../../email-capture-prompt/records/EmailCapturePromptMessage';
import EmailCaptureResponseMessage from '../../email-capture-response/records/EmailCaptureResponseMessage';
import OfficeHoursMessage from '../../office-hours-message/records/OfficeHoursMessage';
import TypicalResponseTimeMessage from '../../typical-response-time/records/TypicalResponseTimeMessage';
import FilteredChangeMessage from '../../filtered-change-message/records/FilteredChangeMessage';
import ThreadStatusUpdateMessage from '../../thread-status-update/records/ThreadStatusUpdateMessage';
import AssignmentUpdateMessage from '../../assignment-update-message/records/AssignmentUpdateMessage';
import FeedbackSubmissionMessage from '../../feedback-submission/records/FeedbackSubmissionMessage';
import {
    getRecordName
} from '../../util/getRecordName';
import TranscriptSubmissionMessage from '../../transcript-submission/records/TranscriptSubmissionMessage';
import TicketCreationFailureMessage from '../../ticket-creation-failure/records/TicketCreationFailureMessage';
import CrmObjectWorkflowEmailSent from '../../crm-object-workflow-email-sent/records/CrmObjectWorkflowEmailSent';
import FeedbackSurveyMessage from '../../feedback-survey-message/records/FeedbackSurveyMessage';
import invariant from 'react-utils/invariant';
const supportedRecords = [CommonMessage, ContextUpdateMessage, CrmObjectLifecycleUpdate, CommentMessage, InitialMessage, TypingIndicatorMessage, InboxUpdateMessage, EmailCapturePromptMessage, EmailCaptureResponseMessage, OfficeHoursMessage, TypicalResponseTimeMessage, FilteredChangeMessage, ThreadStatusUpdateMessage, AssignmentUpdateMessage, FeedbackSubmissionMessage, TranscriptSubmissionMessage, TicketCreationFailureMessage, CrmObjectWorkflowEmailSent, FeedbackSurveyMessage];
export const pubSubMessageRecordInvariant = message => invariant(supportedRecords.some(record => message instanceof record), `Expected message to be one of ${supportedRecords.map(getRecordName)}, but given ${getRecordName(message)}`);