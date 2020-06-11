import browser from 'webextension-polyfill';

import linkDecoration from './features/link-decoration';

const modifiers = [linkDecoration];

console.log('[KZT] krista-zulip-tools has started');

browser.runtime.sendMessage({ type: 'request-credentials' })
    .then((credentials) => modifiers.forEach((modifier) => modifier(credentials)));
