'use es6';

import getIn from 'transmute/getIn';
export const fileIsUploadingInThread = ({
    localId,
    threadId
}, state) => {
    return Boolean(getIn([threadId, localId], state));
};