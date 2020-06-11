import browser from "webextension-polyfill";

import { defaultOptions } from "../shared";

browser.runtime.onMessage.addListener((message) => {
  if (message.type === "request-credentials") {
    return browser.storage.sync.get(defaultOptions);
  }
});
