import browser from 'webextension-polyfill';
import zulip from 'zulip-js';

import linkDecoration from './features/link-decoration';

const modifiers = [linkDecoration];

console.log('[KZT] krista-zulip-tools has started');

browser.runtime.sendMessage({ type: 'request-credentials' })
    .then((credentials) => zulip(credentials).then((zulip) => ({ zulip, credentials })))
    .then(({ zulip, credentials }) => modifiers.forEach((modifier) => modifier(zulip, credentials)));
