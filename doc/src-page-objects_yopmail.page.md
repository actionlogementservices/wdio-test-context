# Module `page-objects/yopmail.page`

![category:internal](https://img.shields.io/badge/category-internal-009663.svg?style=flat-square)

Page-object on top of YOPmail.

[Source file](../src/page-objects/yopmail.page.js)

# Class `YopmailPage`

Implements a page-object on top of YOPmail.

## Methods

### `openInbox(email)`

![modifier: public](images/badges/modifier-public.png)

WDIO logic to open the mailbox.

Parameters | Type | Description
--- | --- | ---
__email__ | `string` | *disposable email*

---

### `getMessages() ► `

![modifier: public](images/badges/modifier-public.png)

WDIO logic to get emails.

Parameters | Type | Description
--- | --- | ---
__*return*__ | `undefined` | **

---

### `getMessageContent(index) ► Promise.<string>`

![modifier: public](images/badges/modifier-public.png)

WDIO logic to get the specified message content.

Parameters | Type | Description
--- | --- | ---
__index__ | `number` | **
__*return*__ | `Promise.<string>` | **

---

## Members

Name | Type | Description
--- | --- | ---
__name__ | `undefined` | *name of the provider*
__domains__ | `undefined` | *domains exposed of the provider*
