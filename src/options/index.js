import browser from 'webextension-polyfill';

import { defaultOptions } from '../shared';

document.addEventListener('DOMContentLoaded', () => {
    browser.storage.sync.get(defaultOptions).then((options) =>
        Object.keys(options).forEach((option) => {
            const field = document.getElementById(option);
            field.value = options[option];
            field.addEventListener('change', (event) => {
                browser.storage.sync.set({ [option]: event.target.value });
            });
        })
    );
});
