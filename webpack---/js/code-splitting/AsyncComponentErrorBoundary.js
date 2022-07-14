'use es6';

import {
    Component
} from 'react';
import PropTypes from 'prop-types';

class AsyncComponentErrorBoundary extends Component {
    static getDerivedStateFromError(error) {
        return {
            error
        };
    }

    constructor(props) {
        super(props);

        this.handleRetry = () => {
            this.setState({
                error: false
            });
        };

        this.explicitlySetError = error => {
            this.setState({
                error
            });
        };

        this.state = {
            error: null
        };
    }

    render() {
        if (this.state.error) {
            return this.props.renderError(this.handleRetry);
        }

        return this.props.children;
    }

}

AsyncComponentErrorBoundary.displayName = 'AsyncComponentErrorBoundary';
AsyncComponentErrorBoundary.propTypes = {
    children: PropTypes.node,
    renderError: PropTypes.func.isRequired
};
export default AsyncComponentErrorBoundary;