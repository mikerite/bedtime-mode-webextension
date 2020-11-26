"use strict";

const fs = require("fs");

const { Builder, Condition, until } = require("selenium-webdriver");
const { Options } = require("selenium-webdriver/firefox");

const SHORT_TIME = 1000; // 1 second in milliseconds. Used for waits.

async function buildDriver() {
  const driver = await new Builder()
    .forBrowser("firefox")
    .setFirefoxOptions(new Options().headless())
    .build();
  const [extension, ...other] = fs.readdirSync("web-ext-artifacts");
  if (extension == null) {
    throw new Error("Can't find extension.");
  }
  if (other.length > 0) {
    throw new Error("Can't determine extension path. Multiple artifacts.");
  }
  await driver.installAddon(`web-ext-artifacts/${extension}`, true);

  return driver;
}

describe("Extension", function () {
  it("should run", async function () {
    const driver = await buildDriver();
    try {
      let condition = new Condition(
        "Waiting for second tab",
        async function () {
          return await driver.getAllWindowHandles().then((x) => x[1] || null);
        }
      );
      let onboardingTab = await driver.wait(condition, SHORT_TIME);
      await driver.switchTo().window(onboardingTab);
      await driver.wait(until.titleIs("Bedtime Mode Extension"), SHORT_TIME);
    } finally {
      await driver.quit();
    }
  });
});
