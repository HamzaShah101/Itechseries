"use strict";
"use es6";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Provider = Provider;
exports.connectAdvanced = connectAdvanced;
exports.createDispatchHook = createDispatchHook;
exports.createSelectorHook = createSelectorHook;
exports.createStoreHook = createStoreHook;
exports.shallowEqual = shallowEqual;
Object.defineProperty(exports, "batch", {
    enumerable: true,
    get: function() {
        return _reactDom.unstable_batchedUpdates;
    }
});
exports.useStore = exports.useSelector = exports.useDispatch = exports.connect = exports.ReactReduxContext = void 0;

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _hoistNonReactStatics = _interopRequireDefault(require("hoist-non-react-statics"));

var _reactIs = require("react-is");

var _reactDom = require("react-dom");

const ReactReduxContext = /*#__PURE__*/ _react.default.createContext(null);

exports.ReactReduxContext = ReactReduxContext;

if (process.env.NODE_ENV !== 'production') {
    ReactReduxContext.displayName = 'ReactRedux';
} // Default to a dummy "batch" implementation that just runs the callback


function defaultNoopBatch(callback) {
    callback();
}

let batch = defaultNoopBatch; // Allow injecting another batching function later

const setBatch = newBatch => batch = newBatch; // Supply a getter just to skip dealing with ESM bindings


const getBatch = () => batch; // well as nesting subscriptions of descendant components, so that we can ensure the
// ancestor components re-render before descendants


function createListenerCollection() {
    const batch = getBatch();
    let first = null;
    let last = null;
    return {
        clear() {
            first = null;
            last = null;
        },

        notify() {
            batch(() => {
                let listener = first;

                while (listener) {
                    listener.callback();
                    listener = listener.next;
                }
            });
        },

        get() {
            let listeners = [];
            let listener = first;

            while (listener) {
                listeners.push(listener);
                listener = listener.next;
            }

            return listeners;
        },

        subscribe(callback) {
            let isSubscribed = true;
            let listener = last = {
                callback,
                next: null,
                prev: last
            };

            if (listener.prev) {
                listener.prev.next = listener;
            } else {
                first = listener;
            }

            return function unsubscribe() {
                if (!isSubscribed || first === null) return;
                isSubscribed = false;

                if (listener.next) {
                    listener.next.prev = listener.prev;
                } else {
                    last = listener.prev;
                }

                if (listener.prev) {
                    listener.prev.next = listener.next;
                } else {
                    first = listener.next;
                }
            };
        }

    };
}

const nullListeners = {
    notify() {},

    get: () => []
};

function createSubscription(store, parentSub) {
    let unsubscribe;
    let listeners = nullListeners;

    function addNestedSub(listener) {
        trySubscribe();
        return listeners.subscribe(listener);
    }

    function notifyNestedSubs() {
        listeners.notify();
    }

    function handleChangeWrapper() {
        if (subscription.onStateChange) {
            subscription.onStateChange();
        }
    }

    function isSubscribed() {
        return Boolean(unsubscribe);
    }

    function trySubscribe() {
        if (!unsubscribe) {
            unsubscribe = parentSub ? parentSub.addNestedSub(handleChangeWrapper) : store.subscribe(handleChangeWrapper);
            listeners = createListenerCollection();
        }
    }

    function tryUnsubscribe() {
        if (unsubscribe) {
            unsubscribe();
            unsubscribe = undefined;
            listeners.clear();
            listeners = nullListeners;
        }
    }

    const subscription = {
        addNestedSub,
        notifyNestedSubs,
        handleChangeWrapper,
        isSubscribed,
        trySubscribe,
        tryUnsubscribe,
        getListeners: () => listeners
    };
    return subscription;
} // To get around it, we can conditionally useEffect on the server (no-op) and
// useLayoutEffect in the browser. We need useLayoutEffect to ensure the store
// subscription callback always has the selector from the latest render commit
// available, otherwise a store update may happen between render and the effect,
// which may cause missed updates; we also must ensure the store subscription
// is created synchronously, otherwise a store update may occur before the
// subscription is created and an inconsistent state may be observed


const useIsomorphicLayoutEffect = typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined' ? _react.useLayoutEffect : _react.useEffect;

function Provider({
    store,
    context,
    children
}) {
    const contextValue = (0, _react.useMemo)(() => {
        const subscription = createSubscription(store);
        subscription.onStateChange = subscription.notifyNestedSubs;
        return {
            store,
            subscription
        };
    }, [store]);
    const previousState = (0, _react.useMemo)(() => store.getState(), [store]);
    useIsomorphicLayoutEffect(() => {
        const {
            subscription
        } = contextValue;
        subscription.trySubscribe();

        if (previousState !== store.getState()) {
            subscription.notifyNestedSubs();
        }

        return () => {
            subscription.tryUnsubscribe();
            subscription.onStateChange = null;
        };
    }, [contextValue, previousState]);
    const Context = context || ReactReduxContext;
    return /*#__PURE__*/ _react.default.createElement(Context.Provider, {
        value: contextValue
    }, children);
}

if (process.env.NODE_ENV !== 'production') {
    Provider.propTypes = {
        store: _propTypes.default.shape({
            subscribe: _propTypes.default.func.isRequired,
            dispatch: _propTypes.default.func.isRequired,
            getState: _propTypes.default.func.isRequired
        }),
        context: _propTypes.default.object,
        children: _propTypes.default.any
    };
}

function _extends() {
    _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }

        return target;
    };

    return _extends.apply(this, arguments);
}

const EMPTY_ARRAY = [];
const NO_SUBSCRIPTION_ARRAY = [null, null];

const stringifyComponent = Comp => {
    try {
        return JSON.stringify(Comp);
    } catch (err) {
        return String(Comp);
    }
};

function storeStateUpdatesReducer(state, action) {
    const [, updateCount] = state;
    return [action.payload, updateCount + 1];
}

function useIsomorphicLayoutEffectWithArgs(effectFunc, effectArgs, dependencies) {
    useIsomorphicLayoutEffect(() => effectFunc(...effectArgs), dependencies);
}

function captureWrapperProps(lastWrapperProps, lastChildProps, renderIsScheduled, wrapperProps, actualChildProps, childPropsFromStoreUpdate, notifyNestedSubs) {
    // We want to capture the wrapper props and child props we used for later comparisons
    lastWrapperProps.current = wrapperProps;
    lastChildProps.current = actualChildProps;
    renderIsScheduled.current = false; // If the render was from a store update, clear out that reference and cascade the subscriber update

    if (childPropsFromStoreUpdate.current) {
        childPropsFromStoreUpdate.current = null;
        notifyNestedSubs();
    }
}

function subscribeUpdates(shouldHandleStateChanges, store, subscription, childPropsSelector, lastWrapperProps, lastChildProps, renderIsScheduled, childPropsFromStoreUpdate, notifyNestedSubs, forceComponentUpdateDispatch) {
    // If we're not subscribed to the store, nothing to do here
    if (!shouldHandleStateChanges) return; // Capture values for checking if and when this component unmounts

    let didUnsubscribe = false;
    let lastThrownError = null; // We'll run this callback every time a store subscription update propagates to this component

    const checkForUpdates = () => {
        if (didUnsubscribe) {
            // Don't run stale listeners.
            // Redux doesn't guarantee unsubscriptions happen until next dispatch.
            return;
        }

        const latestStoreState = store.getState();
        let newChildProps, error;

        try {
            // Actually run the selector with the most recent store state and wrapper props
            // to determine what the child props should be
            newChildProps = childPropsSelector(latestStoreState, lastWrapperProps.current);
        } catch (e) {
            error = e;
            lastThrownError = e;
        }

        if (!error) {
            lastThrownError = null;
        } // If the child props haven't changed, nothing to do here - cascade the subscription update


        if (newChildProps === lastChildProps.current) {
            if (!renderIsScheduled.current) {
                notifyNestedSubs();
            }
        } else {
            // Save references to the new child props.  Note that we track the "child props from store update"
            // as a ref instead of a useState/useReducer because we need a way to determine if that value has
            // been processed.  If this went into useState/useReducer, we couldn't clear out the value without
            // forcing another re-render, which we don't want.
            lastChildProps.current = newChildProps;
            childPropsFromStoreUpdate.current = newChildProps;
            renderIsScheduled.current = true; // If the child props _did_ change (or we caught an error), this wrapper component needs to re-render

            forceComponentUpdateDispatch({
                type: 'STORE_UPDATED',
                payload: {
                    error
                }
            });
        }
    }; // Actually subscribe to the nearest connected ancestor (or store)


    subscription.onStateChange = checkForUpdates;
    subscription.trySubscribe(); // Pull data from the store after first render in case the store has
    // changed since we began.

    checkForUpdates();

    const unsubscribeWrapper = () => {
        didUnsubscribe = true;
        subscription.tryUnsubscribe();
        subscription.onStateChange = null;

        if (lastThrownError) {
            // It's possible that we caught an error due to a bad mapState function, but the
            // parent re-rendered without this component and we're about to unmount.
            // This shouldn't happen as long as we do top-down subscriptions correctly, but
            // if we ever do those wrong, this throw will surface the error in our tests.
            // In that case, throw the error from here so it doesn't get lost.
            throw lastThrownError;
        }
    };

    return unsubscribeWrapper;
}

const initStateUpdates = () => [null, 0];

function connectAdvanced(
    /*
      selectorFactory is a func that is responsible for returning the selector function used to
      compute new props from state, props, and dispatch. For example:
          export default connectAdvanced((dispatch, options) => (state, props) => ({
          thing: state.things[props.thingId],
          saveThing: fields => dispatch(actionCreators.saveThing(props.thingId, fields)),
        }))(YourComponent)
        Access to dispatch is provided to the factory so selectorFactories can bind actionCreators
      outside of their selector as an optimization. Options passed to connectAdvanced are passed to
      the selectorFactory, along with displayName and WrappedComponent, as the second argument.
        Note that selectorFactory is responsible for all caching/memoization of inbound and outbound
      props. Do not use connectAdvanced directly without memoizing results between calls to your
      selector, otherwise the Connect component will re-render on every state or props change.
    */
    selectorFactory, // options object:
    _ref = {}) {
    let {
        // the func used to compute this HOC's displayName from the wrapped component's displayName.
        // probably overridden by wrapper functions such as connect()
        getDisplayName = name => `ConnectAdvanced(${name})`,
            // shown in error messages
            // probably overridden by wrapper functions such as connect()
            methodName = 'connectAdvanced',
            // REMOVED: if defined, the name of the property passed to the wrapped element indicating the number of
            // calls to render. useful for watching in react devtools for unnecessary re-renders.
            renderCountProp = undefined,
            // determines whether this HOC subscribes to store changes
            shouldHandleStateChanges = true,
            // REMOVED: the key of props/context to get the store
            storeKey = 'store',
            // REMOVED: expose the wrapped component via refs
            withRef = false,
            // use React's forwardRef to expose a ref of the wrapped component
            forwardRef = false,
            // the context consumer to use
            context = ReactReduxContext
    } = _ref,
    connectOptions = (0, _objectWithoutPropertiesLoose2.default)(_ref, ["getDisplayName", "methodName", "renderCountProp", "shouldHandleStateChanges", "storeKey", "withRef", "forwardRef", "context"]);

    if (process.env.NODE_ENV !== 'production') {
        if (renderCountProp !== undefined) {
            throw new Error(`renderCountProp is removed. render counting is built into the latest React Dev Tools profiling extension`);
        }

        if (withRef) {
            throw new Error('withRef is removed. To access the wrapped instance, use a ref on the connected component');
        }

        const customStoreWarningMessage = 'To use a custom Redux store for specific components, create a custom React context with ' + "React.createContext(), and pass the context object to React Redux's Provider and specific components" + ' like: <Provider context={MyContext}><ConnectedComponent context={MyContext} /></Provider>. ' + 'You may also pass a {context : MyContext} option to connect';

        if (storeKey !== 'store') {
            throw new Error('storeKey has been removed and does not do anything. ' + customStoreWarningMessage);
        }
    }

    const Context = context;
    return function wrapWithConnect(WrappedComponent) {
        if (process.env.NODE_ENV !== 'production' && !(0, _reactIs.isValidElementType)(WrappedComponent)) {
            throw new Error(`You must pass a component to the function returned by ` + `${methodName}. Instead received ${stringifyComponent(WrappedComponent)}`);
        }

        const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
        const displayName = getDisplayName(wrappedComponentName);
        const selectorFactoryOptions = Object.assign({}, connectOptions, {
            getDisplayName,
            methodName,
            renderCountProp,
            shouldHandleStateChanges,
            storeKey,
            displayName,
            wrappedComponentName,
            WrappedComponent
        });
        const {
            pure
        } = connectOptions;

        function createChildSelector(store) {
            return selectorFactory(store.dispatch, selectorFactoryOptions);
        } // If we aren't running in "pure" mode, we don't want to memoize values.
        // To avoid conditionally calling hooks, we fall back to a tiny wrapper
        // that just executes the given callback immediately.


        const usePureOnlyMemo = pure ? _react.useMemo : callback => callback();

        function ConnectFunction(props) {
            const [propsContext, reactReduxForwardedRef, wrapperProps] = (0, _react.useMemo)(() => {
                // Distinguish between actual "data" props that were passed to the wrapper component,
                // and values needed to control behavior (forwarded refs, alternate context instances).
                // To maintain the wrapperProps object reference, memoize this destructuring.
                const {
                    reactReduxForwardedRef
                } = props,
                wrapperProps = (0, _objectWithoutPropertiesLoose2.default)(props, ["reactReduxForwardedRef"]);
                return [props.context, reactReduxForwardedRef, wrapperProps];
            }, [props]);
            const ContextToUse = (0, _react.useMemo)(() => {
                // Users may optionally pass in a custom context instance to use instead of our ReactReduxContext.
                // Memoize the check that determines which context instance we should use.
                return propsContext && propsContext.Consumer && (0, _reactIs.isContextConsumer)( /*#__PURE__*/ _react.default.createElement(propsContext.Consumer, null)) ? propsContext : Context;
            }, [propsContext, Context]); // Retrieve the store and ancestor subscription via context, if available

            const contextValue = (0, _react.useContext)(ContextToUse); // The store _must_ exist as either a prop or in context.
            // We'll check to see if it _looks_ like a Redux store first.
            // This allows us to pass through a `store` prop that is just a plain value.

            const didStoreComeFromProps = Boolean(props.store) && Boolean(props.store.getState) && Boolean(props.store.dispatch);
            const didStoreComeFromContext = Boolean(contextValue) && Boolean(contextValue.store);

            if (process.env.NODE_ENV !== 'production' && !didStoreComeFromProps && !didStoreComeFromContext) {
                throw new Error(`Could not find "store" in the context of ` + `"${displayName}". Either wrap the root component in a <Provider>, ` + `or pass a custom React context provider to <Provider> and the corresponding ` + `React context consumer to ${displayName} in connect options.`);
            } // Based on the previous check, one of these must be true


            const store = didStoreComeFromProps ? props.store : contextValue.store;
            const childPropsSelector = (0, _react.useMemo)(() => {
                // The child props selector needs the store reference as an input.
                // Re-create this selector whenever the store changes.
                return createChildSelector(store);
            }, [store]);
            const [subscription, notifyNestedSubs] = (0, _react.useMemo)(() => {
                if (!shouldHandleStateChanges) return NO_SUBSCRIPTION_ARRAY; // This Subscription's source should match where store came from: props vs. context. A component
                // connected to the store via props shouldn't use subscription from context, or vice versa.

                const subscription = createSubscription(store, didStoreComeFromProps ? null : contextValue.subscription); // `notifyNestedSubs` is duplicated to handle the case where the component is unmounted in
                // the middle of the notification loop, where `subscription` will then be null. This can
                // probably be avoided if Subscription's listeners logic is changed to not call listeners
                // that have been unsubscribed in the  middle of the notification loop.

                const notifyNestedSubs = subscription.notifyNestedSubs.bind(subscription);
                return [subscription, notifyNestedSubs];
            }, [store, didStoreComeFromProps, contextValue]); // Determine what {store, subscription} value should be put into nested context, if necessary,
            // and memoize that value to avoid unnecessary context updates.

            const overriddenContextValue = (0, _react.useMemo)(() => {
                if (didStoreComeFromProps) {
                    // This component is directly subscribed to a store from props.
                    // We don't want descendants reading from this store - pass down whatever
                    // the existing context value is from the nearest connected ancestor.
                    return contextValue;
                } // Otherwise, put this component's subscription instance into context, so that
                // connected descendants won't update until after this component is done


                return Object.assign({}, contextValue, {
                    subscription
                });
            }, [didStoreComeFromProps, contextValue, subscription]); // We need to force this wrapper component to re-render whenever a Redux store update
            // causes a change to the calculated child component props (or we caught an error in mapState)

            const [
                [previousStateUpdateResult], forceComponentUpdateDispatch
            ] = (0, _react.useReducer)(storeStateUpdatesReducer, EMPTY_ARRAY, initStateUpdates); // Propagate any mapState/mapDispatch errors upwards

            if (previousStateUpdateResult && previousStateUpdateResult.error) {
                throw previousStateUpdateResult.error;
            } // Set up refs to coordinate values between the subscription effect and the render logic


            const lastChildProps = (0, _react.useRef)();
            const lastWrapperProps = (0, _react.useRef)(wrapperProps);
            const childPropsFromStoreUpdate = (0, _react.useRef)();
            const renderIsScheduled = (0, _react.useRef)(false);
            const actualChildProps = usePureOnlyMemo(() => {
                // Tricky logic here:
                // - This render may have been triggered by a Redux store update that produced new child props
                // - However, we may have gotten new wrapper props after that
                // If we have new child props, and the same wrapper props, we know we should use the new child props as-is.
                // But, if we have new wrapper props, those might change the child props, so we have to recalculate things.
                // So, we'll use the child props from store update only if the wrapper props are the same as last time.
                if (childPropsFromStoreUpdate.current && wrapperProps === lastWrapperProps.current) {
                    return childPropsFromStoreUpdate.current;
                } // TODO We're reading the store directly in render() here. Bad idea?
                // This will likely cause Bad Things (TM) to happen in Concurrent Mode.
                // Note that we do this because on renders _not_ caused by store updates, we need the latest store state
                // to determine what the child props should be.


                return childPropsSelector(store.getState(), wrapperProps);
            }, [store, previousStateUpdateResult, wrapperProps]); // We need this to execute synchronously every time we re-render. However, React warns
            // about useLayoutEffect in SSR, so we try to detect environment and fall back to
            // just useEffect instead to avoid the warning, since neither will run anyway.

            useIsomorphicLayoutEffectWithArgs(captureWrapperProps, [lastWrapperProps, lastChildProps, renderIsScheduled, wrapperProps, actualChildProps, childPropsFromStoreUpdate, notifyNestedSubs]); // Our re-subscribe logic only runs when the store/subscription setup changes

            useIsomorphicLayoutEffectWithArgs(subscribeUpdates, [shouldHandleStateChanges, store, subscription, childPropsSelector, lastWrapperProps, lastChildProps, renderIsScheduled, childPropsFromStoreUpdate, notifyNestedSubs, forceComponentUpdateDispatch], [store, subscription, childPropsSelector]); // Now that all that's done, we can finally try to actually render the child component.
            // We memoize the elements for the rendered child component as an optimization.

            const renderedWrappedComponent = (0, _react.useMemo)(() => /*#__PURE__*/ _react.default.createElement(WrappedComponent, _extends({}, actualChildProps, {
                ref: reactReduxForwardedRef
            })), [reactReduxForwardedRef, WrappedComponent, actualChildProps]); // If React sees the exact same element reference as last time, it bails out of re-rendering
            // that child, same as if it was wrapped in React.memo() or returned false from shouldComponentUpdate.

            const renderedChild = (0, _react.useMemo)(() => {
                if (shouldHandleStateChanges) {
                    // If this component is subscribed to store updates, we need to pass its own
                    // subscription instance down to our descendants. That means rendering the same
                    // Context instance, and putting a different value into the context.
                    return /*#__PURE__*/ _react.default.createElement(ContextToUse.Provider, {
                        value: overriddenContextValue
                    }, renderedWrappedComponent);
                }

                return renderedWrappedComponent;
            }, [ContextToUse, renderedWrappedComponent, overriddenContextValue]);
            return renderedChild;
        } // If we're in "pure" mode, ensure our wrapper component only re-renders when incoming props have changed.


        const Connect = pure ? /*#__PURE__*/ _react.default.memo(ConnectFunction) : ConnectFunction;
        Connect.WrappedComponent = WrappedComponent;
        Connect.displayName = ConnectFunction.displayName = displayName;

        if (forwardRef) {
            const forwarded = /*#__PURE__*/ _react.default.forwardRef(function forwardConnectRef(props, ref) {
                return /*#__PURE__*/ _react.default.createElement(Connect, _extends({}, props, {
                    reactReduxForwardedRef: ref
                }));
            });

            forwarded.displayName = displayName;
            forwarded.WrappedComponent = WrappedComponent;
            return (0, _hoistNonReactStatics.default)(forwarded, WrappedComponent);
        }

        return (0, _hoistNonReactStatics.default)(Connect, WrappedComponent);
    };
}

function is(x, y) {
    if (x === y) {
        return x !== 0 || y !== 0 || 1 / x === 1 / y;
    } else {
        return x !== x && y !== y;
    }
}

function shallowEqual(objA, objB) {
    if (is(objA, objB)) return true;

    if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
        return false;
    }

    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) return false;

    for (let i = 0; i < keysA.length; i++) {
        if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
            return false;
        }
    }

    return true;
}

function bindActionCreators(actionCreators, dispatch) {
    const boundActionCreators = {};

    for (const key in actionCreators) {
        const actionCreator = actionCreators[key];

        if (typeof actionCreator === 'function') {
            boundActionCreators[key] = (...args) => dispatch(actionCreator(...args));
        }
    }

    return boundActionCreators;
}
/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */


function isPlainObject(obj) {
    if (typeof obj !== 'object' || obj === null) return false;
    let proto = Object.getPrototypeOf(obj);
    if (proto === null) return true;
    let baseProto = proto;

    while (Object.getPrototypeOf(baseProto) !== null) {
        baseProto = Object.getPrototypeOf(baseProto);
    }

    return proto === baseProto;
}
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */


function warning(message) {
    /* eslint-disable no-console */
    if (typeof console !== 'undefined' && typeof console.error === 'function') {
        console.error(message);
    }
    /* eslint-enable no-console */


    try {
        // This error was thrown as a convenience so that if you enable
        // "break on all exceptions" in your console,
        // it would pause the execution at this line.
        throw new Error(message);
        /* eslint-disable no-empty */
    } catch (e) {}
    /* eslint-enable no-empty */

}

function verifyPlainObject(value, displayName, methodName) {
    if (!isPlainObject(value)) {
        warning(`${methodName}() in ${displayName} must return a plain object. Instead received ${value}.`);
    }
}

function wrapMapToPropsConstant(getConstant) {
    return function initConstantSelector(dispatch, options) {
        const constant = getConstant(dispatch, options);

        function constantSelector() {
            return constant;
        }

        constantSelector.dependsOnOwnProps = false;
        return constantSelector;
    };
} // dependsOnOwnProps is used by createMapToPropsProxy to determine whether to pass props as args
// to the mapToProps function being wrapped. It is also used by makePurePropsSelector to determine
// whether mapToProps needs to be invoked when props have changed.
//
// A length of one signals that mapToProps does not depend on props from the parent component.
// A length of zero is assumed to mean mapToProps is getting args via arguments or ...args and
// therefore not reporting its length accurately..


function getDependsOnOwnProps(mapToProps) {
    return mapToProps.dependsOnOwnProps !== null && mapToProps.dependsOnOwnProps !== undefined ? Boolean(mapToProps.dependsOnOwnProps) : mapToProps.length !== 1;
} // Used by whenMapStateToPropsIsFunction and whenMapDispatchToPropsIsFunction,
// this function wraps mapToProps in a proxy function which does several things:
//
//  * Detects whether the mapToProps function being called depends on props, which
//    is used by selectorFactory to decide if it should reinvoke on props changes.
//
//  * On first call, handles mapToProps if returns another function, and treats that
//    new function as the true mapToProps for subsequent calls.
//
//  * On first call, verifies the first result is a plain object, in order to warn
//    the developer that their mapToProps function is not returning a valid result.
//


function wrapMapToPropsFunc(mapToProps, methodName) {
    return function initProxySelector(dispatch, {
        displayName
    }) {
        const proxy = function mapToPropsProxy(stateOrDispatch, ownProps) {
            return proxy.dependsOnOwnProps ? proxy.mapToProps(stateOrDispatch, ownProps) : proxy.mapToProps(stateOrDispatch);
        }; // allow detectFactoryAndVerify to get ownProps


        proxy.dependsOnOwnProps = true;

        proxy.mapToProps = function detectFactoryAndVerify(stateOrDispatch, ownProps) {
            proxy.mapToProps = mapToProps;
            proxy.dependsOnOwnProps = getDependsOnOwnProps(mapToProps);
            let props = proxy(stateOrDispatch, ownProps);

            if (typeof props === 'function') {
                proxy.mapToProps = props;
                proxy.dependsOnOwnProps = getDependsOnOwnProps(props);
                props = proxy(stateOrDispatch, ownProps);
            }

            if (process.env.NODE_ENV !== 'production') verifyPlainObject(props, displayName, methodName);
            return props;
        };

        return proxy;
    };
}

function whenMapDispatchToPropsIsFunction(mapDispatchToProps) {
    return typeof mapDispatchToProps === 'function' ? wrapMapToPropsFunc(mapDispatchToProps, 'mapDispatchToProps') : undefined;
}

function whenMapDispatchToPropsIsMissing(mapDispatchToProps) {
    return !mapDispatchToProps ? wrapMapToPropsConstant(dispatch => ({
        dispatch
    })) : undefined;
}

function whenMapDispatchToPropsIsObject(mapDispatchToProps) {
    return mapDispatchToProps && typeof mapDispatchToProps === 'object' ? wrapMapToPropsConstant(dispatch => bindActionCreators(mapDispatchToProps, dispatch)) : undefined;
}

var defaultMapDispatchToPropsFactories = [whenMapDispatchToPropsIsFunction, whenMapDispatchToPropsIsMissing, whenMapDispatchToPropsIsObject];

function whenMapStateToPropsIsFunction(mapStateToProps) {
    return typeof mapStateToProps === 'function' ? wrapMapToPropsFunc(mapStateToProps, 'mapStateToProps') : undefined;
}

function whenMapStateToPropsIsMissing(mapStateToProps) {
    return !mapStateToProps ? wrapMapToPropsConstant(() => ({})) : undefined;
}

var defaultMapStateToPropsFactories = [whenMapStateToPropsIsFunction, whenMapStateToPropsIsMissing];

function defaultMergeProps(stateProps, dispatchProps, ownProps) {
    return Object.assign({}, ownProps, {}, stateProps, {}, dispatchProps);
}

function wrapMergePropsFunc(mergeProps) {
    return function initMergePropsProxy(dispatch, {
        displayName,
        pure,
        areMergedPropsEqual
    }) {
        let hasRunOnce = false;
        let mergedProps;
        return function mergePropsProxy(stateProps, dispatchProps, ownProps) {
            const nextMergedProps = mergeProps(stateProps, dispatchProps, ownProps);

            if (hasRunOnce) {
                if (!pure || !areMergedPropsEqual(nextMergedProps, mergedProps)) mergedProps = nextMergedProps;
            } else {
                hasRunOnce = true;
                mergedProps = nextMergedProps;
                if (process.env.NODE_ENV !== 'production') verifyPlainObject(mergedProps, displayName, 'mergeProps');
            }

            return mergedProps;
        };
    };
}

function whenMergePropsIsFunction(mergeProps) {
    return typeof mergeProps === 'function' ? wrapMergePropsFunc(mergeProps) : undefined;
}

function whenMergePropsIsOmitted(mergeProps) {
    return !mergeProps ? () => defaultMergeProps : undefined;
}

var defaultMergePropsFactories = [whenMergePropsIsFunction, whenMergePropsIsOmitted];

function verify(selector, methodName, displayName) {
    if (!selector) {
        throw new Error(`Unexpected value for ${methodName} in ${displayName}.`);
    } else if (methodName === 'mapStateToProps' || methodName === 'mapDispatchToProps') {
        if (!Object.prototype.hasOwnProperty.call(selector, 'dependsOnOwnProps')) {
            warning(`The selector for ${methodName} of ${displayName} did not specify a value for dependsOnOwnProps.`);
        }
    }
}

function verifySubselectors(mapStateToProps, mapDispatchToProps, mergeProps, displayName) {
    verify(mapStateToProps, 'mapStateToProps', displayName);
    verify(mapDispatchToProps, 'mapDispatchToProps', displayName);
    verify(mergeProps, 'mergeProps', displayName);
}

function impureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch) {
    return function impureFinalPropsSelector(state, ownProps) {
        return mergeProps(mapStateToProps(state, ownProps), mapDispatchToProps(dispatch, ownProps), ownProps);
    };
}

function pureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, {
    areStatesEqual,
    areOwnPropsEqual,
    areStatePropsEqual
}) {
    let hasRunAtLeastOnce = false;
    let state;
    let ownProps;
    let stateProps;
    let dispatchProps;
    let mergedProps;

    function handleFirstCall(firstState, firstOwnProps) {
        state = firstState;
        ownProps = firstOwnProps;
        stateProps = mapStateToProps(state, ownProps);
        dispatchProps = mapDispatchToProps(dispatch, ownProps);
        mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
        hasRunAtLeastOnce = true;
        return mergedProps;
    }

    function handleNewPropsAndNewState() {
        stateProps = mapStateToProps(state, ownProps);
        if (mapDispatchToProps.dependsOnOwnProps) dispatchProps = mapDispatchToProps(dispatch, ownProps);
        mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
        return mergedProps;
    }

    function handleNewProps() {
        if (mapStateToProps.dependsOnOwnProps) stateProps = mapStateToProps(state, ownProps);
        if (mapDispatchToProps.dependsOnOwnProps) dispatchProps = mapDispatchToProps(dispatch, ownProps);
        mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
        return mergedProps;
    }

    function handleNewState() {
        const nextStateProps = mapStateToProps(state, ownProps);
        const statePropsChanged = !areStatePropsEqual(nextStateProps, stateProps);
        stateProps = nextStateProps;
        if (statePropsChanged) mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
        return mergedProps;
    }

    function handleSubsequentCalls(nextState, nextOwnProps) {
        const propsChanged = !areOwnPropsEqual(nextOwnProps, ownProps);
        const stateChanged = !areStatesEqual(nextState, state);
        state = nextState;
        ownProps = nextOwnProps;
        if (propsChanged && stateChanged) return handleNewPropsAndNewState();
        if (propsChanged) return handleNewProps();
        if (stateChanged) return handleNewState();
        return mergedProps;
    }

    return function pureFinalPropsSelector(nextState, nextOwnProps) {
        return hasRunAtLeastOnce ? handleSubsequentCalls(nextState, nextOwnProps) : handleFirstCall(nextState, nextOwnProps);
    };
} // TODO: Add more comments
// If pure is true, the selector returned by selectorFactory will memoize its results,
// allowing connectAdvanced's shouldComponentUpdate to return false if final
// props have not changed. If false, the selector will always return a new
// object and shouldComponentUpdate will always return true.


function finalPropsSelectorFactory(dispatch, _ref2) {
    let {
        initMapStateToProps,
        initMapDispatchToProps,
        initMergeProps
    } = _ref2,
    options = (0, _objectWithoutPropertiesLoose2.default)(_ref2, ["initMapStateToProps", "initMapDispatchToProps", "initMergeProps"]);
    const mapStateToProps = initMapStateToProps(dispatch, options);
    const mapDispatchToProps = initMapDispatchToProps(dispatch, options);
    const mergeProps = initMergeProps(dispatch, options);

    if (process.env.NODE_ENV !== 'production') {
        verifySubselectors(mapStateToProps, mapDispatchToProps, mergeProps, options.displayName);
    }

    const selectorFactory = options.pure ? pureFinalPropsSelectorFactory : impureFinalPropsSelectorFactory;
    return selectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, options);
}
/*
  connect is a facade over connectAdvanced. It turns its args into a compatible
  selectorFactory, which has the signature:

    (dispatch, options) => (nextState, nextOwnProps) => nextFinalProps
  
  connect passes its args to connectAdvanced as options, which will in turn pass them to
  selectorFactory each time a Connect component instance is instantiated or hot reloaded.

  selectorFactory returns a final props selector from its mapStateToProps,
  mapStateToPropsFactories, mapDispatchToProps, mapDispatchToPropsFactories, mergeProps,
  mergePropsFactories, and pure args.

  The resulting final props selector is called by the Connect component instance whenever
  it receives new props or store state.
 */


function match(arg, factories, name) {
    for (let i = factories.length - 1; i >= 0; i--) {
        const result = factories[i](arg);
        if (result) return result;
    }

    return (dispatch, options) => {
        throw new Error(`Invalid value of type ${typeof arg} for ${name} argument when connecting component ${options.wrappedComponentName}.`);
    };
}

function strictEqual(a, b) {
    return a === b;
} // createConnect with default args builds the 'official' connect behavior. Calling it with
// different options opens up some testing and extensibility scenarios


function createConnect({
    connectHOC = connectAdvanced,
    mapStateToPropsFactories = defaultMapStateToPropsFactories,
    mapDispatchToPropsFactories = defaultMapDispatchToPropsFactories,
    mergePropsFactories = defaultMergePropsFactories,
    selectorFactory = finalPropsSelectorFactory
} = {}) {
    return function connect(mapStateToProps, mapDispatchToProps, mergeProps, _ref3 = {}) {
        let {
            pure = true,
                areStatesEqual = strictEqual,
                areOwnPropsEqual = shallowEqual,
                areStatePropsEqual = shallowEqual,
                areMergedPropsEqual = shallowEqual
        } = _ref3,
        extraOptions = (0, _objectWithoutPropertiesLoose2.default)(_ref3, ["pure", "areStatesEqual", "areOwnPropsEqual", "areStatePropsEqual", "areMergedPropsEqual"]);
        const initMapStateToProps = match(mapStateToProps, mapStateToPropsFactories, 'mapStateToProps');
        const initMapDispatchToProps = match(mapDispatchToProps, mapDispatchToPropsFactories, 'mapDispatchToProps');
        const initMergeProps = match(mergeProps, mergePropsFactories, 'mergeProps');
        return connectHOC(selectorFactory, Object.assign({
            // used in error messages
            methodName: 'connect',
            // used to compute Connect's displayName from the wrapped component's displayName.
            getDisplayName: name => `Connect(${name})`,
            // if mapStateToProps is falsy, the Connect component doesn't subscribe to store state changes
            shouldHandleStateChanges: Boolean(mapStateToProps),
            // passed through to selectorFactory
            initMapStateToProps,
            initMapDispatchToProps,
            initMergeProps,
            pure,
            areStatesEqual,
            areOwnPropsEqual,
            areStatePropsEqual,
            areMergedPropsEqual
        }, extraOptions));
    };
}

var connect = /*#__PURE__*/ createConnect();
/**
 * A hook to access the value of the `ReactReduxContext`. This is a low-level
 * hook that you should usually not need to call directly.
 *
 * @returns {any} the value of the `ReactReduxContext`
 *
 * @example
 *
 * import React from 'react'
 * import { useReduxContext } from 'react-redux'
 *
 * export const CounterComponent = ({ value }) => {
 *   const { store } = useReduxContext()
 *   return <div>{store.getState()}</div>
 * }
 */

exports.connect = connect;

function useReduxContext() {
    const contextValue = (0, _react.useContext)(ReactReduxContext);

    if (process.env.NODE_ENV !== 'production' && !contextValue) {
        throw new Error('could not find react-redux context value; please ensure the component is wrapped in a <Provider>');
    }

    return contextValue;
}
/**
 * Hook factory, which creates a `useStore` hook bound to a given context.
 *
 * @param {React.Context} [context=ReactReduxContext] Context passed to your `<Provider>`.
 * @returns {Function} A `useStore` hook bound to the specified context.
 */


function createStoreHook(context = ReactReduxContext) {
    const useReduxContext$1 = context === ReactReduxContext ? useReduxContext : () => (0, _react.useContext)(context);
    return function useStore() {
        const {
            store
        } = useReduxContext$1();
        return store;
    };
}
/**
 * A hook to access the redux store.
 *
 * @returns {any} the redux store
 *
 * @example
 *
 * import React from 'react'
 * import { useStore } from 'react-redux'
 *
 * export const ExampleComponent = () => {
 *   const store = useStore()
 *   return <div>{store.getState()}</div>
 * }
 */


const useStore = /*#__PURE__*/ createStoreHook();
/**
 * Hook factory, which creates a `useDispatch` hook bound to a given context.
 *
 * @param {React.Context} [context=ReactReduxContext] Context passed to your `<Provider>`.
 * @returns {Function} A `useDispatch` hook bound to the specified context.
 */

exports.useStore = useStore;

function createDispatchHook(context = ReactReduxContext) {
    const useStore$1 = context === ReactReduxContext ? useStore : createStoreHook(context);
    return function useDispatch() {
        const store = useStore$1();
        return store.dispatch;
    };
}
/**
 * A hook to access the redux `dispatch` function.
 *
 * @returns {any|function} redux store's `dispatch` function
 *
 * @example
 *
 * import React, { useCallback } from 'react'
 * import { useDispatch } from 'react-redux'
 *
 * export const CounterComponent = ({ value }) => {
 *   const dispatch = useDispatch()
 *   const increaseCounter = useCallback(() => dispatch({ type: 'increase-counter' }), [])
 *   return (
 *     <div>
 *       <span>{value}</span>
 *       <button onClick={increaseCounter}>Increase counter</button>
 *     </div>
 *   )
 * }
 */


const useDispatch = /*#__PURE__*/ createDispatchHook();
exports.useDispatch = useDispatch;

const refEquality = (a, b) => a === b;

function useSelectorWithStoreAndSubscription(selector, equalityFn, store, contextSub) {
    const [, forceRender] = (0, _react.useReducer)(s => s + 1, 0);
    const subscription = (0, _react.useMemo)(() => createSubscription(store, contextSub), [store, contextSub]);
    const latestSubscriptionCallbackError = (0, _react.useRef)();
    const latestSelector = (0, _react.useRef)();
    const latestStoreState = (0, _react.useRef)();
    const latestSelectedState = (0, _react.useRef)();
    const storeState = store.getState();
    let selectedState;

    try {
        if (selector !== latestSelector.current || storeState !== latestStoreState.current || latestSubscriptionCallbackError.current) {
            const newSelectedState = selector(storeState); // ensure latest selected state is reused so that a custom equality function can result in identical references

            if (latestSelectedState.current === undefined || !equalityFn(newSelectedState, latestSelectedState.current)) {
                selectedState = newSelectedState;
            } else {
                selectedState = latestSelectedState.current;
            }
        } else {
            selectedState = latestSelectedState.current;
        }
    } catch (err) {
        if (latestSubscriptionCallbackError.current) {
            err.message += `\nThe error may be correlated with this previous error:\n${latestSubscriptionCallbackError.current.stack}\n\n`;
        }

        throw err;
    }

    useIsomorphicLayoutEffect(() => {
        latestSelector.current = selector;
        latestStoreState.current = storeState;
        latestSelectedState.current = selectedState;
        latestSubscriptionCallbackError.current = undefined;
    });
    useIsomorphicLayoutEffect(() => {
        function checkForUpdates() {
            try {
                const newStoreState = store.getState(); // Avoid calling selector multiple times if the store's state has not changed

                if (newStoreState === latestStoreState.current) {
                    return;
                }

                const newSelectedState = latestSelector.current(newStoreState);

                if (equalityFn(newSelectedState, latestSelectedState.current)) {
                    return;
                }

                latestSelectedState.current = newSelectedState;
                latestStoreState.current = newStoreState;
            } catch (err) {
                // we ignore all errors here, since when the component
                // is re-rendered, the selectors are called again, and
                // will throw again, if neither props nor store state
                // changed
                latestSubscriptionCallbackError.current = err;
            }

            forceRender();
        }

        subscription.onStateChange = checkForUpdates;
        subscription.trySubscribe();
        checkForUpdates();
        return () => subscription.tryUnsubscribe();
    }, [store, subscription]);
    return selectedState;
}
/**
 * Hook factory, which creates a `useSelector` hook bound to a given context.
 *
 * @param {React.Context} [context=ReactReduxContext] Context passed to your `<Provider>`.
 * @returns {Function} A `useSelector` hook bound to the specified context.
 */


function createSelectorHook(context = ReactReduxContext) {
    const useReduxContext$1 = context === ReactReduxContext ? useReduxContext : () => (0, _react.useContext)(context);
    return function useSelector(selector, equalityFn = refEquality) {
        if (process.env.NODE_ENV !== 'production') {
            if (!selector) {
                throw new Error(`You must pass a selector to useSelector`);
            }

            if (typeof selector !== 'function') {
                throw new Error(`You must pass a function as a selector to useSelector`);
            }

            if (typeof equalityFn !== 'function') {
                throw new Error(`You must pass a function as an equality function to useSelector`);
            }
        }

        const {
            store,
            subscription: contextSub
        } = useReduxContext$1();
        const selectedState = useSelectorWithStoreAndSubscription(selector, equalityFn, store, contextSub);
        (0, _react.useDebugValue)(selectedState);
        return selectedState;
    };
}
/**
 * A hook to access the redux store's state. This hook takes a selector function
 * as an argument. The selector is called with the store state.
 *
 * This hook takes an optional equality comparison function as the second parameter
 * that allows you to customize the way the selected state is compared to determine
 * whether the component needs to be re-rendered.
 *
 * @param {Function} selector the selector function
 * @param {Function=} equalityFn the function that will be used to determine equality
 *
 * @returns {any} the selected state
 *
 * @example
 *
 * import React from 'react'
 * import { useSelector } from 'react-redux'
 *
 * export const CounterComponent = () => {
 *   const counter = useSelector(state => state.counter)
 *   return <div>{counter}</div>
 * }
 */


const useSelector = /*#__PURE__*/ createSelectorHook(); // with standard React renderers (ReactDOM, React Native)

exports.useSelector = useSelector;
setBatch(_reactDom.unstable_batchedUpdates);