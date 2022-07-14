"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = configure;

var _enviro = _interopRequireDefault(require("enviro"));

var _PortalIdParser = _interopRequireDefault(require("PortalIdParser"));

var _Raven = _interopRequireDefault(require("Raven"));

var _hubspot = _interopRequireDefault(require("hubspot"));

// 200KiB
const MAX_MSG_CHARS = 200 * 1000;

function registerNewRelicErrorCallback(errorsToIgnore) {
    const cb = () => {
        _hubspot.default.newRelicErrorsToIgnore(errorsToIgnore);
    };

    if (_hubspot.default._newRelicCallbacks) {
        _hubspot.default._newRelicCallbacks.push(cb);
    } else {
        _hubspot.default._newRelicCallbacks = [cb];
    }
}

function getDataCallback(origDataCallback) {
    return function dataCallback(data) {
        if (origDataCallback) {
            data = origDataCallback(data);
        }

        try {
            const jsonString = JSON.stringify(data.extra);

            if (jsonString.length > MAX_MSG_CHARS) {
                if (_enviro.default.debug('sentry')) {
                    console.error(`Excessively large message logged to Raven (${jsonString.length} characters). The extra data is logged here but will not be sent to Sentry.`, data.extra);
                }

                data.extra = {
                    message: 'Error processing Sentry (extra data more than 200kb stringified). Existing extra data removed.'
                };
            }
        } catch (__err) {
            // Failed to stringify JSON, report unserializable object problem.
            if (_enviro.default.debug('sentry')) {
                console.error('An unserializable object was logged to Raven as `extra` data. The extra data is logged here but will not be sent to Sentry.', data.extra);
            }

            data.extra = {
                message: 'Error processing Sentry (extra data not serializable). Existing extra data removed.'
            };
        }

        return data;
    };
}

function configure(dsn, options = {}) {
    if (typeof _hubspot.default.bender === 'undefined') {
        if (_enviro.default.getShort('sentry') !== 'prod') {
            console.warn('[raven-hubspot] `project` and `release` Sentry tags will not be set. See: HubSpot/raven-hubspot/issues/40');
        } else {
            _hubspot.default._newRelicCallbacks = _hubspot.default._newRelicCallbacks || [];

            _hubspot.default._newRelicCallbacks.push(() => {
                if (window.newrelic.setCustomAttribute) {
                    window.newrelic.setCustomAttribute('ravenMissingTags', true);
                }
            });
        }
    }

    const {
        bender
    } = _hubspot.default;
    const defaultOptions = {
        sampleRate: 1,
        ignoreErrors: ['Aborting: redirection in progress', /Aborting: notifying parents of unauthorized response/, /Cannot set property 'install' of undefined/, /ResizeObserver loop completed with undelivered notifications/, /ResizeObserver loop limit exceeded/],
        ignoreUrls: []
    };
    const providedErrorsToIgnore = options.ignoreErrors || [];
    options = Object.assign({}, defaultOptions, {}, options, {
        ignoreErrors: [...defaultOptions.ignoreErrors, ...providedErrorsToIgnore]
    });
    registerNewRelicErrorCallback(options.ignoreErrors);

    const env = _enviro.default.getShort('sentry');

    _Raven.default.config(dsn, {
        release: bender && bender.currentProjectVersion,
        ignoreErrors: options.ignoreErrors,
        ignoreUrls: options.ignoreUrls,
        sampleRate: options.sampleRate,
        environment: env,
        tags: Object.assign({
            env,
            project: bender && bender.currentProject,
            portalId: _PortalIdParser.default.get(),
            hublet: _enviro.default.getHublet()
        }, options.tags),
        breadcrumbCallback: options.breadcrumbCallback || (crumb => crumb),
        autoBreadcrumbs: {
            console: false
        },
        dataCallback: getDataCallback(options.dataCallback),
        shouldSendCallback: options.shouldSendCallback || (() => true)
    }).install();

    if (_enviro.default.debug('sentry') || !_enviro.default.deployed('sentry')) {
        // According to the docs (https://docs.sentry.io/clients/javascript/config/) `debug` is
        // a valid option but it doesn't seems to work in the version of `raven-js` that we have
        // repackaged. Setting this property works for now.
        _Raven.default.debug = true;
    }

    if (!_enviro.default.deployed('sentry')) {
        // If not deployed we still want to configure Raven and allow local testing. This
        // would be more appropriate as a NODE_ENV check when available.
        _Raven.default.setTransport(({
            onSuccess
        }) => {
            onSuccess();
        });
    }
}

const origSetInterval = window.setInterval;

window.setInterval = function setIntervalWrapped(fn, ...rest) {
    if (typeof fn !== 'function') {
        _Raven.default.captureException(new Error('Implied eval. Only a function should be passed as first arg of setInterval.'));
    }

    return origSetInterval(fn, ...rest);
};

const origSetTimeout = window.setTimeout;

window.setTimeout = function setTimeoutWrapped(fn, ...rest) {
    if (typeof fn !== 'function') {
        _Raven.default.captureException(new Error('Implied eval. Only a function should be passed as first arg of setTimeout.'));
    }

    return origSetTimeout(fn, ...rest);
};

module.exports = exports.default;