'use es6';

import {
    createElement,
    forwardRef,
    lazy
} from 'react'; // stolen from https://github.com/ianschmitz/react-lazy-with-preload/blob/master/src/index.ts

export const lazyWithPreload = factory => {
    const LazyComponent = /*#__PURE__*/ lazy(factory);
    let factoryPromise;
    let LoadedComponent; // eslint-disable-next-line react/display-name

    const Component = /*#__PURE__*/ forwardRef((props, ref) => {
        return /*#__PURE__*/ createElement(LoadedComponent || LazyComponent, Object.assign(ref ? {
            ref
        } : {}, props));
    });

    Component.preload = () => {
        if (!factoryPromise) {
            factoryPromise = factory().then(module => {
                LoadedComponent = module.default;
            });
        }

        return factoryPromise;
    };

    return Component;
};