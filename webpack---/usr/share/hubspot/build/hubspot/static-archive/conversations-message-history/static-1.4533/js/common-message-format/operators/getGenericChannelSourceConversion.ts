import { FB_MESSENGER, LIVE_CHAT, EMAIL } from 'conversations-internal-schema/constants/ThreadSources';
import { EMAIL_GENERIC_CHANNEL_ID, FB_MESSENGER_GENERIC_CHANNEL_ID, LIVE_CHAT_GENERIC_CHANNEL_ID, FORMS_GENERIC_CHANNEL_ID, COMMENTS_GENERIC_CHANNEL_ID, FEEDBACK_GENERIC_CHANNEL_ID, WHATSAPP_GENERIC_CHANNEL_ID, CUSTOMER_PORTAL_GENERIC_CHANNEL_ID } from '../constants/genericChannelIds';
const GenericChannelIdToStatusSourceMap = {
  [FB_MESSENGER_GENERIC_CHANNEL_ID]: FB_MESSENGER,
  [LIVE_CHAT_GENERIC_CHANNEL_ID]: LIVE_CHAT,
  [EMAIL_GENERIC_CHANNEL_ID]: EMAIL,
  [FORMS_GENERIC_CHANNEL_ID]: null,
  [CUSTOMER_PORTAL_GENERIC_CHANNEL_ID]: null,
  [COMMENTS_GENERIC_CHANNEL_ID]: null,
  [FEEDBACK_GENERIC_CHANNEL_ID]: null,
  // note API is not an acceptable ThreadSource value, can only be used as StatusSource
  [WHATSAPP_GENERIC_CHANNEL_ID]: 'API'
};
const SourceToGenericChannelIdMap = {
  [FB_MESSENGER]: FB_MESSENGER_GENERIC_CHANNEL_ID,
  [LIVE_CHAT]: LIVE_CHAT_GENERIC_CHANNEL_ID,
  [EMAIL]: EMAIL_GENERIC_CHANNEL_ID
};
export const getStatusSourceFromGenericChannelId = genericChannelId => GenericChannelIdToStatusSourceMap[genericChannelId];
export const getGenericChannelIdFromSource = threadSource => SourceToGenericChannelIdMap[threadSource];