# Module `page-objects/page`

![category:public](https://img.shields.io/badge/category-public-FF5000.svg?style=flat-square)

Base page object for WDIO page objects.

[Source file](../src/page-objects/page.js)

## Functions

### `setUrl(tabName, url, maximize) ► Promise.<void>`

![modifier: public](images/badges/modifier-public.png)

**Sets the browser url** for the specified **tab name**.

Parameters | Type | Description
--- | --- | ---
__tabName__ | `string` | *tab name*
__url__ | `string` | *url to navigate to*
__maximize__ | `boolean` | *maximize window*
__*return*__ | `Promise.<void>` | **

---

### `openNewTab(tabName, url) ► Promise.<void>`

![modifier: public](images/badges/modifier-public.png)

**Opens** the specified **tab name** with the specified **url**.

Parameters | Type | Description
--- | --- | ---
__tabName__ | `string` | *nom de l&#x27;onglet du navigateur*
__url__ | `string` | *url à atteindre*
__*return*__ | `Promise.<void>` | **

---

### `switchToTab(tabName) ► Promise.<void>`

![modifier: public](images/badges/modifier-public.png)

**Switches to** the specified **tab name**.

Parameters | Type | Description
--- | --- | ---
__tabName__ | `string` | *nom de l&#x27;onglet du navigateur*
__*return*__ | `Promise.<void>` | **

---

### `switchToLastOpenedTab() ► Promise.<void>`

![modifier: public](images/badges/modifier-public.png)

**Switches to** the **last opened tab**.

Parameters | Type | Description
--- | --- | ---
__*return*__ | `Promise.<void>` | **

---

### `debugTabs()`

![modifier: public](images/badges/modifier-public.png)

Dumps tabs information.

---

### `switchToFrame(css) ► Promise.<(void|string)>`

![modifier: public](images/badges/modifier-public.png)

Switches to the frame specified by the css selector.

Parameters | Type | Description
--- | --- | ---
__css__ | `string` | *css selector of top level frame if not specified*
__*return*__ | `Promise.<(void\|string)>` | **

---

### `getText(css, timeout) ► Promise.<string>`

![modifier: public](images/badges/modifier-public.png)

**Retrieves the text** corresponding to the specified css selector.
Waits during the specified (or default) timeout **before throwing error**.

Parameters | Type | Description
--- | --- | ---
__css__ | `string` | *css selector*
__timeout__ | `number` | *optional timeout before throwing error*
__*return*__ | `Promise.<string>` | *the corresponding text*

---

### `getValue(css, timeout) ► Promise.<string>`

![modifier: public](images/badges/modifier-public.png)

**Retrieves the value** corresponding to the specified css selector.
Waits during the specified (or default) timeout **before throwing error**.

Parameters | Type | Description
--- | --- | ---
__css__ | `string` | *css selector*
__timeout__ | `number` | *optional timeout before throwing error*
__*return*__ | `Promise.<string>` | *the corresponding value*

---

### `getHtml(css, timeout) ► Promise.<string>`

![modifier: public](images/badges/modifier-public.png)

**Retrieves the inner html** corresponding to the specified css selector.
Waits during the specified (or default) timeout **before throwing error**.

Parameters | Type | Description
--- | --- | ---
__css__ | `string` | *css selector*
__timeout__ | `number` | *optional timeout before throwing error*
__*return*__ | `Promise.<string>` | *the corresponding inner html*

---

### `getOptions(css, timeout) ► Promise.<Array.<string>>`

![modifier: public](images/badges/modifier-public.png)

**Retrieves the list of values** of the specified **select** css selector.
Waits during the specified (or default) timeout **before throwing error**.

Parameters | Type | Description
--- | --- | ---
__css__ | `string` | *css selector of the select*
__timeout__ | `number` | *optional timeout before throwing error*
__*return*__ | `Promise.<Array.<string>>` | *the corresponding values*

---

### `getSelectedText(css, timeout) ► Promise.<string>`

![modifier: public](images/badges/modifier-public.png)

**Retrieves the selected text** of the specified **select** css selector.
Waits during the specified (or default) timeout **before throwing error**.

Parameters | Type | Description
--- | --- | ---
__css__ | `string` | *css selector of the select*
__timeout__ | `number` | *optional timeout before throwing error*
__*return*__ | `Promise.<string>` | *the corresponding text*

---

### `getSelectedValue(css, timeout) ► Promise.<string>`

![modifier: public](images/badges/modifier-public.png)

**Retrieves the selected value** of the specified **select** css selector.
Waits during the specified (or default) timeout **before throwing error**.

Parameters | Type | Description
--- | --- | ---
__css__ | `string` | *css selector of the select*
__timeout__ | `number` | *optional timeout before throwing error*
__*return*__ | `Promise.<string>` | *the corresponding text*

---

### `verifyElementExistsDuring(css, periodInSecond) ► Promise.<boolean>`

![modifier: public](images/badges/modifier-public.png)

**Verifies if the element** specified by the css selector **exists**.
Will only verify for the **specified amount of seconds**.
**Does not throw error**.

Parameters | Type | Description
--- | --- | ---
__css__ | `string` | *css selector*
__periodInSecond__ | `Number` | *period of time to wait (in s)*
__*return*__ | `Promise.<boolean>` | *true if element exists, false otherwise*

---

### `verifyElementExists(css) ► Promise.<boolean>`

![modifier: public](images/badges/modifier-public.png)

**Verifies if the element** specified by the css selector **exists**.
**Does not throw error**.

Parameters | Type | Description
--- | --- | ---
__css__ | `string` | *css selector*
__*return*__ | `Promise.<boolean>` | *true if element exists, false otherwise*

---

### `waitElementExists(css, timeout) ► ChainablePromiseElement`

![modifier: public](images/badges/modifier-public.png)

**Waits until the element** specified by the css selector **exists**.
**Throws an error** after the specified (or default) timeout has expired.

Parameters | Type | Description
--- | --- | ---
__css__ | `string` | *css selector*
__timeout__ | `number` | *optional timeout before throwing error*
__*return*__ | `ChainablePromiseElement` | *the element if it exists*

---

### `waitTextChanged(css, timeout, oldText) ► Promise.<string>`

![modifier: public](images/badges/modifier-public.png)

**Waits until the element** specified by the css selector **has no more** the specified **text**.
**Throws an error** after the specified (or default) timeout has expired.

Parameters | Type | Description
--- | --- | ---
__css__ | `string` | *css selector*
__timeout__ | `number` | *optional timeout before throwing error*
__oldText__ | `string` | *text that is supposed to disapear*
__*return*__ | `Promise.<string>` | *the new text if it exists*

---

### `waitElementHasText(css, text, timeout) ► Promise.<boolean>`

![modifier: public](images/badges/modifier-public.png)

**Waits until the element** specified by the css selector **has** the specified **text**.
**Throws an error** after the specified (or default) timeout has expired.

Parameters | Type | Description
--- | --- | ---
__css__ | `string` | *css selector*
__text__ | `string` | *text to wait for*
__timeout__ | `number` | *optional timeout before throwing error*
__*return*__ | `Promise.<boolean>` | *true if condition is fullfilled*

---

### `waitElementHasValue(css, value, timeout) ► Promise.<boolean>`

![modifier: public](images/badges/modifier-public.png)

**Waits until the element** specified by the css selector **has the specified value**.
**Throws an error** after the specified (or default) timeout has expired.

Parameters | Type | Description
--- | --- | ---
__css__ | `string` | *css selector*
__value__ | `string` | *value to wait for*
__timeout__ | `number` | *optional timeout before throwing error*
__*return*__ | `Promise.<boolean>` | *true if condition is fullfilled*

---

### `waitElementRemoved(css, timeout) ► Promise.<boolean>`

![modifier: public](images/badges/modifier-public.png)

**Waits until the element** specified by the css selector is **removed from the DOM**.
**Throws an error** after the specified (or default) timeout has expired.

Parameters | Type | Description
--- | --- | ---
__css__ | `string` | *css selector*
__timeout__ | `number` | *optional timeout before throwing error*
__*return*__ | `Promise.<boolean>` | *true if condition is fullfilled*

---

### `waitElementClickable(css, timeout) ► Promise.<boolean>`

![modifier: public](images/badges/modifier-public.png)

**Waits until the element** specified by the css selector is **clickable**.
**Throws an error** after the specified (or default) timeout has expired.

Parameters | Type | Description
--- | --- | ---
__css__ | `string` | *css selector*
__timeout__ | `number` | *optional timeout before throwing error*
__*return*__ | `Promise.<boolean>` | *true if condition is fullfilled*

---

### `waitElementDisplayed(css, timeout) ► Promise.<boolean>`

![modifier: public](images/badges/modifier-public.png)

**Waits until the element** specified by the css selector is **displayed**.
**Throws an error** after the specified (or default) timeout has expired.

Parameters | Type | Description
--- | --- | ---
__css__ | `string` | *css selector*
__timeout__ | `number` | *optional timeout before throwing error*
__*return*__ | `Promise.<boolean>` | *true if condition is fullfilled*

---

### `waitElementHidden(css, timeout) ► Promise.<boolean>`

![modifier: public](images/badges/modifier-public.png)

**Waits until the element** specified by the css selector is **hidden**.
**Throws an error** after the specified (or default) timeout has expired.

Parameters | Type | Description
--- | --- | ---
__css__ | `string` | *css selector*
__timeout__ | `number` | *optional timeout before throwing error*
__*return*__ | `Promise.<boolean>` | *true if condition is fullfilled*

---

### `waitElementHasChildren(css, childrenCount, timeout) ► Promise.<boolean>`

![modifier: public](images/badges/modifier-public.png)

**Waits until the element** specified by the css selector **has children**.
**Throws an error** after the specified (or default) timeout has expired.

Parameters | Type | Description
--- | --- | ---
__css__ | `string` | *css selector*
__childrenCount__ | `number` | *optional count of children to wait for (default 1)*
__timeout__ | `number` | *optional timeout before throwing error*
__*return*__ | `Promise.<boolean>` | *true if condition is fullfilled*

---

### `waitUrlEndsWith(text, timeout) ► Promise.<boolean>`

![modifier: public](images/badges/modifier-public.png)

**Waits until the browser url ends with** the specified **text**.
**Throws an error** after the specified (or default) timeout has expired.

Parameters | Type | Description
--- | --- | ---
__text__ | `string` | *ending text*
__timeout__ | `number` | *optional timeout before throwing error*
__*return*__ | `Promise.<boolean>` | *true if condition is fullfilled*

---

### `waitUrlContains(text, timeout) ► Promise.<boolean>`

![modifier: public](images/badges/modifier-public.png)

**Waits until the browser url contains** the specified **text**.
**Throws an error** after the specified (or default) timeout has expired.

Parameters | Type | Description
--- | --- | ---
__text__ | `string` | *ending text*
__timeout__ | `number` | *optional timeout before throwing error*
__*return*__ | `Promise.<boolean>` | *true if condition is fullfilled*

---

### `waitUrlIsNoMore(text, timeout) ► Promise.<boolean>`

![modifier: public](images/badges/modifier-public.png)

**Waits until the browser url is not more** the specified **text**.
**Throws an error** after the specified (or default) timeout has expired.

Parameters | Type | Description
--- | --- | ---
__text__ | `string` | *ending text*
__timeout__ | `number` | *optional timeout before throwing error*
__*return*__ | `Promise.<boolean>` | *true if condition is fullfilled*

---

### `click(css, cssParent, timeout) ► Promise.<void>`

![modifier: public](images/badges/modifier-public.png)

**Clicks the element** specified by the css selector.
**Throws an error** after the specified (or default) timeout has expired.

Parameters | Type | Description
--- | --- | ---
__css__ | `string` | *css selector*
__cssParent__ | `string` | *optional css selector of the parent*
__timeout__ | `number` | *optional timeout before throwing error*
__*return*__ | `Promise.<void>` | **

---

### `check(css, timeout) ► Promise.<void>`

![modifier: public](images/badges/modifier-public.png)

**Checks the checkbox or radio button** specified by the css selector.
**Throws an error** after the specified (or default) timeout has expired.

Parameters | Type | Description
--- | --- | ---
__css__ | `string` | *css selector of checkbox or radio button*
__timeout__ | `number` | *optional timeout before throwing error*
__*return*__ | `Promise.<void>` | **

---

### `checkByText(text, css, cssParent, timeout) ► Promise.<void>`

![modifier: public](images/badges/modifier-public.png)

**Checks the checkbox or radio button** specified by the label text and css selector.
**Throws an error** after the specified (or default) timeout has expired.

Parameters | Type | Description
--- | --- | ---
__text__ | `string` | *label text*
__css__ | `string` | *css selector of the label*
__cssParent__ | `string` | *optional css selector for the parent*
__timeout__ | `number` | *optional timeout before throwing error*
__*return*__ | `Promise.<void>` | **

---

### `fillInput(css, text, timeout) ► Promise.<void>`

![modifier: public](images/badges/modifier-public.png)

**Fills the input** specified by the css selector with the specified **text**.
**Throws an error** after the specified (or default) timeout has expired.

Parameters | Type | Description
--- | --- | ---
__css__ | `string` | *css selector of the input*
__text__ | `string` | *text to fill in*
__timeout__ | `number` | *optional timeout before throwing error*
__*return*__ | `Promise.<void>` | **

---

### `selectItem(css, text, timeout) ► Promise.<void>`

![modifier: public](images/badges/modifier-public.png)

**Selects the option** specified by the **select** css selector with the specified **text**.
**Throws an error** after the specified (or default) timeout has expired.

Parameters | Type | Description
--- | --- | ---
__css__ | `string` | *css selector of the select*
__text__ | `string` | *text of the option*
__timeout__ | `number` | *optional timeout before throwing error*
__*return*__ | `Promise.<void>` | **

---

### `selectObjectItem(element, text, timeout) ► Promise.<void>`

![modifier: public](images/badges/modifier-public.png)

**Selects the option** specified by the wdio element with the specified **text**.
**Throws an error** after the specified (or default) timeout has expired.

Parameters | Type | Description
--- | --- | ---
__element__ | `WebdriverIO.Element` | *select element*
__text__ | `string` | *text of the option*
__timeout__ | `number` | *optional timeout before throwing error*
__*return*__ | `Promise.<void>` | **

---
