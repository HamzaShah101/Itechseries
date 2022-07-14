"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.disableRejectionTracking = exports.enableRejectionTracking = void 0;
let enabled = false;

const typeOfReason = reason => {
    return reason === null ? 'Null' : reason === undefined ? 'Undefined' : Object.prototype.toString.call(reason).slice(8, -1);
};

const sendAlerts = reason => {
    const Raven = require('Raven');

    const ravenOpts = {
        tags: {
            isUnhandledPromiseRejection: true
        }
    };

    if (typeof reason === 'string') {
        Raven.captureMessage(reason, ravenOpts);
    } else {
        Raven.captureException(reason, ravenOpts);
    }

    if (window.newrelic) {
        window.newrelic.noticeError(reason, {
            isUnhandledPromiseRejection: true,
            typeOfReason: typeOfReason(reason)
        });
    }
};

const isObject = it => {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
};

const handleUnhandledRejection = e => {
    e.preventDefault();

    if (isObject(e.promise)) {
        console.error('Unhandled Promise Rejection', e.reason);
        sendAlerts(e.reason);
    }
};

const disableRejectionTracking = () => {
    enabled = false;
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
};

exports.disableRejectionTracking = disableRejectionTracking;

const enableRejectionTracking = () => {
    if (enabled) {
        disableRejectionTracking();
    }

    enabled = true;
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
};

exports.enableRejectionTracking = enableRejectionTracking;