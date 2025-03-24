/**
 * Base page object for WDIO page objects.
 * @module
 * @category public
 */

/* global browser,$,$$ */

import { logger } from '../logger.js';

export const TIMEOUT = process.env.DEBUG ? 60 * 60 * 1000 : 20_000;
export const EXTRA_LARGE_TIMEOUT = 120_000;

const tabs = new Map();

export default class Page {
  /**
   * **Sets the browser url** for the specified **tab name**.
   * @param {string} tabName tab name
   * @param {string} url url to navigate to
   * @param {boolean} [maximize] maximize window
   * @returns {Promise<void>}
   */
  async setUrl(tabName, url, maximize = true) {
    await browser.url(url);
    if (maximize) await browser.maximizeWindow();
    const handle = await browser.getWindowHandle();
    tabs.set(tabName, handle);
  }

  /**
   * **Opens** the specified **tab name** with the specified **url**.
   * @param {string} tabName nom de l'onglet du navigateur
   * @param {string} url url à atteindre
   * @returns {Promise<void>}
   */
  async openNewTab(tabName, url) {
    if (tabs.has(tabName)) {
      const handle = tabs.get(tabName);
      await browser.switchToWindow(handle);
      await browser.url(url);
      return;
    }
    await browser.newWindow(url);
    await browser.maximizeWindow();
    const handle = await browser.getWindowHandle();
    tabs.set(tabName, handle);
  }

  /**
   * **Switches to** the specified **tab name**.
   * @param {string} tabName nom de l'onglet du navigateur
   * @returns {Promise<void>}
   */
  async switchToTab(tabName) {
    const handle = tabs.get(tabName);
    await browser.switchToWindow(handle);
  }

  /**
   * **Switches to** the **last opened tab**.
   * @returns {Promise<void>}
   */
  async switchToLastOpenedTab() {
    const handles = await browser.getWindowHandles();
    return browser.switchToWindow(handles.at(-1));
  }

  /**
   * Dumps tabs information.
   */
  async debugTabs() {
    for (const tab of tabs) {
      const [name, handle] = tab;
      if (handle) {
        await browser.switchToWindow(handle);
        const url = await browser.getUrl();
        logger.debug(`Tab ${name}: ${url}`);
      } else {
        logger.error(`Tab ${name} not set!`);
      }
    }
  }

  /**
   * Switches to the frame specified by the css selector.
   * @param {string} [css] css selector of top level frame if not specified
   * @returns {Promise<void | string>}
   */
  async switchToFrame(css) {
    if (!css) {
      // eslint-disable-next-line unicorn/no-null
      return browser.switchFrame(null);
    }
    try {
      return browser.switchFrame($(css));
    } catch (error) {
      logger.detailError(error);
    }
  }

  /**
   * **Retrieves the text** corresponding to the specified css selector.
   * Waits during the specified (or default) timeout **before throwing error**.
   * @param {string} css css selector
   * @param {number} [timeout] optional timeout before throwing error
   * @returns {Promise<string>} the corresponding text
   */
  async getText(css, timeout = TIMEOUT) {
    await browser.waitUntil($(css).isDisplayed, { timeout });
    return $(css).getText();
  }

  /**
   * **Retrieves the value** corresponding to the specified css selector.
   * Waits during the specified (or default) timeout **before throwing error**.
   * @param {string} css css selector
   * @param {number} [timeout] optional timeout before throwing error
   * @returns {Promise<string>} the corresponding value
   */
  async getValue(css, timeout = TIMEOUT) {
    await browser.waitUntil($(css).isDisplayed, { timeout });
    return $(css).getValue();
  }

  /**
   * **Retrieves the inner html** corresponding to the specified css selector.
   * Waits during the specified (or default) timeout **before throwing error**.
   * @param {string} css css selector
   * @param {number} [timeout] optional timeout before throwing error
   * @returns {Promise<string>} the corresponding inner html
   */
  async getHtml(css, timeout = TIMEOUT) {
    await browser.waitUntil($(css).isDisplayed, { timeout });
    return $(css).getHTML({ includeSelectorTag: false });
  }

  /**
   * **Retrieves the list of values** of the specified **select** css selector.
   * Waits during the specified (or default) timeout **before throwing error**.
   * @param {string} css  css selector of the select
   * @param {number} [childrenCount] optional count of children to wait for (default 1)
   * @param {number} [timeout] optional timeout before throwing error
   * @returns {Promise<string[]>} the corresponding values
   */
  async getSelectOptions(css, childrenCount = 1, timeout = TIMEOUT) {
    await this.waitElementHasChildren(`${css} option`, childrenCount, timeout);
    const options = await $$(`${css} option`).getElements();
    // le tableau des options
    const items = [];
    for (const o of options) {
      const item = await o.getValue();
      items.push(item);
    }
    return items;
  }

  /**
   * **Retrieves the selected text** of the specified **select** css selector.
   * Waits during the specified (or default) timeout **before throwing error**.
   * @param {string} css  css selector of the select
   * @param {number} [childrenCount] optional count of children to wait for (default 1)
   * @param {number} [timeout] optional timeout before throwing error
   * @returns {Promise<string>} the corresponding text
   */
  async getSelectSelectedText(css, childrenCount = 1, timeout = TIMEOUT) {
    await this.waitElementHasChildren(`${css} option`, childrenCount, timeout);
    return $(`${css} option:checked`).getText();
  }

  /**
   * **Retrieves the selected value** of the specified **select** css selector.
   * Waits during the specified (or default) timeout **before throwing error**.
   * @param {string} css css selector of the select
   * @param {number} [childrenCount] optional count of children to wait for (default 1)
   * @param {number} [timeout] optional timeout before throwing error
   * @returns {Promise<string>} the corresponding text
   */
  async getSelectSelectedValue(css, childrenCount = 1, timeout = TIMEOUT) {
    await this.waitElementHasChildren(`${css} option`, childrenCount, timeout);
    return $(`${css} option:checked`).getValue();
  }

  /**
   * **Verifies if the element** specified by the css selector **exists**.
   * Will only verify for the **specified amount of seconds**.
   * **Does not throw error**.
   * @param {string} css css selector
   * @param {Number} periodInSecond period of time to wait (in s)
   * @returns {Promise<boolean>} true if element exists, false otherwise
   */
  async verifyElementExistsDuring(css, periodInSecond) {
    const totalTime = Math.trunc(periodInSecond);
    let elementExists = false;
    let elapsedTime = 0;
    while (!elementExists || elapsedTime <= totalTime) {
      elementExists = await $(css).isExisting();
      if (elementExists || elapsedTime === totalTime) break;
      await browser.pause(1000);
      elapsedTime++;
    }
    return elementExists;
  }

  /**
   * **Verifies if the element** specified by the css selector **exists**.
   * **Does not throw error**.
   * @param {string} css css selector
   * @returns {Promise<boolean>} true if element exists, false otherwise
   */
  async verifyElementExists(css) {
    return $(css).isExisting();
  }

  /**
   * **Waits until the element** specified by the css selector **exists**.
   * **Throws an error** after the specified (or default) timeout has expired.
   * @param {string} css css selector
   * @param {number} [timeout] optional timeout before throwing error
   * @returns {ChainablePromiseElement} the element if it exists
   */
  async waitElementExists(css, timeout = TIMEOUT) {
    await $(css).waitForExist();
    await browser.waitUntil(async () => await $(css).isExisting(), { timeout });
    return $(css);
  }

  /**
   * **Waits until the element** specified by the css selector **has no more** the specified **text**.
   * **Throws an error** after the specified (or default) timeout has expired.
   * @param {string} css css selector
   * @param {number} [timeout] optional timeout before throwing error
   * @param {string} oldText text that is supposed to disapear
   * @returns {Promise<string>} the new text if it exists
   */
  async waitTextChanged(css, oldText, timeout = TIMEOUT) {
    await browser.waitUntil(
      async () => {
        const existingText = await $(css).getText();
        return !existingText.includes(oldText);
      },
      { timeout }
    );
    return $(css).getText();
  }

  /**
   * **Waits until the element** specified by the css selector **has** the specified **text**.
   * **Throws an error** after the specified (or default) timeout has expired.
   * @param {string} css css selector
   * @param {string} text text to wait for
   * @param {number} [timeout] optional timeout before throwing error
   * @returns {Promise<boolean>} true if condition is fullfilled
   */
  async waitElementHasText(css, text, timeout = TIMEOUT) {
    return browser.waitUntil(
      async () => {
        const existingText = await $(css).getText();
        return existingText.includes(text);
      },
      { timeout }
    );
  }

  /**
   * **Waits until the element** specified by the css selector **has the specified value**.
   * **Throws an error** after the specified (or default) timeout has expired.
   * @param {string} css css selector
   * @param {string | number | boolean} value value to wait for
   * @param {number} [timeout] optional timeout before throwing error
   * @returns {Promise<boolean>} true if condition is fullfilled
   */
  async waitElementHasValue(css, value, timeout = TIMEOUT) {
    // eslint-disable-next-line eqeqeq
    return await browser.waitUntil(async () => (await $(css).getValue()) == value, { timeout });
  }

  /**
   * **Waits until the element** specified by the css selector is **removed from the DOM**.
   * **Throws an error** after the specified (or default) timeout has expired.
   * @param {string} css css selector
   * @param {number} [timeout] optional timeout before throwing error
   * @returns {Promise<boolean>} true if condition is fullfilled
   */
  async waitElementRemoved(css, timeout = TIMEOUT) {
    return browser.waitUntil(async () => !(await $(css).isExisting()), { timeout });
  }

  /**
   * **Waits until the element** specified by the css selector is **clickable**.
   * **Throws an error** after the specified (or default) timeout has expired.
   * @param {string} css css selector
   * @param {number} [timeout] optional timeout before throwing error
   * @returns {Promise<boolean>} true if condition is fullfilled
   */
  async waitElementClickable(css, timeout = TIMEOUT) {
    return browser.waitUntil(() => $(css).isClickable(), { timeout });
  }

  /**
   * **Waits until the element** specified by the css selector is **displayed**.
   * **Throws an error** after the specified (or default) timeout has expired.
   * @param {string} css css selector
   * @param {number} [timeout] optional timeout before throwing error
   * @returns {Promise<boolean>} true if condition is fullfilled
   */
  async waitElementDisplayed(css, timeout = TIMEOUT) {
    return browser.waitUntil(() => $(css).isDisplayed(), { timeout });
  }

  /**
   * **Waits until the element** specified by the css selector is **hidden**.
   * **Throws an error** after the specified (or default) timeout has expired.
   * @param {string} css css selector
   * @param {number} [timeout] optional timeout before throwing error
   * @returns {Promise<boolean>} true if condition is fullfilled
   */
  async waitElementHidden(css, timeout = TIMEOUT) {
    return browser.waitUntil(async () => !(await $(css).isDisplayed()), { timeout });
  }

  /**
   * **Waits until the element** specified by the css selector **has children**.
   * **Throws an error** after the specified (or default) timeout has expired.
   * @param {string} css css selector that contains children
   * @param {number} [childrenCount] optional count of children to wait for (default 1)
   * @param {number} [timeout] optional timeout before throwing error
   * @returns {Promise<boolean>} true if condition is fullfilled
   */
  async waitElementHasChildren(css, childrenCount = 1, timeout = TIMEOUT) {
    return browser.waitUntil(async () => (await $$(css).length) >= childrenCount, { timeout });
  }

  /**
   * **Waits until the browser url ends with** the specified **text**.
   * **Throws an error** after the specified (or default) timeout has expired.
   * @param {string} text ending text
   * @param {number} [timeout] optional timeout before throwing error
   * @returns {Promise<boolean>} true if condition is fullfilled
   */
  async waitUrlEndsWith(text, timeout = TIMEOUT) {
    return browser.waitUntil(
      async () => {
        const existingUrl = await browser.getUrl();
        return existingUrl.endsWith(text);
      },
      { timeout }
    );
  }

  /**
   * **Waits until the browser url contains** the specified **text**.
   * **Throws an error** after the specified (or default) timeout has expired.
   * @param {string} text ending text
   * @param {number} [timeout] optional timeout before throwing error
   * @returns {Promise<boolean>} true if condition is fullfilled
   */
  async waitUrlContains(text, timeout = TIMEOUT) {
    return browser.waitUntil(
      async () => {
        const existingUrl = await browser.getUrl();
        return existingUrl.includes(text);
      },
      { timeout }
    );
  }

  /**
   * **Waits until the browser url is not more** the specified **text**.
   * **Throws an error** after the specified (or default) timeout has expired.
   * @param {string} text ending text
   * @param {number} [timeout] optional timeout before throwing error
   * @returns {Promise<boolean>} true if condition is fullfilled
   */
  async waitUrlIsNoMore(text, timeout = TIMEOUT) {
    return browser.waitUntil(async () => (await browser.getUrl()) !== text, { timeout });
  }

  /**
   * **Clicks the element** specified by the css selector.
   * **Throws an error** after the specified (or default) timeout has expired.
   * @param {string} css css selector
   * @param {string} [cssParent] optional css selector of the parent
   * @param {number} [timeout] optional timeout before throwing error
   * @returns {Promise<void>}
   */
  async click(css, cssParent, timeout = TIMEOUT) {
    const element = cssParent ? $(cssParent).$(css) : $(css);
    await browser.waitUntil(() => element.isClickable(), { timeout });
    return element.click();
  }

  /**
   * **Checks the checkbox or radio button** specified by the css selector.
   * **Throws an error** after the specified (or default) timeout has expired.
   * @param {string} css css selector of checkbox or radio button
   * @param {number} [timeout] optional timeout before throwing error
   * @returns {Promise<void>}
   */
  async check(css, timeout = TIMEOUT) {
    const element = $(css);
    await browser.waitUntil(() => element.isClickable(), { timeout });
    return element.click();
  }

  /**
   * **Checks the checkbox or radio button** specified by the label text and css selector.
   * **Throws an error** after the specified (or default) timeout has expired.
   * @param {string} text label text
   * @param {string} css css selector of the label
   * @param {string} [cssParent] optional css selector for the parent
   * @param {number} [timeout] optional timeout before throwing error
   * @returns {Promise<void>}
   */
  async checkByText(text, css, cssParent, timeout = TIMEOUT) {
    return this.click(`${css}=${text}`, cssParent, timeout);
  }

  /**
   * **Fills the input** specified by the css selector with the specified **text**.
   * **Throws an error** after the specified (or default) timeout has expired.
   * @param {string} css css selector of the input
   * @param {string | number} text text to fill in
   * @param {number} [timeout] optional timeout before throwing error
   * @returns {Promise<void>}
   */
  async fillInput(css, text, timeout = TIMEOUT) {
    await browser.waitUntil(() => $(css).isEnabled(), { timeout });
    await $(css).setValue(text);
    return browser.keys('Tab');
  }

  /**
   * **Selects the option** specified by the **select** css selector with the specified **text**.
   * **Throws an error** after the specified (or default) timeout has expired.
   * @param {string} css css selector of the select
   * @param {string} text text of the option
   * @param {number} [timeout] optional timeout before throwing error
   * @returns {Promise<void>}
   */
  async selectItem(css, text, timeout = TIMEOUT) {
    await browser.waitUntil(
      async () => {
        const nbOptions = await $$(`${css} option`).length;
        return nbOptions > 1;
      },
      { timeout }
    );
    await this.click(css);
    await $(css).selectByVisibleText(text);
  }

  /**
   * **Selects the option** specified by the wdio element with the specified **text**.
   * **Throws an error** after the specified (or default) timeout has expired.
   * @param {WebdriverIO.Element} element select element
   * @param {string} text text of the option
   * @param {number} [timeout] optional timeout before throwing error
   * @returns {Promise<void>}
   */
  async selectObjectItem(element, text, timeout = TIMEOUT) {
    await browser.waitUntil(() => element.isClickable(), { timeout });
    await element.click();
    return element.selectByVisibleText(text);
  }
}
