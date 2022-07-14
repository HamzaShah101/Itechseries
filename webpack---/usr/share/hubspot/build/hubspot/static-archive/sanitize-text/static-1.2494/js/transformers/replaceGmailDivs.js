'use es6';

import {
    secureDocument
} from '../sanitizers/SanitizeConfiguration';
export const replaceGmailDivs = ({
    node,
    node_name
}) => {
    if (node_name === 'div' && node && node.classList && node.classList.contains('gmail_default')) {
        const span = secureDocument.createElement('span');
        Object.keys(node.attributes).forEach(key => {
            const attribute = node.attributes[key];

            try {
                span.setAttribute(attribute.nodeName, attribute.nodeValue);
            } catch (error) { // Customer has malformed HTML, this allows us to catch the error and proceed with parsing
                // https://issues.hubspotcentral.com/browse/CRMMAIL-7984
            }
        });
        span.innerHTML = node.innerHTML.trim();
        return {
            node: span
        };
    }

    return null;
};