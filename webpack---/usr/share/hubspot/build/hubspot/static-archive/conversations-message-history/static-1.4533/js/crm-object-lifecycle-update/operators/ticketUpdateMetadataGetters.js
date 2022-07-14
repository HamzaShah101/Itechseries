'use es6';

import getIn from 'transmute/getIn';
import {
    PIPELINE_ID,
    PIPELINE_NAME,
    PIPELINE_STAGE,
    PIPELINE_STAGE_ID,
    UPDATE_TYPE
} from '../constants/keyPaths';
export const getUpdateType = getIn(UPDATE_TYPE);
export const getPipelineId = getIn(PIPELINE_ID);
export const getPipelineName = getIn(PIPELINE_NAME);
export const getPipelineStageId = getIn(PIPELINE_STAGE_ID);
export const getPipelineStage = getIn(PIPELINE_STAGE);