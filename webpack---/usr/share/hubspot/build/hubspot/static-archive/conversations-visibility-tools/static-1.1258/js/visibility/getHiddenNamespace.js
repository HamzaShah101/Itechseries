'use es6';

export function getHiddenNamespace(prefix) {
    const withPrefix = prefix ? `${prefix}Hidden` : 'hidden';
    return withPrefix;
}