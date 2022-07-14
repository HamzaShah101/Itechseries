'use es6';

import PropTypes from 'prop-types';
import {
    Component
} from 'react';
import {
    reportError
} from 'conversations-error-reporting/error-reporting/reportError';
import {
    buildError
} from 'conversations-error-reporting/error-reporting/builders/buildError';
export default class ErrorBoundary extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            hasError: false
        };
    }

    static getDerivedStateFromError() {
        return {
            hasError: true
        };
    }

    componentDidCatch(error, info) {
        const message = ['Component caught', this.props.errorLoggingTitle, error.message].join(': ');
        const componentError = buildError(message, {
            name: 'ComponentError',
            componentStack: info.componentStack
        });
        reportError({
            error: componentError,
            fingerprint: ['{{ default }}', 'ComponentError'],
            tags: {
                componentDidCatch: true
            }
        });
    }

    reset() {
        this.setState({
            hasError: false
        });
    }

    render() {
        const {
            children,
            renderError
        } = this.props;
        const {
            hasError
        } = this.state;
        if (hasError && !renderError) return null;

        if (hasError && renderError) {
            return renderError({
                reset: this.reset
            });
        }

        return children;
    }

}
ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
    errorLoggingTitle: PropTypes.string.isRequired,
    renderError: PropTypes.func
};
ErrorBoundary.displayName = 'ErrorBoundary';