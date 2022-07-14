import { Map as ImmutableMap, Record } from 'immutable';
import { INLINE_IMAGES } from '../constants/attachmentTypes';
const InlineImageStatusAttachments = Record({
  '@type': INLINE_IMAGES,
  fileIdsByStatus: ImmutableMap(),
  hasInlineImagesStripped: false
}, 'InlineImageStatusAttachments');
export default InlineImageStatusAttachments;