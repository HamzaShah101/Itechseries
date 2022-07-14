'use es6';

import {
    UPDATE_SUBSCRIPTIONS,
    RESUBSCRIBE
} from '../constants/actionTypes';
import {
    DEFAULT_CLIENT_KEY
} from '../constants/clientKeys';
import {
    getPubSubClient
} from '../selectors/pubSubClientGetters';
import {
    silenceErrorAlert
} from 'conversations-error-reporting/error-actions/builders/silenceErrorAlert';

const updateSubscriptionsStarted = (subscriptions, clientKey = DEFAULT_CLIENT_KEY) => ({
    type: UPDATE_SUBSCRIPTIONS.STARTED,
    payload: {
        clientKey,
        subscriptions
    }
});

const updateSubscriptionsSucceeded = (subscriptions, clientKey = DEFAULT_CLIENT_KEY) => ({
    type: UPDATE_SUBSCRIPTIONS.SUCCEEDED,
    payload: {
        clientKey,
        subscriptions
    }
});

const updateSubscriptionsFailed = (error, clientKey = DEFAULT_CLIENT_KEY) => ({
    type: UPDATE_SUBSCRIPTIONS.FAILED,
    payload: {
        clientKey,
        error
    },
    meta: silenceErrorAlert()
});

export const resubscribe = clientKey => ({
    type: RESUBSCRIBE,
    payload: {
        clientKey
    }
});
/**
 * @typedef subscriptionObject
 * @type {Object}
 * @property {function} onMessage - Called when a message is received
 * @property {function} [onPlayback] - Optional callback to received messages that are played back

/**
 * Update the current subscriptions.
 *
 * @param {Object<string, subscriptionObject>} subscriptions - A mapping of channel and subscription
 */

export const updateSubscriptions = (subscriptions, clientKey = DEFAULT_CLIENT_KEY) => (dispatch, getState) => {
    const client = getPubSubClient(getState(), {
        clientKey
    });
    dispatch(updateSubscriptionsStarted(subscriptions, clientKey));
    client.updateSubscriptions(subscriptions).then(result => {
        if (result === client.updateSubscriptions.DEBOUNCED) {
            // An out of date subscription update was skipped in favor of a more recent update.
            return;
        }

        dispatch(updateSubscriptionsSucceeded(result, clientKey));
    }, error => {
        dispatch(updateSubscriptionsFailed(error, clientKey));
    }).done();
};