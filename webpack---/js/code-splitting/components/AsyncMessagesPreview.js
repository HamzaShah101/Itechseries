'use es6';

import {
    jsx as _jsx
} from "react/jsx-runtime";
import * as React from 'react';
import {
    initializeI18n
} from '../../utils/initializeI18n';

class AsyncMessagesPreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            AsyncComponent: null,
            error: null
        };
    }

    componentDidMount() {
        Promise.all([
            import (
                /* webpackChunkName: "messages-preview" */
                '../../message-preview/containers/MessagePreviewContainer'), initializeI18n()
        ]).then(([AsyncModule]) => {
            this.setState({
                AsyncComponent: AsyncModule.default
            });
        }, error => {
            this.setState({
                error
            });
        });
    }

    render() {
        const Component = this.state.AsyncComponent;

        if (this.state.error) {
            window.parent.postMessage('error');
            return null;
        }

        if (!Component) {
            return null;
        }

        return /*#__PURE__*/ _jsx(Component, Object.assign({}, this.props));
    }

}

AsyncMessagesPreview.displayName = 'AsyncMessagesPreview';
export default AsyncMessagesPreview;