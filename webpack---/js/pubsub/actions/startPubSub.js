'use es6';

import {
    initializePubSub
} from 'conversations-internal-pub-sub/redux/actions/initializePubSub';
import Raven from 'Raven';
import enviro from 'enviro';
import {
    getToken
} from '../clients/getToken';
import {
    resolveBuilder
} from '../resolvers/resolveBuilder';
import {
    trackUserInteraction
} from '../../actions/trackUserInteraction';
import {
    getSessionId
} from '../../selectors/widgetDataSelectors/getSessionId';
import {
    networkOnline
} from '../../actions/PubSubStatusActions/networkOnline';
import {
    networkOffline
} from '../../actions/PubSubStatusActions/networkOffline';
import {
    fetchCurrentThreadHistory
} from '../../thread-histories/actions/fetchCurrentThreadHistory';
import {
    fetchVisitorThreads
} from '../../threads/actions/ThreadActions';
import {
    getThreads
} from '../../threads/selectors/getThreads';
import {
    diffPrimitives
} from 'conversations-internal-pub-sub/utils/diffPrimitives';
import {
    getChannelName
} from '../../threads/operators/threadGetters';
import {
    onThreadCreatedAndNetworkOnline
} from '../../actions/PubSubStatusActions/onThreadCreatedAndNetworkOnline';
import {
    getHubspotUtk
} from '../../query-params/hubspotUtk';
import noAuthHttp from '../../http/noAuthApiClient';
import {
    isUngatedForWorkerExperiment
} from '../../selectors/widgetDataSelectors/gateSelectors';
export const startPubSub = ({
    newThreadCreated
} = {}) => {
    return (dispatch, getState) => {
        // TODO [Follow up]: Find a better home for this
        dispatch(trackUserInteraction());
        const ungatedForExperiment = isUngatedForWorkerExperiment(getState());
        const clientOptions = {
            skipSubscribeReauth: false,
            authCallback: (__tokenParams, callback) => {
                const sessionId = getSessionId(getState());
                const hubspotUtk = getHubspotUtk();
                getToken({
                    sessionId,
                    hubspotUtk
                }).then(tokenRequest => {
                    try {
                        const channels = getThreads(getState()).map(getChannelName).valueSeq().toJS();
                        const capability = JSON.parse(tokenRequest.capability);
                        const grantedChannels = Object.keys(capability);
                        const difference = diffPrimitives(channels, grantedChannels);

                        if (difference.length) {
                            Raven.captureMessage('capability mismatch', {
                                level: 'error',
                                extra: {
                                    channels,
                                    grantedChannels,
                                    difference,
                                    sessionId
                                }
                            });
                        }
                    } catch (error) { // Do nothing
                    }

                    callback(null, tokenRequest);
                }, error => callback(error));
            },
            publishFn: ungatedForExperiment ? ({
                channel,
                message,
                connectionKey,
                clientId
            }) => noAuthHttp.post(`https://chat.hubspot${enviro.isQa() ? 'qa' : ''}.com/publish/${enviro.getHublet()}/${channel}`, {
                data: {
                    id: message.id,
                    connectionKey,
                    clientId,
                    messageData: JSON.stringify(message)
                }
            }) : undefined
        };
        const lifecycleHooks = {
            onConnect({
                connectionWasSuspended,
                reconnected
            }) {
                dispatch(networkOnline());

                if (newThreadCreated) {
                    dispatch(onThreadCreatedAndNetworkOnline());
                }

                if (connectionWasSuspended || reconnected) {
                    dispatch(fetchCurrentThreadHistory());
                }

                if (connectionWasSuspended) {
                    dispatch(fetchVisitorThreads());
                }
            },

            onDisconnect() {
                dispatch(networkOffline());
            },

            onFailure() {
                dispatch(networkOffline());
            }

        };
        dispatch(initializePubSub({
            clientOptions,
            lifecycleHooks,
            resolveBuilder
        }));
    };
};