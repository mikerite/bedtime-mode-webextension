"use strict";
async function handleInstalled({ reason }) {
  if (reason == "install") {
    await browser.tabs.create({ url: "/about.html" });
  }
}

browser.runtime.onInstalled.addListener(handleInstalled);
