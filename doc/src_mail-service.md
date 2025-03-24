# Module `mail-service`

![category:public](https://img.shields.io/badge/category-public-FF5000.svg?style=flat-square)

**Mail service** to send and retrieve mail from various provider.
Accessible through the **mailService property** of the TestContext instance.

[Source file](../src/mail-service.js)

# Class `MailService`



## Methods

### `sendMessage(from, to, subject, html) ► Promise.<void>`

![modifier: public](images/badges/modifier-public.png)

Sends a mail.

Parameters | Type | Description
--- | --- | ---
__from__ | `string` | *sender*
__to__ | `string` | *recipient*
__subject__ | `string` | *subject of the mail*
__html__ | `string` | *html body string of the mail*
__*return*__ | `Promise.<void>` | **

---

### `waitForMessage(email, from, subject) ► Promise.<string>`

![modifier: public](images/badges/modifier-public.png)

Waits for an email from the specified sender and containing the specified subject
and gets its content.

Parameters | Type | Description
--- | --- | ---
__email__ | `string` | *recipient email*
__from__ | `string` | *sender*
__subject__ | `string` | *subject of email*
__*return*__ | `Promise.<string>` | *content of email*

---

## Members

Name | Type | Description
--- | --- | ---
__provider__ | `MailProvider` | *disposable email provider @type {MailProvider}*
__name__ | `string` | *Provider name*
__domains__ | `Array.<string>` | *Emails domains exposed by the provider.*
