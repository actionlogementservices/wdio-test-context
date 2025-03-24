# Module `wdio/test-context-worker-service`

![category:other](https://img.shields.io/badge/category-other-9f9f9f.svg?style=flat-square)



[Source file](../src/wdio/test-context-worker-service.js)

## Functions

### `filterPrivateProperty()`

![modifier: public](images/badges/modifier-public.png)



---

### `beforeSession(_config, _capabilities, _specs, _cid)`

![modifier: public](images/badges/modifier-public.png)

Gets executed just before initialising the webdriver session and test framework.
**Displays** the Test Context.

Parameters | Type | Description
--- | --- | ---
___config__ | `TestrunnerOptions` | **
___capabilities__ | `TestrunnerCapabilities` | **
___specs__ | `Array.<string>` | **
___cid__ | `string` | **

---

### `afterTest(test, _context, result)`

![modifier: public](images/badges/modifier-public.png)

Gets executed after a test.
Generates **error screenshot** if applicable.

Parameters | Type | Description
--- | --- | ---
__test__ | `Test` | **
___context__ | `*` | **
__result__ | `TestResult` | **

---
