'use es6';

import {
    jsx as _jsx
} from "react/jsx-runtime";
import {
    useContext
} from 'react';
import {
    Provider
} from 'react-redux';
import PropTypes from 'prop-types';
import Url from 'hubspot.urlinator.Url';
import buildStore from './buildStore';
import {
    parseStringBoolean
} from './utils/parseStringBoolean';
import VisitorIdentity from './visitor-identity/records/VisitorIdentity';
import WidgetUi from './widget-ui/records/WidgetUi';
import {
    defaultVisitorIdentityContext,
    VisitorIdentityContext
} from './visitorIdentityContext/VisitorIdentityContext';
const widgetShellUrl = new Url(window.location);

function getQueryParam(param) {
    return widgetShellUrl.paramValue(param);
}

function getUrl() {
    const urlParam = getQueryParam('url');

    try {
        return decodeURIComponent(urlParam);
    } catch (error) {
        return urlParam;
    }
}

let getVisitorIdentityContext = () => defaultVisitorIdentityContext;

function startRedux(initialState = {}) {
    const startOpen = parseStringBoolean(getQueryParam('startOpen'));
    const isEmbeddedInProduct = getQueryParam('inApp53') === 'true';
    const defaultStore = Object.assign({}, initialState, {
        visitorIdentity: new VisitorIdentity({
            globalCookieOptOut: getQueryParam('globalCookieOptOut'),
            isFirstVisitorSession: getQueryParam('isFirstVisitorSession') === 'true'
        }),
        widgetUi: WidgetUi({
            isAttachmentDisabled: getQueryParam('isAttachmentDisabled') === 'true',
            isFullscreen: getQueryParam('isFullscreen') === 'true',
            mobile: getQueryParam('mobile') === 'true',
            startOpen,
            hideWelcomeMessage: getQueryParam('hideWelcomeMessage') !== 'true',
            domain: getQueryParam('domain'),
            url: getUrl(),
            isEmbeddedInProduct,
            isInCMS: getQueryParam('isInCMS') === 'true',
            mode: getQueryParam('mode'),
            apiEnableWidgetCookieBanner: getQueryParam('enableWidgetCookieBanner')
        })
    });
    return buildStore(defaultStore, {
        getVisitorIdentityContext: () => getVisitorIdentityContext()
    });
}

const store = startRedux();

const ReduxProvider = ({
    children
}) => {
    const identityContext = useContext(VisitorIdentityContext);

    getVisitorIdentityContext = () => identityContext;

    return /*#__PURE__*/ _jsx(Provider, {
        store: store,
        children: children
    });
};

ReduxProvider.displayName = 'ReduxProvider';
ReduxProvider.propTypes = {
    children: PropTypes.node
};
export default ReduxProvider;